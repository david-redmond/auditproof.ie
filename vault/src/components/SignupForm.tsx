"use client";

import { useState } from "react";
import styles from "./SignupForm.module.css";

export default function SignupForm() {
  const [values, setValues] = useState({
    fullName: "",
    organisationName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function setField<K extends keyof typeof values>(k: K, v: string) {
    setValues((x) => ({ ...x, [k]: v }));
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const redirectUrl = data?.redirectUrl ?? "/";
      window.location.href = redirectUrl;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      {error ? (
        <div className={styles.formError} role="alert">
          {error}
        </div>
      ) : null}

      <div className={styles.fieldGroup}>
        <label htmlFor="signup-fullName" className={styles.fieldLabel}>
          Full name
        </label>
        <input
          id="signup-fullName"
          type="text"
          className={styles.input}
          value={values.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          autoComplete="name"
          required
          aria-invalid={!!error}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="signup-organisationName" className={styles.fieldLabel}>
          Organisation name
        </label>
        <input
          id="signup-organisationName"
          type="text"
          className={styles.input}
          value={values.organisationName}
          onChange={(e) => setField("organisationName", e.target.value)}
          autoComplete="organization"
          required
          aria-invalid={!!error}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="signup-email" className={styles.fieldLabel}>
          Work email address
        </label>
        <input
          id="signup-email"
          type="email"
          className={styles.input}
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          autoComplete="email"
          required
          aria-invalid={!!error}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="signup-password" className={styles.fieldLabel}>
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          className={styles.input}
          value={values.password}
          onChange={(e) => setField("password", e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
          aria-invalid={!!error}
        />
        <p className={styles.fieldHint}>
          Use at least 8 characters. You can change this later.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={styles.submit}
        aria-busy={loading}
      >
        {loading ? "Creating workspace…" : "Create my workspace"}
      </button>

      <p className={styles.underButton}>
        No credit card required • Cancel anytime
      </p>
    </form>
  );
}
