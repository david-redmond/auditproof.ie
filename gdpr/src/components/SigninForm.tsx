"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./SigninForm.module.css";

const SIGNIN_ERROR_MESSAGE = "Incorrect email or password.";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function clearError() {
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          res.status === 401 || data?.error === "Invalid credentials"
            ? SIGNIN_ERROR_MESSAGE
            : data?.message || data?.error || "Something went wrong. Please try again.";
        setError(message);
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
        <div className={styles.formError} role="alert" aria-live="polite">
          {error}
        </div>
      ) : null}

      <div className={styles.fieldGroup}>
        <label htmlFor="signin-email" className={styles.fieldLabel}>
          Email
        </label>
        <input
          id="signin-email"
          type="email"
          autoComplete="email"
          className={styles.input}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
          }}
          aria-invalid={!!error}
          disabled={loading}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="signin-password" className={styles.fieldLabel}>
          Password
        </label>
        <div className={styles.passwordWrapper}>
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={styles.input}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError();
            }}
            aria-invalid={!!error}
            disabled={loading}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={0}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <Link
          href="/forgot-password"
          className={styles.forgotLink}
          tabIndex={loading ? -1 : 0}
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={styles.submit}
        aria-busy={loading}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
