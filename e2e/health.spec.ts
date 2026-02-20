import { test, expect } from "@playwright/test";

test.describe("Health and readiness", () => {
  test("GET /api/health returns 200 and status ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ status: "ok" });
  });

  test("GET /api/ready returns 200 when app is ready", async ({ request }) => {
    const res = await request.get("/api/ready");
    expect([200, 503]).toContain(res.status());
    const data = await res.json();
    if (res.status() === 200) {
      expect(data.status).toBe("ok");
    } else {
      expect(data.status).toBe("not ready");
    }
  });
});
