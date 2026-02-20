"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import styles from "@/components/AuthCard.module.css";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setStatus("idle");
    setPending(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
    setPending(false);
  }

  if (status === "success") {
    return (
      <AuthCard
        title="Reset your password"
        subtitle="We'll email you a secure link to set a new password."
        footer={
          <>
            <Link href="/signin" className={styles.footerLink}>
              Back to sign in
            </Link>
            <p>
              Don&apos;t have a workspace?{" "}
              <Link href="/signup" className={styles.footerLink}>
                Register for free
              </Link>
            </p>
          </>
        }
      >
        <div className={styles.successPanel}>
          <h2 className={styles.successTitle}>Check your email</h2>
          <p className={styles.successBody}>
            If an account exists for that email, we&apos;ve sent a reset link.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="We'll email you a secure link to set a new password."
      footer={
        <>
          <Link href="/signin" className={styles.footerLink}>
            Back to sign in
          </Link>
          <p>
            Don&apos;t have a workspace?{" "}
            <Link href="/signup" className={styles.footerLink}>
              Register for free
            </Link>
          </p>
        </>
      }
    >
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {status === "error" && errorMessage ? (
          <p className={styles.errorAlert} role="alert" aria-live="polite">
            {errorMessage}
          </p>
        ) : null}

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="forgot-email">
            Email
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={pending}
            aria-invalid={status === "error" ? "true" : undefined}
          />
        </div>

        <button
          type="submit"
          className={styles.submit}
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthCard>
  );
}
