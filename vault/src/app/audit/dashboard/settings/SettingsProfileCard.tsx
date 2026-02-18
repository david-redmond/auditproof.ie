"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile } from "./actions";
import { useSettingsToast } from "./SettingsToast";
import listStyles from "../list.module.css";
import styles from "./settings.module.css";

type Props = { initialName: string; initialEmail: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`${styles.btn} ${styles.btnPrimary}`}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function SettingsProfileCard({ initialName, initialEmail }: Props) {
  const { showToast } = useSettingsToast();
  const [state, formAction] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await updateProfile(formData);
      if (result?.ok) {
        showToast("Profile updated");
      }
      return result;
    },
    null as { error?: string; ok?: boolean } | null
  );

  return (
    <section className={listStyles.panel} aria-labelledby="profile-heading">
      <h2 id="profile-heading" className={styles.cardHeading}>
        Personal details
      </h2>
      <p className={styles.cardHelper}>
        Your name is shown in the organisation and on invites you send. Sign in with your email.
      </p>
      <form action={formAction}>
        {state?.error && (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        )}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="profile-name">
            Name
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            className={styles.input}
            defaultValue={initialName}
            placeholder="e.g. Jane Smith"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="profile-email">
            Email
          </label>
          <input
            id="profile-email"
            name="email"
            type="email"
            className={styles.input}
            defaultValue={initialEmail}
            required
            aria-required="true"
          />
        </div>
        <div className={styles.actions}>
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}
