"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import listStyles from "../list.module.css";

const CHECKLIST = [
  "Privacy policy",
  "Data retention policy",
  "Supplier / processor agreements",
  "Staff training records",
];

type Props = { canEdit?: boolean };

export function EvidenceEmptyState({ canEdit: _canEdit = true }: Props) {
  const viewFired = useRef(false);
  useEffect(() => {
    if (viewFired.current) return;
    viewFired.current = true;
    trackEvent("evidence_empty_state_view");
  }, []);

  return (
    <section
      className={listStyles.emptyState}
      aria-labelledby="evidence-empty-heading"
    >
      <h2 id="evidence-empty-heading" className={listStyles.emptyStateTitle}>
        No documents uploaded yet
      </h2>
      <p className={listStyles.emptyStateText}>
        This is where you keep copies of policies and records that support your GDPR compliance.
      </p>
      <ul
        className={listStyles.emptyStateList}
        aria-labelledby="evidence-empty-heading"
        style={{ maxWidth: "28em", marginLeft: "auto", marginRight: "auto" }}
      >
        {CHECKLIST.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className={listStyles.emptyStateNote}>
        Use the &quot;Upload document&quot; button above to add your first document.
      </p>
    </section>
  );
}
