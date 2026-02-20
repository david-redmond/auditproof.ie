"use client";

import Link from "next/link";
import { auditPath } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import listStyles from "../list.module.css";

type Props = {
  recordCount: number;
  canEdit: boolean;
};

/**
 * Top CTAs: when zero records, primary = Start with templates, secondary = Create blank.
 * When there are records, primary = Add data use, secondary = Start with templates + supporting line.
 * Matches empty-state CTA structure so both states feel like the same design.
 */
export function RopaTopCtas({ recordCount, canEdit }: Props) {
  if (!canEdit) return null;

  const hasRecords = recordCount > 0;

  if (!hasRecords) {
    return (
      <div className={listStyles.ctaGroup}>
        <Link
          href={auditPath("/dashboard/ropa/templates")}
          className={`${listStyles.btn} ${listStyles.btnPrimary}`}
          onClick={() => trackEvent("ropa_cta_click", { action: "templates" })}
        >
          Start with templates (recommended)
        </Link>
        <Link
          href={auditPath("/dashboard/ropa/new")}
          className={listStyles.btnSecondary}
          onClick={() => trackEvent("ropa_cta_click", { action: "add_blank" })}
        >
          Create blank record
        </Link>
      </div>
    );
  }

  return (
    <div className={listStyles.ctaGroup}>
      <Link
        href={auditPath("/dashboard/ropa/new")}
        className={`${listStyles.btn} ${listStyles.btnPrimary}`}
        onClick={() => trackEvent("ropa_cta_click", { action: "add_blank" })}
      >
        Add data use
      </Link>
      <Link
        href={auditPath("/dashboard/ropa/templates")}
        className={listStyles.btnSecondary}
        onClick={() => trackEvent("ropa_cta_click", { action: "templates" })}
      >
        Start with templates
      </Link>
      <p className={listStyles.ctaSupporting}>Recommended for most SMEs.</p>
    </div>
  );
}
