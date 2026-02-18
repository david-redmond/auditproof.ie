# RoPA UI Update — Implementation Summary

Summary of changes to the Data Processing Register and RoPA Templates pages: user experience, accessibility (WCAG-minded), and GA4 instrumentation.

---

## A) `/audit/dashboard/ropa` — Data Processing Register

### A1) Summary strip
- **Added** a summary section above the table with three counts (based on current filtered results):
  - Total data uses
  - Need review (no `lastReviewedAt`)
  - International transfers
- Uses `<section aria-labelledby="ropa-summary-heading">` and a visible heading "Summary".
- **GA4:** `ropa_summary_view` once per page load with `{ page: "register" }`.

### A2) Empty state
- When there are no rows (or no results after search/filters), the table is **replaced** by an empty state panel:
  - Title: "No RoPA records yet"
  - Short supportive text
  - Primary button: "Start with templates (recommended)" → `/audit/dashboard/ropa/templates`
  - Secondary button: "Create blank record" → `/audit/dashboard/ropa/new`
- **GA4:** `ropa_empty_state_view` when empty; `ropa_empty_state_click` with `action: "templates"` or `"blank"`.

### A3) Search
- Search input above filters: placeholder "Search data uses… (e.g. payroll, CCTV, marketing)".
- Debounced 250 ms; matches **Data use** (name) and **purpose** (description).
- Visible label "Search data uses" and `id`/`htmlFor`; `type="search"`; optional sr-only description.
- **GA4:** `ropa_search_used` on first non-empty search per page with `query_length_bucket`: `"1-3"` / `"4-10"` / `"10+"`.

### A4) Filters layout
- Status, Lawful basis, and International transfers remain; layout updated to a **grid** with labels **above** each select.
- Each select has `htmlFor`/`id`, clear focus ring (`:focus-visible`), and min-height 44px for touch.

### A5) "Lawful basis" column
- Column header text: **"Lawful basis"** (renamed from "Why we can use it").
- Accessible help: `<details><summary>` with "?" and text: "Lawful reason under GDPR for processing this data." (keyboard and screen-reader friendly).

### A6) Last checked
- When `lastReviewedAt` is missing, shows **"Not reviewed yet"** (plain text, not "—").

### A7) Completeness / quality badge
- New badge per row next to Data use:
  - **Complete** (checkmark + text)
  - **Missing retention** / **Missing suppliers** / **Not reviewed yet** (warning-style pills).
- Rules: missing retention if no period; missing suppliers if processors count is 0; not reviewed if no `lastReviewedAt`.
- Text is explicit (not color-only).

### A8) Row click
- Table rows are **clickable** (mouse) to open the record; "View / Edit" link kept for keyboard and clarity.
- No nested interactive content: row click is pointer-only; keyboard users use the link.

### A9) Status pills
- **"Active"** and **"Inactive"** shown as pills (border + background + text). Text is always present.

### A10) Export
- **"Download RoPA (CSV)"** button next to the table caption; client-side CSV export of current (filtered) list.
- **GA4:** `ropa_export_click` with `{ format: "csv", page: "register" }`.

---

## B) `/audit/dashboard/ropa/templates` — RoPA Templates

### B1) Onboarding header
- Title: **"Start with templates"**
- Subtext: "Pick the activities your business does. You can edit everything after importing."

### B2) Info banner
- Replaced "Templates are examples only" with a single friendly banner:
  - "Templates are a starting point. Review and customise each one to match your business."
- Marked with `role="status"` so it’s non-disruptive.

### B3) Search templates
- `type="search"` input with visible label "Search templates" and `id`/`htmlFor`.

### B4) Grouped sections
- Templates grouped into:
  - **Customer & Sales**
  - **Finance & Admin**
  - **Staff**
  - **Security**
- Each section has an `<h2>` and a grid of template cards.

### B5) Template cards
- Each template is a **card** with:
  - Checkbox (native, focusable)
  - Title, description
  - Category pill
  - **Recommended** pill for: Customer Enquiries, Invoicing & Accounting, Employee Payroll, Supplier Management, IT Logs
- Card implemented as `<label htmlFor="...">` so clicking the card toggles the checkbox; keyboard users focus the checkbox and use Space.

### B6) Selection actions
- Top-right: **Select recommended**, **Select all**, **Clear**.
- Import button label:
  - Disabled: "Import selected templates" when count = 0
  - Enabled: "Import N template(s)" when count > 0
- Selection counter: "N selected" (and `aria-live="polite"` where shown).

### B7) Sticky footer
- Sticky bar at bottom: left "N template(s) selected"; right: primary "Import N templates" and secondary "Create blank instead".
- Main content has bottom padding so the bar doesn’t cover content.
- Footer does not trap focus; it’s in normal DOM order.

### GA4 (templates)
- `ropa_templates_view` on page load (`page: "templates"`).
- `ropa_templates_search_used` with `query_length_bucket`.
- `ropa_templates_select` with `template_key`, `selected: true/false`.
- `ropa_templates_select_all` with `mode: "all" | "recommended" | "clear"`.
- `ropa_templates_import_click` with `count: N`.

---

## C) Google Analytics (GA4)

- **New:** `vault/src/lib/analytics.ts` with `trackEvent(name, params)`.
- Client-side only (no firing on server render).
- Uses `window.gtag("event", name, params)` when `gtag` is present (e.g. after adding the GA4 script).
- **TODO:** If the app adds a consent banner, gate events on consent (see comment in `analytics.ts`).

---

## D) Accessibility

- Form controls have programmatic labels (`htmlFor`/`id` or `aria-label` where needed).
- Headings: h1 → h2 used in sections.
- Focus visible via `:focus-visible` and outline variables.
- No hover-only info: Lawful basis help uses `<details><summary>`.
- Table remains a semantic table with `aria-label` / `aria-labelledby`.
- Buttons/links have clear names (no "Click here").
- Sticky footer does not cover content (padding on main).
- Layout is responsive (flex/grid and breakpoints); works at 320px width.

---

## Files changed / added

| Path | Change |
|------|--------|
| `vault/src/lib/analytics.ts` | **New** — GA4 `trackEvent` helper |
| `vault/src/lib/ropaTemplates.ts` | Added `category`, `recommended`; `RopaTemplateCategory` type |
| `vault/src/app/audit/dashboard/ropa/page.tsx` | Server: serializes list, renders `RopaRegisterClient` |
| `vault/src/app/audit/dashboard/ropa/RopaRegisterClient.tsx` | **New** — Summary, search, filters, empty state, table, export |
| `vault/src/app/audit/dashboard/ropa/RopaFilters.tsx` | Unchanged (still used inside client) |
| `vault/src/app/audit/dashboard/list.module.css` | Summary strip, search, filters grid, empty state actions, table caption, export btn, Lawful basis help, pills, badges, row click, focus styles |
| `vault/src/app/audit/dashboard/ropa/templates/page.tsx` | Unchanged (still wraps `ImportTemplatesForm`) |
| `vault/src/app/audit/dashboard/ropa/templates/ImportTemplatesForm.tsx` | Rewritten: header, banner, search, sections, cards, selection actions, sticky footer, GA4 |
| `vault/src/app/audit/dashboard/ropa/templates/templates.module.css` | New layout: subtext, info banner, search, actions top, sections, grid, pills, sticky footer |

Routes and behaviour (add/edit/delete, filters via URL, import API) are unchanged.
