"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawfulBasis = exports.DocumentType = exports.IncidentRiskLevel = exports.RequestOutcome = exports.RequestType = void 0;
exports.getModels = getModels;
const mongoose_1 = require("mongoose");
/* -----------------------------
   Enums (client-safe; use in forms/UI)
----------------------------- */
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
/* -----------------------------
   Sub-schemas
----------------------------- */
const SubjectRefSchema = new mongoose_1.Schema({
    scheme: { type: String, required: true, enum: ["customer_id", "employee_id", "order_id", "email_hash", "other"] },
    value: { type: String, required: true },
}, { _id: false });
const ProcessorRefSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ["processor", "subprocessor"], default: "processor" },
    country: { type: String },
    dpaOnFile: { type: Boolean, default: false },
}, { _id: false });
const SecurityMeasuresSchema = new mongoose_1.Schema({
    accessControls: { type: Boolean, default: true },
    encryptionAtRest: { type: Boolean, default: false },
    encryptionInTransit: { type: Boolean, default: true },
    backups: { type: Boolean, default: true },
    notes: { type: String, trim: true, maxlength: 2000 },
}, { _id: false });
/* -----------------------------
   Organisation
----------------------------- */
const OrganisationSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    tradingName: { type: String, trim: true },
    country: { type: String, default: "IE" },
    website: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    controllerContact: {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        phone: { type: String, trim: true },
    },
    dpo: {
        status: { type: String, required: true, enum: ["appointed", "not_required", "outsourced"] },
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        justification: { type: String, trim: true, maxlength: 2000 },
    },
    lastReviewAt: { type: Date },
    // Billing: source of truth synced from Stripe webhook
    subscriptionStatus: { type: String, trim: true, default: "inactive" },
    stripeCustomerId: { type: String, trim: true },
    stripeSubscriptionId: { type: String, trim: true },
    stripePriceId: { type: String, trim: true },
    partnerRef: { type: String, trim: true },
    firstExportAt: { type: Date },
}, { timestamps: true });
OrganisationSchema.index({ name: 1 });
/* -----------------------------
   User
----------------------------- */
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    name: { type: String, trim: true },
    authProvider: { type: String, enum: ["clerk", "auth0", "firebase", "custom"], default: "custom" },
    authSubject: { type: String, trim: true },
    passwordHash: { type: String },
}, { timestamps: true });
/* -----------------------------
   Membership
----------------------------- */
const MembershipSchema = new mongoose_1.Schema({
    orgId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organisation", required: true, index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, required: true, enum: ["owner", "admin", "editor", "viewer"] },
    invitedByUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date },
}, { timestamps: true });
MembershipSchema.index({ orgId: 1, userId: 1 }, { unique: true });
/* -----------------------------
   RoPA
----------------------------- */
const RopaRecordSchema = new mongoose_1.Schema({
    orgId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organisation", required: true, index: true },
    source: { type: String, enum: ["manual", "template"], default: "manual" },
    templateId: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    purpose: { type: String, required: true, trim: true, maxlength: 2000 },
    dataSubjects: { type: [String], default: [] },
    personalDataCategories: { type: [String], default: [] },
    specialCategoryData: { isProcessed: { type: Boolean, default: false }, notes: { type: String, trim: true, maxlength: 2000 } },
    lawfulBasis: { type: String, required: true, enum: Object.values(exports.LawfulBasis) },
    lawfulBasisNotes: { type: String, trim: true, maxlength: 2000 },
    recipients: { type: [String], default: [] },
    processors: { type: [ProcessorRefSchema], default: [] },
    internationalTransfers: {
        occurs: { type: Boolean, default: false },
        countries: { type: [String], default: [] },
        safeguards: { type: String, trim: true, maxlength: 2000 },
    },
    retention: {
        period: { type: String, required: true, trim: true },
        rationale: { type: String, trim: true, maxlength: 2000 },
    },
    security: { type: SecurityMeasuresSchema, default: () => ({}) },
    lastReviewedAt: { type: Date },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });
RopaRecordSchema.index({ orgId: 1, name: 1 });
RopaRecordSchema.index({ orgId: 1, templateId: 1 }, { sparse: true });
/* -----------------------------
   Data Subject Request
----------------------------- */
const DataSubjectRequestSchema = new mongoose_1.Schema({
    orgId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organisation", required: true, index: true },
    requestType: { type: String, required: true, enum: Object.values(exports.RequestType) },
    receivedAt: { type: Date, required: true, default: () => new Date() },
    dueAt: { type: Date, required: true },
    subjectRef: { type: SubjectRefSchema, required: true },
    channel: { type: String, enum: ["email", "webform", "phone", "in_person", "letter", "other"], default: "email" },
    summary: { type: String, trim: true, maxlength: 2000 },
    outcome: { type: String, enum: Object.values(exports.RequestOutcome) },
    outcomeReason: { type: String, trim: true, maxlength: 2000 },
    actionsTaken: { categories: { type: [String], default: [] }, notes: { type: String, trim: true, maxlength: 2000 } },
    completedAt: { type: Date },
    responseSent: { type: Boolean, default: false },
    responseSentAt: { type: Date },
    extension: { used: { type: Boolean, default: false }, newDueAt: { type: Date }, justification: { type: String, trim: true, maxlength: 2000 } },
    identityVerifiedAt: { type: Date },
    overdueNote: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true });
