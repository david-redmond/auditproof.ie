"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import listStyles from "../list.module.css";

const CHECKLIST = [
  "What happened",
  "What data may be affected",
  "Actions taken",
  "Decision on notification",
];

type Props = { canEdit?: boolean };

export function IncidentsEmptyState({ canEdit = true }: Props) {
  const viewFired = useRef(false);
  useEffect(() => {
    if (viewFired.current) return;
    viewFired.current = true;
    trackEvent("incidents_empty_state_view");
  }, []);

  return (
    <section
      className={listStyles.emptyState}
      aria-labelledby="incidents-empty-heading"
    >
      <h2 id="incidents-empty-heading" className={listStyles.emptyStateTitle}>
        No incidents logged
      </h2>
      <p className={listStyles.emptyStateText}>
        If something happens, record it here so you have dates and decisions documented.
      </p>
      <ul
        className={listStyles.emptyStateList}
        aria-labelledby="incidents-empty-heading"
        style={{ maxWidth: "28em", marginLeft: "auto", marginRight: "auto" }}
      >
        {CHECKLIST.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className={listStyles.emptyStateNote}>
        Use the &quot;Log a security incident&quot; button above to add your first entry.
      </p>
    </section>
  );
}
