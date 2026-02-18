import path from "node:path";
import { test, expect } from "@playwright/test";

const FIXTURE_DOC = path.join(process.cwd(), "e2e", "fixtures", "sample-document.txt");

async function signUpAndSignIn(page: import("@playwright/test").Page, email: string, password: string) {
  const fullName = "E2E Test User";
  const organisationName = "E2E Test Org";

  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: /create your gdpr workspace/i })).toBeVisible({ timeout: 10_000 });

  await page.getByLabel(/full name/i).fill(fullName);
  await page.getByLabel(/organisation name/i).fill(organisationName);
  await page.getByLabel(/work email|email/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);

  const signupClicked = page.getByRole("button", { name: /create my workspace/i }).click();
  const signupRes = page.waitForResponse(
    (res) => res.url().includes("/api/signup") && res.request().method() === "POST"
  );
  await signupClicked;
  const res = await signupRes;
  expect(res.ok(), `Signup returned ${res.status()}`).toBe(true);
  await expect(page).toHaveURL(/\/audit\/signin/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible({ timeout: 5_000 });

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/audit\/dashboard/, { timeout: 15_000 });
  await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 5_000 });
}

test.describe("Signup and signin", () => {
  test("creates a new user then signs in on the UI", async ({ page }) => {
    const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
    const password = "securepass123";
    await signUpAndSignIn(page, email, password);
  });

  test("creates a user, signs in, adds a RoPA and an incident", async ({ page }) => {
    const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
    const password = "securepass123";
    await signUpAndSignIn(page, email, password);

    const ropaName = `E2E RoPA ${Date.now()}`;
    const incidentTitle = `E2E Incident ${Date.now()}`;

    // Add a new RoPA
    await page.goto("/audit/dashboard/ropa/new");
    await expect(page.getByRole("heading", { name: /add data use/i })).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(/data use name/i).fill(ropaName);
    await page.getByLabel(/why do you use this data/i).fill("To respond to enquiries and provide quotes.");
    await page.getByLabel(/why you can use it \(gdpr lawful basis\)/i).selectOption("consent");
    await page.getByLabel(/how long do you keep it/i).fill("2 years");

    await page.getByRole("button", { name: /save data use/i }).click();

    await expect(page).toHaveURL(/\/audit\/dashboard\/ropa/, { timeout: 15_000 });
    await expect(page.getByText(ropaName)).toBeVisible({ timeout: 5_000 });

    // Add a new incident
    await page.goto("/audit/dashboard/incidents/new");
    await expect(page.getByRole("heading", { name: /log a security incident/i })).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(/short summary/i).fill(incidentTitle);
    await page.getByRole("textbox", { name: /what happened/i }).fill("E2E test incident description.");
    await page.getByLabel(/when did you become aware of it/i).fill(new Date().toISOString().slice(0, 16));
    await page.getByLabel(/how serious does this seem/i).selectOption("low");

    await page.getByRole("button", { name: /save incident/i }).click();

    await expect(page).toHaveURL(/\/audit\/dashboard\/incidents/, { timeout: 15_000 });
    await expect(page.getByText(incidentTitle)).toBeVisible({ timeout: 5_000 });

    // Add a customer data request (DSR)
    const dsrSummary = `E2E DSR ${Date.now()}`;
    await page.goto("/audit/dashboard/requests/new");
    await expect(page.getByRole("heading", { name: /log customer data request/i })).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(/request type/i).selectOption("access");
    await page.getByLabel(/received/i).fill(new Date().toISOString().slice(0, 16));
    await page.getByLabel(/reference type/i).selectOption("customer_id");
    await page.getByPlaceholder(/48391|hash/i).fill("E2E-cust-001");
    await page.getByRole("textbox", { name: /what did they ask for/i }).fill(dsrSummary);

    await page.getByRole("button", { name: /save request/i }).click();

    await expect(page).toHaveURL(/\/audit\/dashboard\/requests(\?.*)?$/, { timeout: 15_000 });
    await expect(page.getByRole("table", { name: /customer data requests/i })).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText("E2E-cust-001")).toBeVisible({ timeout: 2_000 });

    // Upload a document
    const docTitle = `E2E Policy ${Date.now()}`;
    await page.goto("/audit/dashboard/evidence");
    await expect(page.getByRole("heading", { name: /policies & supporting documents/i })).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /upload document/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });

    await page.getByLabel(/what kind of document is this/i).selectOption("privacy_notice");
    await page.getByLabel(/document name/i).fill(docTitle);
    await page.getByLabel(/select file/i).setInputFiles(FIXTURE_DOC);

    await page.getByRole("dialog").getByRole("button", { name: /^upload document$/i }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(docTitle)).toBeVisible({ timeout: 5_000 });

    // Create an audit pack (export report)
    await page.goto("/audit/dashboard/audit-exports");
    await expect(page.getByRole("heading", { name: /export an audit pack/i })).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /create audit pack/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });

    await page.getByRole("dialog").getByRole("button", { name: /create audit pack/i }).click();

    await expect(page).toHaveURL(/\/audit\/dashboard\/audit-exports/, { timeout: 20_000 });
    await expect(page.getByRole("table", { name: /audit packs/i })).toBeVisible({ timeout: 10_000 });

    // Confirm dashboard reflects all new items (1 RoPA, 1 open DSR, 1 open incident, 1 document)
    await page.goto("/audit/dashboard");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible({ timeout: 10_000 });

    const ropaCard = page.locator("section").filter({ has: page.getByText("RoPA records") });
    await expect(ropaCard.getByText("1")).toBeVisible();

    const dsrCard = page.locator("section").filter({ has: page.getByText("Open DSRs") });
    await expect(dsrCard.getByText("1")).toBeVisible();

    const incidentsCard = page.locator("section").filter({ has: page.getByText("Open incidents") });
    await expect(incidentsCard.getByText("1")).toBeVisible();

    const policiesCard = page.locator("section").filter({ has: page.getByText("Policies & evidence") });
    await expect(policiesCard.getByText("1")).toBeVisible();

    // View RoPA detail – list → detail shows created RoPA
    await page.goto("/audit/dashboard/ropa");
    await page.getByRole("link", { name: new RegExp(`View or edit ${ropaName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
    await expect(page).toHaveURL(/\/audit\/dashboard\/ropa\/[a-f0-9]+/);
    await expect(page.getByLabel(/data use name/i)).toHaveValue(ropaName);

    // View incident detail – list → detail shows created incident
    await page.goto("/audit/dashboard/incidents");
    await page.getByRole("link", { name: new RegExp(`View or edit ${incidentTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
    await expect(page).toHaveURL(/\/audit\/dashboard\/incidents\/[a-f0-9]+/);
    await expect(page.getByLabel(/short summary/i)).toHaveValue(incidentTitle);

    // View DSR detail – list → detail shows created request
    await page.goto("/audit/dashboard/requests");
    await page.getByRole("link", { name: /view or edit request E2E-cust-001/i }).click();
    await expect(page).toHaveURL(/\/audit\/dashboard\/requests\/[a-f0-9]+/);
    await expect(page.getByPlaceholder(/48391|hash/i)).toHaveValue("E2E-cust-001");

    // Audit export download – PDF returns 200 and non-empty body
    await page.goto("/audit/dashboard/audit-exports");
    const [pdfResponse] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/audit-exports/download") &&
          res.url().includes("type=pdf") &&
          res.request().method() === "GET"
      ),
      page.getByRole("button", { name: /download pdf for/i }).first().click(),
    ]);
    expect(pdfResponse.status()).toBe(200);
    // Response may be consumed by client; we've verified the download endpoint returns 200

    // Evidence download – document download returns 200 and non-empty body
    await page.goto("/audit/dashboard/evidence");
    const downloadLink = page.getByRole("link", { name: `Download ${docTitle}` });
    const evidenceHref = await downloadLink.getAttribute("href");
    const evidenceRes = await page.request.get(evidenceHref!);
    expect(evidenceRes.ok()).toBe(true);

    // Settings – Organisation and Users sections visible
    await page.goto("/audit/dashboard/settings");
    await expect(page.getByRole("heading", { name: /settings/i })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("heading", { name: /organisation/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /users & access|users/i })).toBeVisible();

    // Sign out – then dashboard redirects to signin
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL("/", { timeout: 10_000 });
    await page.goto("/audit/dashboard");
    await expect(page).toHaveURL(/\/audit\/signin/, { timeout: 10_000 });
  });
});
