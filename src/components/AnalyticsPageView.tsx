"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/analytics";

/**
 * Sends a GA4 page_view on route change (App Router client-side navigation).
 * Renders nothing. Only sends when GA is loaded (trackPageView no-ops otherwise).
 */
export default function AnalyticsPageView() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Avoid duplicate page_view on first mount when GA config already sent one
    const _isFirst = prevPath.current === null;
    prevPath.current = pathname;
    trackPageView(pathname, typeof document !== "undefined" ? document.title : undefined);
  }, [pathname]);

  return null;
}
