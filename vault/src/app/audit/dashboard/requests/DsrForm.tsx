"use client";

import { useActionState, useState, useMemo } from "react";
import Link from "next/link";
import { createDsr, updateDsr } from "./actions";
import { RequestType, RequestOutcome, auditPath } from "@/lib/constants";
import styles from "./dsrForm.module.css";

/* Display labels only; stored values unchanged */
const REQUEST_TYPES = [
  { value: RequestType.ACCESS, label: "Show me my data" },
  { value: RequestType.RECTIFICATION, label: "Correct my data" },
  { value: RequestType.ERASURE, label: "Delete my data" },
  { value: RequestType.RESTRICTION, label: "Limit use of my data" },
  { value: RequestType.OBJECTION, label: "Stop using my data" },
  { value: RequestType.PORTABILITY, label: "Send me my data (portable copy)" },
];

const OUTCOMES = [
  { value: RequestOutcome.COMPLETED_FULL, label: "Completed" },
  { value: RequestOutcome.COMPLETED_PARTIAL, label: "Partially completed" },
  { value: RequestOutcome.REFUSED, label: "Refused (with reason)" },
  { value: RequestOutcome.WITHDRAWN, label: "Withdrawn by requester" },
];

const SUBJECT_SCHEMES = [
  { value: "customer_id", label: "customer_id" },
  { value: "order_id", label: "order_id" },
  { value: "email_hash", label: "email_hash" },
  { value: "employee_id", label: "employee_id" },
  { value: "other", label: "Other" },
];

const CHANNELS = [
  { value: "email", label: "Email" },
  { value: "webform", label: "Webform" },
  { value: "phone", label: "Phone" },
  { value: "in_person", label: "In person" },
  { value: "letter", label: "Letter" },
  { value: "other", label: "Other" },
];

