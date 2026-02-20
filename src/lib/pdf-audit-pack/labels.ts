/**
 * Display-only labels for the PDF. Do not change stored enum values.
 * SME-friendly where specified (e.g. request types).
 */

export const LAWFUL_BASIS_LABELS: Record<string, string> = {
  consent: "Consent",
  contract: "Contract",
  legal_obligation: "Legal obligation",
  vital_interests: "Vital interests",
  public_task: "Public task",
  legitimate_interests: "Legitimate interests",
};

/** SME-friendly request type labels for the PDF */
export const REQUEST_TYPE_LABELS: Record<string, string> = {
  access: "Access my data",
  rectification: "Correct my data",
  erasure: "Delete my data",
  restriction: "Restrict processing",
  objection: "Object to processing",
  portability: "Portability",
};

export const REQUEST_OUTCOME_LABELS: Record<string, string> = {
  completed_full: "Completed (full)",
  completed_partial: "Completed (partial)",
  refused: "Refused",
  withdrawn: "Withdrawn",
};

export const INCIDENT_RISK_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  privacy_notice: "Privacy notice",
  retention_policy: "Retention policy",
  dsr_procedure: "DSR procedure",
  breach_procedure: "Breach procedure",
  processor_agreement: "Processor agreement",
  training_record: "Training record",
  other: "Other",
};

export function friendlyLawfulBasis(value: string | undefined | null): string {
  return (value && LAWFUL_BASIS_LABELS[value]) || value || "—";
}

export function friendlyRequestType(value: string | undefined | null): string {
  return (value && REQUEST_TYPE_LABELS[value]) || value || "—";
}

export function friendlyOutcome(value: string | undefined | null): string {
  return (value && REQUEST_OUTCOME_LABELS[value]) || value || "—";
}

export function friendlyRisk(value: string | undefined | null): string {
  return (value && INCIDENT_RISK_LABELS[value]) || value || "—";
}

export function friendlyDocType(value: string | undefined | null): string {
  return (value && DOCUMENT_TYPE_LABELS[value]) || value || "—";
}

/** Safe subject ref for PDF (avoid PII in plain text where possible). */
export function subjectRefDisplay(
  subjectRef: { scheme?: string; value?: string } | null | undefined
): string {
  if (!subjectRef) return "—";
  const scheme = subjectRef.scheme || "ref";
  const val = subjectRef.value;
  if (!val) return "—";
  if (val.length > 30) return `${scheme}: ${val.slice(0, 27)}…`;
  return `${scheme}: ${val}`;
}
