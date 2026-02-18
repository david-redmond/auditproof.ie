"use strict";
/** Client-safe enums only (no mongoose). Use in forms and UI. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawfulBasis = exports.DocumentType = exports.IncidentRiskLevel = exports.RequestOutcome = exports.RequestType = void 0;
exports.RequestType = {
    ACCESS: "access",
    RECTIFICATION: "rectification",
    ERASURE: "erasure",
    RESTRICTION: "restriction",
    OBJECTION: "objection",
    PORTABILITY: "portability",
};
exports.RequestOutcome = {
    COMPLETED_FULL: "completed_full",
    COMPLETED_PARTIAL: "completed_partial",
    REFUSED: "refused",
    WITHDRAWN: "withdrawn",
};
exports.IncidentRiskLevel = { LOW: "low", MEDIUM: "medium", HIGH: "high" };
exports.DocumentType = {
    PRIVACY_NOTICE: "privacy_notice",
    RETENTION_POLICY: "retention_policy",
    DSR_PROCEDURE: "dsr_procedure",
    BREACH_PROCEDURE: "breach_procedure",
    PROCESSOR_AGREEMENT: "processor_agreement",
    TRAINING_RECORD: "training_record",
    OTHER: "other",
};
exports.LawfulBasis = {
    CONSENT: "consent",
    CONTRACT: "contract",
    LEGAL_OBLIGATION: "legal_obligation",
    VITAL_INTERESTS: "vital_interests",
    PUBLIC_TASK: "public_task",
    LEGITIMATE_INTERESTS: "legitimate_interests",
};
