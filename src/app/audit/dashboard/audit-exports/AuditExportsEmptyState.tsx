"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { auditPath } from "@/lib/constants";
import listStyles from "../list.module.css";

type Props = { allowGenerate?: boolean; hasActiveSubscription?: boolean };

export function AuditExportsEmptyState({ allowGenerate = true, hasActiveSubscription: _hasActiveSubscription = true }: Props) {
  const viewFired = useRef(false);
  useEffect(() => {
    if (viewFired.current) return;
    viewFired.current = true;
    trackEvent("audit_exports_empty_state_view");
  }, []);

  return (
    <section
      className={listStyles.emptyState}
      aria-labelledby="audit-exports-empty-heading"
    >
      <h2 id="audit-exports-empty-heading" className={listStyles.emptyStateTitle}>
        No audit packs yet
      </h2>
      <p className={listStyles.emptyStateText}>
        Generate a pack when you want a timestamped snapshot for an advisor, auditor, or regulator.
      </p>
      {allowGenerate && (
        <Link
          href={auditPath("/dashboard/audit-exports") + "?generate=1"}
          className={`${listStyles.btn} ${listStyles.btnPrimary}`}
          aria-label="Generate new audit pack"
          onClick={() => trackEvent("audit_pack_generate_click", { source: "empty_state" })}
        >
          Generate new audit pack
        </Link>
      )}
    </section>
  );
}
