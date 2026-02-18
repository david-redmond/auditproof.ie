"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createIncident, updateIncident } from "./actions";
import { IncidentRiskLevel, auditPath } from "@/lib/constants";
import styles from "./incidentForm.module.css";

/* Display labels only; stored values unchanged */
const RISK_OPTIONS = [
  { value: IncidentRiskLevel.LOW, label: "Low – unlikely to affect anyone" },
  { value: IncidentRiskLevel.MEDIUM, label: "Medium – possible impact" },
  { value: IncidentRiskLevel.HIGH, label: "High – likely impact" },
];

function friendlyError(serverError: string): string {
  if (serverError.includes("Title") && serverError.includes("required")) {
    return "Please add a short summary.";
  }
  if (serverError.includes("risk") || serverError.includes("Risk")) {
    return "Please choose how serious this seems.";
  }
  if (serverError.includes("rationale") || serverError.includes("notification")) {
    return "Please explain why notification was not required.";
  }
  return serverError;
}

type Props = {
  mode: "create" | "edit";
  id?: string;
  initial?: {
    title: string;
    description: string;
    occurredAt?: string;
    discoveredAt: string;
    riskLevel: string;
    likelyRiskToIndividuals: boolean;
    dpcNotified: boolean;
    dpcNotifiedAt?: string;
    individualsNotified: boolean;
    individualsNotifiedAt?: string;
    rationaleIfNotNotified: string;
    containmentSteps: string;
    status: string;
  };
};

