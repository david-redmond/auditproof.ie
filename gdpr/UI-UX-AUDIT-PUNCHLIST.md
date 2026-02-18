# UI/UX Audit Punch-List — Marketing Site (Homepage + /partners)

## Summary

Primary CTA is **Create workspace** (signup) across the site. Secondary CTA is **View sample audit pack** (consistent label). Security and trust are surfaced in the header, footer, and a dedicated Security page. Homepage and Partners page have clearer hierarchy, trust signals, and accessibility improvements.

---

## P0 (Required — Done)

### A) Global navigation and CTA system
- **Primary CTA:** "Create workspace" (links to /signup) is the single primary CTA in the header on all pages.
- **Secondary CTA:** "View sample audit pack" (links to /#cta) — label standardized site-wide; duplicate wordings removed.
- **Header:** Shared `Header` component includes Product, Partners, Security, "View sample audit pack" (link), and "Create workspace" (button).
- **Security link:** Added in header and in footer (Security page at /security).

### B) Homepage improvements
- **Who it's for:** Line added near hero: "For SMEs with 5–50 employees who need to show evidence, not just policies."
- **How it works:** 3-step section added (Create → Record → Export) with numbered step cards and short copy.
- **Trust strip:** Replaced with a 4-card **trust grid** (EU-hosted data, Audit trails, Access controls, Export-ready) with simple icons and stronger typography.
- **Subheadings / layout:** Section order and section titles kept; "How it works" and trust grid improve scan-ability. Two-column grid used for "What your clients get / What you get" on Partners.
- **Social proof placeholder:** "Used by agencies, clinics, SaaS companies, and professional services." (no fake numbers.)
- **No legal advice:** Badge added near hero ("No legal advice. No unnecessary complexity."), near "What this tool is not," and near pricing.

### C) Partners page improvements
- **Why / What clients get / What you get:** "What your clients get" and "What you get as a partner" are clear two-column feature cards; "Why partners use this" is a short section above.
- **Partner CTA lane:** Dedicated section with heading "Become a partner," short copy, and primary button "Apply to become a partner" linking to #become-a-partner (form). General signup is secondary: "Create workspace (for my business)."
- **Partner form UX:**
  - Honeypot kept for bots; label is screen-reader-only ("Leave this field blank"); field remains in DOM but visually hidden.
  - Every input has an explicit label and appropriate autocomplete (name, email, tel, organization, url).
  - Required fields marked with * and aria-required; optional fields show "(optional)" in label.
  - Inline validation and error messages; form-level error in a role="alert" div and duplicated in an aria-live region for screen readers.
  - Consent checkbox copy clarified: "I have permission to refer clients… and I agree to be contacted about the partner programme (commission, setup, and support). Required."
  - Reassurance under submit: "We respond within 1–2 business days. No spam, no cold sales — we'll only contact you about your partner application."

### D) Trust, footer, and compliance UI
- **Site-wide footer:** `Footer` component with links: Product, Partners, Pricing (/#pricing), Security (/security), Privacy Policy (/privacy), Terms (/terms), Contact (/contact).
- **Security snapshot:** Footer includes "Privacy & data hosting" mini-section (EU data, access controls, no selling data). Full content on /security (EU hosting, access controls, audit trails; no fear-mongering).
- **No legal advice:** Shown near hero and near pricing on homepage; near hero and above partner form on Partners.

### E) Accessibility
- **Focus:** Visible focus rings via :focus-visible in globals.css and shared/component CSS (buttons, links, inputs, select).
- **Buttons vs links:** Primary/secondary CTAs use semantic `<Link>` or `<a>`/`<button>`; header secondary CTA is a link (ctaSecondaryLink) so the primary button stands out.
- **Labels:** All form inputs have associated labels; required/optional and error messages use aria-describedby and ids where needed.
- **Errors:** Form-level error in role="alert" and repeated in an aria-live="polite" region so screen readers announce updates.
- **Contrast:** Existing theme (theme.css) uses WCAG AA–friendly contrast; no changes to text/background tokens.
- **Headings:** Semantic order (h1 → h2 → h3) preserved across pages.

---

## P1 (Important — Done)

- **Shared Header and Footer:** Implemented in `components/Header.tsx` and `components/Footer.tsx`; used on Home, Product (/gdpr), Partners, Signup, Security, Privacy, Terms, Contact.
- **Security page:** New route /security with short sections on where data lives, access controls, and audit trails; links to Privacy and Contact.
- **Placeholder pages:** /privacy, /terms, /contact (contact uses mailto: hello@gdprevidence.ie — update if needed).

---

## P2 (Nice to have / Notes)

- **Sample audit pack:** "View sample audit pack" currently links to /#cta (same section). Consider a dedicated page or modal with a sample PDF when available.
- **Contact email:** Set to `hello@gdprevidence.ie` in `/contact`; change in `src/app/contact/page.tsx` if your domain differs.
- **Trust card icons:** Placeholder character (◇) used; can be replaced with inline SVGs or an icon set for a more polished look.
- **Mobile header:** Nav wraps with flex-wrap; no hamburger menu. Consider a mobile nav pattern if the link list grows.

---

## Files changed / added

| Path | Change |
|------|--------|
| `src/components/Header.tsx` | **New.** Shared header with primary CTA "Create workspace," Security link, "View sample audit pack" link. |
| `src/components/Footer.tsx` | **New.** Footer with Product, Partners, Pricing, Security, Privacy, Terms, Contact + "Privacy & data hosting" copy. |
| `src/app/shared.module.css` | Footer link styles, footer grid, trust grid, How it works step styles, heroWhoFor, socialProof, badgeNoAdvice, ctaSecondaryLink. |
| `src/app/page.tsx` | Header/Footer; hero "who it's for"; trust grid; How it works; social proof; badges; single primary CTA in final block; id="pricing". |
| `src/app/partners/page.tsx` | Header/Footer; two-column cards; partner CTA lane; no-advice badge above form. |
| `src/app/partners/page.module.css` | twoColGrid, partnerCtaLane. |
| `src/app/signup/page.tsx` | Header/Footer. |
| `src/app/gdpr/page.tsx` | Header/Footer; Link re-imported for existing CTAs. |
| `src/components/PartnerSignupForm.tsx` | Honeypot sr-only label; required/optional markers; unique ids; aria-required; aria-live for errors; clearer consent copy; reassurance text. |
| `src/components/PartnerSignupForm.module.css` | hpLabel, requiredMarker, optionalMarker, srOnly, reassurance. |
| `src/app/security/page.tsx` | **New.** Security & data hosting content. |
| `src/app/privacy/page.tsx` | **New.** Placeholder privacy policy. |
| `src/app/terms/page.tsx` | **New.** Placeholder terms. |
| `src/app/contact/page.tsx` | **New.** Contact with mailto link. |
| `src/app/sitemap.ts` | Routes for /security, /privacy, /terms, /contact. |

---

## Assumptions

1. **Primary CTA:** "Create workspace" was chosen as primary over "Get sample audit pack" to drive signups; sample pack is secondary.
2. **Security:** No separate "Trust" page; "Security" in nav and footer covers trust and data hosting.
3. **Pricing:** No dedicated /pricing page; footer "Pricing" links to /#pricing on the homepage.
4. **Privacy / Terms:** Placeholder pages only; full legal copy to be added later.
5. **Contact:** Single email (mailto); no contact form to avoid scope creep and spam.
6. **Copy:** All CTAs standardized to "View sample audit pack" (not "See sample…" or "Request…"); "Create workspace" used consistently; removed competing "Request a short demo" from final CTA block.
