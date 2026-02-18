"use client";

import { useState, useActionState } from "react";
import { trackEvent } from "@/lib/analytics";
import { uploadEvidence } from "./actions";
import { DocumentType } from "@/lib/constants";
import styles from "./evidence.module.css";
import listStyles from "../list.module.css";

/* Display labels only; stored enum values unchanged */
const DOC_TYPES = [
  { value: DocumentType.PRIVACY_NOTICE, label: "Privacy policy" },
  { value: DocumentType.RETENTION_POLICY, label: "Data retention policy" },
  { value: DocumentType.DSR_PROCEDURE, label: "How we handle data requests" },
  { value: DocumentType.BREACH_PROCEDURE, label: "Incident / breach handling procedure" },
  { value: DocumentType.PROCESSOR_AGREEMENT, label: "Supplier / processor agreement" },
  { value: DocumentType.TRAINING_RECORD, label: "Staff training record" },
  { value: DocumentType.OTHER, label: "Other" },
];

const TAG_SUGGESTIONS = ["Contracts", "Policies", "Training", "Article 30"];

function friendlyError(serverError: string): string {
  if (serverError.includes("Type") && serverError.includes("title") && serverError.includes("required")) {
    return "Please choose a document type and add a document name.";
  }
  if (serverError.includes("Type") && serverError.includes("required")) {
    return "Please choose a document type.";
  }
  if (serverError.includes("title") && serverError.includes("required")) {
    return "Please add a document name.";
  }
  if (serverError.toLowerCase().includes("file")) {
    return "Please select a file to upload.";
  }
  return serverError;
}

type Props = { initialOpen?: boolean; variant?: "primary" | "secondary" };

export function EvidenceUpload({ initialOpen, variant = "primary" }: Props) {
  const [open, setOpen] = useState(!!initialOpen);
  const [fileName, setFileName] = useState<string>("");
  const [tagsValue, setTagsValue] = useState("");
  const isPrimary = variant === "primary";
  const location = isPrimary ? "header" : "documents_header";

  const [state, formAction] = useActionState(
    (_prev: { error: string } | null, formData: FormData) => uploadEvidence(formData),
    null as { error: string } | null
  );

  const addTag = (tag: string) => {
    const current = tagsValue.trim();
    const added = current ? `${current}, ${tag}` : tag;
    setTagsValue(added);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent("evidence_upload_click", { location });
        }}
        className={
          isPrimary
            ? `${listStyles.btn} ${listStyles.btnPrimary}`
            : listStyles.btnSecondary
        }
        aria-label={isPrimary ? "Upload document" : "Upload"}
      >
        {isPrimary ? "Upload document" : "Upload"}
      </button>
      {open && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="upload-modal-title" aria-describedby="upload-modal-desc">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h2 id="upload-modal-title" className={styles.modalTitle}>
                  Upload policy or document
                </h2>
                <p id="upload-modal-desc" className={styles.modalSubtitle}>
                  Upload any document that shows how you manage personal data.
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
            <form action={formAction} className={styles.modalBody}>
              {state?.error && (
                <p className={styles.error} role="alert" aria-live="polite">
                  {friendlyError(state.error)}
                </p>
              )}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="evidence-type">
                  What kind of document is this?
                  <span style={{ marginLeft: "0.25rem" }} aria-hidden="true">(required)</span>
                </label>
                <select
                  id="evidence-type"
                  name="type"
                  className={styles.select}
                  required
                  aria-required="true"
                  aria-describedby="evidence-type-hint"
                >
                  <option value="">Select…</option>
                  {DOC_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <p id="evidence-type-hint" className={styles.helper}>
                  Choose the closest match. You can always change this later.
                </p>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="evidence-title">
                  Document name
                  <span style={{ marginLeft: "0.25rem" }} aria-hidden="true">(required)</span>
                </label>
                <input
                  id="evidence-title"
                  name="title"
                  className={styles.input}
                  required
                  aria-required="true"
                  placeholder="e.g. Privacy Policy – Website, Payroll provider contract, GDPR staff training – 2025"
                  aria-describedby="evidence-title-hint"
                />
                <span id="evidence-title-hint" className={styles.helper}>
                  A name you’ll recognise (e.g. Privacy Policy – Website, Payroll provider contract).
                </span>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="evidence-file">
                  Select file
                </label>
                <input
                  id="evidence-file"
                  name="file"
                  type="file"
                  className={styles.input}
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                  aria-describedby="evidence-file-hint"
                />
                {fileName && <p className={styles.fileName}>Selected: {fileName}</p>}
                <p id="evidence-file-hint" className={styles.helper}>
                  PDF, Word, or scanned documents are all fine.
                </p>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="evidence-tags">
                  Tags (optional)
                </label>
                <input
                  id="evidence-tags"
                  name="tags"
                  className={styles.input}
                  value={tagsValue}
                  onChange={(e) => setTagsValue(e.target.value)}
                  placeholder="e.g. contracts, Article30, training"
                  aria-describedby="evidence-tags-hint"
                />
                <p id="evidence-tags-hint" className={styles.helper}>
                  Use tags like: contracts, Article30, training (optional).
                </p>
                <div className={styles.tagChips}>
                  {TAG_SUGGESTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={styles.tagChip}
                      onClick={() => addTag(tag)}
                      aria-label={`Add tag ${tag}`}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="evidence-reviewDue">
                  Review again on (optional)
                </label>
                <input
                  id="evidence-reviewDue"
                  name="reviewDueAt"
                  type="date"
                  className={styles.input}
                  aria-describedby="evidence-reviewDue-hint"
                />
                <p id="evidence-reviewDue-hint" className={styles.helper}>
                  Useful if you review policies yearly. You can leave this blank.
                </p>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="evidence-notes">
                  Notes (optional)
                </label>
                <textarea
                  id="evidence-notes"
                  name="notes"
                  className={styles.textarea}
                  placeholder="e.g. Reviewed by accountant in Jan 2026 or Template adapted for our business"
                  aria-describedby="evidence-notes-hint"
                />
                <span id="evidence-notes-hint" className={styles.helper}>
                  Optional note for your records.
                </span>
              </div>

              <p className={styles.reassuranceNote}>
                This tool stores documents only. It does not check or approve their content.
              </p>

              <div className={styles.actions}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Upload document
                </button>
                <button type="button" onClick={() => setOpen(false)} className={styles.btn}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