export function IncidentForm({ mode, id, initial }: Props) {
  const action = mode === "create"
    ? (_prev: { error: string } | null, formData: FormData) => createIncident(formData)
    : (_prev: { error: string } | null, formData: FormData) => updateIncident(id!, formData);
  const [state, formAction] = useActionState(action, null as { error: string } | null);

  const [dpcNotified, setDpcNotified] = useState(initial?.dpcNotified ?? false);
  const [individualsNotified, setIndividualsNotified] = useState(initial?.individualsNotified ?? false);

  const discoveredDefault = initial?.discoveredAt
    ? new Date(initial.discoveredAt).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16);

  const defaultDpcAt = initial?.dpcNotifiedAt ? new Date(initial.dpcNotifiedAt).toISOString().slice(0, 16) : "";
  const defaultIndividualsAt = initial?.individualsNotifiedAt ? new Date(initial.individualsNotifiedAt).toISOString().slice(0, 16) : "";

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state?.error && (
        <p className={styles.error} role="alert" aria-live="polite">
          {friendlyError(state.error)}
        </p>
      )}

      {/* Step 1: What happened? */}
      <section className={styles.section} aria-labelledby="step1-heading">
        <h2 id="step1-heading" className={styles.sectionTitle}>
          Step 1: What happened?
        </h2>
        <p className={styles.sectionDesc}>
          Briefly describe the issue in your own words.
        </p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">
            Short summary
            <span className={styles.helper} style={{ marginLeft: "0.25rem" }} aria-hidden="true">(required)</span>
          </label>
          <input
            id="title"
            name="title"
            className={styles.input}
            defaultValue={initial?.title}
            placeholder="e.g. Email sent to wrong customer"
            required
            aria-required="true"
            aria-describedby="title-hint"
          />
          <span id="title-hint" className={styles.helper}>
            A brief title you’ll recognise later.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            What happened?
          </label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            defaultValue={initial?.description}
            placeholder="e.g. An email containing an invoice was sent to the wrong recipient."
            aria-describedby="description-hint"
          />
          <span id="description-hint" className={styles.helper}>
            Describe what occurred in plain language.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="occurredAt">
            When did it happen? (if known)
          </label>
          <input
            id="occurredAt"
            name="occurredAt"
            type="datetime-local"
            className={styles.input}
            defaultValue={initial?.occurredAt ? new Date(initial.occurredAt).toISOString().slice(0, 16) : ""}
            aria-describedby="occurredAt-hint"
          />
          <span id="occurredAt-hint" className={styles.helper}>
            Optional. When the incident occurred, if different from when you found out.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="discoveredAt">
            When did you become aware of it?
          </label>
          <input
            id="discoveredAt"
            name="discoveredAt"
            type="datetime-local"
            className={styles.input}
            defaultValue={discoveredDefault}
            required
            aria-required="true"
          />
        </div>
      </section>

      {/* Step 2: How serious does it seem? */}
      <section className={styles.section} aria-labelledby="step2-heading">
        <h2 id="step2-heading" className={styles.sectionTitle}>
          Step 2: How serious does it seem?
        </h2>
        <p className={styles.sectionDesc}>
          This is your best judgement at the time. You can update it later.
        </p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="riskLevel">
            How serious does this seem?
          </label>
          <select
            id="riskLevel"
            name="riskLevel"
            className={styles.select}
            defaultValue={initial?.riskLevel ?? IncidentRiskLevel.LOW}
            aria-describedby="riskLevel-hint"
          >
            {RISK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <p id="riskLevel-hint" className={styles.helper}>
            Choose what seems right based on what you know now.
          </p>
        </div>

        <div className={styles.field}>
          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              id="likelyRiskToIndividuals"
              name="likelyRiskToIndividuals"
              defaultChecked={initial?.likelyRiskToIndividuals}
              aria-describedby="likelyRisk-hint"
            />
            <label htmlFor="likelyRiskToIndividuals">
              Could this cause harm or distress to people?
            </label>
          </div>
          <p id="likelyRisk-hint" className={styles.helper}>
            For example: identity theft, embarrassment, financial loss.
          </p>
        </div>
      </section>

      {/* Step 3: Who was notified? (collapsed by default) */}
      <section className={`${styles.section} ${styles.collapsibleSection}`} aria-labelledby="step3-heading">
        <details>
          <summary id="step3-heading">
            Step 3: Who was notified?
          </summary>
          <p className={styles.sectionDesc}>
            Only record notifications if they were required.
          </p>
          <p className={styles.sectionNote}>
            Only complete this section if notifications were required.
          </p>

          <div className={styles.field}>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="dpcNotified"
                name="dpcNotified"
                checked={dpcNotified}
                onChange={(e) => setDpcNotified(e.target.checked)}
                aria-describedby="dpc-hint"
              />
              <label htmlFor="dpcNotified">
                Did you notify the Data Protection Commission (DPC)?
              </label>
            </div>
            <span id="dpc-hint" className={styles.visuallyHidden}>Only if required.</span>
            {dpcNotified && (
              <div className={styles.revealBlock}>
                <label className={styles.label} htmlFor="dpcNotifiedAt">
                  Date notified
                </label>
                <input
                  id="dpcNotifiedAt"
                  name="dpcNotifiedAt"
                  type="datetime-local"
                  className={styles.input}
                  defaultValue={defaultDpcAt}
                />
              </div>
            )}
          </div>

          <div className={styles.field}>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="individualsNotified"
                name="individualsNotified"
                checked={individualsNotified}
                onChange={(e) => setIndividualsNotified(e.target.checked)}
              />
              <label htmlFor="individualsNotified">
                Did you notify the people affected?
              </label>
            </div>
            {individualsNotified && (
              <div className={styles.revealBlock}>
                <label className={styles.label} htmlFor="individualsNotifiedAt">
                  Date notified
                </label>
                <input
                  id="individualsNotifiedAt"
                  name="individualsNotifiedAt"
                  type="datetime-local"
                  className={styles.input}
                  defaultValue={defaultIndividualsAt}
                />
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="rationaleIfNotNotified">
              Why notification was not required
            </label>
            <textarea
              id="rationaleIfNotNotified"
              name="rationaleIfNotNotified"
              className={styles.textarea}
              defaultValue={initial?.rationaleIfNotNotified}
              placeholder="e.g. Data was encrypted and quickly recovered. No risk to individuals."
              aria-describedby="rationale-hint"
            />
            <span id="rationale-hint" className={styles.helper}>
              Optional. Use if you did not notify and need to record why.
            </span>
          </div>
        </details>
      </section>

      {/* Step 4: What did you do? */}
      <section className={styles.section} aria-labelledby="step4-heading">
        <h2 id="step4-heading" className={styles.sectionTitle}>
          Step 4: What did you do?
        </h2>
        <p className={styles.sectionDesc}>
          Steps taken to contain or resolve the issue.
        </p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="containmentSteps">
            What did you do to fix or contain the issue?
          </label>
          <textarea
            id="containmentSteps"
            name="containmentSteps"
            className={styles.textarea}
            defaultValue={initial?.containmentSteps}
            placeholder={"Password reset\nEmail recall attempted\nAccess revoked"}
            aria-describedby="containment-hint"
          />
          <span id="containment-hint" className={styles.helper}>
            One step per line. You can leave this open and come back later.
          </span>
        </div>

        {mode === "edit" && initial?.status !== "closed" && (
          <div className={styles.field}>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="closeIncident"
                name="closeIncident"
                aria-describedby="close-hint"
              />
              <label htmlFor="closeIncident">
                Mark this incident as resolved
              </label>
            </div>
            <p id="close-hint" className={styles.helper}>
              You can leave this open and come back later.
            </p>
          </div>
        )}
      </section>

      <div className={styles.actions}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} aria-label="Save incident">
          {mode === "create" ? "Save incident" : "Save"}
        </button>
        <Link href={auditPath("/dashboard/incidents")} className={styles.btn}>
          Cancel
        </Link>
        <p className={styles.saveNote}>
          You can update this record as more information becomes available.
        </p>
      </div>
    </form>
  );
}
