/**
 * Analytics cookie consent – client-side only.
 * Persists in localStorage so GA/Hotjar load and events only run when the user has consented.
 */

const STORAGE_KEY = "gdpr_analytics_consent";

export type AnalyticsConsent = "yes" | "no" | null;

/** Returns true only when the user has explicitly accepted analytics cookies. */
export function getAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage?.getItem(STORAGE_KEY) === "yes";
  } catch {
    return false;
  }
}

/** Returns the raw consent value (yes / no / null). */
export function getAnalyticsConsentValue(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage?.getItem(STORAGE_KEY);
    if (v === "yes" || v === "no") return v;
    return null;
  } catch {
    return null;
  }
}

/** Persist consent. Call with true when user accepts, false when they reject. */
export function setAnalyticsConsent(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage?.setItem(STORAGE_KEY, value ? "yes" : "no");
    window.dispatchEvent(new CustomEvent("analytics-consent-change", { detail: value }));
  } catch {
    // no-op
  }
}
