import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { rateLimit } from "@/lib/rateLimit";

const { mockInsertOne, mockFindOne } = vi.hoisted(() => ({
  mockInsertOne: vi.fn().mockResolvedValue(undefined),
  mockFindOne: vi.fn().mockResolvedValue(null),
}));

const validBody = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  companyName: "Acme Ltd",
  partnerType: "accountant" as const,
  agreeToTerms: true,
};

function jsonRequest(body: unknown, opts?: { ip?: string; hp?: string }) {
  const b = opts?.hp !== undefined ? { ...validBody, hp: opts.hp } : body;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts?.ip) headers["x-forwarded-for"] = opts.ip;
  return new Request("http://localhost/api/partner", {
    method: "POST",
    body: JSON.stringify(b),
    headers,
  });
}

vi.mock("@/lib/db", () => ({
  getDb: vi.fn().mockResolvedValue({
    collection: vi.fn().mockReturnValue({
      findOne: mockFindOne,
      insertOne: mockInsertOne,
    }),
  }),
}));
vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn().mockReturnValue({ ok: true }),
}));
vi.mock("@/lib/notifyEmail", () => ({
  notifyPartnerApplicationEmail: vi.fn().mockResolvedValue(undefined),
}));

describe("POST /api/partner", () => {
  beforeEach(() => {
    vi.mocked(rateLimit).mockReturnValue({ ok: true });
    mockFindOne.mockResolvedValue(null);
    mockInsertOne.mockClear();
  });

  it("returns 429 when rate limit exceeded", async () => {
    vi.mocked(rateLimit).mockReturnValue({ ok: false });
    const req = jsonRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.message).toContain("Too many requests");
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new Request("http://localhost/api/partner", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe("Invalid JSON body.");
  });

  it("returns 400 and fieldErrors when fullName too short", async () => {
    const req = jsonRequest({ ...validBody, fullName: "A" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain("highlighted");
    expect(data.fieldErrors).toBeDefined();
    expect(data.fieldErrors.fullName).toBeDefined();
  });

  it("returns 400 when email invalid", async () => {
    const req = jsonRequest({ ...validBody, email: "not-an-email" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.fieldErrors?.email).toBeDefined();
  });

  it("returns 400 when agreeToTerms is false", async () => {
    const req = jsonRequest({ ...validBody, agreeToTerms: false });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.fieldErrors?.agreeToTerms).toBeDefined();
  });

  it("returns 400 when companyName missing", async () => {
    const req = jsonRequest({ ...validBody, companyName: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.fieldErrors).toBeDefined();
  });

  it("returns 400 when website is invalid URL", async () => {
    const req = jsonRequest({ ...validBody, website: "not a url!!!" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.fieldErrors?.website).toBeDefined();
  });

  it("accepts valid website with or without protocol", async () => {
    const withProtocol = jsonRequest({ ...validBody, website: "https://example.com" });
    const res1 = await POST(withProtocol);
    expect(res1.status).toBe(200);

    const withoutProtocol = jsonRequest({ ...validBody, website: "example.com" });
    const res2 = await POST(withoutProtocol);
    expect(res2.status).toBe(200);
  });

  it("returns 200 without DB/email when honeypot (hp) is set", async () => {
    const req = jsonRequest(validBody, { hp: "filled-by-bot" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(mockInsertOne).not.toHaveBeenCalled();
  });

  it("returns 200 and inserts when valid body", async () => {
    const req = jsonRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.message).toContain("received");
    expect(mockInsertOne).toHaveBeenCalled();
  });

  it("returns 200 when duplicate application within 24h", async () => {
    mockFindOne.mockResolvedValueOnce({ email: validBody.email.toLowerCase() });
    const req = jsonRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.message).toContain("already received");
    expect(mockInsertOne).not.toHaveBeenCalled();
  });
});
