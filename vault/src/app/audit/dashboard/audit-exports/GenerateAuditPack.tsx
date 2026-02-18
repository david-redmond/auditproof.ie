"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { trackEvent } from "@/lib/analytics";
import { generateAuditPack, type GenerateAuditPackState } from "./actions";
import { PaywallModal } from "./PaywallModal";
import styles from "./audit-exports.module.css";

type Props = {
  initialOpen?: boolean;
  triggerLabel?: string;
  variant?: "primary" | "secondary";
  hasActiveSubscription?: boolean;
};

type OptionItem = {
  name: "includeRopa" | "includeDsrs" | "includeIncidents" | "includeEvidenceIndex" | "includeEvidenceFiles";
  label: string;
  helper: string;
  previewLabel: string;
  optional?: boolean;
  defaultChecked?: boolean;
};

const OPTIONS: OptionItem[] = [
  {
    name: "includeRopa",
    label: "Data processing register (RoPA)",
    helper: "Your data uses and lawful bases",
    previewLabel: "RoPA",
  },
  {
    name: "includeDsrs",
    label: "Customer data requests (DSR)",
    helper: "Requests to access, correct, or delete data",
    previewLabel: "Requests",
  },
  {
    name: "includeIncidents",
    label: "Security incidents",
    helper: "Incidents and possible data breaches",
    previewLabel: "Incidents",
  },
  {
    name: "includeEvidenceIndex",
    label: "Policies & documents index",
    helper: "List of uploaded documents (not the files)",
    previewLabel: "Evidence index",
  },
  {
    name: "includeEvidenceFiles",
    label: "Attach documents (ZIP)",
    helper: "Includes uploaded files in a ZIP (larger download)",
    previewLabel: "ZIP",
    optional: true,
    defaultChecked: false,
  },
];

function SubmitButton({ onCancel }: { onCancel: () => void }) {
  const { pending } = useFormStatus();
  return (
    <div className={styles.modalFooterActions}>
      <button
        type="submit"
        className={`${styles.btn} ${styles.btnPrimary}`}
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? (
          <>
            <span className={styles.spinner} aria-hidden />
            Creating…
          </>
        ) : (
          "Create audit pack"
        )}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className={styles.btn}
        disabled={pending}
      >
        Cancel
      </button>
    </div>
  );
}

export function GenerateAuditPack({
  initialOpen,
  triggerLabel = "Create audit pack",
  variant = "primary",
  hasActiveSubscription = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [state, formAction] = useActionState<GenerateAuditPackState, FormData>(
    generateAuditPack,
    null
  );
  const modalRef = useRef<HTMLDivElement>(null);

  // When landing with ?generate=1, show paywall if not subscribed, else show form
  useEffect(() => {
    if (!initialOpen) return;
    if (hasActiveSubscription) {
      setOpen(true);
    } else {
      setPaywallOpen(true);
    }
  }, [initialOpen, hasActiveSubscription]);

  useEffect(() => {
    if (state?.error === "subscription_required") {
      setOpen(false);
      setPaywallOpen(true);
    }
  }, [state]);

  // Focus trap and Escape to close
  useEffect(() => {
    if (!open) return;
    const el = modalRef.current;
    if (!el) return;

    const focusables = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
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
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackEvent("audit_pack_generate_click");
          if (hasActiveSubscription) {
            setOpen(true);
          } else {
            setPaywallOpen(true);
          }
        }}
        className={variant === "secondary" ? `${styles.btn} ${styles.btnSecondary}` : `${styles.btn} ${styles.btnPrimary}`}
        aria-label={triggerLabel}
      >
        {triggerLabel}
      </button>
      {open && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="generate-audit-title"
          aria-describedby="generate-audit-description"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className={styles.modal} ref={modalRef}>
            <div className={styles.modalHeader}>
              <div>
                <h2
                  id="generate-audit-title"
                  className={styles.modalTitle}
                >
                  Create audit pack
                </h2>
                <p
                  id="generate-audit-description"
                  className={styles.modalSubtitle}
                >
                  Create a read-only snapshot of your records at this moment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={styles.modalClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <AuditPackForm setOpen={setOpen} formAction={formAction} />
          </div>
        </div>
      )}
      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </>
  );
}

function AuditPackForm({
  setOpen,
  formAction,
}: {
  setOpen: (open: boolean) => void;
  formAction: (formData: FormData) => void;
}) {
  const [includeRopa, setIncludeRopa] = useState(true);
  const [includeDsrs, setIncludeDsrs] = useState(true);
  const [includeIncidents, setIncludeIncidents] = useState(true);
  const [includeEvidenceIndex, setIncludeEvidenceIndex] = useState(true);
  const [includeEvidenceFiles, setIncludeEvidenceFiles] = useState(false);

  const previewParts: string[] = [];
  if (includeRopa) previewParts.push("RoPA");
  if (includeDsrs) previewParts.push("Requests");
  if (includeIncidents) previewParts.push("Incidents");
  if (includeEvidenceIndex) previewParts.push("Evidence index");
  if (includeEvidenceFiles) previewParts.push("ZIP");
  const previewText =
    previewParts.length > 0
      ? `This will create: ${previewParts.join(" • ")}`
      : "Select at least one option to include in the audit pack.";

  return (
    <form action={formAction} className={styles.modalBody}>
      <div className={styles.optionsList}>
        {OPTIONS.map((opt, i) => (
          <div key={opt.name}>
            {i > 0 && <div className={styles.optionSeparator} />}
            <div className={opt.optional ? styles.optionRowOptional : styles.optionRow}>
              <div className={styles.optionInputWrap}>
                <input
                  type="checkbox"
                  id={opt.name}
                  name={opt.name}
                  value="on"
                  defaultChecked={opt.defaultChecked !== false}
                  onChange={(e) => {
                    const v = e.target.checked;
                    if (opt.name === "includeRopa") setIncludeRopa(v);
                    else if (opt.name === "includeDsrs") setIncludeDsrs(v);
                    else if (opt.name === "includeIncidents") setIncludeIncidents(v);
                    else if (opt.name === "includeEvidenceIndex") setIncludeEvidenceIndex(v);
                    else if (opt.name === "includeEvidenceFiles") setIncludeEvidenceFiles(v);
                  }}
                  className={styles.checkbox}
                  aria-describedby={`${opt.name}-helper`}
                />
                <input type="hidden" name={opt.name} value="off" />
              </div>
              <div className={styles.optionContent}>
                <label htmlFor={opt.name} className={styles.optionLabel}>
                  {opt.label}
                  {opt.optional && (
                    <span className={styles.optionalBadge}>Optional</span>
                  )}
                </label>
                <p id={`${opt.name}-helper`} className={styles.optionHelper}>
                  {opt.helper}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className={styles.previewLine} role="status">
        {previewText}
      </p>

      <div className={styles.modalFooter}>
        <SubmitButton onCancel={() => setOpen(false)} />
        <p className={styles.footerReassurance}>
          Creating an audit pack does not change your records.
        </p>
      </div>
    </form>
  );
}
