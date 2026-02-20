import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

const mockCountDocuments = vi.fn().mockResolvedValue(0);
const mockCreate = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/mongoose", () => ({ connectToDatabase: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/models", () => ({
  UserModel: {
    countDocuments: () => mockCountDocuments(),
    create: (args: unknown) => mockCreate(args),
  },
}));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: vi.fn().mockReturnValue({ ok: true }) }));

describe("POST /api/auth/bootstrap", () => {
  const validBody = {
    token: "correct-token",
    email: "admin@example.com",
    password: "password123",
  };

  beforeEach(() => {
    process.env.BOOTSTRAP_TOKEN = "correct-token";
    mockCountDocuments.mockResolvedValue(0);
    mockCreate.mockClear();
  });

  it("returns 401 when token is wrong", async () => {
    const req = new Request("http://localhost/api/auth/bootstrap", {
      method: "POST",
      body: JSON.stringify({ ...validBody, token: "wrong" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 401 when token is missing", async () => {
    const req = new Request("http://localhost/api/auth/bootstrap", {
      method: "POST",
      body: JSON.stringify({ email: validBody.email, password: validBody.password }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when email empty or password too short", async () => {
    const req = new Request("http://localhost/api/auth/bootstrap", {
      method: "POST",
      body: JSON.stringify({ token: validBody.token, email: "", password: "short" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/Email required|8 chars/);
  });

  it("returns 409 when already initialized", async () => {
    mockCountDocuments.mockResolvedValueOnce(1);
    const req = new Request("http://localhost/api/auth/bootstrap", {
      method: "POST",
      body: JSON.stringify(validBody),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("Already initialized");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 200 and creates user when valid", async () => {
    const req = new Request("http://localhost/api/auth/bootstrap", {
      method: "POST",
      body: JSON.stringify(validBody),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(mockCreate).toHaveBeenCalled();
  });
});
