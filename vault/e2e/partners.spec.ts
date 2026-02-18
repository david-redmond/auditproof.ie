import { test, expect } from "@playwright/test";

const MAILTRAP_API_TOKEN = process.env.MAILTRAP_API_TOKEN;
const MAILTRAP_ACCOUNT_ID = process.env.MAILTRAP_ACCOUNT_ID;
const MAILTRAP_INBOX_ID = process.env.MAILTRAP_INBOX_ID;
const MAILTRAP_CONFIGURED =
  Boolean(MAILTRAP_API_TOKEN && MAILTRAP_ACCOUNT_ID && MAILTRAP_INBOX_ID);

async function getLatestPartnerEmailFromMailtrap(
  fullName: string,
  companyName: string,
  email: string
): Promise<{ found: boolean; subject?: string; body?: string }> {
  if (!MAILTRAP_CONFIGURED) return { found: false };
  const base = `https://mailtrap.io/api/accounts/${MAILTRAP_ACCOUNT_ID}/inboxes/${MAILTRAP_INBOX_ID}`;
  const listRes = await fetch(`${base}/messages`, {
    headers: { "Api-Token": MAILTRAP_API_TOKEN! },
  });
  if (!listRes.ok) return { found: false };
  const messages = (await listRes.json()) as Array<{ id: number; subject?: string }>;
  const latest = messages?.[0];
  if (!latest?.id) return { found: false };
  const bodyRes = await fetch(`${base}/messages/${latest.id}/body.txt`, {
    headers: { "Api-Token": MAILTRAP_API_TOKEN! },
  });
  const body = bodyRes.ok ? await bodyRes.text() : undefined;
  return {
    found: true,
    subject: latest.subject,
    body,
  };
}

test.describe("Partners page", () => {
  test("partners page loads and form is visible", async ({ page }) => {
    await page.goto("/partners");
    await expect(page).toHaveTitle(/partner|vault|audit/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByLabel(/email/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByLabel(/company|name/i).first()).toBeVisible();
  });

  test("partner signup form submits and shows success", async ({ page }) => {
    const email = `partner-e2e-${Date.now()}@example.com`;
    const fullName = "E2E Partner User";
    const companyName = "E2E Test Company";

    await page.goto("/partners");
    await expect(page.getByRole("heading", { name: /partner with us/i })).toBeVisible({ timeout: 10_000 });

    await page.getByRole("form", { name: /partner application/i }).scrollIntoViewIfNeeded();

    await page.getByLabel(/full name/i).fill(fullName);
    await page.locator("#partner-email").fill(email);
    await page.getByLabel(/company name/i).fill(companyName);
    await page.getByLabel(/partner type/i).selectOption("accountant");
    await page.getByLabel(/i have permission to refer clients/i).check();

    const submitClicked = page.getByRole("button", { name: /apply to become a partner/i }).click();
    const apiRes = page.waitForResponse(
      (res) => res.url().includes("/api/partner") && res.request().method() === "POST"
    );
    await submitClicked;
    const res = await apiRes;
    expect(res.ok(), `Partner API returned ${res.status()}`).toBe(true);

    await expect(page.getByText(/thanks.*you're in/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/we've received your partner application/i)).toBeVisible();

    // If Mailtrap is configured, check the inbox for the notification email
    if (MAILTRAP_CONFIGURED) {
      await page.waitForTimeout(3000); // allow email to land
      const mail = await getLatestPartnerEmailFromMailtrap(fullName, companyName, email);
      expect(mail.found, "Mailtrap: no messages in inbox").toBe(true);
      expect(mail.subject).toContain(companyName);
      expect(mail.body, "Mailtrap: email body should contain applicant name").toContain(fullName);
      expect(mail.body, "Mailtrap: email body should contain company name").toContain(companyName);
      expect(mail.body, "Mailtrap: email body should contain applicant email").toContain(email);
    }
  });
});
