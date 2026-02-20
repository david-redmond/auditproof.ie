"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import { createRopa, updateRopa } from "./actions";
import { LawfulBasis, auditPath } from "@/lib/constants";
import styles from "./ropaForm.module.css";

type ProcessorRow = { name: string; country: string; dpaOnFile: boolean };

/* Display labels only; stored values unchanged */
const LAWFUL_OPTIONS = [
  { value: LawfulBasis.CONSENT, label: "Consent" },
  { value: LawfulBasis.CONTRACT, label: "Contract (needed to provide a service)" },
  { value: LawfulBasis.LEGAL_OBLIGATION, label: "Legal requirement" },
  { value: LawfulBasis.LEGITIMATE_INTERESTS, label: "Legitimate interests" },
  { value: LawfulBasis.VITAL_INTERESTS, label: "Vital interests" },
  { value: LawfulBasis.PUBLIC_TASK, label: "Public task" },
];

const DATA_SUBJECT_SUGGESTIONS = ["Customers", "Employees", "Suppliers", "Website visitors", "Prospects"];
const DATA_CATEGORY_SUGGESTIONS = ["Contact details", "Payment details", "Location data", "CCTV footage", "Email communications"];
const RECIPIENTS_SUGGESTIONS = ["Marketing team", "Payroll provider", "Legal", "IT / Hosting", "Customer support"];

function friendlyError(serverError: string): string {
  if (serverError.includes("Name, purpose, lawful basis") || serverError.includes("required")) {
    if (serverError.includes("Name")) return "Please name this data use.";
    if (serverError.includes("lawful basis")) return "Please choose a lawful basis.";
    return "Please fill in the data use name, why you use it, lawful basis, and how long you keep it.";
  }
  if (serverError.includes("not found")) return "This record could not be found.";
  return serverError;
}

type TagInputProps = {
  name: string;
  initialTags: string[];
  suggestionPills: string[];
  ariaLabel: string;
  ariaDescribedBy: string;
  className?: string;
};

