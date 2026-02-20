import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { connectToDatabase } from "@/lib/mongoose";
import { OrganisationModel } from "@/lib/models";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ctx = await getOrgContext(userId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!STRIPE_SECRET) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 500 });
  }

  await connectToDatabase();
  const org = await OrganisationModel.findById(ctx.orgId).select("stripeCustomerId").lean();
  const customerId = (org as { stripeCustomerId?: string })?.stripeCustomerId;
  if (!customerId) {
    return NextResponse.json(
      { error: "No billing account found. Subscribe first to manage your subscription." },
      { status: 400 }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET);
  const origin = req.headers.get("origin") || req.headers.get("x-url") || "http://localhost:3000";
  const returnUrl = `${origin}${auditPath("/dashboard/audit-exports")}`;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return NextResponse.json({ url: session.url });
}