function formatReplyBy(isoDatetime: string): string {
  if (!isoDatetime) return "—";
  const d = new Date(isoDatetime);
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

function friendlyError(serverError: string): string {
  if (serverError.includes("subject reference") && serverError.includes("Request type")) {
    return "Please choose what they asked for and who asked (e.g. customer ID or order number).";
  }
  return serverError;
}

type Props = {
  mode: "create" | "edit";
  id?: string;
  initial?: {
    requestType: string;
    channel: string;
    receivedAt: string;
    subjectScheme: string;
    subjectValue: string;
    summary: string;
    outcome?: string;
    outcomeReason?: string;
    completedAt?: string;
    responseSent?: boolean;
    responseSentAt?: string;
    extensionUsed?: boolean;
    extensionNewDueAt?: string;
    extensionJustification?: string;
    identityVerifiedAt?: string;
    overdueNote?: string;
    dueAt?: string;
  };
};

export function DsrForm({ mode, id, initial }: Props) {
  const action = mode === "create" ? createDsr : (formData: FormData) => updateDsr(id!, formData);
  const [state, formAction] = useActionState(
    (_prev: { error: string } | null, formData: FormData) => action(formData),
    null as { error: string } | null
  );

  const defaultReceived =
    initial?.receivedAt ? new Date(initial.receivedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
  const [receivedAtValue, setReceivedAtValue] = useState(defaultReceived);
  const [extensionUsed, setExtensionUsed] = useState(Boolean(initial?.extensionUsed));
  const [outcome, setOutcome] = useState(initial?.outcome ?? "");
  const [responseSent, setResponseSent] = useState(Boolean(initial?.responseSent));

  const replyByDisplay = useMemo(() => formatReplyBy(receivedAtValue), [receivedAtValue]);
  const showCompletedDate = outcome && outcome !== RequestOutcome.WITHDRAWN;
  const showOutcomeReason = outcome === RequestOutcome.COMPLETED_PARTIAL || outcome === RequestOutcome.REFUSED;
  const defaultReplySentAt =
    initial?.responseSentAt ? new Date(initial.responseSentAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
  const isOverdueAndOpen = mode === "edit" && initial?.dueAt && !initial?.outcome && new Date(initial.dueAt) < new Date();

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state?.error && (
        <p className={styles.error} role="alert" aria-live="polite">
          {friendlyError(state.error)}
        </p>
      )}

      {/* Step 1: What was requested? (Intake) */}
      <section className={styles.section} aria-labelledby="step1-heading">
        <h2 id="step1-heading" className={styles.sectionTitle}>
          Step 1: What was requested?
        </h2>
        <p className={styles.sectionDesc}>Basic details about the request and who made it.</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="requestType">
            Request type
            <span className={styles.requiredHint} aria-hidden="true">(required)</span>
          </label>
          <select
            id="requestType"
            name="requestType"
            className={styles.select}
            defaultValue={initial?.requestType ?? ""}
            required
            aria-required="true"
            aria-describedby="requestType-hint"
          >
            <option value="">Select…</option>
            {REQUEST_TYPES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span id="requestType-hint" className={styles.visuallyHidden}>Choose the type of request, e.g. show my data or delete my data.</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="channel">
            How did they contact you?
          </label>
          <select
            id="channel"
            name="channel"
            className={styles.select}
            defaultValue={initial?.channel ?? "email"}
            aria-describedby="channel-hint"
          >
            {CHANNELS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span id="channel-hint" className={styles.visuallyHidden}>e.g. email, phone, web form.</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="receivedAt">
            Received
          </label>
          <input
            id="receivedAt"
            name="receivedAt"
            type="datetime-local"
            className={styles.input}
            value={receivedAtValue}
            onChange={(e) => setReceivedAtValue(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Who asked?
            <span className={styles.requiredHint} aria-hidden="true">(required)</span>
          </label>
          <div className={styles.subjectRow}>
            <select
              name="subjectScheme"
              className={styles.select}
              defaultValue={initial?.subjectScheme ?? "customer_id"}
              aria-label="Reference type"
            >
              {SUBJECT_SCHEMES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              name="subjectValue"
              className={styles.input}
              defaultValue={initial?.subjectValue}
              placeholder="e.g. 48391 or hash"
              required
              aria-required="true"
              aria-describedby="who-asked-hint"
            />
          </div>
          <p id="who-asked-hint" className={styles.muted}>
            Use a reference like customer ID, order number, or an email hash. Don&apos;t enter full personal details.
          </p>
          <p className={styles.replyByDisplay}>
            Reply by: <strong>{replyByDisplay}</strong> (usually within 1 month)
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="summary">
            What did they ask for?
          </label>
          <textarea
            id="summary"
            name="summary"
            className={styles.textarea}
            defaultValue={initial?.summary}
            placeholder="e.g. 'Please delete my account' or 'My address is wrong'"
            aria-describedby="summary-hint"
          />
          <span id="summary-hint" className={styles.visuallyHidden}>Short description of the request.</span>
        </div>

        <div className={styles.field}>
          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              id="extensionUsed"
              name="extensionUsed"
              checked={extensionUsed}
              onChange={(e) => setExtensionUsed(e.target.checked)}
              aria-controls="extension-fields"
              aria-expanded={extensionUsed}
            />
            <label htmlFor="extensionUsed">Need more time?</label>
          </div>
          {extensionUsed && (
            <div id="extension-fields" className={styles.extensionReveal} role="region" aria-label="Extension details">
              <div className={styles.field}>
                <label className={styles.label} htmlFor="extensionNewDueAt">
                  New reply-by date
                </label>
                <input
                  id="extensionNewDueAt"
                  name="extensionNewDueAt"
                  type="datetime-local"
                  className={styles.input}
                  defaultValue={initial?.extensionNewDueAt ? new Date(initial.extensionNewDueAt).toISOString().slice(0, 16) : ""}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="extensionJustification">
                  Reason
                  <span className={styles.requiredHint} aria-hidden="true">(required)</span>
                </label>
                <textarea
                  id="extensionJustification"
                  name="extensionJustification"
                  className={styles.textarea}
                  placeholder="e.g. request is complex / multiple systems involved"
                  defaultValue={initial?.extensionJustification}
                  required={extensionUsed}
                  aria-required={extensionUsed}
                  aria-describedby="extensionJustification-hint"
                />
                <p id="extensionJustification-hint" className={styles.muted}>
                  A brief reason helps with accountability (e.g. complexity under Art. 12(3)). This is not legal advice.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Step 2: How did you handle it? (Resolution) */}
      <section className={styles.section} aria-labelledby="step2-heading">
        <h2 id="step2-heading" className={styles.sectionTitle}>
          Step 2: How did you handle it?
        </h2>
        <p className={styles.sectionDesc}>You can leave this blank and complete it later.</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="outcome">
            Outcome
          </label>
          <select
            id="outcome"
            name="outcome"
            className={styles.select}
            defaultValue={initial?.outcome ?? ""}
            onChange={(e) => setOutcome(e.target.value)}
            aria-describedby="outcome-hint"
          >
            <option value="">—</option>
            {OUTCOMES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span id="outcome-hint" className={styles.visuallyHidden}>Optional. How you resolved the request.</span>
        </div>

        {showCompletedDate && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="completedAt">
              Completed date
            </label>
            <input
              id="completedAt"
              name="completedAt"
              type="datetime-local"
              className={styles.input}
              defaultValue={initial?.completedAt ? new Date(initial.completedAt).toISOString().slice(0, 16) : ""}
            />
          </div>
        )}

        {showOutcomeReason && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="outcomeReason">
              Reason
              <span className={styles.requiredHint} aria-hidden="true">(required if partial or refused)</span>
            </label>
            <textarea
              id="outcomeReason"
              name="outcomeReason"
              className={styles.textarea}
              defaultValue={initial?.outcomeReason}
              aria-required={showOutcomeReason}
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="identityVerifiedAt">
            Identity verified
          </label>
          <input
            id="identityVerifiedAt"
            name="identityVerifiedAt"
            type="datetime-local"
            className={styles.input}
            defaultValue={initial?.identityVerifiedAt ? new Date(initial.identityVerifiedAt).toISOString().slice(0, 16) : ""}
            aria-describedby="identityVerifiedAt-hint"
          />
          <p id="identityVerifiedAt-hint" className={styles.muted}>
            Optional. Date when you verified the requester&apos;s identity (supports accountability).
          </p>
        </div>

        <div className={styles.field}>
          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              id="responseSent"
              name="responseSent"
              checked={responseSent}
              onChange={(e) => setResponseSent(e.target.checked)}
              aria-controls="response-sent-date"
              aria-expanded={responseSent}
            />
            <label htmlFor="responseSent">Reply sent to requester</label>
          </div>
          {responseSent && (
            <div id="response-sent-date" className={styles.extensionReveal}>
              <label className={styles.label} htmlFor="responseSentAt">
                Reply sent date
              </label>
              <input
                id="responseSentAt"
                name="responseSentAt"
                type="datetime-local"
                className={styles.input}
                defaultValue={initial?.responseSentAt ? new Date(initial.responseSentAt).toISOString().slice(0, 16) : defaultReplySentAt}
              />
            </div>
          )}
        </div>

        {mode === "edit" && (isOverdueAndOpen || initial?.overdueNote) && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="overdueNote">
              Reason / note {isOverdueAndOpen && <span className={styles.muted}>(recommended if overdue and still open)</span>}
            </label>
            <textarea
              id="overdueNote"
              name="overdueNote"
              className={styles.textarea}
              defaultValue={initial?.overdueNote}
              placeholder="e.g. extension under Art. 12(3), awaiting info from another team"
              maxLength={1000}
              aria-describedby="overdueNote-hint"
            />
            <p id="overdueNote-hint" className={styles.muted}>
              Short note for accountability. Not legal advice.
            </p>
          </div>
        )}
      </section>

      <div className={styles.actions}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} aria-label="Save request">
          {mode === "create" ? "Save request" : "Save"}
        </button>
        <Link href={auditPath("/dashboard/requests")} className={styles.btn}>
          Cancel
        </Link>
        {mode === "create" && (
          <p className={styles.saveNote}>
            You can save this now and complete the outcome later.
          </p>
        )}
      </div>
    </form>
  );
}
