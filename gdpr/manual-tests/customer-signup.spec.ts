import { test, expect } from "@playwright/test";
import { resetStepCounter, step } from "./test-utils";

test.describe("Customer signup workflow", () => {
  test.beforeEach(() => resetStepCounter());

  test("Customer signup validation and redirect @customer", async ({ page }, testInfo) => {
    await step(page, testInfo, "Open signup page", async () => {
      await page.goto("/signup", { waitUntil: "networkidle" });
      await expect(
        page.getByRole("heading", { name: /create your gdpr workspace/i })
      ).toBeVisible();
    });

    await step(page, testInfo, "Submit invalid details to surface error", async () => {
      await page.route("**/api/signup", async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ message: "Use at least 8 characters." }),
        });
      });

      await page.getByLabel("Full name").fill("A");
      await page.getByLabel("Organisation name").fill("Org");
      await page.getByLabel("Work email address").fill("invalid-email");
      await page.getByLabel("Password").fill("short");
      await page.getByRole("button", { name: /create my workspace/i }).click();

      await expect(page.getByRole("alert")).toHaveText(/use at least 8 characters/i);
    });

    await step(page, testInfo, "Submit valid details and verify redirect", async () => {
      await page.unroute("**/api/signup");
      await page.route("**/api/signup", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true, redirectUrl: "/" }),
        });
      });

      await page.getByLabel("Full name").fill("Casey Customer");
      await page.getByLabel("Organisation name").fill("Customer Org");
      await page.getByLabel("Work email address").fill("casey.customer@example.com");
      await page.getByLabel("Password").fill("LongerPassword123");

      await page.getByRole("button", { name: /create my workspace/i }).click();
      await page.waitForURL("**/");
      await expect(page.getByRole("heading", { name: /gdpr evidence/i })).toBeVisible();
    });
  });
});
