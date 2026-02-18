import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { notifyPartnerApplicationEmail } from "@/lib/notifyEmail";

const PartnerSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(200),
  phone: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z
      .string()
      .trim()
      .min(7, "Please enter a valid phone number.")
      .max(30)
      .optional()
  ),
  companyName: z
    .string()
    .trim()
    .min(2, "Please enter your company name.")
    .max(200),
  website: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z
      .string()
      .trim()
      .max(200)
      .optional()
      .refine(
        (v) => {
          if (!v) return true;
          try {
            const url = v.includes("://") ? v : `https://${v}`;
            new URL(url);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Please enter a valid website (or leave it blank)." }
      )
  ),
  partnerType: z.enum([
    "accountant",
    "bookkeeper",
    "business_support",
    "msp_it",
    "web_agency",
    "gdpr_consultant",
    "other",
  ]),
  clientCount: z.number().int().min(0).max(100000).optional(),
  message: z.string().trim().max(2000).optional(),
  agreeToTerms: z.literal(
    true,
    "You must confirm you have permission to refer clients."
  ),
  hp: z.string().optional(), // honeypot
});

function toFieldErrors(issues: z.ZodIssue[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rl = rateLimit(`partner:${ip}`, {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = PartnerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please correct the highlighted fields.",
        fieldErrors: toFieldErrors(parsed.error.issues),
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.hp !== undefined && data.hp.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const createdAt = new Date();
  const userAgent = req.headers.get("user-agent") ?? undefined;

  const db = await getDb();
  const col = db.collection("partner_applications");

  const existing = await col.findOne({
    email: data.email.toLowerCase(),
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  if (existing) {
    return NextResponse.json(
      { ok: true, message: "Application already received recently." },
      { status: 200 }
    );
  }

  await col.insertOne({
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    phone: data.phone,
    companyName: data.companyName,
    website: data.website,
    partnerType: data.partnerType,
    clientCount: data.clientCount,
    message: data.message,
    agreeToTerms: true,
    createdAt,
    status: "new",
    source: "partners-page",
    ipHash: ip !== "unknown" ? sha256(ip) : undefined,
    userAgent,
  });

  try {
    await notifyPartnerApplicationEmail({
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      companyName: data.companyName,
      website: data.website,
      partnerType: data.partnerType,
      clientCount: data.clientCount,
      message: data.message,
      createdAtISO: createdAt.toISOString(),
    });
  } catch (err) {
    console.error("Partner notify email failed:", err);
  }

  return NextResponse.json(
    { ok: true, message: "Partner application received." },
    { status: 200 }
  );
}
