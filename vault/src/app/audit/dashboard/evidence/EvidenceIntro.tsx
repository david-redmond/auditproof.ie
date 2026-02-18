"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import listStyles from "../list.module.css";

const UPLOAD_EXAMPLES = [
  "Privacy policy",
  "Data retention policy",
  "Data processing agreements",
  "Staff training records",
] as const;

const STORE_NOTE =
  "This is a document store for evidence. It does not check or validate document content.";

/** Fires evidence_page_view once on mount. Wrap page content as children. */
export function EvidencePageTracker({ children }: { children: React.ReactNode }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("evidence_page_view", { page: "evidence" });
  }, []);
  return <>{children}</>;
}

/** Accessible disclosure "What should I upload?" with GA4 open/close. */
export function EvidenceHelpDisclosure() {
  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const details = e.currentTarget;
    trackEvent(details.open ? "evidence_help_open" : "evidence_help_close");
  };

  return (
    <details className={listStyles.whyBlock} onToggle={handleToggle}>
      <summary className={listStyles.whySummary}>What should I upload?</summary>
      <div className={listStyles.whyText}>
        <p className={listStyles.whyIntro}>
          Common documents that support your compliance:
        </p>
        <ul className={listStyles.examplesList}>
          {UPLOAD_EXAMPLES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={listStyles.whyReassurance}>{STORE_NOTE}</p>
      </div>
    </details>
  );
}
