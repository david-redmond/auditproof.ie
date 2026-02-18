# E2E test coverage – recommendations

After reviewing the vault app and current E2E specs, here’s what’s covered and what’s worth adding.

---

## Currently tested

| Area | What’s tested |
|------|----------------|
| **Auth** | Signup → redirect to signin; signin → dashboard; unauthenticated dashboard → redirect to signin; signin page loads. |
| **Happy path** | One full flow: signup → signin → add RoPA → add incident → add DSR → upload document → create audit pack → dashboard shows 1 in each stat card. |
| **Health** | `GET /api/health` and `GET /api/ready`. |
| **Partners** | Partners page loads and form is visible. |

---

## Recommended additional tests

### 1. **View / edit flows (high value)**

- **RoPA** – From dashboard or RoPA list, open a RoPA (e.g. the one we created), assert detail page shows name/purpose; optionally submit an edit and confirm list/dashboard still correct.
- **Incident** – Open an incident from the list, assert title/description/risk; optionally mark as resolved (if UI supports it) and confirm status on list.
- **DSR** – Open a request from the list, assert type/summary/due date; optionally set outcome (e.g. completed) and confirm it no longer counts as “open” on dashboard.

These prove list → detail and (where applicable) edit/outcome updates work end-to-end.

### 2. **Audit export download (high value)**

- After creating an audit pack, click **PDF** (and optionally **ZIP**) on the audit-exports table.
- Assert the download request returns 200 and a non-empty body (e.g. PDF magic bytes or size > 0), so the download API and response shape are exercised in E2E.

Right now we only assert the pack appears in the table; we don’t verify the download links work.

### 3. **Settings (medium value)**

- **Settings page** – As the owner user, open `/audit/dashboard/settings`, assert “Organisation” and “Users & Access” (or “Settings”) are present.
- **Password** – If the user has a password, optionally open “Change password” and assert the form is present (no need to actually change password unless you want a dedicated test).

Useful to guard against regressions on a critical, role-gated page.

### 4. **Evidence download (medium value)**

- From the evidence list, click **Download** on a document we uploaded.
- Assert the download response is 200 and body is non-empty (or has expected `Content-Disposition`), so the evidence download API is covered in E2E.

### 5. **Sign out (medium value)**

- From the dashboard (or any authenticated page), trigger sign out (if there’s a clear “Sign out” control).
- Assert redirect to signin and that visiting `/audit/dashboard` again redirects to signin.

Confirms session clearing and redirect behaviour.

### 6. **Accept invite (lower priority, more setup)**

- Requires creating an invite (e.g. via API or a “manage users” flow), then opening the accept-invite URL with a valid token.
- Assert the “Set your password” (or similar) form appears and, after submitting, the user can reach the dashboard.

High value for teams that use invites; skip if invites are rarely used.

### 7. **RoPA templates (optional)**

- Open `/audit/dashboard/ropa/templates`, assert the page and “Import” (or similar) UI are present.
- Optionally run an import and then confirm new RoPA entries appear on the RoPA list or dashboard.

Useful if template import is a main workflow.

### 8. **Public / marketing pages (optional)**

- **Home** – `/` loads and has expected heading or CTA.
- **GDPR** – `/gdpr` loads.
- **Contact / Terms / Privacy / Security** – Smoke test that each page loads without error.

Low effort; catches obvious breakage on public routes.

### 9. **Validation and error paths (optional)**

- **Signin** – Wrong password → error message, no redirect to dashboard.
- **Signup** – Duplicate email → “account already exists” (or equivalent).
- **Form validation** – Submit RoPA or DSR with required fields empty → validation message, no redirect.

Improves confidence in error handling and validation.

---

## Suggested order of implementation

1. **Audit export download** – Small addition to the existing “create audit pack” test (click PDF, assert response).
2. **View one item** – e.g. “from dashboard or list, open the created RoPA and assert its name on the detail page.”
3. **Evidence download** – Click Download on the uploaded document and assert 200 + non-empty body.
4. **Settings page** – One test: go to settings and assert key sections are visible.
5. **Sign out** – If the UI exposes sign out, one test for sign out then redirect when visiting dashboard.

If you tell me which of these you want first (e.g. “downloads only” or “view + edit only”), I can outline or write the exact test steps and selectors next.