DataSubjectRequestSchema.index({ orgId: 1, receivedAt: -1 });
DataSubjectRequestSchema.index({ orgId: 1, dueAt: 1 });
/* -----------------------------
   Incident
----------------------------- */
const IncidentSchema = new mongoose_1.Schema({
    orgId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organisation", required: true, index: true },
    discoveredAt: { type: Date, required: true, default: () => new Date() },
    occurredAt: { type: Date },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 4000 },
    riskLevel: { type: String, enum: Object.values(exports.IncidentRiskLevel), default: exports.IncidentRiskLevel.LOW },
    likelyRiskToIndividuals: { type: Boolean, default: false },
    notification: {
        dpcNotified: { type: Boolean, default: false },
        dpcNotifiedAt: { type: Date },
        individualsNotified: { type: Boolean, default: false },
        individualsNotifiedAt: { type: Date },
        rationaleIfNotNotified: { type: String, trim: true, maxlength: 2000 },
    },
    containment: { steps: { type: [String], default: [] }, notes: { type: String, trim: true, maxlength: 2000 } },
    closedAt: { type: Date },
    status: { type: String, enum: ["open", "closed"], default: "open" },
}, { timestamps: true });
IncidentSchema.index({ orgId: 1, status: 1, discoveredAt: -1 });
/* -----------------------------
   Evidence document
----------------------------- */
const EvidenceDocumentSchema = new mongoose_1.Schema({
    orgId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organisation", required: true, index: true },
    type: { type: String, required: true, enum: Object.values(exports.DocumentType) },
    title: { type: String, required: true, trim: true },
    storage: {
        provider: { type: String, required: true, enum: ["s3", "gcs", "azure_blob", "local"] },
        bucket: { type: String, trim: true },
        key: { type: String, required: true, trim: true },
        contentType: { type: String, trim: true },
        sizeBytes: { type: Number },
        sha256: { type: String, trim: true },
    },
    uploadedAt: { type: Date, required: true, default: () => new Date() },
    reviewDueAt: { type: Date },
    notes: { type: String, trim: true, maxlength: 2000 },
    tags: { type: [String], default: [] },
}, { timestamps: true });
EvidenceDocumentSchema.index({ orgId: 1, type: 1, uploadedAt: -1 });
/* -----------------------------
   Audit pack
----------------------------- */
const AuditPackSchema = new mongoose_1.Schema({
    orgId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organisation", required: true, index: true },
    generatedAt: { type: Date, required: true, default: () => new Date() },
    generatedByUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    includes: {
        ropa: { type: Boolean, default: true },
        dsrs: { type: Boolean, default: true },
        incidents: { type: Boolean, default: true },
        evidenceIndex: { type: Boolean, default: true },
        evidenceFiles: { type: Boolean, default: false },
    },
    artifacts: {
        pdf: { provider: { type: String }, bucket: { type: String }, key: { type: String }, sha256: { type: String } },
        zip: { provider: { type: String }, bucket: { type: String }, key: { type: String }, sha256: { type: String } },
    },
    versionLabel: { type: String, required: true, trim: true },
}, { timestamps: true });
AuditPackSchema.index({ orgId: 1, generatedAt: -1 });
/* -----------------------------
   Audit event (append-only)
----------------------------- */
const AuditEventSchema = new mongoose_1.Schema({
    orgId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organisation", required: true, index: true },
    actorUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    actorType: { type: String, enum: ["user", "system"], required: true, default: "user" },
    entity: { type: String, required: true },
    entityId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    at: { type: Date, required: true, default: () => new Date() },
    summary: { type: String, trim: true, maxlength: 2000 },
    diff: { changedFields: { type: [String], default: [] } },
    requestId: { type: String, trim: true },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
}, { timestamps: false, versionKey: false });
AuditEventSchema.index({ orgId: 1, at: -1 });
AuditEventSchema.pre("updateOne", function () {
    throw new Error("AuditEvent is append-only; updates are not allowed.");
});
AuditEventSchema.pre("deleteOne", function () {
    throw new Error("AuditEvent is append-only; deletes are not allowed.");
});
AuditEventSchema.pre("findOneAndUpdate", function () {
    throw new Error("AuditEvent is append-only; updates are not allowed.");
});
AuditEventSchema.pre("findOneAndDelete", function () {
    throw new Error("AuditEvent is append-only; deletes are not allowed.");
});
/* -----------------------------
   Invite (email-based onboarding)
----------------------------- */
const InviteSchema = new mongoose_1.Schema({
    orgId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organisation", required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    role: { type: String, required: true, enum: ["owner", "admin", "editor", "viewer"] },
    tokenHash: { type: String, required: true },
    invitedByUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
    revokedAt: { type: Date },
}, { timestamps: true });
InviteSchema.index({ orgId: 1, email: 1, usedAt: 1, revokedAt: 1 });
InviteSchema.index({ tokenHash: 1 }, { unique: true });
InviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
function getModels(mongooseInstance) {
    const m = mongooseInstance;
    return {
        OrganisationModel: m.models.Organisation ?? m.model("Organisation", OrganisationSchema),
        UserModel: m.models.User ?? m.model("User", UserSchema),
        MembershipModel: m.models.Membership ?? m.model("Membership", MembershipSchema),
        RopaRecordModel: m.models.RopaRecord ?? m.model("RopaRecord", RopaRecordSchema),
        DataSubjectRequestModel: m.models.DataSubjectRequest ?? m.model("DataSubjectRequest", DataSubjectRequestSchema),
        IncidentModel: m.models.Incident ?? m.model("Incident", IncidentSchema),
        EvidenceDocumentModel: m.models.EvidenceDocument ?? m.model("EvidenceDocument", EvidenceDocumentSchema),
        AuditPackModel: m.models.AuditPack ?? m.model("AuditPack", AuditPackSchema),
        AuditEventModel: m.models.AuditEvent ?? m.model("AuditEvent", AuditEventSchema),
        InviteModel: m.models.Invite ?? m.model("Invite", InviteSchema),
    };
}
