/**
 * GA4 and Hotjar analytics – client-side only.
 * Fires events only when the user has consented to analytics cookies (see CookieConsentProvider).
 */

import { getAnalyticsConsent } from "@/lib/consent";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js",
      targetOrName: string,
      params?: Record<string, unknown>
    ) => void;
    hj?: (command: string, ...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !getAnalyticsConsent()) return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {
    // no-op if gtag fails
  }
}

/** Send a page view to GA4 (for client-side route changes). */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === "undefined" || !getAnalyticsConsent()) return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: path,
        page_title: title ?? document?.title ?? "",
      });
    }
  } catch {
    // no-op
  }
}

/** Tag the current Hotjar recording with labels (e.g. for filtering key flows). */
export function tagRecording(tags: string[]): void {
  if (typeof window === "undefined" || !getAnalyticsConsent()) return;
  try {
    if (typeof window.hj === "function") {
      window.hj("tagRecording", tags);
    }
  } catch {
    // no-op
  }
}
