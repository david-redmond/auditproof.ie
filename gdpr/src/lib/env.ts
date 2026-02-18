/**
 * Fail-fast validation for all environment variables used by the gdpr app.
 * Import this module from root layout so the first request validates env and throws if invalid.
 */

function validateGdprEnv(): void {
  const missing: string[] = [];

  if (!process.env.MONGODB_URI?.trim()) missing.push("MONGODB_URI");
  if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) missing.push("NEXT_PUBLIC_SITE_URL");
  if (!process.env.VAULT_URL?.trim()) missing.push("VAULT_URL");
  if (!process.env.RESEND_API_KEY?.trim()) missing.push("RESEND_API_KEY");
  if (!process.env.RESEND_FROM?.trim()) missing.push("RESEND_FROM");
  if (!process.env.PARTNER_NOTIFY_EMAIL?.trim()) missing.push("PARTNER_NOTIFY_EMAIL");

  if (missing.length > 0) {
    throw new Error(
      `Gdpr environment validation failed. Missing or empty: ${missing.join(", ")}. ` +
        "Set these in .env.local or your deployment environment. See .env.example for reference."
    );
  }
}

validateGdprEnv();
