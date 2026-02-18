This is a [Next.js](https://nextjs.org) project for **GDPR Evidence** — audit-ready records for small businesses.

## Environment variables

Create `.env.local` (or copy from `.env.example` if present) and set:

- **MONGODB_URI** – MongoDB connection string (required).
- **Partner notifications (Resend):**  
  **PARTNER_NOTIFY_EMAIL** – address to receive partner signup notifications (e.g. your Gmail).  
  **RESEND_API_KEY** – from [Resend](https://resend.com).  
  **RESEND_FROM** – sender for those emails (e.g. `GDPR Tool <no-reply@yourdomain.ie>`).

When you confirm the final notification address, you only need to change `PARTNER_NOTIFY_EMAIL`.

Optional: **NEXT_PUBLIC_SITE_URL** for sitemap URLs in production.

Optional: **VAULT_URL** – after signup and when visiting `/onboarding`, users are redirected here (e.g. your vault app URL). If unset, redirect is `/`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
