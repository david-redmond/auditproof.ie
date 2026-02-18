"use client";

import React, { useMemo, useState } from "react";
import styles from "./PartnerSignupForm.module.css";

type FieldErrors = Partial<
  Record<
    | "fullName"
    | "email"
    | "phone"
    | "companyName"
    | "website"
    | "partnerType"
    | "clientCount"
    | "message"
    | "agreeToTerms",
    string
  >
>;

type ApiError = {
  message: string;
  fieldErrors?: FieldErrors;
};

type PartnerType =
  | "accountant"
  | "bookkeeper"
  | "business_support"
  | "msp_it"
  | "web_agency"
  | "gdpr_consultant"
  | "other";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function isValidUrlOrEmpty(value: string) {
  if (!value.trim()) return true;
  try {
    const v = value.includes("://") ? value : `https://${value}`;
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

export default function PartnerSignupForm() {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    website: "",
    partnerType: "accountant" as PartnerType,
    clientCount: "",
    message: "",
    agreeToTerms: false,
    hp: "", // honeypot – leave empty; bots often fill it
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  const canSubmit = useMemo(() => status !== "submitting", [status]);

  function setField<K extends keyof typeof values>(
    key: K,
    val: (typeof values)[K]
  ) {
    setValues((v) => ({ ...v, [key]: val }));
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
    setFormError(null);
  }

  function validateClientSide(): FieldErrors {
    const e: FieldErrors = {};

    if (!values.fullName.trim() || values.fullName.trim().length < 2) {
      e.fullName = "Please enter your name.";
    }
    if (!values.email.trim() || !emailRegex.test(values.email.trim())) {
      e.email = "Please enter a valid email address.";
    }
    if (!values.companyName.trim() || values.companyName.trim().length < 2) {
      e.companyName = "Please enter your company name.";
    }
    if (!values.partnerType) {
      e.partnerType = "Please choose a partner type.";
    }

    if (values.phone.trim() && values.phone.trim().length < 7) {
      e.phone = "Please enter a valid phone number (or leave it blank).";
    }

    if (!isValidUrlOrEmpty(values.website)) {
      e.website = "Please enter a valid website (or leave it blank).";
    }

    if (values.clientCount.trim()) {
      const n = Number(values.clientCount);
      if (!Number.isFinite(n) || n < 0 || n > 100000) {
        e.clientCount = "Please enter a valid number.";
      }
    }

    if (!values.agreeToTerms) {
      e.agreeToTerms =
        "You must confirm you have permission to refer clients.";
    }

    return e;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const clientErrors = validateClientSide();
    if (Object.values(clientErrors).some(Boolean)) {
      setFieldErrors(clientErrors);
      return;
    }

    setStatus("submitting");
    setFormError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || undefined,
          companyName: values.companyName.trim(),
          website: values.website.trim() || undefined,
          partnerType: values.partnerType,
          clientCount: values.clientCount.trim()
            ? Number(values.clientCount)
            : undefined,
          message: values.message.trim() || undefined,
          agreeToTerms: values.agreeToTerms,
          hp: values.hp,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as ApiError | null;
        const msg = data?.message || "Something went wrong. Please try again.";
        if (data?.fieldErrors) setFieldErrors(data.fieldErrors);
        setFormError(msg);
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch {
      setFormError(
        "Network error. Please check your connection and try again."
      );
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div>
        <h3 className={styles.successTitle}>Thanks — you're in.</h3>
        <p className={styles.successText}>
          We've received your partner application. We'll follow up by email with
          next steps (including referral tracking and commission details).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate aria-label="Partner application form">
      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {formError ?? ""}
      </div>
      {formError ? (
        <div className={styles.formError} role="alert" id="partner-form-error">
          {formError}
        </div>
      ) : null}

      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="partner-hp" className={styles.hpLabel}>
          Leave this field blank
        </label>
        <input
          id="partner-hp"
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          value={values.hp}
          onChange={(ev) => setField("hp", ev.target.value)}
        />
      </div>

      <div className={styles.grid}>
        <Field
          id="partner-fullName"
          label="Full name"
          required
          value={values.fullName}
          onChange={(v) => setField("fullName", v)}
          error={fieldErrors.fullName}
          autoComplete="name"
          styles={styles}
        />
        <Field
          id="partner-email"
          label="Email"
          required
          value={values.email}
          onChange={(v) => setField("email", v)}
          error={fieldErrors.email}
          inputMode="email"
          autoComplete="email"
          styles={styles}
        />
        <Field
          id="partner-phone"
          label="Phone"
          optional
          value={values.phone}
          onChange={(v) => setField("phone", v)}
          error={fieldErrors.phone}
          inputMode="tel"
          autoComplete="tel"
          styles={styles}
        />
        <Field
          id="partner-companyName"
          label="Company name"
          required
          value={values.companyName}
          onChange={(v) => setField("companyName", v)}
          error={fieldErrors.companyName}
          autoComplete="organization"
          styles={styles}
        />
        <Field
          id="partner-website"
          label="Website"
          optional
          value={values.website}
          onChange={(v) => setField("website", v)}
          error={fieldErrors.website}
          placeholder="example.ie"
          autoComplete="url"
          styles={styles}
        />

        <div className={styles.fieldGroup}>
          <label htmlFor="partner-type" className={styles.fieldLabel}>
            Partner type <span className={styles.requiredMarker} aria-hidden="true">*</span>
          </label>
          <select
            id="partner-type"
            className={`${styles.select} ${fieldErrors.partnerType ? styles.inputError : ""}`}
            value={values.partnerType}
            onChange={(ev) =>
              setField("partnerType", ev.target.value as PartnerType)
            }
            aria-required="true"
            aria-invalid={!!fieldErrors.partnerType}
            aria-describedby={fieldErrors.partnerType ? "partner-type-err" : undefined}
          >
            <option value="accountant">Accountant</option>
            <option value="bookkeeper">Bookkeeper</option>
            <option value="business_support">Business support</option>
            <option value="msp_it">MSP / IT support</option>
            <option value="web_agency">Web / digital agency</option>
            <option value="gdpr_consultant">GDPR consultant</option>
            <option value="other">Other</option>
          </select>
          {fieldErrors.partnerType ? (
            <p id="partner-type-err" className={styles.fieldError}>
              {fieldErrors.partnerType}
            </p>
          ) : null}
        </div>

        <Field
          id="partner-clientCount"
          label="Approx. number of SME clients"
          optional
          value={values.clientCount}
          onChange={(v) => setField("clientCount", v)}
          error={fieldErrors.clientCount}
          inputMode="numeric"
          placeholder="e.g. 50"
          styles={styles}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="partner-message" className={styles.fieldLabel}>
          Anything we should know?
        </label>
        <textarea
          id="partner-message"
          className={`${styles.textarea} ${fieldErrors.message ? styles.inputError : ""}`}
          value={values.message}
          onChange={(ev) => setField("message", ev.target.value)}
          placeholder="e.g. We specialise in retail SMEs, prefer a white-labelled export, etc."
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "partner-message-err" : undefined}
        />
        {fieldErrors.message ? (
          <p id="partner-message-err" className={styles.fieldError}>
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className={styles.checkboxGroup}>
        <div className={styles.checkboxRow}>
          <input
            id="agreeToTerms"
            type="checkbox"
            className={styles.checkbox}
            checked={values.agreeToTerms}
            onChange={(ev) => setField("agreeToTerms", ev.target.checked)}
            aria-required="true"
            aria-invalid={!!fieldErrors.agreeToTerms}
            aria-describedby={fieldErrors.agreeToTerms ? "agree-err" : undefined}
          />
          <label htmlFor="agreeToTerms" className={styles.checkboxLabel}>
            I have permission to refer clients to GDPR Evidence and I agree to be contacted about the partner programme (commission, setup, and support). <span className={styles.requiredMarker} aria-hidden="true">Required.</span>
          </label>
        </div>
        {fieldErrors.agreeToTerms ? (
          <p id="agree-err" className={styles.fieldError}>
            {fieldErrors.agreeToTerms}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={styles.submit}
        aria-busy={status === "submitting"}
      >
        {status === "submitting"
          ? "Submitting…"
          : "Apply to become a partner"}
      </button>

      {status === "submitting" ? (
        <p className={styles.hint}>Submitting your details securely…</p>
      ) : (
        <p className={styles.reassurance}>
          We respond within 1–2 business days. No spam, no cold sales — we'll only contact you about your partner application.
        </p>
      )}
    </form>
  );
}

function Field(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  styles: Record<string, string>;
}) {
  const id = props.id;
  const errorId = props.error ? `${id}-err` : undefined;
  return (
    <div className={props.styles.fieldGroup}>
      <label htmlFor={id} className={props.styles.fieldLabel}>
        {props.label}
        {props.required ? <span className={props.styles.requiredMarker} aria-hidden="true"> *</span> : null}
        {props.optional ? <span className={props.styles.optionalMarker}> (optional)</span> : null}
      </label>
      <input
        id={id}
        type="text"
        className={`${props.styles.input} ${props.error ? props.styles.inputError : ""}`}
        value={props.value}
        onChange={(ev) => props.onChange(ev.target.value)}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        aria-required={props.required ?? undefined}
        aria-invalid={!!props.error}
        aria-describedby={errorId}
      />
      {props.error ? (
        <p id={errorId} className={props.styles.fieldError}>
          {props.error}
        </p>
      ) : null}
    </div>
  );
}
