"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markRopaReviewed } from "./actions";

type Props = { recordId: string };

export function TemplateReviewBanner({ recordId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleMarkReviewed = async () => {
    setLoading(true);
    try {
      const result = await markRopaReviewed(recordId);
      if (result?.error) {
        setLoading(false);
        return;
      }
      setDone(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (done) return null;

  return (
    <div
      className="templateReviewBanner"
      style={{
        background: "var(--theme-amber-bg, #fef3c7)",
        border: "1px solid var(--theme-amber, #d97706)",
        borderRadius: "var(--theme-radius-md)",
        padding: "var(--theme-space-4)",
        marginBottom: "var(--theme-space-4)",
        fontSize: "0.9375rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "var(--theme-space-3)",
      }}
      role="status"
    >
      <p style={{ margin: 0, color: "var(--theme-text-strong)" }}>
        This record was created from a template. Please review and update it.
      </p>
      <button
        type="button"
        onClick={handleMarkReviewed}
        disabled={loading}
        style={{
          padding: "var(--theme-space-2) var(--theme-space-4)",
          fontSize: "0.875rem",
          fontWeight: 500,
          border: "1px solid var(--theme-amber)",
          borderRadius: "var(--theme-radius-sm)",
          background: "var(--theme-card-bg)",
          color: "var(--theme-text)",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Saving…" : "Mark as reviewed"}
      </button>
    </div>
  );
}
