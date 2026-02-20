"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  getAnalyticsConsentValue,
  setAnalyticsConsent as setConsentStorage,
  type AnalyticsConsent,
} from "@/lib/consent";

type ContextValue = {
  consent: AnalyticsConsent;
  setConsent: (value: boolean) => void;
  hasConsented: boolean;
};

const CookieConsentContext = createContext<ContextValue | null>(null);

export function useCookieConsent(): ContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}

export function useCookieConsentOptional(): ContextValue | null {
  return useContext(CookieConsentContext);
}

function readConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  return getAnalyticsConsentValue();
}

function getInitialConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  return getAnalyticsConsentValue();
}

export default function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsentState] = useState<AnalyticsConsent>(null);

  // Sync from localStorage after mount (client-only) so consent is correct after hydration
  useEffect(() => {
    setConsentState(getInitialConsent());
  }, []);

  useEffect(() => {
    const handler = () => setConsentState(readConsent());
    window.addEventListener("analytics-consent-change", handler);
    return () => window.removeEventListener("analytics-consent-change", handler);
  }, []);

  const setConsent = useCallback((value: boolean) => {
    setConsentStorage(value);
    flushSync(() => setConsentState(value ? "yes" : "no"));
  }, []);

  const value = useMemo<ContextValue>(
    () => ({
      consent,
      setConsent,
      hasConsented: consent === "yes",
    }),
    [consent, setConsent]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}
