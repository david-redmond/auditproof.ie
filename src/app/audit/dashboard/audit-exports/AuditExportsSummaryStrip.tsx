import listStyles from "../list.module.css";

type Pack = {
  generatedAt?: unknown;
  artifacts?:
    | { pdf?: { key?: string | null } | null; zip?: { key?: string | null } | null }
    | null;
};

type Props = {
  list: Pack[];
};

export function AuditExportsSummaryStrip({ list }: Props) {
  const total = list.length;
  const latestGenerated =
    list.length > 0 && list[0].generatedAt
      ? new Date(list[0].generatedAt as string).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : null;
  const withZip = list.filter((e) => e.artifacts?.zip?.key).length;
  const formatsLabel =
    total === 0 ? "—" : withZip === total ? "PDF, ZIP" : withZip > 0 ? `PDF, ZIP (${withZip}/${total})` : "PDF";

  return (
    <section
      className={`${listStyles.panel} ${listStyles.filtersSummaryPanel}`}
      aria-labelledby="audit-exports-summary-heading"
    >
      <h2 id="audit-exports-summary-heading" className={listStyles.summaryHeading}>
        Summary
      </h2>
      <div className={listStyles.summaryCards}>
        <div className={listStyles.summaryCard}>
          <span className={listStyles.summaryValue}>{total}</span>
          <span className={listStyles.summaryLabel}>Total audit packs</span>
        </div>
        <div className={listStyles.summaryCard}>
          <span className={listStyles.summaryValue}>{latestGenerated ?? "—"}</span>
          <span className={listStyles.summaryLabel}>Latest generated</span>
        </div>
        <div className={listStyles.summaryCard}>
          <span className={listStyles.summaryValue}>{formatsLabel}</span>
          <span className={listStyles.summaryLabel}>Formats available</span>
        </div>
      </div>
    </section>
  );
}
