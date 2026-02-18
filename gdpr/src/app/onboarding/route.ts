import { NextResponse } from "next/server";

/**
 * Redirect /onboarding to the URL from .env (VAULT_URL).
 * If VAULT_URL is not set, redirects to /.
 */
export function GET() {
  const url = process.env.VAULT_URL?.trim() || "/";
  return NextResponse.redirect(url, 302);
}
