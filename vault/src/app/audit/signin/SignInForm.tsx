"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { auditPath } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import styles from "./page.module.css";

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    trackEvent("sign_in_submit");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const errMsg = data?.error || "Sign in failed";
        setError(errMsg);
        setPending(false);
        trackEvent("sign_in_error", { message: errMsg });
        return;
      }

      trackEvent("sign_in_success");
      form.reset();
      router.replace(auditPath("/dashboard"));
    } catch (err) {
      console.error(err);
      setError("Sign in failed");
      setPending(false);
      trackEvent("sign_in_error", { message: "network_error" });
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          className={styles.input}
          type="email"
          autoComplete="email"
          required
        />
        <p className={styles.hint}>Use the email provided by your admin.</p>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          className={styles.input}
          type="password"
          autoComplete="current-password"
          required
        />
        <p className={styles.hint}>
          Passwords are encrypted and never stored in plain text.
        </p>
      </div>
      {error ? (
        <p className={styles.error} role="status" aria-live="polite">
          {error}
        </p>
      ) : null}
      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
