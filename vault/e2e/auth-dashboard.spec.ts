import { test, expect } from "@playwright/test";

test.describe("Auth and dashboard", () => {
  test("audit signin page loads", async ({ page }) => {
    await page.goto("/audit/signin");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("unauthenticated dashboard redirects to signin", async ({ page }) => {
    await page.goto("/audit/dashboard");
    await expect(page).toHaveURL(/\/audit\/signin/, { timeout: 15_000 });
  });
});
