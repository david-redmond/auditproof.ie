import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { OrganisationModel } from "@/lib/models";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET || !WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 500 });
  }

  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(STRIPE_SECRET);
    event = stripe.webhooks.constructEvent(raw, sig, WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await connectToDatabase();

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const orgId = sub.metadata?.organisation_id;
    if (!orgId) return NextResponse.json({ ok: true });

    const status = sub.status === "active" || sub.status === "trialing" ? sub.status : "inactive";
    const priceId = sub.items?.data?.[0]?.price?.id ?? null;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

    await OrganisationModel.updateOne(
      { _id: orgId },
      {
        $set: {
          subscriptionStatus: status,
          stripeCustomerId: customerId ?? undefined,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId ?? undefined,
        },
      }
    );
  } else if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const orgId = sub.metadata?.organisation_id;
    if (!orgId) return NextResponse.json({ ok: true });

    await OrganisationModel.updateOne(
      { _id: orgId },
      {
        $set: {
          subscriptionStatus: "inactive",
          stripeSubscriptionId: null,
          stripePriceId: null,
        },
      }
    );
  }

  return NextResponse.json({ received: true });
}
