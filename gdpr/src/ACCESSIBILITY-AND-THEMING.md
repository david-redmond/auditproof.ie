# Accessibility & Theming

## Theming (one file)

**All visual tokens live in `src/app/theme.css`.**

- Change colours, spacing, radii, focus ring, and motion there to restyle the whole app.
- Page and component CSS should use **only** `var(--theme-*)` variables (no hard-coded colours or spacing).
- Optional dark theme: set `data-theme="dark"` on `<html>` to use the dark palette defined in `theme.css`.

### Theme variables

| Variable | Purpose |
|----------|--------|
| `--theme-bg`, `--theme-bg-alt` | Page and alternate section backgrounds |
| `--theme-text`, `--theme-text-muted` | Body and secondary text |
| `--theme-accent`, `--theme-accent-hover`, `--theme-accent-contrast` | Buttons and links |
| `--theme-border`, `--theme-card-bg`, `--theme-card-highlight-bg` | Borders and cards |
| `--theme-focus-ring`, `--theme-focus-ring-offset`, `--theme-focus-outline-width` | Focus indicators |
| `--theme-font-sans`, `--theme-font-mono` | Typography |
| `--theme-space-*` | Spacing scale |
| `--theme-radius-sm`, `--theme-radius-md` | Border radius |
| `--theme-duration-*`, `--theme-ease` | Motion (honours `prefers-reduced-motion`) |

---

## Accessibility checklist for new pages

1. **Skip link** – Provided in root layout; target main content with `id="main-content"` on `<main>`.
2. **Main landmark** – Use `<main id="main-content" tabIndex={-1}>` so the skip link works and focus moves there.
3. **Headings** – One `<h1>` per page, then `<h2>` → `<h3>` in order (no skips).
4. **Landmarks** – Use `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>` as appropriate.
5. **Focus** – Don’t remove `:focus-visible`; use theme variables for focus ring. Primary CTAs use a high-contrast outline (see `page.module.css`).
6. **Links and buttons** – Use `<a>` for navigation, `<button>` for actions; ensure labels are clear.
7. **Images** – Always set `alt` (or `alt=""` if decorative).
8. **Motion** – `theme.css` respects `prefers-reduced-motion: reduce`; avoid extra animations that don’t use theme duration variables.
9. **Contrast** – Theme colours are chosen for sufficient contrast; if adding new colours, check WCAG AA.

---

## When adding a new page

1. **Sitemap** – Add the route to the `routes` array in `src/app/sitemap.ts` so `/sitemap.xml` stays up to date. Set `NEXT_PUBLIC_SITE_URL` in production so sitemap URLs use your real domain.
2. **Styling** – Use `shared.module.css` for layout and components; add page-specific classes in the page’s module if needed.
3. **Metadata** – Export `metadata` (title, description) from the page.
