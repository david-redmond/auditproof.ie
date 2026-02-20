import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { Types } from "mongoose";
import { getSessionUserId } from "@/lib/auth";
import { getOrgContext } from "@/lib/org";

const orgA = new Types.ObjectId();

const mockFindOne = vi.fn();
const chainLean = vi.fn();

vi.mock("@/lib/auth", () => ({ getSessionUserId: vi.fn() }));
vi.mock("@/lib/org", () => ({ getOrgContext: vi.fn() }));
vi.mock("@/lib/mongoose", () => ({ connectToDatabase: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/models", () => ({
  EvidenceDocumentModel: { findOne: (q: unknown) => mockFindOne(q), lean: vi.fn() },
}));

mockFindOne.mockReturnValue({ lean: chainLean });

describe("GET /api/evidence/download", () => {
  beforeEach(() => {
    vi.mocked(getSessionUserId).mockResolvedValue("user-1");
    vi.mocked(getOrgContext).mockResolvedValue({
      orgId: orgA,
      organisation: {} as never,
      user: {} as never,
      role: "owner",
    });
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getSessionUserId).mockResolvedValue(null);
    const req = new Request("http://localhost/api/evidence/download?id=doc-1");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 when no org context", async () => {
    vi.mocked(getOrgContext).mockResolvedValue(null);
    const req = new Request("http://localhost/api/evidence/download?id=doc-1");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when id missing", async () => {
    const req = new Request("http://localhost/api/evidence/download");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing id");
  });

  it("returns 404 when doc not found for org (IDOR: wrong org)", async () => {
    chainLean.mockResolvedValueOnce(null);
    const req = new Request("http://localhost/api/evidence/download?id=doc-from-org-b");
    const res = await GET(req);
    expect(res.status).toBe(404);
    expect(mockFindOne).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "doc-from-org-b", orgId: orgA })
    );
  });

  it("returns 404 when doc has no storage key", async () => {
    chainLean.mockResolvedValueOnce({ _id: "doc-1", orgId: orgA, storage: {} });
    const req = new Request("http://localhost/api/evidence/download?id=doc-1");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("returns 400 when storage.key is absolute path outside uploads", async () => {
    chainLean.mockResolvedValueOnce({
      _id: "doc-1",
      orgId: orgA,
      storage: { key: "/etc/passwd", contentType: "text/plain" },
      title: "doc",
    });
    const req = new Request("http://localhost/api/evidence/download?id=doc-1");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid file path");
  });
});
