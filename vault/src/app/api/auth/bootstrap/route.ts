import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { UserModel } from "@/lib/models";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const limiter = rateLimit(`bootstrap:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (!limiter.ok) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }

    const body = await req.json();
    const token = typeof body?.token === "string" ? body.token : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const expected = process.env.BOOTSTRAP_TOKEN;
    if (!expected || token !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email || password.length < 8) {
      return NextResponse.json(
        { error: "Email required and password must be at least 8 chars" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const existing = await UserModel.countDocuments();
    if (existing > 0) {
      return NextResponse.json({ error: "Already initialized" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await UserModel.create({ email, passwordHash });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
