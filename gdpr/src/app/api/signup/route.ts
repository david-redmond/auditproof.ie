import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongoose";
import { OrganisationModel, UserModel, MembershipModel } from "@/lib/models";
import { rateLimit } from "@/lib/rateLimit";

const SignupSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name.").max(100),
  organisationName: z
    .string()
    .trim()
    .min(1, "Please enter your organisation name.")
    .max(200),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(200),
  password: z.string().min(8, "Use at least 8 characters.").max(200),
});

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rl = rateLimit(`signup:${ip}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = SignupSchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Please enter valid details.";
    return NextResponse.json({ message: msg }, { status: 400 });
  }

  const { fullName, organisationName, email, password } = parsed.data;
  const emailLower = email.toLowerCase();

  await connectToDatabase();
  const existing = await UserModel.findOne({ email: emailLower }).lean();

  if (existing) {
    return NextResponse.json(
      { message: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const mongoose = await connectToDatabase();
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = await UserModel.create(
        [
          {
            name: fullName,
            email: emailLower,
            passwordHash,
            authProvider: "custom",
          },
        ],
        { session }
      );

      const org = await OrganisationModel.create(
        [
          {
            name: organisationName.trim(),
            dpo: { status: "not_required", justification: "MVP default" },
          },
        ],
        { session }
      );

      await MembershipModel.create(
        [
          {
            userId: user[0]._id,
            orgId: org[0]._id,
            role: "owner",
          },
        ],
        { session }
      );
    });
  } finally {
    session.endSession();
  }

  // TODO: establish session (cookie / auth lib)
  const redirectUrl = process.env.VAULT_URL?.trim() || "/";
  return NextResponse.json({ ok: true, redirectUrl });
}
