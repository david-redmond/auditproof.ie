"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { PasswordFieldWithToggle } from "./PasswordFieldWithToggle";
import styles from "@/components/AuthCard.module.css";

const MIN_LENGTH = 8;
const _RECOMMENDED_LENGTH = 12;

type Props = {
  token: string | null;
};

export function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const lengthOk = password.length >= MIN_LENGTH;
  const match = password === confirm;
  const confirmTouched = confirm.length > 0;
  const isValid = lengthOk && match && password.length > 0 && confirm.length > 0;

  const confirmErrorId = "reset-confirm-error";
  const confirmError = useMemo(() => {
    if (!confirmTouched) return null;
    if (password !== confirm) return "Passwords must match";
    return null;
  }, [confirmTouched, password, confirm]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !isValid) return;
    setErrorMessage(null);
    setStatus("idle");
    setPending(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirm }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("error");
        const msg = data?.error ?? "Something went wrong. Please try again.";
        setErrorMessage(msg);
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

  if (token === null || token === "") {
    return (
      <AuthCard
        title="Set a new password"
        subtitle="Choose a strong password you haven't used before."
        footer={
          <Link href="/forgot-password" className={styles.footerLink}>
            Request a new link
          </Link>
        }
      >
        <p className={styles.errorAlert} role="alert">
          This reset link is invalid or expired.
        </p>
        <p>
          <Link href="/forgot-password" className={styles.footerLink}>
            Request a new link
          </Link>
        </p>
      </AuthCard>
    );
  }

  if (status === "success") {
    return (
      <AuthCard
        title="Set a new password"
        subtitle="Choose a strong password you haven't used before."
        footer={
          <p>
            Don&apos;t have a workspace?{" "}
            <Link href="/signup" className={styles.footerLink}>
              Register for free
            </Link>
          </p>
        }
      >
        <div className={styles.successPanel}>
          <h2 className={styles.successTitle}>Password updated</h2>
          <p className={styles.successBody}>
            You can now sign in with your new password.
          </p>
        </div>
        <Link href="/signin" className={styles.linkButton}>
          Sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
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
            {(errorMessage.includes("invalid") || errorMessage.includes("expired")) && (
              <>{" "}
                <Link href="/forgot-password" className={styles.footerLink}>
                  Request a new link
                </Link>
              </>
            )}
          </p>
        ) : null}

        <PasswordFieldWithToggle
          id="reset-password"
          name="password"
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          disabled={pending}
          ariaInvalid={password.length > 0 && password.length < MIN_LENGTH}
          ariaDescribedBy="reset-password-hint"
        />
        <p id="reset-password-hint" className={styles.hint}>
          At least {MIN_LENGTH} characters (12+ recommended for security).
        </p>

        <PasswordFieldWithToggle
          id="reset-confirm"
          name="confirm"
          label="Confirm new password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          disabled={pending}
          ariaInvalid={!!confirmError}
          ariaDescribedBy={confirmError ? confirmErrorId : undefined}
        />
        {confirmError ? (
          <p id={confirmErrorId} className={styles.validationError}>
            {confirmError}
          </p>
        ) : null}

        <button
          type="submit"
          className={styles.submit}
          disabled={!isValid || pending}
          aria-busy={pending}
        >
          {pending ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}
