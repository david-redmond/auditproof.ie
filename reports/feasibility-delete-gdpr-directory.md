# Feasibility: Deleting the `gdpr` Directory

**Date:** 18 February 2025  
**Scope:** Whether the `gdpr` directory can be removed from the audit-proof repo with no loss of functionality, with all marketing and auth flows served from `vault`.

---

## 1. Summary

**Recommendation: Yes — deleting the `gdpr` directory is feasible.**

The **vault** app already provides the same marketing site, auth flows, and legal pages. The **gdpr** app is a separate Next.js app that duplicates this surface. Consolidating on vault is supported by the codebase and docs; removing `gdpr` simplifies the repo and avoids maintaining two UIs.

---

## 2. What Each App Does

### 2.1 gdpr directory (candidate for removal)

| Area | Content |
|------|--------|
| **Routes** | `/` (home), `/gdpr` (product), `/signup`, `/signin`, `/forgot-password`, `/partners`, `/security`, `/privacy`, `/terms`, `/contact` |
| **APIs** | `/api/signin`, `/api/signup`, `/api/partner`, `/api/health`, `/onboarding` (redirect) |
| **Auth** | Standalone signin/signup; forgot-password is a “Coming soon” placeholder |
| **Dependencies** | Next.js, React, mongoose, gdpr-models (from `../packages/models`), bcryptjs, resend, zod |
| **Notes** | No audit dashboard; marketing + signup/signin only. Uses `gdpr-models` shared package (same as vault). |

### 2.2 vault directory (canonical app)

| Area | Content |
|------|--------|
| **Routes** | All of the above **plus** `/audit/*` (signin, dashboard, RoPA, requests, incidents, evidence, audit-exports, settings, accept-invite), `/forgot-password`, `/reset-password`, `/legal`, `/cookies`, `/data-processing`, `/acceptable-use` |
| **APIs** | Full auth (signin, forgot-password, reset-password), signup, partner, billing (Stripe), audit-exports, evidence, etc. |
| **Auth** | Session-based auth, redirect when logged in from `/`, full forgot/reset password flow |
| **Dependencies** | Same stack plus jose, pdf-lib, stripe; uses shared **packages/models** (via vault’s own resolution, not the gdpr app) |
| **Notes** | Single app for marketing, signup, signin, and product (audit vault). |

---

## 3. Parity Check (gdpr → vault)

| Feature | gdpr | vault | Notes |
|--------|------|-------|------|
| Homepage `/` | Yes | Yes (with logged-in redirect) | Same structure; vault CTAs updated to “Register for free”. |
| Product `/gdpr` | Yes | Yes | Same content (vault already has full product page). |
| Signup `/signup` | Yes | Yes | Vault has full signup + API. |
| Signin `/signin` | Yes (standalone page) | Yes (redirects to `/audit/signin`) | Vault handles signin via audit flow. |
| Forgot password | Placeholder only | Full flow + API | Vault is ahead. |
| Reset password | No | Yes | Vault only. |
| Partners `/partners` | Yes | Yes | Vault has partners + PartnerSignupForm; CTAs aligned to “Register for free”. |
| Security / Privacy / Terms / Contact | Yes | Yes | Vault has full content (privacy is more complete in vault). |
| Header / Footer | Yes | Yes | Vault has Header (with Sign in + “Register for free”) and Footer. |
| Sitemap | Yes | Yes | Vault has `sitemap.ts`. |

**Conclusion:** There is no user-facing capability in gdpr that vault does not already provide. Vault is either equivalent or better (e.g. full forgot/reset, full privacy/legal).

---

## 4. Dependencies and References

### 4.1 Does anything depend on the gdpr app?

- **vault** does not depend on the `gdpr` package or directory. Vault’s `package.json` does not reference `gdpr`.
- **packages/models** is used by both apps via `file:../packages/models` (package name `gdpr-models`). That package lives under `packages/models/`, not under the `gdpr/` app directory. Deleting `gdpr/` does not remove `packages/models`.
- No other workspace roots or configs in the repo reference the `gdpr` app directory (only internal references inside `gdpr/` and docs that describe the old split).

### 4.2 References to “gdpr” in the repo

- **Routes and links:** `/gdpr` is the product page URL. It is implemented **in vault** at `vault/src/app/gdpr/page.tsx`. Header and Footer link to `/gdpr`; that route is served by vault, not by the gdpr app.
- **Naming:** “GDPR Evidence” and “gdprevidence.ie” appear in copy and contact details; these are product/brand names, not references to the `gdpr` folder.
- **Package name:** `packages/models` is published as `gdpr-models`; renaming is optional and independent of deleting the `gdpr` app.

So: no runtime or build dependency on the `gdpr` directory; only the app in that directory would disappear.

---

## 5. What to Do Before Deleting

1. **Confirm deployment**  
   Ensure the live site is served by **vault** (e.g. only vault is built and deployed). If anything still points at a “gdpr” deployment, switch it to vault first.

2. **Scripts / CI**  
   If any script or CI job runs `npm run dev` or `npm run build` in the `gdpr` directory, remove or repoint those to vault.

3. **Docs and punchlists**  
   - `vault/README.md` already describes vault as the app that serves marketing and audit.  
   - `vault/UI-UX-AUDIT-PUNCHLIST.md` states that marketing and shared UI from the gdpr app now live in vault.  
   After deletion, a quick pass to remove or update mentions of “the gdpr app” or “gdpr directory” (e.g. in READMEs or internal docs) will avoid confusion.

4. **Manual / E2E tests**  
   - gdpr has `manual-tests/` and some customer-signup specs. Vault has e2e (e.g. `vault/e2e/signup-signin.spec.ts`). Ensure vault e2e covers signup/signin and any critical marketing flows; then the gdpr-specific tests can be retired with the directory.

---

## 6. What to Delete

- Delete the entire **`gdpr`** directory (app, config, .next, manual-tests, etc.).

Do **not** delete:

- **`packages/models`** — shared models used by vault (and previously by gdpr). Required for vault.

---

## 7. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Something still deploys or runs the gdpr app | Confirm only vault is deployed; remove gdpr from any deploy config or scripts. |
| Missing feature in vault | Parity table above shows vault has equal or better coverage; re-check signin/signup/forgot if needed. |
| Broken links or bookmarks | All public URLs (`/`, `/gdpr`, `/signup`, etc.) are the same in vault; no URL change. |
| Lost history | If desired, create a final commit or tag before deleting `gdpr`, or keep a branch with the directory for reference. |

---

## 8. Conclusion

- **Feasibility: Yes.** The vault app already implements the full marketing site, auth (including forgot/reset password), and product/legal pages. The gdpr directory is a duplicate surface with less functionality.
- **Recommendation:** Remove the `gdpr` directory after confirming deployment and CI use only vault, and optionally tidy docs/tests that refer to the gdpr app.
- **Result:** One less app to maintain, one source of truth for marketing and auth (vault), and no loss of routes or features for users.
