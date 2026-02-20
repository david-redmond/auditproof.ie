import Link from "next/link";

import { auditPath } from "@/lib/constants";
import listStyles from "../list.module.css";

type Props = { canEdit?: boolean };

export function RequestsEmptyState({ canEdit = true }: Props) {
  return (
    <div className={listStyles.emptyState} role="status" aria-label="No customer data requests recorded yet">
      <h2 className={listStyles.emptyStateTitle} id="empty-state-heading">
        No customer data requests recorded yet
      </h2>
      <p className={listStyles.emptyStateText}>
        Log a request here when someone asks you to delete, correct, or access their personal data. Most businesses only log these occasionally.
      </p>
      <ul className={listStyles.emptyStateList} aria-labelledby="empty-state-heading">
        <li>Delete my data</li>
        <li>Correct my data</li>
        <li>Show me what data you hold about me</li>
      </ul>
      {canEdit && (
        <Link
          href={auditPath("/dashboard/requests/new")}
          className={`${listStyles.btn} ${listStyles.btnPrimary}`}
          aria-label="Log customer request"
        >
          Log customer request
        </Link>
      )}
      <p className={listStyles.emptyStateNote}>
        You don&apos;t need to log general customer emails — only requests about personal data.
      </p>
    </div>
  );
}
