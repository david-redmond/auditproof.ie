import listStyles from "../list.module.css";

const CORE_TYPES = [
  "privacy_notice",
  "retention_policy",
  "processor_agreement",
  "training_record",
];

type EvidenceRow = { type: string };

type Props = { list: EvidenceRow[] };

/** Count how many of the four core policy types are present in the list. */
function getCoreCount(list: EvidenceRow[]): number {
  const types = new Set(list.map((d) => d.type));
  return CORE_TYPES.filter((t) => types.has(t)).length;
}

export function EvidenceComplianceStrip({ list }: Props) {
  const count = getCoreCount(list);

  return (
    <section
      className={`${listStyles.panel} ${listStyles.summaryStrip}`}
      aria-labelledby="evidence-compliance-heading"
    >
      <h2 id="evidence-compliance-heading" className={listStyles.summaryHeading}>
        Core policies uploaded
      </h2>
      <div className={listStyles.summaryCards}>
        <div className={listStyles.summaryCard}>
          <span className={listStyles.summaryValue}>
            {count} / {CORE_TYPES.length}
          </span>
          <span className={listStyles.summaryLabel}>
            Privacy policy, retention policy, supplier agreements, training records
          </span>
        </div>
      </div>
    </section>
  );
}
