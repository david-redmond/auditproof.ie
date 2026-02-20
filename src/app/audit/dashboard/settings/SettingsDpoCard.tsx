"use client";

import { useActionState, useState } from "react";
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

function DpoSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`${styles.btn} ${styles.btnPrimary}`}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? "Saving…" : "Save DPO details"}
    </button>
  );
}

export function SettingsDpoCard({ orgId, initial }: Props) {
  const { showToast } = useSettingsToast();
  const [dpoStatus, setDpoStatus] = useState(initial.dpoStatus);
  const [state, formAction] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      const result = await updateOrganisation(orgId, formData);
      if (!result) {
        showToast("DPO saved");
      }
      return result;
    },
    null as { error: string } | null
  );

  const showDpoFields = dpoStatus === "appointed" || dpoStatus === "outsourced";
  const showJustification = dpoStatus === "not_required";

  return (
    <section className={listStyles.panel} aria-labelledby="dpo-heading">
      <h2 id="dpo-heading" className={styles.cardHeading}>
        Data Protection Officer (DPO)
      </h2>
      <p className={styles.cardHelper}>
        Most SMEs are not required to appoint a DPO unless specific conditions apply.
      </p>
      <form action={formAction}>
        <input type="hidden" name="name" value={initial.name} />
        <input type="hidden" name="contactName" value={initial.contactName} />
        <input type="hidden" name="contactEmail" value={initial.contactEmail} />
        <input type="hidden" name="contactPhone" value={initial.contactPhone} />
        <input type="hidden" name="lastReviewAt" value={initial.lastReviewAt} />
        {state?.error && <p className={styles.error} role="alert">{state.error}</p>}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="dpo-status">
            DPO status
          </label>
          <select
            id="dpo-status"
            name="dpoStatus"
            className={styles.select}
            defaultValue={initial.dpoStatus}
            onChange={(e) => setDpoStatus(e.target.value)}
            aria-describedby="dpo-status-helper"
          >
            <option value="appointed">Appointed</option>
            <option value="outsourced">Outsourced</option>
            <option value="not_required">Not required</option>
          </select>
          <p id="dpo-status-helper" className={styles.cardHelper} style={{ marginTop: "var(--theme-space-1)", marginBottom: 0 }}>
            Most SMEs are not required to appoint a DPO unless specific conditions apply.
          </p>
        </div>
        {showDpoFields && (
          <>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="dpo-name">
                DPO name
              </label>
              <input
                id="dpo-name"
                name="dpoName"
                className={styles.input}
                defaultValue={initial.dpoName}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="dpo-email">
                DPO email
              </label>
              <input
                id="dpo-email"
                name="dpoEmail"
                type="email"
                className={styles.input}
                defaultValue={initial.dpoEmail}
              />
            </div>
          </>
        )}
        {showJustification && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="dpo-justification">
              Justification (e.g. why not required)
            </label>
            <textarea
              id="dpo-justification"
              name="dpoJustification"
              className={styles.textarea}
              defaultValue={initial.dpoJustification}
            />
            <input type="hidden" name="dpoName" value="" />
            <input type="hidden" name="dpoEmail" value="" />
          </div>
        )}
        {showDpoFields && (
          <input type="hidden" name="dpoJustification" value={initial.dpoJustification} />
        )}
        <div className={styles.actions}>
          <DpoSubmitButton />
        </div>
      </form>
    </section>
  );
}
