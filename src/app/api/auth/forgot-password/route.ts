import { z } from "zod";
import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rateLimit";

const ForgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email").max(200),
});

/**
 * Request a password reset link for the given email.
 * TODO: Wire to real implementation: look up user by email, create reset token (e.g. in DB or signed JWT),
 * send email with link to /reset-password?token=... . Always return 200 with same body to avoid enumeration.
 */
export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const limiter = rateLimit(`forgot-password:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!limiter.ok) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const parsed = ForgotPasswordSchema.safeParse(json);
    if (!parsed.success) {
      // Still return 200 with generic success to avoid email enumeration
      return NextResponse.json({ ok: true });
    }

    const { email } = parsed.data;
    // TODO: await sendPasswordResetEmail(email) – create token, store expiry, send email
    void email;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
