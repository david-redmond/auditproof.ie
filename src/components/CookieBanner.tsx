"use client";

import Link from "next/link";
import { useCookieConsentOptional } from "@/components/CookieConsentProvider";
import styles from "./CookieBanner.module.css";

/**
 * Shows when the user has not yet accepted or rejected analytics cookies.
 * Accept = load GA/Hotjar and persist consent. Reject = never load, persist choice.
 */
export default function CookieBanner() {
  const ctx = useCookieConsentOptional();
  if (!ctx || ctx.consent !== null) return null;

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ctx.setConsent(true);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ctx.setConsent(false);
  };

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <p className={styles.text}>
        We use optional analytics cookies to understand how the site is used and to improve it.
        You can accept or reject them. Essential cookies (e.g. sign-in) are always used.{" "}
        <Link href="/cookies" className={styles.link}>
          Cookie policy
        </Link>
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.accept}
          onClick={handleAccept}
        >
          Accept
        </button>
        <button
          type="button"
          className={styles.reject}
          onClick={handleReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
