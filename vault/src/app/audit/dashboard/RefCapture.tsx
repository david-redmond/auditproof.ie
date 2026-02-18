"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const COOKIE_NAME = "partner_ref";
const MAX_AGE_DAYS = 365;

/** Store ?ref= referral code in a cookie when present (for use at Stripe checkout). */
export function RefCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && typeof ref === "string" && ref.length > 0 && ref.length <= 200) {
      const value = encodeURIComponent(ref.trim());
      document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax`;
    }
  }, [searchParams]);

  return null;
}
