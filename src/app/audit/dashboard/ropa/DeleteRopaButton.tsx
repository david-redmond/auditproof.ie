"use client";

import { useActionState } from "react";
import { deleteRopa } from "./actions";
import listStyles from "../list.module.css";

type State = { error?: string } | null;

type Props = { id: string; name: string };

export function DeleteRopaButton({ id, name }: Props) {
  function confirmDelete(event: React.FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      event.preventDefault();
    }
  }

  const [state, formAction] = useActionState(
    async (_prev: State) => deleteRopa(id),
    null
  );

  return (
    <form action={formAction} onSubmit={confirmDelete} style={{ display: "inline" }}>
      {state?.error && (
        <span className={listStyles.muted} style={{ display: "inline-block", marginRight: "var(--theme-space-2)" }}>
          {state.error}
        </span>
      )}
      <button
        type="submit"
        className={listStyles.deleteButton}
        aria-label={`Delete ${name}`}
        disabled={false}
      >
        Delete
      </button>
    </form>
  );
}
