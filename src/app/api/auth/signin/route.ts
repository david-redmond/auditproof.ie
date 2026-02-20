import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { rateLimit } from "@/lib/rateLimit";
import { createSession } from "@/lib/auth";
import { UserModel } from "@/lib/models";

const SigninSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email").max(200),
  password: z.string().min(1, "Password is required").max(200),
});

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const limiter = rateLimit(`signin:${ip}`, { limit: 6, windowMs: 60_000 });
    if (!limiter.ok) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const parsed = SigninSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { email: rawEmail, password } = parsed.data;
    const email = rawEmail.trim().toLowerCase();

    await connectToDatabase();
    const user = await UserModel.findOne({ email }).lean();
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user._id.toString());
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
