"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateOrganisation } from "./actions";
import { useSettingsToast } from "./SettingsToast";
import listStyles from "../list.module.css";
import styles from "./settings.module.css";

type Initial = {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  dpoStatus: string;
  dpoName: string;
  dpoEmail: string;
  dpoJustification: string;
  lastReviewAt: string;
};

type Props = { orgId: string; initial: Initial };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`${styles.btn} ${styles.btnPrimary}`}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? "Saving…" : "Save organisation details"}
    </button>
  );
}

export function SettingsOrgProfileCard({ orgId, initial }: Props) {
  const { showToast } = useSettingsToast();
  const [state, formAction] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      const contactEmail = (formData.get("contactEmail") as string)?.trim() ?? "";
      if (contactEmail && !EMAIL_REGEX.test(contactEmail)) {
        return { error: "Please enter a valid email address." };
      }
      const result = await updateOrganisation(orgId, formData);
      if (!result) {
        showToast("Organisation saved");
      }
      return result;
    },
    null as { error: string } | null
  );

  return (
    <section className={listStyles.panel} aria-labelledby="org-profile-heading">
      <h2 id="org-profile-heading" className={styles.cardHeading}>
        Organisation profile
      </h2>
      <p className={styles.cardHelper}>
        Your organisation name and the main controller contact for GDPR accountability.
      </p>
      <form action={formAction}>
        <input type="hidden" name="dpoStatus" value={initial.dpoStatus} />
        <input type="hidden" name="dpoName" value={initial.dpoName} />
        <input type="hidden" name="dpoEmail" value={initial.dpoEmail} />
        <input type="hidden" name="dpoJustification" value={initial.dpoJustification} />
        <input type="hidden" name="lastReviewAt" value={initial.lastReviewAt} />
        {state?.error && <p className={styles.error} role="alert">{state.error}</p>}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="org-name">
            Organisation name
          </label>
          <input
            id="org-name"
            name="name"
            className={styles.input}
            defaultValue={initial.name}
            required
            aria-required="true"
          />
        </div>
        <div className={styles.controllerGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="controller-name">
              Controller name
            </label>
            <input
              id="controller-name"
              name="contactName"
              className={styles.input}
              defaultValue={initial.contactName}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="controller-email">
              Controller email
            </label>
            <input
              id="controller-email"
              name="contactEmail"
              type="email"
              className={styles.input}
              defaultValue={initial.contactEmail}
              aria-invalid={state?.error?.toLowerCase().includes("email") ? "true" : undefined}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="controller-phone">
            Controller phone
          </label>
          <input
            id="controller-phone"
            name="contactPhone"
            type="tel"
            className={styles.input}
            defaultValue={initial.contactPhone}
          />
        </div>
        <div className={styles.actions}>
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}
