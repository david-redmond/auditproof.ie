import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/auth", () => ({ getSessionUserId: vi.fn() }));
vi.mock("@/lib/org", () => ({ getOrgContext: vi.fn() }));
vi.mock("@/lib/mongoose", () => ({ connectToDatabase: vi.fn() }));
vi.mock("@/lib/models", () => ({
  RopaRecordModel: {
    find: vi.fn(),
    create: vi.fn(),
  },
}));
vi.mock("@/lib/audit", () => ({ logAuditEvent: vi.fn() }));

const { getSessionUserId } = await import("@/lib/auth");
const { getOrgContext } = await import("@/lib/org");
const { RopaRecordModel } = await import("@/lib/models");

describe("POST /api/ropa/import-templates", () => {
  beforeEach(() => {
    vi.mocked(getSessionUserId).mockResolvedValue("user-1");
    vi.mocked(getOrgContext).mockResolvedValue({
      orgId: { toString: () => "org-1" },
      organisation: {} as never,
      user: {} as never,
      role: "owner",
    });
    vi.mocked(RopaRecordModel.find).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([]),
    } as never);
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getSessionUserId).mockResolvedValue(null);
    const req = new Request("http://localhost/api/ropa/import-templates", {
      method: "POST",
      body: JSON.stringify({ templateIds: ["customer-enquiries-contact-forms"] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when templateIds is empty", async () => {
    const req = new Request("http://localhost/api/ropa/import-templates", {
      method: "POST",
      body: JSON.stringify({ templateIds: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("templateIds");
  });

  it("returns 400 when templateIds contains invalid id", async () => {
    const req = new Request("http://localhost/api/ropa/import-templates", {
      method: "POST",
      body: JSON.stringify({ templateIds: ["customer-enquiries-contact-forms", "invalid-template-id"] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid template IDs");
    expect(data.error).toContain("invalid-template-id");
  });

  it("returns 400 when more than 12 templates requested", async () => {
    const { ROPA_TEMPLATES } = await import("@/lib/ropaTemplates");
    const allIds = ROPA_TEMPLATES.map((t) => t.templateId);
    const ids = [...allIds, allIds[0]];
    const req = new Request("http://localhost/api/ropa/import-templates", {
      method: "POST",
      body: JSON.stringify({ templateIds: ids }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Maximum 12");
  });

  it("returns skippedCount when org already has record for templateId", async () => {
    vi.mocked(RopaRecordModel.find).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([{ templateId: "customer-enquiries-contact-forms" }]),
    } as never);
    const req = new Request("http://localhost/api/ropa/import-templates", {
      method: "POST",
      body: JSON.stringify({ templateIds: ["customer-enquiries-contact-forms"] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.importedCount).toBe(0);
    expect(data.skippedCount).toBe(1);
    expect(data.skippedIds).toContain("customer-enquiries-contact-forms");
  });
});
