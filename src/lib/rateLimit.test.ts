import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { rateLimit } from "./rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    const key = "test-key-1";
    const options = { limit: 3, windowMs: 60_000 };

    expect(rateLimit(key, options).ok).toBe(true);
    expect(rateLimit(key, options).ok).toBe(true);
    expect(rateLimit(key, options).ok).toBe(true);
  });

  it("returns ok: false when limit exceeded", () => {
    const key = "test-key-2";
    const options = { limit: 2, windowMs: 60_000 };

    expect(rateLimit(key, options).ok).toBe(true);
    expect(rateLimit(key, options).ok).toBe(true);
    expect(rateLimit(key, options).ok).toBe(false);
    expect(rateLimit(key, options).ok).toBe(false);
  });

  it("isolates keys", () => {
    const options = { limit: 1, windowMs: 60_000 };

    expect(rateLimit("key-a", options).ok).toBe(true);
    expect(rateLimit("key-a", options).ok).toBe(false);
    expect(rateLimit("key-b", options).ok).toBe(true);
    expect(rateLimit("key-b", options).ok).toBe(false);
  });

  it("resets after window expires", () => {
    const key = "test-key-3";
    const options = { limit: 1, windowMs: 60_000 };

    expect(rateLimit(key, options).ok).toBe(true);
    expect(rateLimit(key, options).ok).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(rateLimit(key, options).ok).toBe(true);
    expect(rateLimit(key, options).ok).toBe(false);
  });
});
