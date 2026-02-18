/** Client-safe enums only (no mongoose). Use in forms and UI. */
export declare const RequestType: {
    readonly ACCESS: "access";
    readonly RECTIFICATION: "rectification";
    readonly ERASURE: "erasure";
    readonly RESTRICTION: "restriction";
    readonly OBJECTION: "objection";
    readonly PORTABILITY: "portability";
};
export type RequestType = (typeof RequestType)[keyof typeof RequestType];
export declare const RequestOutcome: {
    readonly COMPLETED_FULL: "completed_full";
    readonly COMPLETED_PARTIAL: "completed_partial";
    readonly REFUSED: "refused";
    readonly WITHDRAWN: "withdrawn";
};
export type RequestOutcome = (typeof RequestOutcome)[keyof typeof RequestOutcome];
export declare const IncidentRiskLevel: {
    readonly LOW: "low";
    readonly MEDIUM: "medium";
    readonly HIGH: "high";
};
export type IncidentRiskLevel = (typeof IncidentRiskLevel)[keyof typeof IncidentRiskLevel];
export declare const DocumentType: {
    readonly PRIVACY_NOTICE: "privacy_notice";
    readonly RETENTION_POLICY: "retention_policy";
    readonly DSR_PROCEDURE: "dsr_procedure";
    readonly BREACH_PROCEDURE: "breach_procedure";
    readonly PROCESSOR_AGREEMENT: "processor_agreement";
    readonly TRAINING_RECORD: "training_record";
    readonly OTHER: "other";
};
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];
export declare const LawfulBasis: {
    readonly CONSENT: "consent";
    readonly CONTRACT: "contract";
    readonly LEGAL_OBLIGATION: "legal_obligation";
    readonly VITAL_INTERESTS: "vital_interests";
    readonly PUBLIC_TASK: "public_task";
    readonly LEGITIMATE_INTERESTS: "legitimate_interests";
};
export type LawfulBasis = (typeof LawfulBasis)[keyof typeof LawfulBasis];
//# sourceMappingURL=constants.d.ts.map