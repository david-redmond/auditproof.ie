/**
 * GA4 analytics helper – client-side only. Fires events via gtag when available.
 * TODO: If the app uses a consent banner, gate events on consent (don't fire until granted).
 */

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: Record<string, unknown>) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {
    // no-op if gtag fails
  }
}
