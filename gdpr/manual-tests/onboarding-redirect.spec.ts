import { test, expect } from "@playwright/test";
import { resetStepCounter, step } from "./test-utils";

test.describe("Redirects", () => {
  test.beforeEach(() => resetStepCounter());

  test("Onboarding redirect honors VAULT_URL @redirect", async ({ page }, testInfo) => {
    const expected = process.env.PLAYWRIGHT_EXPECTED_ONBOARDING_REDIRECT;

    await step(page, testInfo, "Navigate to /onboarding", async () => {
      await page.goto("/onboarding", { waitUntil: "domcontentloaded" });
    });

    await step(page, testInfo, "Verify redirect target", async () => {
      const finalUrl = page.url();
      if (expected) {
        expect(finalUrl).toContain(expected);
      } else {
        expect(finalUrl).not.toContain("/onboarding");
      }
    });
  });
});
