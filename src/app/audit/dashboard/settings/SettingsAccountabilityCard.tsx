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

function ReviewSubmitButton() {
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

export function SettingsAccountabilityCard({ orgId, initial }: Props) {
  const { showToast } = useSettingsToast();
  const [state, formAction] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      const result = await updateOrganisation(orgId, formData);
      if (!result) {
        showToast("Review date saved");
      }
      return result;
    },
    null as { error: string } | null
  );

  return (
    <section className={listStyles.panel} aria-labelledby="accountability-heading">
      <h2 id="accountability-heading" className={styles.cardHeading}>
        Accountability review
      </h2>
      <p className={styles.cardHelper}>
        Track when you last reviewed your GDPR documentation.
      </p>
      <form action={formAction}>
        <input type="hidden" name="name" value={initial.name} />
        <input type="hidden" name="contactName" value={initial.contactName} />
        <input type="hidden" name="contactEmail" value={initial.contactEmail} />
        <input type="hidden" name="contactPhone" value={initial.contactPhone} />
        <input type="hidden" name="dpoStatus" value={initial.dpoStatus} />
        <input type="hidden" name="dpoName" value={initial.dpoName} />
        <input type="hidden" name="dpoEmail" value={initial.dpoEmail} />
        <input type="hidden" name="dpoJustification" value={initial.dpoJustification} />
        {state?.error && <p className={styles.error} role="alert">{state.error}</p>}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="last-review-at">
            Last review date
          </label>
          <input
            id="last-review-at"
            name="lastReviewAt"
            type="date"
            className={styles.input}
            defaultValue={initial.lastReviewAt}
          />
        </div>
        <div className={styles.actions}>
          <ReviewSubmitButton />
        </div>
      </form>
    </section>
  );
}
