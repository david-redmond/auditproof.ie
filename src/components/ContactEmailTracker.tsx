"use client";

import { useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = { children: React.ReactNode };

/**
 * Wraps contact content and tracks clicks on mailto links for GA4/Hotjar.
 */
export default function ContactEmailTracker({ children }: Props) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a[href^="mailto:"]');
    if (a) {
      const href = (a as HTMLAnchorElement).href;
      trackEvent("contact_email_click", {
        type: href.includes("privacy") ? "privacy" : "support",
      });
    }
  }, []);

  return <div onClick={handleClick}>{children}</div>;
}
