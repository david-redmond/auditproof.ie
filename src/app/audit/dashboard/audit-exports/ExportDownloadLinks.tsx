"use client";

import { useState } from "react";
import { PaywallModal } from "./PaywallModal";
import listStyles from "../list.module.css";
import styles from "./audit-exports.module.css";

type Props = {
  packId: string;
  versionLabel: string;
  hasPdf: boolean;
  hasZip: boolean;
  priceAnnual?: number;
  priceMonthly?: number;
};

export function ExportDownloadLinks({ packId, versionLabel, hasPdf, hasZip, priceAnnual, priceMonthly }: Props) {
  const [paywallOpen, setPaywallOpen] = useState(false);

  const handleDownload = async (type: "pdf" | "zip") => {
    const url = `/api/audit-exports/download?id=${packId}&type=${type}`;
    const res = await fetch(url);
    if (res.status === 402) {
      setPaywallOpen(true);
      return;
    }
    if (!res.ok) return;
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = `audit-${versionLabel}.${type}`;
    a.click();
    URL.revokeObjectURL(objUrl);
  };

  return (
    <>
      <div className={styles.downloadCell}>
        {hasPdf ? (
          <button
            type="button"
            onClick={() => handleDownload("pdf")}
            className={styles.downloadBtn}
            aria-label={`Download PDF for ${versionLabel}`}
          >
            PDF
          </button>
        ) : (
          <span className={styles.downloadUnavailable}>Not available</span>
        )}
        {hasZip ? (
          <button
            type="button"
            onClick={() => handleDownload("zip")}
            className={styles.downloadBtn}
            aria-label={`Download ZIP for ${versionLabel}`}
          >
            ZIP
          </button>
        ) : null}
      </div>
      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        annualPrice={priceAnnual}
        monthlyPrice={priceMonthly}
      />
    </>
  );
}
