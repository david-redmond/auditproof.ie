"use client";

import { useActionState } from "react";

import { auditPath } from "@/lib/constants";
import { acceptInvite } from "./actions";
import styles from "./page.module.css";

type State = { error?: string; ok?: boolean; email?: string; orgName?: string } | null;

type Props = { token: string };

export function AcceptInviteForm({ token }: Props) {
  const [state, formAction] = useActionState(
    async (_prev: State, formData: FormData) => acceptInvite(formData),
    null
  );

  if (state?.ok) {
    return (
      <div className={styles.successCard}>
        <h2 className={styles.successTitle}>Password set</h2>
        <p className={styles.successBody}>
          Your account is ready. You can now sign in.
        </p>
        <a className={styles.primaryAction} href={auditPath("/signin")}>
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <form className={styles.form} action={formAction}>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="token" value={token} />
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={styles.input}
          minLength={8}
          required
        />
        <p className={styles.hint}>Minimum 8 characters.</p>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="confirm">
          Confirm password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          className={styles.input}
          minLength={8}
          required
        />
      </div>
      <button className={styles.submit} type="submit">
        Set password
      </button>
    </form>
  );
}
