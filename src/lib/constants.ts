/**
 * Client-safe enums (no mongoose). Values kept in sync with gdpr-models/constants.
 * Inlined here so Next.js/Turbopack resolves without package subpath exports.
 */

export const RequestType = {
  ACCESS: "access",
  RECTIFICATION: "rectification",
  ERASURE: "erasure",
  RESTRICTION: "restriction",
  OBJECTION: "objection",
  PORTABILITY: "portability",
} as const;
export type RequestType = (typeof RequestType)[keyof typeof RequestType];

export const RequestOutcome = {
  COMPLETED_FULL: "completed_full",
  COMPLETED_PARTIAL: "completed_partial",
  REFUSED: "refused",
  WITHDRAWN: "withdrawn",
} as const;
export type RequestOutcome = (typeof RequestOutcome)[keyof typeof RequestOutcome];

export const IncidentRiskLevel = { LOW: "low", MEDIUM: "medium", HIGH: "high" } as const;
export type IncidentRiskLevel = (typeof IncidentRiskLevel)[keyof typeof IncidentRiskLevel];

export const DocumentType = {
  PRIVACY_NOTICE: "privacy_notice",
  RETENTION_POLICY: "retention_policy",
  DSR_PROCEDURE: "dsr_procedure",
  BREACH_PROCEDURE: "breach_procedure",
  PROCESSOR_AGREEMENT: "processor_agreement",
  TRAINING_RECORD: "training_record",
  OTHER: "other",
} as const;
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export const LawfulBasis = {
  CONSENT: "consent",
  CONTRACT: "contract",
  LEGAL_OBLIGATION: "legal_obligation",
  VITAL_INTERESTS: "vital_interests",
  PUBLIC_TASK: "public_task",
  LEGITIMATE_INTERESTS: "legitimate_interests",
} as const;
export type LawfulBasis = (typeof LawfulBasis)[keyof typeof LawfulBasis];

/** Base path for audit app (signin, dashboard, accept-invite). */
export const AUDIT_BASE = "/audit";

/** Build audit path: auditPath("/dashboard") => "/audit/dashboard". */
export function auditPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${AUDIT_BASE}${p}`;
}
