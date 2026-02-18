import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { rateLimit } from "@/lib/rateLimit";

const testPasswordHash = "hashed";
const mockCompare = vi.fn().mockResolvedValue(true);
const chainLean = vi.fn().mockResolvedValue({
  _id: "user-1",
  email: "user@example.com",
  passwordHash: testPasswordHash,
});

vi.mock("bcryptjs", () => ({
  default: { compare: (password: string, hash: string) => mockCompare(password, hash) },
  compare: (password: string, hash: string) => mockCompare(password, hash),
}));
vi.mock("@/lib/mongoose", () => ({ connectToDatabase: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/models", () => ({
  UserModel: { findOne: () => ({ lean: () => chainLean() }) },
}));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: vi.fn().mockReturnValue({ ok: true }) }));
vi.mock("@/lib/auth", () => ({ createSession: vi.fn().mockResolvedValue(undefined) }));

describe("POST /api/auth/signin", () => {
  beforeEach(() => {
    vi.mocked(rateLimit).mockReturnValue({ ok: true });
    chainLean.mockResolvedValue({
      _id: "user-1",
      email: "user@example.com",
      passwordHash: testPasswordHash,
    });
    mockCompare.mockResolvedValue(true);
  });

  it("returns 429 when rate limit exceeded", async () => {
    vi.mocked(rateLimit).mockReturnValue({ ok: false });
    const req = new Request("http://localhost/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com", password: "password123" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain("Too many attempts");
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new Request("http://localhost/api/auth/signin", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request");
  });

  it("returns 400 for invalid credentials (schema)", async () => {
    const req = new Request("http://localhost/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: "invalid-email", password: "" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid credentials");
  });

  it("returns 401 when user not found", async () => {
    chainLean.mockResolvedValueOnce(null);
    const req = new Request("http://localhost/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: "nobody@example.com", password: "password123" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Invalid credentials");
  });

  it("returns 401 when password wrong", async () => {
    mockCompare.mockResolvedValueOnce(false);
    const req = new Request("http://localhost/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com", password: "wrongpassword" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Invalid credentials");
  });

  it("returns 200 and calls createSession when credentials valid", async () => {
    const req = new Request("http://localhost/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com", password: "password123" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    const { createSession } = await import("@/lib/auth");
    expect(createSession).toHaveBeenCalledWith("user-1");
  });
});