function TagInput({ name, initialTags, suggestionPills, ariaLabel, ariaDescribedBy, className }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const t = value.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setInputValue("");
  };

  const removeTag = (i: number) => setTags((prev) => prev.filter((_, j) => j !== i));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className={className}>
      <div
        className={styles.tagInputWrap}
        role="group"
        aria-label={ariaLabel}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span key={`${tag}-${i}`} className={styles.tagChip}>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length ? "" : "Type and press Enter"}
          aria-describedby={ariaDescribedBy}
        />
      </div>
      <input type="hidden" name={name} value={tags.join(", ")} />
      <div className={styles.suggestionPills} id={ariaDescribedBy}>
        {suggestionPills.map((s) => (
          <button
            key={s}
            type="button"
            className={styles.suggestionPill}
            onClick={() => addTag(s)}
          >
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}

type Props = {
  mode: "create" | "edit";
  id?: string;
  initial?: {
    name: string;
    purpose: string;
    dataSubjects: string[];
    personalDataCategories: string[];
    lawfulBasis: string;
    lawfulBasisNotes: string;
    retentionPeriod: string;
    retentionRationale: string;
    lastReviewedAt?: string;
    recipients: string[];
    internationalOccurs: boolean;
    internationalCountries: string[];
    internationalSafeguards: string;
    processors: ProcessorRow[];
    securityAccessControls: boolean;
    securityEncryptionAtRest: boolean;
    securityEncryptionInTransit: boolean;
    securityBackups: boolean;
    securityNotes: string;
    status: string;
  };
};

export function RopaForm({ mode, id, initial }: Props) {
  const [internationalShow, setInternationalShow] = useState(
    initial?.internationalOccurs ?? false
  );
  const [lawfulBasis, setLawfulBasis] = useState(initial?.lawfulBasis ?? "");
  const [processors, setProcessors] = useState<ProcessorRow[]>(
    initial?.processors?.length ? initial.processors : [{ name: "", country: "", dpaOnFile: false }]
  );

  const addProcessor = () =>
    setProcessors((p) => [...p, { name: "", country: "", dpaOnFile: false }]);
  const removeProcessor = (i: number) =>
    setProcessors((p) => (p.length <= 1 ? p : p.filter((_, j) => j !== i)));
  const updateProcessor = (i: number, field: keyof ProcessorRow, value: string | boolean) =>
    setProcessors((p) => {
      const next = [...p];
      next[i] = { ...next[i], [field]: value };
      return next;
    });

  const action = mode === "create" ? createRopa : (formData: FormData) => updateRopa(id!, formData);
  const [state, formAction] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      formData.set("processors", JSON.stringify(processors.filter((p) => p.name.trim())));
      return action(formData);
    },
    null as { error: string } | null
  );

  const showLawfulBasisNotes = lawfulBasis === LawfulBasis.LEGITIMATE_INTERESTS;

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state?.error && (
        <p className={styles.error} role="alert" aria-live="polite">
          {friendlyError(state.error)}
        </p>
      )}

      {/* Step 1: What is this data use? */}
      <section className={styles.section} aria-labelledby="step1-heading">
        <h2 id="step1-heading" className={styles.sectionTitle}>
          Step 1: What is this data use?
        </h2>
        <p className={styles.sectionDesc}>
          Name the activity and describe what personal data is involved.
        </p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Data use name
            <span className={styles.requiredHint} aria-hidden="true">(required)</span>
          </label>
          <input
            id="name"
            name="name"
            className={styles.input}
            defaultValue={initial?.name}
            placeholder="e.g. Website contact form, CCTV, Payroll"
            required
            aria-required="true"
            aria-describedby="name-hint"
          />
          <span id="name-hint" className={styles.helper}>
            A short name you’ll recognise (e.g. website contact form, CCTV, payroll).
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="purpose">
            Why do you use this data?
            <span className={styles.requiredHint} aria-hidden="true">(required)</span>
          </label>
          <textarea
            id="purpose"
            name="purpose"
            className={styles.textarea}
            defaultValue={initial?.purpose}
            placeholder="e.g. To respond to enquiries and provide quotes"
            required
            aria-required="true"
            aria-describedby="purpose-hint"
          />
          <span id="purpose-hint" className={styles.helper}>
            Brief description of the purpose (e.g. to respond to enquiries, run payroll).
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} id="dataSubjects-label">
            Who is the data about?
          </label>
          <TagInput
            name="dataSubjects"
            initialTags={initial?.dataSubjects ?? []}
            suggestionPills={DATA_SUBJECT_SUGGESTIONS}
            ariaLabel="Who is the data about"
            ariaDescribedBy="dataSubjects-hint"
          />
          <p id="dataSubjects-hint" className={styles.helper}>
            e.g. customers, staff, website visitors
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} id="personalDataCategories-label">
            What personal data is used?
          </label>
          <TagInput
            name="personalDataCategories"
            initialTags={initial?.personalDataCategories ?? []}
            suggestionPills={DATA_CATEGORY_SUGGESTIONS}
            ariaLabel="What personal data is used"
            ariaDescribedBy="personalDataCategories-hint"
          />
          <p id="personalDataCategories-hint" className={styles.helper}>
            e.g. name, email, phone, CCTV footage
          </p>
        </div>
      </section>

      {/* Step 2: Why and how long? */}
      <section className={styles.section} aria-labelledby="step2-heading">
        <h2 id="step2-heading" className={styles.sectionTitle}>
          Step 2: Why and how long?
        </h2>
        <p className={styles.sectionDesc}>
          Your legal basis and how long you keep the data.
        </p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="lawfulBasis">
            Why you can use it (GDPR lawful basis)
            <span className={styles.requiredHint} aria-hidden="true">(required)</span>
          </label>
          <select
            id="lawfulBasis"
            name="lawfulBasis"
            className={styles.select}
            defaultValue={initial?.lawfulBasis ?? ""}
            required
            aria-required="true"
            aria-describedby="lawfulBasis-hint"
            onChange={(e) => setLawfulBasis(e.target.value)}
          >
            <option value="">Select…</option>
            {LAWFUL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <p id="lawfulBasis-hint" className={styles.helper}>
            This is a record of your reason, not legal advice.
          </p>
        </div>

        {showLawfulBasisNotes && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="lawfulBasisNotes">
              Short note (only needed for Legitimate interests)
            </label>
            <textarea
              id="lawfulBasisNotes"
              name="lawfulBasisNotes"
              className={styles.textarea}
              defaultValue={initial?.lawfulBasisNotes}
              aria-describedby="lawfulBasisNotes-hint"
            />
            <span id="lawfulBasisNotes-hint" className={styles.helper}>
              Briefly note your legitimate interest and balancing test.
            </span>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="retentionPeriod">
            How long do you keep it?
            <span className={styles.requiredHint} aria-hidden="true">(required)</span>
          </label>
          <input
            id="retentionPeriod"
            name="retentionPeriod"
            className={styles.input}
            defaultValue={initial?.retentionPeriod}
            placeholder="e.g. 7 years, 90 days, Until account closed"
            required
            aria-required="true"
            aria-describedby="retentionPeriod-hint"
          />
          <span id="retentionPeriod-hint" className={styles.helper}>
            Use a defined period (e.g. 7 years, 90 days), &quot;Until withdrawn&quot; for consent-based processing, or &quot;Other&quot; with a note below. Not legal advice.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="retentionRationale">
            Why this retention period? <span className={styles.requiredHint}>(required if &quot;Other&quot;)</span>
          </label>
          <input
            id="retentionRationale"
            name="retentionRationale"
            className={styles.input}
            defaultValue={initial?.retentionRationale}
            placeholder="e.g. tax rules / warranty / dispute handling"
            aria-describedby="retentionRationale-hint"
          />
          <span id="retentionRationale-hint" className={styles.helper}>
            Optional for defined periods. Required when retention is &quot;Other&quot;.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="lastReviewedAt">
            Last reviewed
          </label>
          <input
            id="lastReviewedAt"
            name="lastReviewedAt"
            type="date"
            className={styles.input}
            defaultValue={initial?.lastReviewedAt ?? ""}
            aria-describedby="lastReviewedAt-hint"
          />
          <span id="lastReviewedAt-hint" className={styles.helper}>
            Optional. When this entry was last reviewed (supports accountability).
          </span>
        </div>
      </section>

      {/* Step 3: Who do you share it with? */}
      <section className={styles.section} aria-labelledby="step3-heading">
        <h2 id="step3-heading" className={styles.sectionTitle}>
          Step 3: Who do you share it with?
        </h2>
        <p className={styles.sectionDesc}>
          Recipients or categories of recipients, suppliers who process this data, and any international transfers.
        </p>

        <div className={styles.field}>
          <label className={styles.label}>
            Recipients / third parties (high-level)
          </label>
          <TagInput
            name="recipients"
            initialTags={initial?.recipients ?? []}
            suggestionPills={RECIPIENTS_SUGGESTIONS}
            ariaLabel="Recipients or categories"
            ariaDescribedBy="recipients-pills"
            className={styles.tagInput}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Suppliers who handle this data for you
          </label>
          <p className={styles.helper} id="processors-hint">
            Examples: payroll provider, email marketing tool, cloud hosting.
          </p>
          {processors.map((p, i) => (
            <div key={i} className={styles.processorRow} aria-describedby="processors-hint">
              <div>
                <label htmlFor={`processor-name-${i}`}>Supplier name</label>
                <input
                  id={`processor-name-${i}`}
                  className={styles.input}
                  value={p.name}
                  onChange={(e) => updateProcessor(i, "name", e.target.value)}
                  placeholder="e.g. Acme Payroll Ltd"
                />
              </div>
              <div>
                <label htmlFor={`processor-country-${i}`}>Country (where data may be processed)</label>
                <input
                  id={`processor-country-${i}`}
                  className={styles.input}
                  value={p.country}
                  onChange={(e) => updateProcessor(i, "country", e.target.value)}
                  placeholder="e.g. IE, US"
                />
              </div>
              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id={`dpa-${i}`}
                  checked={p.dpaOnFile}
                  onChange={(e) => updateProcessor(i, "dpaOnFile", e.target.checked)}
                  aria-label="Contract/DPA in place"
                />
                <label htmlFor={`dpa-${i}`}>Contract/DPA in place</label>
              </div>
              <button type="button" onClick={() => removeProcessor(i)} className={styles.btn} aria-label="Remove this supplier">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addProcessor} className={`${styles.btn} ${styles.addProcessor}`}>
            Add supplier
          </button>
        </div>

        <div className={styles.toggleSection}>
          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              id="internationalOccurs"
              name="internationalOccurs"
              checked={internationalShow}
              onChange={(e) => setInternationalShow(e.target.checked)}
              aria-describedby="international-hint"
            />
            <label htmlFor="internationalOccurs">Data sent outside the EU?</label>
          </div>
          <p id="international-hint" className={styles.helper}>
            If any supplier processes data outside the EU/EEA, record it here.
          </p>
          {internationalShow && (
            <>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="internationalCountries">
                  Countries (comma-separated)
                </label>
                <input
                  id="internationalCountries"
                  name="internationalCountries"
                  className={styles.input}
                  defaultValue={initial?.internationalCountries?.join(", ")}
                  placeholder="e.g. US, UK"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="internationalSafeguards">
                  Safeguards (e.g. SCCs)
                </label>
                <textarea
                  id="internationalSafeguards"
                  name="internationalSafeguards"
                  className={styles.textarea}
                  defaultValue={initial?.internationalSafeguards}
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.toggleSection}>
          <span className={styles.label}>Security measures</span>
          <div className={styles.field}>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="securityAccessControls"
                name="securityAccessControls"
                defaultChecked={initial?.securityAccessControls ?? true}
              />
              <label htmlFor="securityAccessControls">Access controls</label>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="securityEncryptionAtRest"
                name="securityEncryptionAtRest"
                defaultChecked={initial?.securityEncryptionAtRest}
              />
              <label htmlFor="securityEncryptionAtRest">Encryption at rest</label>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="securityEncryptionInTransit"
                name="securityEncryptionInTransit"
                defaultChecked={initial?.securityEncryptionInTransit ?? true}
              />
              <label htmlFor="securityEncryptionInTransit">Encryption in transit</label>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="securityBackups"
                name="securityBackups"
                defaultChecked={initial?.securityBackups ?? true}
              />
              <label htmlFor="securityBackups">Backups</label>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="securityNotes">Notes</label>
            <input
              id="securityNotes"
              name="securityNotes"
              className={styles.input}
              defaultValue={initial?.securityNotes}
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              id="statusInactive"
              name="status"
              value="inactive"
              defaultChecked={initial?.status === "inactive"}
            />
            <label htmlFor="statusInactive">Inactive</label>
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} aria-label="Save data use">
          {mode === "create" ? "Save data use" : "Save"}
        </button>
        <Link href={auditPath("/dashboard/ropa")} className={styles.btn}>Cancel</Link>
        {mode === "create" && (
          <p className={styles.saveNote}>
            You can edit this later. Review this register at least yearly.
          </p>
        )}
      </div>
    </form>
  );
}
