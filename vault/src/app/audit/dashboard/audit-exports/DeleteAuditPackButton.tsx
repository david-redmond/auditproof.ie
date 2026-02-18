"use client";

import { useActionState } from "react";
import { deleteAuditPack } from "./actions";
import styles from "./audit-exports.module.css";

type State = { ok?: boolean; error?: string } | null;

type Props = { id: string };

export function DeleteAuditPackButton({ id }: Props) {
  function confirmDelete(event: React.FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this audit pack? This cannot be undone.")) {
      event.preventDefault();
    }
  }

  const [state, formAction] = useActionState(
    async (_prev: State) => deleteAuditPack(id),
    null
  );

  return (
    <form action={formAction} onSubmit={confirmDelete}>
      {state?.error && !state?.ok && <span className={styles.error} style={{ display: "inline-block", marginRight: "var(--theme-space-2)" }}>{state.error}</span>}
      <button
        type="submit"
        className={styles.deleteButton}
        aria-label="Delete audit pack"
        disabled={state?.ok}
      >
        Delete
      </button>
    </form>
  );
}
