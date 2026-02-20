import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { checkEnvReadiness } from "@/lib/env";
import { connectToDatabase } from "@/lib/mongoose";

vi.mock("@/lib/env", () => ({ checkEnvReadiness: vi.fn() }));
vi.mock("@/lib/mongoose", () => ({ connectToDatabase: vi.fn().mockResolvedValue(undefined) }));

describe("GET /api/ready", () => {
  beforeEach(() => {
    vi.mocked(checkEnvReadiness).mockReturnValue({ ready: true });
  });

  it("returns 503 when env not ready", async () => {
    vi.mocked(checkEnvReadiness).mockReturnValue({ ready: false, missing: ["AUTH_SECRET"] });
    const res = await GET();
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.status).toBe("not ready");
    expect(data.missing).toContain("AUTH_SECRET");
  });

  it("returns 200 when env ready and DB connects", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
  });

  it("returns 503 when DB connection fails", async () => {
    vi.mocked(connectToDatabase).mockRejectedValueOnce(new Error("Connection refused"));
    const res = await GET();
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.status).toBe("not ready");
    expect(data.error).toContain("Database");
  });
});
