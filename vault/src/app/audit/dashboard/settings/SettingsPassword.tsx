"use client";

import { useActionState, useState, useEffect } from "react";
import { setPassword, changePassword } from "./actions";
import { useSettingsToast } from "./SettingsToast";
import listStyles from "../list.module.css";
import styles from "./settings.module.css";

type Props = { hasPassword: boolean };

type State = { error?: string; ok?: boolean } | null;

export function SettingsPassword({ hasPassword }: Props) {
  const { showToast } = useSettingsToast();
  const [password, setPasswordVal] = useState("");
  const [confirm, setConfirmVal] = useState("");
  const [setState, setFormAction] = useActionState(
    async (_prev: State, formData: FormData) => setPassword(formData),
    null
  );
  const [changeState, changeFormAction] = useActionState(
    async (_prev: State, formData: FormData) => changePassword(formData),
    null
  );

  const passwordsMatch = password.length >= 8 && password === confirm;
  const canSubmitSet = password.length >= 8 && passwordsMatch;

  useEffect(() => {
    if (setState?.ok) showToast("Password set");
  }, [setState?.ok, showToast]);
  useEffect(() => {
    if (changeState?.ok) showToast("Password changed");
  }, [changeState?.ok, showToast]);

  if (hasPassword) {
    return (
      <section className={listStyles.panel} aria-labelledby="password-heading">
        <h2 id="password-heading" className={styles.cardHeading}>
          My account security
        </h2>
        <p className={styles.cardHelper}>Change your password.</p>
        <form action={changeFormAction}>
          {changeState?.error && (
            <p className={styles.error} role="alert">
              {changeState.error}
            </p>
          )}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="current-password">
              Current password
            </label>
            <input
              id="current-password"
              name="currentPassword"
              type="password"
              className={styles.input}
              required
              autoComplete="current-password"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              name="password"
              type="password"
              className={styles.input}
              minLength={8}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPasswordVal(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirm-password">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              name="confirm"
              type="password"
              className={styles.input}
              minLength={8}
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirmVal(e.target.value)}
              aria-invalid={confirm.length > 0 && password !== confirm ? "true" : undefined}
            />
            {confirm.length > 0 && password !== confirm && (
              <p className={styles.fieldError}>Passwords do not match.</p>
            )}
          </div>
          <div className={styles.actions}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={password.length < 8 || password !== confirm}
            >
              Change password
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className={listStyles.panel} aria-labelledby="password-heading">
      <h2 id="password-heading" className={styles.cardHeading}>
        My account security
      </h2>
      <p className={styles.cardHelper}>Set a password to sign in with email and password.</p>
      <form action={setFormAction}>
        {setState?.error && (
          <p className={styles.error} role="alert">
            {setState.error}
          </p>
        )}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="set-new-password">
            New password
          </label>
          <input
            id="set-new-password"
            name="password"
            type="password"
            className={styles.input}
            minLength={8}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPasswordVal(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="set-confirm-password">
            Confirm password
          </label>
          <input
            id="set-confirm-password"
            name="confirm"
            type="password"
            className={styles.input}
            minLength={8}
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirmVal(e.target.value)}
            aria-invalid={confirm.length > 0 && password !== confirm ? "true" : undefined}
          />
          {confirm.length > 0 && password !== confirm && (
            <p className={styles.fieldError}>Passwords do not match.</p>
          )}
        </div>
        <div className={styles.actions}>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={!canSubmitSet}
          >
            Set password
          </button>
        </div>
      </form>
    </section>
  );
}
