import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/mongoose", () => ({
  connectToDatabase: vi.fn().mockResolvedValue(undefined),
}));

describe("GET /api/health", () => {
  beforeEach(async () => {
    const { connectToDatabase } = await import("@/lib/mongoose");
    vi.mocked(connectToDatabase).mockResolvedValue(undefined as never);
  });

  it("returns 200 and status ok when DB connects", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ status: "ok" });
  });
});
