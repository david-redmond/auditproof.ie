"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

const TOPICS = [
  { value: "", label: "Select topic…" },
  { value: "Support", label: "Support" },
  { value: "Partner", label: "Partner" },
  { value: "Privacy", label: "Privacy" },
  { value: "Other", label: "Other" },
] as const;

type FormState = {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  website: string;
};

const initial: FormState = {
  name: "",
  email: "",
  company: "",
  topic: "",
  message: "",
  website: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export default function ContactForm() {
  const [state, setState] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function setField<K extends keyof FormState>(k: K, v: string) {
    setState((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setSubmitError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSubmitError(null);

    const next: FieldErrors = {};
    if (!state.name.trim()) next.name = "Name is required.";
    if (!state.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!state.topic || !["Support", "Partner", "Privacy", "Other"].includes(state.topic)) {
      next.topic = "Please select a topic.";
    }
    if (!state.message.trim()) next.message = "Message is required.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          email: state.email.trim(),
          company: state.company.trim() || undefined,
          topic: state.topic,
          message: state.message.trim(),
          website: state.website,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.error ?? data?.errors ?? "Something went wrong. Please try again.";
        if (typeof msg === "string") {
          setSubmitError(msg);
        } else if (data?.errors && typeof data.errors === "object") {
          setErrors(data.errors as FieldErrors);
        } else {
          setSubmitError("Something went wrong. Please try again.");
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
      setState(initial);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.formSuccess} role="status">
        Thanks — message received. We&apos;ll reply within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      {submitError ? (
        <div className={styles.formError} role="alert">
          {submitError}
        </div>
      ) : null}

      <div className={styles.honeypotGroup} aria-hidden>
        <label htmlFor="contact-website">Leave blank</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className={styles.honeypot}
          value={state.website}
          onChange={(e) => setField("website", e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="contact-name" className={styles.fieldLabel}>
          Name <span aria-hidden>*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          value={state.name}
          onChange={(e) => setField("name", e.target.value)}
          autoComplete="name"
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name ? (
          <span id="contact-name-error" className={styles.fieldError} role="alert">
            {errors.name}
          </span>
        ) : null}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="contact-email" className={styles.fieldLabel}>
          Email <span aria-hidden>*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          value={state.email}
          onChange={(e) => setField("email", e.target.value)}
          autoComplete="email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email ? (
          <span id="contact-email-error" className={styles.fieldError} role="alert">
            {errors.email}
          </span>
        ) : null}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="contact-company" className={styles.fieldLabel}>
          Company <span style={{ fontWeight: 400, color: "var(--theme-text-muted)" }}>(optional)</span>
        </label>
        <input
          id="contact-company"
          type="text"
          className={styles.input}
          value={state.company}
          onChange={(e) => setField("company", e.target.value)}
          autoComplete="organization"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="contact-topic" className={styles.fieldLabel}>
          Topic <span aria-hidden>*</span>
        </label>
        <select
          id="contact-topic"
          className={`${styles.select} ${errors.topic ? styles.selectError : ""}`}
          value={state.topic}
          onChange={(e) => setField("topic", e.target.value)}
          required
          aria-invalid={!!errors.topic}
          aria-describedby={errors.topic ? "contact-topic-error" : undefined}
        >
          {TOPICS.map((opt) => (
            <option key={opt.value || "empty"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.topic ? (
          <span id="contact-topic-error" className={styles.fieldError} role="alert">
            {errors.topic}
          </span>
        ) : null}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="contact-message" className={styles.fieldLabel}>
          Message <span aria-hidden>*</span>
        </label>
        <textarea
          id="contact-message"
          className={`${styles.textarea} ${errors.message ? styles.textareaError : ""}`}
          value={state.message}
          onChange={(e) => setField("message", e.target.value)}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? (
          <span id="contact-message-error" className={styles.fieldError} role="alert">
            {errors.message}
          </span>
        ) : null}
      </div>

      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
