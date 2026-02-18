"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./audit-exports.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PaywallModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState<"annual" | "monthly" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = modalRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    first?.focus();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const startCheckout = async (plan: "annual" | "monthly") => {
    setError(null);
    setLoading(plan);
    try {
      const partnerRef =
        typeof document !== "undefined"
          ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("partner_ref="))
            ?.split("=")[1]
          : undefined;
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, partnerRef: partnerRef || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(null);
        return;
      }
      if (data.url) window.location.href = data.url;
      else setError("No checkout URL returned.");
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(null);
  };

  if (!open) return null;

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
      aria-describedby="paywall-description"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal} ref={modalRef} style={{ maxWidth: "28rem" }}>
        <div className={styles.modalHeader}>
          <div>
            <h2 id="paywall-title" className={styles.modalTitle}>
              Generate your GDPR audit pack
            </h2>
            <p id="paywall-description" className={styles.modalSubtitle}>
              You&apos;ve recorded the key GDPR information required to demonstrate accountability. To
              generate and download your GDPR audit pack, you&apos;ll need an active subscription.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.modalClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <ul className={styles.paywallList}>
            <li>Unlimited audit exports</li>
            <li>Ongoing record storage</li>
            <li>Future updates</li>
          </ul>
          <p className={styles.modalSubtitle} style={{ margin: "0 0 1rem 0", fontSize: "0.8125rem" }}>
            Less than the cost of one hour of consultancy.
          </p>
          {error && (
            <p className={styles.paywallError} role="alert">
              {error}
            </p>
          )}
          <div
            className={styles.modalFooterActions}
            style={{ flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}
          >
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={!!loading}
              onClick={() => startCheckout("annual")}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {loading === "annual" ? (
                <>
                  <span className={styles.spinner} aria-hidden />
                  Redirecting…
                </>
              ) : (
                "Subscribe €299/year (recommended)"
              )}
            </button>
            <button
              type="button"
              className={styles.btn}
              disabled={!!loading}
              onClick={() => startCheckout("monthly")}
              style={{
                width: "100%",
                justifyContent: "center",
                border: "1px solid var(--theme-border)",
                background: "var(--theme-card-bg)",
              }}
            >
              {loading === "monthly" ? (
                <>
                  <span className={styles.spinner} aria-hidden />
                  Redirecting…
                </>
              ) : (
                "Subscribe €29/month"
              )}
            </button>
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--theme-text-muted)",
              margin: "0.75rem 0 0 0",
            }}
          >
            No refunds after export generation.
          </p>
        </div>
      </div>
    </div>
  );
}
