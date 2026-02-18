import { test, expect } from "@playwright/test";
import { resetStepCounter, step } from "./test-utils";

test.describe("Partner signup workflow", () => {
  test.beforeEach(() => resetStepCounter());

  test("Partner signup form validation and success state @partner", async ({ page }, testInfo) => {
    await step(page, testInfo, "Open partners page", async () => {
      await page.goto("/partners", { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { name: /partner with us/i })).toBeVisible();
    });

    await step(page, testInfo, "Jump to partner form", async () => {
      await page.getByRole("link", { name: /apply to become a partner/i }).click();
      await expect(page.getByRole("form", { name: /partner application form/i })).toBeVisible();
    });

    await step(page, testInfo, "Submit empty form to trigger client validation", async () => {
      await page.getByRole("button", { name: /apply to become a partner/i }).click();
      await expect(page.getByText("Please enter your name.")).toBeVisible();
      await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
      await expect(page.getByText("Please enter your company name.")).toBeVisible();
      await expect(
        page.getByText("You must confirm you have permission to refer clients.")
      ).toBeVisible();
    });

    await step(page, testInfo, "Fill in valid partner application details", async () => {
      await page.getByLabel("Full name").fill("Avery Partner");
      await page.getByLabel("Email").fill("avery.partner@example.com");
      await page.getByLabel("Phone").fill("+353 1 555 0123");
      await page.getByLabel("Company name").fill("Partner Co");
      await page.getByLabel("Website").fill("partnerco.ie");
      await page.getByLabel(/partner type/i).selectOption("accountant");
      await page.getByLabel("Approx. number of SME clients").fill("50");
      await page.getByLabel("Anything we should know?").fill("We focus on retail SMEs.");
      await page.getByLabel(/I have permission to refer clients/i).check();
    });

    await step(page, testInfo, "Submit the form and verify success state", async () => {
      await page.route("**/api/partner", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true, message: "Partner application received." }),
        });
      });

      await page.getByRole("button", { name: /apply to become a partner/i }).click();
      await expect(page.getByRole("heading", { name: /thanks/i })).toBeVisible();
      await expect(
        page.getByText(/received your partner application/i)
      ).toBeVisible();
    });
  });
});
