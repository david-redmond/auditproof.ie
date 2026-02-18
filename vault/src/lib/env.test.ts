import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkEnvReadiness } from "./env";

describe("checkEnvReadiness", () => {
  const origEnv = process.env;

  beforeEach(() => {
    vi.stubEnv("MONGODB_URI", "mongodb://localhost");
    vi.stubEnv("AUTH_SECRET", "test-secret");
  });

  afterEach(() => {
    process.env = origEnv;
  });

  it("returns ready when MONGODB_URI and AUTH_SECRET are set", () => {
    const result = checkEnvReadiness();
    expect(result.ready).toBe(true);
    expect(result.missing).toBeUndefined();
  });

  it("returns not ready and lists missing when AUTH_SECRET is unset", () => {
    delete process.env.AUTH_SECRET;
    const result = checkEnvReadiness();
    expect(result.ready).toBe(false);
    expect(result.missing).toContain("AUTH_SECRET");
  });

  it("returns not ready when MONGODB_URI is unset", () => {
    delete process.env.MONGODB_URI;
    const result = checkEnvReadiness();
    expect(result.ready).toBe(false);
    expect(result.missing).toContain("MONGODB_URI");
  });

  it("returns not ready when AUTH_SECRET is empty string", () => {
    process.env.AUTH_SECRET = "   ";
    const result = checkEnvReadiness();
    expect(result.ready).toBe(false);
    expect(result.missing).toContain("AUTH_SECRET");
  });
});
