import { expect, Page, TestInfo } from "@playwright/test";

let stepCounter = 0;

export function resetStepCounter() {
  stepCounter = 0;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function step(
  page: Page,
  testInfo: TestInfo,
  label: string,
  fn: () => Promise<void>
) {
  await testInfo.step(label, async () => {
    await fn();
    stepCounter += 1;
    const filename = `${String(stepCounter).padStart(2, "0")}-${slugify(label) || "step"}.png`;
    await page.screenshot({
      path: testInfo.outputPath("steps", filename),
      fullPage: true,
    });
  });
}

export async function expectVisible(page: Page, selector: string, description: string) {
  const locator = page.locator(selector);
  await expect(locator, description).toBeVisible();
}
