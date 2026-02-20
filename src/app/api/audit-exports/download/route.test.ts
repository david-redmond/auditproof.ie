import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { getSessionUserId } from "@/lib/auth";
import { getOrgContext } from "@/lib/org";
import { getSubscriptionStatus } from "@/lib/billing";
import { Types } from "mongoose";

const mockFindOne = vi.fn();
const mockPack = {
  _id: "pack-1",
  orgId: new Types.ObjectId(),
  generatedAt: new Date(),
  versionLabel: "v1",
  includes: { ropa: true, dsrs: true, incidents: true, evidenceIndex: true, evidenceFiles: false },
  generatedByUserId: new Types.ObjectId(),
};

vi.mock("@/lib/auth", () => ({ getSessionUserId: vi.fn() }));
vi.mock("@/lib/org", () => ({ getOrgContext: vi.fn() }));
vi.mock("@/lib/billing", () => ({ getSubscriptionStatus: vi.fn() }));
vi.mock("@/lib/mongoose", () => ({ connectToDatabase: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/models", () => ({
  AuditPackModel: { findOne: (q: unknown) => mockFindOne(q), lean: vi.fn() },
  OrganisationModel: { findById: vi.fn(), updateOne: vi.fn(), select: vi.fn().mockReturnThis() },
  UserModel: { findById: vi.fn() },
  RopaRecordModel: { countDocuments: vi.fn(), find: vi.fn() },
  DataSubjectRequestModel: { countDocuments: vi.fn(), find: vi.fn() },
  IncidentModel: { countDocuments: vi.fn(), find: vi.fn() },
  EvidenceDocumentModel: { countDocuments: vi.fn(), find: vi.fn() },
  AuditEventModel: { countDocuments: vi.fn() },
}));

const chainLean = vi.fn();
mockFindOne.mockReturnValue({ lean: chainLean });

describe("GET /api/audit-exports/download", () => {
  const orgId = new Types.ObjectId();
  const baseUrl = "http://localhost/api/audit-exports/download";

  beforeEach(() => {
    vi.mocked(getSessionUserId).mockResolvedValue("user-1");
    vi.mocked(getOrgContext).mockResolvedValue({
      orgId,
      organisation: {} as never,
      user: {} as never,
      role: "owner",
    });
    vi.mocked(getSubscriptionStatus).mockResolvedValue({ isActive: true, plan: "annual" });
    chainLean.mockResolvedValue(mockPack);
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getSessionUserId).mockResolvedValue(null);
    const req = new Request(`${baseUrl}?id=pack-1&type=pdf`);
    const res = await GET(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 401 when no org context", async () => {
    vi.mocked(getOrgContext).mockResolvedValue(null);
    const req = new Request(`${baseUrl}?id=pack-1&type=pdf`);
    const res = await GET(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 402 when subscription not active", async () => {
    vi.mocked(getSubscriptionStatus).mockResolvedValue({ isActive: false, plan: null });
    const req = new Request(`${baseUrl}?id=pack-1&type=pdf`);
    const res = await GET(req);
    expect(res.status).toBe(402);
    const data = await res.json();
    expect(data.message).toContain("Subscription required");
  });

  it("returns 400 when id or type missing", async () => {
    const req1 = new Request(`${baseUrl}?type=pdf`);
    const res1 = await GET(req1);
    expect(res1.status).toBe(400);
    const req2 = new Request(`${baseUrl}?id=pack-1`);
    const res2 = await GET(req2);
    expect(res2.status).toBe(400);
  });

  it("returns 404 when pack not found for org", async () => {
    chainLean.mockResolvedValueOnce(null);
    const req = new Request(`${baseUrl}?id=pack-1&type=pdf`);
    const res = await GET(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Not found");
  });

  it("returns 501 when type is not pdf", async () => {
    const req = new Request(`${baseUrl}?id=pack-1&type=zip`);
    const res = await GET(req);
    expect(res.status).toBe(501);
    const data = await res.json();
    expect(data.error).toContain("ZIP");
  });
});
