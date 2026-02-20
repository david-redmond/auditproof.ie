"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { auditPath } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import listStyles from "../list.module.css";

const EXAMPLES = [
  "Laptop/phone lost with customer data",
  "Email sent to the wrong person",
  "Account accessed by someone who shouldn't have access",
  "System outage where data might have been exposed",
];

const REASSURANCE =
  "Logging an incident doesn't automatically mean you must notify the DPC — it helps you keep a clear record.";

/** Fires incidents_page_view once on mount. Wrap page content as children. */
export function IncidentsPageTracker({ children }: { children: React.ReactNode }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("incidents_page_view", { page: "incidents" });
  }, []);
  return <>{children}</>;
}

/** CTA link that fires incidents_cta_click on click. */
export function IncidentsCtaLink() {
  return (
    <div className={listStyles.ctaGroup}>
      <Link
        href={auditPath("/dashboard/incidents/new")}
        className={`${listStyles.btn} ${listStyles.btnPrimary}`}
        onClick={() => trackEvent("incidents_cta_click", { action: "log" })}
      >
        Log a security incident
      </Link>
    </div>
  );
}

/** Accessible disclosure "See examples" with GA4 open/close. */
export function IncidentsExamplesDisclosure() {
  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const details = e.currentTarget;
    trackEvent(details.open ? "incidents_examples_open" : "incidents_examples_close");
  };

  return (
    <details className={listStyles.whyBlock} onToggle={handleToggle}>
      <summary className={listStyles.whySummary}>See examples</summary>
      <div className={listStyles.whyText}>
        <ul className={listStyles.examplesList}>
          {EXAMPLES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={listStyles.whyReassurance}>{REASSURANCE}</p>
      </div>
    </details>
  );
}
