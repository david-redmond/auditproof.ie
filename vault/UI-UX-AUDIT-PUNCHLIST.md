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
- **Partner form UX:** Honeypot sr-only; required/optional markers; aria-live for errors; clearer consent copy; reassurance text.

### D) Trust, footer, and compliance UI
- **Site-wide footer:** `Footer` with Product, Partners, Pricing, Security, Privacy, Terms, Contact, Sign in, Register; "Privacy & data hosting" copy; © go-solutions; Made with ♥.
- **Security page:** /security with EU hosting, access controls, audit trails.

### E) Accessibility
- Focus rings, labels, aria-required/optional, role="alert" + aria-live for form errors, semantic headings.

---

## Files (moved into vault)

Marketing content and shared UI from the gdpr app now live in **vault**: `Header`, `Footer`, `shared.module.css`, homepage (with redirect when logged in), partners, signup, gdpr product page, security, privacy, terms, contact, sitemap, `PartnerSignupForm` (with a11y improvements), and these docs.
