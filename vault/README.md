This is a [Next.js](https://nextjs.org) project that combines the GDPR Evidence marketing site and the audit (vault) app in one codebase.

## URL structure

- **Marketing:** `/` (home), `/gdpr`, `/partners`, `/signup`. `/onboarding` redirects to the audit dashboard.
- **Audit app:** All product routes live under `/audit` — sign in at `/audit/signin`, dashboard at `/audit/dashboard`, and so on. Legacy `/signin` and `/dashboard` redirect to these paths.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page is the marketing site; if you are logged in you are redirected to `/audit/dashboard`.

### Generating the GDPR Audit Pack (PDF) locally

1. Ensure the dev server is running (`npm run dev`) and MongoDB (or your configured DB) is available.
2. Sign in at `/audit/signin` and select (or create) an organisation.
3. Go to **Audit exports** in the dashboard (or navigate to `/audit/dashboard/audit-exports`).
4. Click **Create audit pack**, choose which sections to include (RoPA, DSRs, Incidents, Documents), then click **Create audit pack**.
5. When the pack is ready, click **Download PDF** to get the snapshot. The PDF includes article signposting (e.g. Article 30 RoPA, Articles 12–23 DSR), a disclaimer, status-at-a-glance, and audit log event count. This pack is a read-only snapshot for accountability and record-keeping; it does not constitute legal advice.

### GDPR Audit Pack PDF – design and branding

The PDF is built from a small **design token** module so layout and branding can be adjusted in one place.

- **Tokens** (`vault/src/lib/pdf-audit-pack/tokens.ts`): Page size (A4), margins (min 18 mm), typography sizes (title 22–26 pt, section 14–16 pt, body 10.5–11 pt, tables 9.5–10 pt), line heights, table cell padding, card padding and radius, and grid column count.
- **Colours** (`getColors()` in `tokens.ts`): Text, muted, divider, table header/zebra, box border/background, footer, and a single **accent** colour (e.g. blue) plus **accentTint**, **risk**, and **success** for highlights and badges. To change branding (e.g. Go Solutions blue), edit the `accent` and optionally `accentTint` values in `getColors()`.
- **Fonts**: The PDF uses `pdf-lib` standard fonts (Helvetica) by default. To use Inter or Source Sans, add `.ttf`/`.otf` files (e.g. under `public/fonts/`) and embed them when creating the document (see `route.ts`); then pass the embedded font into the PDF context instead of `StandardFonts.Helvetica`.
- **Footer**: Left text defaults to “Go Solutions GDPR Audit Pack”, centre to “Confidential”, right to “Page N of M”. Override by passing `left`, `center`, or `right` to `drawFooterOnPage()`.

**Table layout (enterprise audit):**

- **Orientation**: Cover and summary stay portrait; all table-heavy sections (RoPA, DSR, Incidents, Documents) use **landscape** A4 for width and readability.
- **Margins**: 20–25 mm on table pages (`MARGIN_TABLE` ≈ 60 pt); portrait uses `MARGIN`.
- **Cell padding**: 12 pt horizontal, 10 pt vertical (`TABLE_CELL_PAD_H`, `TABLE_CELL_PAD_V`) for consistent spacing and no overlap.
- **Column widths**: Fixed; long-text columns (Summary, Retention, Note, Rationale, Document name) get ~30–35% of content width; boolean/short fields get ~8–12%.
- **DSR two-row pattern**: Each request is two physical rows — row 1: Received | Type | Who | Reply by | Late?; row 2: ID? | Sent? | Extension | Note — to avoid horizontal compression and overflow.
- **Headers**: Short labels (e.g. “ID?”, “Sent?”, “Late?”, “DPC?”) to avoid layout breakage; full wording in section titles/subtitles where needed.

### Environment variables

Create `vault/.env.local` (or set these in your deployment environment). Minimum for local dev:

```bash
AUTH_SECRET=your-secret-at-least-32-chars
MONGODB_URI=mongodb://localhost:27017/gdpr-vault
```

### Billing (Stripe)

To enable the export paywall and subscriptions, add to `.env.local` using the **exact** Price IDs from your Stripe product:

```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
STRIPE_PRICE_ANNUAL=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_MONTHLY=price_xxxxxxxxxxxxxxxx
```

- **STRIPE_SECRET_KEY** – [Stripe Dashboard → API keys](https://dashboard.stripe.com/apikeys) → Secret key
- **STRIPE_WEBHOOK_SECRET** – From [Webhooks](https://dashboard.stripe.com/webhooks) after adding endpoint `https://your-domain/api/billing/webhook` (events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`). For local testing use Stripe CLI: `stripe listen --forward-to localhost:3000/api/billing/webhook`. After checkout or portal, users are returned to `/audit/dashboard/audit-exports`.
- **STRIPE_PRICE_ANNUAL** – Price ID for your €299/year recurring price (Stripe Dashboard → Product → copy Price ID)
- **STRIPE_PRICE_MONTHLY** – Price ID for your €29/month recurring price

Without these four variables, export remains gated and the Subscribe buttons return “Billing not configured”.

**Feature flag – disable payments:** Set `ENABLE_PAYMENTS=false` (or leave it unset) to turn off all payment logic. When not `"true"`, every user can create and download audit packs with no paywall. Set `ENABLE_PAYMENTS=true` when you are ready to enforce Stripe subscriptions.

Optional: **NEXT_PUBLIC_SITE_URL** for sitemap and canonical URLs. **PARTNER_NOTIFY_EMAIL** and **RESEND_FROM** for partner signup notifications.

**Production – invite links:** For production you **must** set **VAULT_BASE_URL** or **NEXT_PUBLIC_BASE_URL** to your public app URL (e.g. `https://your-domain.com`). Invite emails use this to build the accept-invite link; if unset, links fall back to `http://localhost:3000` and will be wrong in production.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
