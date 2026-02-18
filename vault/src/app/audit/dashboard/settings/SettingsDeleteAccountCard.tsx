"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { auditPath } from "@/lib/constants";
import { deleteAccount } from "./actions";
import listStyles from "../list.module.css";
import styles from "./settings.module.css";

type Props = { hasPassword: boolean; isSoleOwner: boolean };

export function SettingsDeleteAccountCard({ hasPassword, isSoleOwner }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [understood, setUnderstood] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [state, formAction] = useActionState(deleteAccount, null as { error?: string } | null);

  const canSubmit =
    confirmText === "DELETE" &&
    understood &&
    (!hasPassword || password.length > 0);

  useEffect(() => {
    if (!open) return;
    const el = modalRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>(
      'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    first?.focus();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <section
        className={`${listStyles.panel} ${styles.dangerZone}`}
        aria-labelledby="danger-account-heading"
      >
        <h2 id="danger-account-heading" className={styles.dangerZoneTitle}>
          Danger zone
        </h2>
        <div className={styles.dangerZoneSection}>
          <h3 className={styles.dangerZoneSectionTitle}>Delete my account</h3>
          <p className={styles.dangerZoneText}>
            This removes your sign-in and access.
          </p>
          <p className={styles.dangerZoneText}>
            Your organisation&apos;s records (RoPA, requests, incidents, evidence) will remain unless an Owner deletes the organisation.
          </p>
          <p className={styles.dangerZoneText}>This cannot be undone.</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={styles.btnDanger}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            Delete my account
          </button>
        </div>
      </section>

      {open && (
        <div
          className={styles.confirmBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-dialog-title"
          aria-describedby="delete-account-dialog-desc"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className={styles.confirmModal} ref={modalRef}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={styles.modalClose}
              aria-label="Close"
            >
              ×
            </button>
            <h3 id="delete-account-dialog-title" className={styles.confirmTitle}>
              Delete your account?
            </h3>
            <p id="delete-account-dialog-desc" className={styles.confirmBody}>
              Your account and access will be removed. Organisation data will stay unless an Owner deletes it from Organisation settings.
            </p>
            {isSoleOwner && (
              <p className={styles.dangerZoneText} style={{ marginBottom: "var(--theme-space-3)" }}>
                You are the only Owner. To delete all organisation data, use &quot;Delete organisation&quot; in{" "}
                <Link href={auditPath("/dashboard/settings/organisation")} className={styles.inlineLink}>
                  Organisation settings
                </Link>.
              </p>
            )}
            <form action={formAction}>
              {state?.error && (
                <p className={styles.error} role="alert" style={{ marginBottom: "var(--theme-space-3)" }}>
                  {state.error}
                </p>
              )}
              {hasPassword && (
                <div className={styles.field} style={{ marginBottom: "var(--theme-space-3)" }}>
                  <label className={styles.label} htmlFor="delete-account-password">
                    Password
                  </label>
                  <input
                    id="delete-account-password"
                    name="password"
                    type="password"
                    className={styles.input}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
              <div className={styles.field} style={{ marginBottom: "var(--theme-space-3)" }}>
                <label className={styles.label} htmlFor="delete-account-confirm">
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  id="delete-account-confirm"
                  name="confirmText"
                  type="text"
                  className={styles.input}
                  placeholder="DELETE"
                  autoComplete="off"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
              </div>
              <div className={styles.field} style={{ marginBottom: "var(--theme-space-4)" }}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="understood"
                    value="on"
                    className={styles.checkbox}
                    checked={understood}
                    onChange={(e) => setUnderstood(e.target.checked)}
                  />
                  I understand this cannot be undone
                </label>
              </div>
              <div className={styles.confirmActions}>
                <button type="button" className={styles.btn} onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnDanger}
                  disabled={!canSubmit}
                >
                  Permanently delete my account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
