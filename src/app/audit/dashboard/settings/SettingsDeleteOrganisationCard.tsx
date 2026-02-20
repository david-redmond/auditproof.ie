"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { auditPath } from "@/lib/constants";
import { deleteOrganisation } from "./actions";
import listStyles from "../list.module.css";
import styles from "./settings.module.css";

type Props = { organisationName: string };

export function SettingsDeleteOrganisationCard({ organisationName }: Props) {
  const [open, setOpen] = useState(false);
  const [orgNameConfirm, setOrgNameConfirm] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [understood, setUnderstood] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [state, formAction] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) =>
      deleteOrganisation(formData),
    null as { error?: string } | null
  );

  const canSubmit =
    orgNameConfirm.trim() === organisationName.trim() &&
    confirmText === "DELETE" &&
    understood;

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
        aria-labelledby="danger-org-heading"
      >
        <h2 id="danger-org-heading" className={styles.dangerZoneTitle}>
          Danger zone
        </h2>
        <div className={styles.dangerZoneSection}>
          <h3 className={styles.dangerZoneSectionTitle}>Delete organisation</h3>
          <p className={styles.dangerZoneText}>
            This will permanently delete all organisation data: RoPA records, customer requests, incidents, evidence documents, audit exports, and user access.
          </p>
          <p className={styles.dangerZoneText}>This cannot be undone.</p>
          <p className={styles.dangerZoneText}>
            <Link href={auditPath("/dashboard/audit-exports")} className={styles.inlineLink}>
              Download an audit pack first
            </Link>{" "}
            if you want to keep a copy.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={styles.btnDanger}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            Delete organisation
          </button>
        </div>
      </section>

      {open && (
        <div
          className={styles.confirmBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-org-dialog-title"
          aria-describedby="delete-org-dialog-desc"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className={styles.confirmModal} ref={modalRef} style={{ maxWidth: "28rem" }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={styles.modalClose}
              aria-label="Close"
            >
              ×
            </button>
            <h3 id="delete-org-dialog-title" className={styles.confirmTitle}>
              Delete organisation?
            </h3>
            <p id="delete-org-dialog-desc" className={styles.confirmBody}>
              All organisation data and access will be permanently removed. Everyone in this organisation will lose access.
            </p>
            <form action={formAction}>
              {state?.error && (
                <p className={styles.error} role="alert" style={{ marginBottom: "var(--theme-space-3)" }}>
                  {state.error}
                </p>
              )}
              <div className={styles.field} style={{ marginBottom: "var(--theme-space-3)" }}>
                <label className={styles.label} htmlFor="delete-org-name">
                  Type the organisation name <strong>{organisationName}</strong> to confirm
                </label>
                <input
                  id="delete-org-name"
                  name="orgNameConfirm"
                  type="text"
                  className={styles.input}
                  autoComplete="off"
                  value={orgNameConfirm}
                  onChange={(e) => setOrgNameConfirm(e.target.value)}
                />
              </div>
              <div className={styles.field} style={{ marginBottom: "var(--theme-space-3)" }}>
                <label className={styles.label} htmlFor="delete-org-confirm">
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  id="delete-org-confirm"
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
                  I understand this is permanent
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
                  Permanently delete organisation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
