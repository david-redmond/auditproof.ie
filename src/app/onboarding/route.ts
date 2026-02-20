import { NextResponse } from "next/server";
import { auditPath } from "@/lib/constants";

/**
 * Redirect /onboarding to the audit dashboard (same origin).
 */
export function GET() {
  return NextResponse.redirect(auditPath("/dashboard"), 302);
}
