/**
 * Server-side subscription status. Source of truth: Stripe; cached on Organisation via webhook.
 */

import type { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { OrganisationModel } from "@/lib/models";

export type SubscriptionPlan = "annual" | "monthly" | null;

export type SubscriptionStatus = {
  isActive: boolean;
  plan: SubscriptionPlan;
};

/** When false or unset, payments are disabled and all users have full access (no paywall). */
const PAYMENTS_ENABLED = process.env.ENABLE_PAYMENTS === "true";

/**
 * Returns subscription status for an organisation (cached from Stripe webhook).
 * Use for gating audit pack export only; data entry and uploads are never gated.
 * When ENABLE_PAYMENTS is not "true", always returns isActive: true so export is allowed.
 */
export async function getSubscriptionStatus(
  organisationId: Types.ObjectId
): Promise<SubscriptionStatus> {
  if (!PAYMENTS_ENABLED) {
    return { isActive: true, plan: "annual" };
  }
  await connectToDatabase();
  const org = await OrganisationModel.findById(organisationId)
    .select("subscriptionStatus stripePriceId")
    .lean();
  if (!org) return { isActive: false, plan: null };

  const status = (org as { subscriptionStatus?: string; stripePriceId?: string }).subscriptionStatus;
  const priceId = (org as { stripePriceId?: string }).stripePriceId;

  const isActive = status === "active" || status === "trialing";
  let plan: SubscriptionPlan = null;
  if (isActive && priceId) {
    const annualId = process.env.STRIPE_PRICE_ANNUAL;
    const monthlyId = process.env.STRIPE_PRICE_MONTHLY;
    if (annualId && priceId === annualId) plan = "annual";
    else if (monthlyId && priceId === monthlyId) plan = "monthly";
  }

  return { isActive, plan };
}
