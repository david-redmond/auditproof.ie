import { z } from "zod";
import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rateLimit";

const MIN_PASSWORD_LENGTH = 8;

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Reset link is invalid"),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`).max(200),
  confirm: z.string().min(1, "Please confirm your password"),
});

/**
 * Set a new password using the reset token from the email link.
 * TODO: Wire to real implementation: verify token (e.g. from DB or verify signed JWT), find user,
 * hash new password, update user, invalidate token.
 */
export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const limiter = rateLimit(`reset-password:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!limiter.ok) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const parsed = ResetPasswordSchema.safeParse(json);
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const message =
        first.password?.[0] ?? first.confirm?.[0] ?? first.token?.[0] ?? "Invalid request";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { token, password, confirm } = parsed.data;
    if (password !== confirm) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // TODO: Verify token (e.g. lookup in reset_tokens table or verify JWT), get userId
    // TODO: const user = await UserModel.findById(userId); if (!user) return 400 { error: "This reset link is invalid or expired." }
    // TODO: const passwordHash = await bcrypt.hash(password, 12); await UserModel.updateOne({ _id: userId }, { passwordHash });
    // TODO: Invalidate token / delete from DB
    void token;
    void password;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
