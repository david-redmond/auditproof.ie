import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { connectToDatabase } from "@/lib/mongoose";
import { OrganisationModel } from "@/lib/models";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const PRICE_ANNUAL = process.env.STRIPE_PRICE_ANNUAL;
const PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY;

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ctx = await getOrgContext(userId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!STRIPE_SECRET || !PRICE_ANNUAL || !PRICE_MONTHLY) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 500 });
  }

  let body: { plan?: string; partnerRef?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const plan = body.plan === "monthly" ? "monthly" : "annual";
  const priceId = plan === "annual" ? PRICE_ANNUAL : PRICE_MONTHLY;
  const partnerRef = typeof body.partnerRef === "string" ? body.partnerRef.trim() || undefined : undefined;

  await connectToDatabase();
  const orgId = ctx.orgId.toString();
  const org = await OrganisationModel.findById(ctx.orgId).lean();
  const partnerRefToUse = (org as { partnerRef?: string })?.partnerRef ?? partnerRef;
  if (partnerRefToUse && !(org as { partnerRef?: string })?.partnerRef) {
    await OrganisationModel.updateOne(
      { _id: ctx.orgId },
      { $set: { partnerRef: partnerRefToUse } }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET);
  const origin = req.headers.get("origin") || req.headers.get("x-url") || "http://localhost:3000";
  const successUrl = `${origin}${auditPath("/dashboard/audit-exports")}?checkout=success`;
  const cancelUrl = `${origin}${auditPath("/dashboard/audit-exports")}?checkout=cancelled`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: orgId,
    subscription_data: {
      metadata: {
        organisation_id: orgId,
        ...(partnerRefToUse && { partner_ref: partnerRefToUse }),
      },
    },
    metadata: {
      organisation_id: orgId,
      ...(partnerRefToUse && { partner_ref: partnerRefToUse }),
    },
    customer_email: ctx.user.email ?? undefined,
  });

  return NextResponse.json({ url: session.url });
}
