"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { GenerateAuditPack } from "./GenerateAuditPack";
import listStyles from "../list.module.css";

const HELP_BODY = (
  <>
    <p className={listStyles.whyIntro}>
      An audit pack is a read-only snapshot of your GDPR records at a point in time.
      It typically includes your data processing register (RoPA), customer request log,
      incidents log, and an index of your policies and evidence documents.
    </p>
    <p className={listStyles.whyReassurance}>
      You can share it with an advisor, auditor, or the DPC. Exporting does not change
      your records — it just creates a downloadable PDF and optional ZIP.
    </p>
  </>
);

type Props = {
  showGenerate: boolean;
  allowGenerate: boolean;
  hasActiveSubscription: boolean;
  latestLabel: string | null;
  priceAnnual?: number;
  priceMonthly?: number;
};

/** Fires audit_exports_page_view once on mount. */
export function AuditExportsPageTracker({ children }: { children: React.ReactNode }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("audit_exports_page_view", { page: "audit-exports" });
  }, []);
  return <>{children}</>;
}

export function AuditExportsIntro({ showGenerate, allowGenerate, hasActiveSubscription, latestLabel, priceAnnual, priceMonthly }: Props) {
  return (
    <section
      className={`${listStyles.panel} ${listStyles.introPanel}`}
      aria-labelledby="audit-exports-page-title"
    >
      <h1 id="audit-exports-page-title" className={listStyles.title}>
        Export an audit pack
      </h1>
      <p className={listStyles.subtitle}>
        Create a timestamped PDF/ZIP you can share with an advisor, auditor, or the DPC if ever needed.
      </p>
      <p className={listStyles.subtitleAction}>
        Exporting does not change your records — it just creates a snapshot.
      </p>

      <details className={listStyles.whyBlock}>
        <summary className={listStyles.whySummary}>What is an audit pack?</summary>
        <div className={listStyles.whyText}>{HELP_BODY}</div>
      </details>

      {allowGenerate && (
        <div className={listStyles.ctaGroup} style={{ marginTop: "var(--theme-space-4)" }}>
          <GenerateAuditPack
            initialOpen={showGenerate}
            triggerLabel="Generate new audit pack"
            hasActiveSubscription={hasActiveSubscription}
            priceAnnual={priceAnnual}
            priceMonthly={priceMonthly}
          />
        </div>
      )}

      <p className={listStyles.ctaSupporting} style={{ marginTop: "var(--theme-space-2)" }}>
        {latestLabel != null ? (
          <>Latest audit pack: {latestLabel}</>
        ) : (
          <>No audit packs yet</>
        )}
      </p>
    </section>
  );
}
