/**
 * Shared GDPR Evidence Vault models – single source of truth for Vault & GDPR apps.
 * Server-only (mongoose). Multi-tenant via orgId.
 */
import type { InferSchemaType, Model, Types } from "mongoose";
import { Schema } from "mongoose";
export type ObjectId = Types.ObjectId;
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
declare const OrganisationSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    country: string;
    subscriptionStatus: string;
    tradingName?: string | null | undefined;
    website?: string | null | undefined;
    contactEmail?: string | null | undefined;
    controllerContact?: any;
    dpo?: any;
    lastReviewAt?: NativeDate | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
    stripePriceId?: string | null | undefined;
    partnerRef?: string | null | undefined;
    firstExportAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    name: string;
    country: string;
    subscriptionStatus: string;
    tradingName?: string | null | undefined;
    website?: string | null | undefined;
    contactEmail?: string | null | undefined;
    controllerContact?: any;
    dpo?: any;
    lastReviewAt?: NativeDate | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
    stripePriceId?: string | null | undefined;
    partnerRef?: string | null | undefined;
    firstExportAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    name: string;
    country: string;
    subscriptionStatus: string;
    tradingName?: string | null | undefined;
    website?: string | null | undefined;
    contactEmail?: string | null | undefined;
    controllerContact?: any;
    dpo?: any;
    lastReviewAt?: NativeDate | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
    stripePriceId?: string | null | undefined;
    partnerRef?: string | null | undefined;
    firstExportAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        name: string;
        country: string;
        subscriptionStatus: string;
        tradingName?: string | null | undefined;
        website?: string | null | undefined;
        contactEmail?: string | null | undefined;
        controllerContact?: any;
        dpo?: any;
        lastReviewAt?: NativeDate | null | undefined;
        stripeCustomerId?: string | null | undefined;
        stripeSubscriptionId?: string | null | undefined;
        stripePriceId?: string | null | undefined;
        partnerRef?: string | null | undefined;
        firstExportAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        name: string;
        country: string;
        subscriptionStatus: string;
        tradingName?: string | null | undefined;
        website?: string | null | undefined;
        contactEmail?: string | null | undefined;
        controllerContact?: any;
        dpo?: any;
        lastReviewAt?: NativeDate | null | undefined;
        stripeCustomerId?: string | null | undefined;
        stripeSubscriptionId?: string | null | undefined;
        stripePriceId?: string | null | undefined;
        partnerRef?: string | null | undefined;
        firstExportAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    name: string;
    country: string;
    subscriptionStatus: string;
    tradingName?: string | null | undefined;
    website?: string | null | undefined;
    contactEmail?: string | null | undefined;
    controllerContact?: any;
    dpo?: any;
    lastReviewAt?: NativeDate | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
    stripePriceId?: string | null | undefined;
    partnerRef?: string | null | undefined;
    firstExportAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type Organisation = InferSchemaType<typeof OrganisationSchema>;
declare const UserSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    authProvider: "clerk" | "auth0" | "firebase" | "custom";
    name?: string | null | undefined;
    authSubject?: string | null | undefined;
    passwordHash?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    email: string;
    authProvider: "clerk" | "auth0" | "firebase" | "custom";
    name?: string | null | undefined;
    authSubject?: string | null | undefined;
    passwordHash?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    email: string;
    authProvider: "clerk" | "auth0" | "firebase" | "custom";
    name?: string | null | undefined;
    authSubject?: string | null | undefined;
    passwordHash?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        email: string;
        authProvider: "clerk" | "auth0" | "firebase" | "custom";
        name?: string | null | undefined;
        authSubject?: string | null | undefined;
        passwordHash?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        email: string;
        authProvider: "clerk" | "auth0" | "firebase" | "custom";
        name?: string | null | undefined;
        authSubject?: string | null | undefined;
        passwordHash?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    email: string;
    authProvider: "clerk" | "auth0" | "firebase" | "custom";
    name?: string | null | undefined;
    authSubject?: string | null | undefined;
    passwordHash?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type User = InferSchemaType<typeof UserSchema>;
declare const MembershipSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    role: "owner" | "admin" | "editor" | "viewer";
    orgId: any;
    userId: any;
    invitedByUserId?: any;
    expiresAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    role: "owner" | "admin" | "editor" | "viewer";
    orgId: any;
    userId: any;
    invitedByUserId?: any;
    expiresAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    role: "owner" | "admin" | "editor" | "viewer";
    orgId: any;
    userId: any;
    invitedByUserId?: any;
    expiresAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        role: "owner" | "admin" | "editor" | "viewer";
        orgId: any;
        userId: any;
        invitedByUserId?: any;
        expiresAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        role: "owner" | "admin" | "editor" | "viewer";
        orgId: any;
        userId: any;
        invitedByUserId?: any;
        expiresAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    role: "owner" | "admin" | "editor" | "viewer";
    orgId: any;
    userId: any;
    invitedByUserId?: any;
    expiresAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type Membership = InferSchemaType<typeof MembershipSchema>;
declare const RopaRecordSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    status: "inactive" | "active";
    orgId: any;
    source: "manual" | "template";
    purpose: string;
    dataSubjects: string[];
    personalDataCategories: string[];
    lawfulBasis: "consent" | "contract" | "legal_obligation" | "vital_interests" | "public_task" | "legitimate_interests";
    recipients: string[];
    processors: Types.DocumentArray<{
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }> & {
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }>;
    security: {
        accessControls: any;
        encryptionAtRest: any;
        encryptionInTransit: any;
        backups: any;
        notes?: string | null | undefined;
    };
    templateId?: string | null | undefined;
    specialCategoryData?: any;
    lawfulBasisNotes?: string | null | undefined;
    internationalTransfers?: any;
    retention?: any;
    lastReviewedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    name: string;
    status: "inactive" | "active";
    orgId: any;
    source: "manual" | "template";
    purpose: string;
    dataSubjects: string[];
    personalDataCategories: string[];
    lawfulBasis: "consent" | "contract" | "legal_obligation" | "vital_interests" | "public_task" | "legitimate_interests";
    recipients: string[];
    processors: Types.DocumentArray<{
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }> & {
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }>;
    security: {
        accessControls: any;
        encryptionAtRest: any;
        encryptionInTransit: any;
        backups: any;
        notes?: string | null | undefined;
    };
    templateId?: string | null | undefined;
    specialCategoryData?: any;
    lawfulBasisNotes?: string | null | undefined;
    internationalTransfers?: any;
    retention?: any;
    lastReviewedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    name: string;
    status: "inactive" | "active";
    orgId: any;
    source: "manual" | "template";
    purpose: string;
    dataSubjects: string[];
    personalDataCategories: string[];
    lawfulBasis: "consent" | "contract" | "legal_obligation" | "vital_interests" | "public_task" | "legitimate_interests";
    recipients: string[];
    processors: Types.DocumentArray<{
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }> & {
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }>;
    security: {
        accessControls: any;
        encryptionAtRest: any;
        encryptionInTransit: any;
        backups: any;
        notes?: string | null | undefined;
    };
    templateId?: string | null | undefined;
    specialCategoryData?: any;
    lawfulBasisNotes?: string | null | undefined;
    internationalTransfers?: any;
    retention?: any;
    lastReviewedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        name: string;
        status: "inactive" | "active";
        orgId: any;
        source: "manual" | "template";
        purpose: string;
        dataSubjects: string[];
        personalDataCategories: string[];
        lawfulBasis: "consent" | "contract" | "legal_obligation" | "vital_interests" | "public_task" | "legitimate_interests";
        recipients: string[];
        processors: Types.DocumentArray<{
            name: string;
            role: "processor" | "subprocessor";
            dpaOnFile: any;
            country?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            name: string;
            role: "processor" | "subprocessor";
            dpaOnFile: any;
            country?: string | null | undefined;
        }> & {
            name: string;
            role: "processor" | "subprocessor";
            dpaOnFile: any;
            country?: string | null | undefined;
        }>;
        security: {
            accessControls: any;
            encryptionAtRest: any;
            encryptionInTransit: any;
            backups: any;
            notes?: string | null | undefined;
        };
        templateId?: string | null | undefined;
        specialCategoryData?: any;
        lawfulBasisNotes?: string | null | undefined;
        internationalTransfers?: any;
        retention?: any;
        lastReviewedAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        name: string;
        status: "inactive" | "active";
        orgId: any;
        source: "manual" | "template";
        purpose: string;
        dataSubjects: string[];
        personalDataCategories: string[];
        lawfulBasis: "consent" | "contract" | "legal_obligation" | "vital_interests" | "public_task" | "legitimate_interests";
        recipients: string[];
        processors: Types.DocumentArray<{
            name: string;
            role: "processor" | "subprocessor";
            dpaOnFile: any;
            country?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            name: string;
            role: "processor" | "subprocessor";
            dpaOnFile: any;
            country?: string | null | undefined;
        }> & {
            name: string;
            role: "processor" | "subprocessor";
            dpaOnFile: any;
            country?: string | null | undefined;
        }>;
        security: {
            accessControls: any;
            encryptionAtRest: any;
            encryptionInTransit: any;
            backups: any;
            notes?: string | null | undefined;
        };
        templateId?: string | null | undefined;
        specialCategoryData?: any;
        lawfulBasisNotes?: string | null | undefined;
        internationalTransfers?: any;
        retention?: any;
        lastReviewedAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    name: string;
    status: "inactive" | "active";
    orgId: any;
    source: "manual" | "template";
    purpose: string;
    dataSubjects: string[];
    personalDataCategories: string[];
    lawfulBasis: "consent" | "contract" | "legal_obligation" | "vital_interests" | "public_task" | "legitimate_interests";
    recipients: string[];
    processors: Types.DocumentArray<{
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }> & {
        name: string;
        role: "processor" | "subprocessor";
        dpaOnFile: any;
        country?: string | null | undefined;
    }>;
    security: {
        accessControls: any;
        encryptionAtRest: any;
        encryptionInTransit: any;
        backups: any;
        notes?: string | null | undefined;
    };
    templateId?: string | null | undefined;
    specialCategoryData?: any;
    lawfulBasisNotes?: string | null | undefined;
    internationalTransfers?: any;
    retention?: any;
    lastReviewedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type RopaRecord = InferSchemaType<typeof RopaRecordSchema>;
declare const DataSubjectRequestSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    orgId: any;
    requestType: "access" | "rectification" | "erasure" | "restriction" | "objection" | "portability";
    receivedAt: NativeDate;
    dueAt: NativeDate;
    subjectRef: {
        scheme: "other" | "customer_id" | "employee_id" | "order_id" | "email_hash";
        value: string;
    };
    channel: "other" | "email" | "phone" | "webform" | "in_person" | "letter";
    responseSent: any;
    summary?: string | null | undefined;
    outcome?: "completed_full" | "completed_partial" | "refused" | "withdrawn" | null | undefined;
    outcomeReason?: string | null | undefined;
    actionsTaken?: any;
    completedAt?: NativeDate | null | undefined;
    responseSentAt?: NativeDate | null | undefined;
    extension?: any;
    identityVerifiedAt?: NativeDate | null | undefined;
    overdueNote?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    orgId: any;
    requestType: "access" | "rectification" | "erasure" | "restriction" | "objection" | "portability";
    receivedAt: NativeDate;
    dueAt: NativeDate;
    subjectRef: {
        scheme: "other" | "customer_id" | "employee_id" | "order_id" | "email_hash";
        value: string;
    };
    channel: "other" | "email" | "phone" | "webform" | "in_person" | "letter";
    responseSent: any;
    summary?: string | null | undefined;
    outcome?: "completed_full" | "completed_partial" | "refused" | "withdrawn" | null | undefined;
    outcomeReason?: string | null | undefined;
    actionsTaken?: any;
    completedAt?: NativeDate | null | undefined;
    responseSentAt?: NativeDate | null | undefined;
    extension?: any;
    identityVerifiedAt?: NativeDate | null | undefined;
    overdueNote?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    orgId: any;
    requestType: "access" | "rectification" | "erasure" | "restriction" | "objection" | "portability";
    receivedAt: NativeDate;
    dueAt: NativeDate;
    subjectRef: {
        scheme: "other" | "customer_id" | "employee_id" | "order_id" | "email_hash";
        value: string;
    };
    channel: "other" | "email" | "phone" | "webform" | "in_person" | "letter";
    responseSent: any;
    summary?: string | null | undefined;
    outcome?: "completed_full" | "completed_partial" | "refused" | "withdrawn" | null | undefined;
    outcomeReason?: string | null | undefined;
    actionsTaken?: any;
    completedAt?: NativeDate | null | undefined;
    responseSentAt?: NativeDate | null | undefined;
    extension?: any;
    identityVerifiedAt?: NativeDate | null | undefined;
    overdueNote?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        orgId: any;
        requestType: "access" | "rectification" | "erasure" | "restriction" | "objection" | "portability";
        receivedAt: NativeDate;
        dueAt: NativeDate;
        subjectRef: {
            scheme: "other" | "customer_id" | "employee_id" | "order_id" | "email_hash";
            value: string;
        };
        channel: "other" | "email" | "phone" | "webform" | "in_person" | "letter";
        responseSent: any;
        summary?: string | null | undefined;
        outcome?: "completed_full" | "completed_partial" | "refused" | "withdrawn" | null | undefined;
        outcomeReason?: string | null | undefined;
        actionsTaken?: any;
        completedAt?: NativeDate | null | undefined;
        responseSentAt?: NativeDate | null | undefined;
        extension?: any;
        identityVerifiedAt?: NativeDate | null | undefined;
        overdueNote?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        orgId: any;
        requestType: "access" | "rectification" | "erasure" | "restriction" | "objection" | "portability";
        receivedAt: NativeDate;
        dueAt: NativeDate;
        subjectRef: {
            scheme: "other" | "customer_id" | "employee_id" | "order_id" | "email_hash";
            value: string;
        };
        channel: "other" | "email" | "phone" | "webform" | "in_person" | "letter";
        responseSent: any;
        summary?: string | null | undefined;
        outcome?: "completed_full" | "completed_partial" | "refused" | "withdrawn" | null | undefined;
        outcomeReason?: string | null | undefined;
        actionsTaken?: any;
        completedAt?: NativeDate | null | undefined;
        responseSentAt?: NativeDate | null | undefined;
        extension?: any;
        identityVerifiedAt?: NativeDate | null | undefined;
        overdueNote?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    orgId: any;
    requestType: "access" | "rectification" | "erasure" | "restriction" | "objection" | "portability";
    receivedAt: NativeDate;
    dueAt: NativeDate;
    subjectRef: {
        scheme: "other" | "customer_id" | "employee_id" | "order_id" | "email_hash";
        value: string;
    };
    channel: "other" | "email" | "phone" | "webform" | "in_person" | "letter";
    responseSent: any;
    summary?: string | null | undefined;
    outcome?: "completed_full" | "completed_partial" | "refused" | "withdrawn" | null | undefined;
    outcomeReason?: string | null | undefined;
    actionsTaken?: any;
    completedAt?: NativeDate | null | undefined;
    responseSentAt?: NativeDate | null | undefined;
    extension?: any;
    identityVerifiedAt?: NativeDate | null | undefined;
    overdueNote?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type DataSubjectRequest = InferSchemaType<typeof DataSubjectRequestSchema>;
declare const IncidentSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "open" | "closed";
    orgId: any;
    discoveredAt: NativeDate;
    title: string;
    riskLevel: "low" | "medium" | "high";
    likelyRiskToIndividuals: any;
    description?: string | null | undefined;
    occurredAt?: NativeDate | null | undefined;
    notification?: any;
    containment?: any;
    closedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    status: "open" | "closed";
    orgId: any;
    discoveredAt: NativeDate;
    title: string;
    riskLevel: "low" | "medium" | "high";
    likelyRiskToIndividuals: any;
    description?: string | null | undefined;
    occurredAt?: NativeDate | null | undefined;
    notification?: any;
    containment?: any;
    closedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    status: "open" | "closed";
    orgId: any;
    discoveredAt: NativeDate;
    title: string;
    riskLevel: "low" | "medium" | "high";
    likelyRiskToIndividuals: any;
    description?: string | null | undefined;
    occurredAt?: NativeDate | null | undefined;
    notification?: any;
    containment?: any;
    closedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        status: "open" | "closed";
        orgId: any;
        discoveredAt: NativeDate;
        title: string;
        riskLevel: "low" | "medium" | "high";
        likelyRiskToIndividuals: any;
        description?: string | null | undefined;
        occurredAt?: NativeDate | null | undefined;
        notification?: any;
        containment?: any;
        closedAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        status: "open" | "closed";
        orgId: any;
        discoveredAt: NativeDate;
        title: string;
        riskLevel: "low" | "medium" | "high";
        likelyRiskToIndividuals: any;
        description?: string | null | undefined;
        occurredAt?: NativeDate | null | undefined;
        notification?: any;
        containment?: any;
        closedAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    status: "open" | "closed";
    orgId: any;
    discoveredAt: NativeDate;
    title: string;
    riskLevel: "low" | "medium" | "high";
    likelyRiskToIndividuals: any;
    description?: string | null | undefined;
    occurredAt?: NativeDate | null | undefined;
    notification?: any;
    containment?: any;
    closedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type Incident = InferSchemaType<typeof IncidentSchema>;
declare const EvidenceDocumentSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "privacy_notice" | "retention_policy" | "dsr_procedure" | "breach_procedure" | "processor_agreement" | "training_record" | "other";
    orgId: any;
    title: string;
    uploadedAt: NativeDate;
    tags: string[];
    notes?: string | null | undefined;
    storage?: any;
    reviewDueAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    type: "privacy_notice" | "retention_policy" | "dsr_procedure" | "breach_procedure" | "processor_agreement" | "training_record" | "other";
    orgId: any;
    title: string;
    uploadedAt: NativeDate;
    tags: string[];
    notes?: string | null | undefined;
    storage?: any;
    reviewDueAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    type: "privacy_notice" | "retention_policy" | "dsr_procedure" | "breach_procedure" | "processor_agreement" | "training_record" | "other";
    orgId: any;
    title: string;
    uploadedAt: NativeDate;
    tags: string[];
    notes?: string | null | undefined;
    storage?: any;
    reviewDueAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        type: "privacy_notice" | "retention_policy" | "dsr_procedure" | "breach_procedure" | "processor_agreement" | "training_record" | "other";
        orgId: any;
        title: string;
        uploadedAt: NativeDate;
        tags: string[];
        notes?: string | null | undefined;
        storage?: any;
        reviewDueAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        type: "privacy_notice" | "retention_policy" | "dsr_procedure" | "breach_procedure" | "processor_agreement" | "training_record" | "other";
        orgId: any;
        title: string;
        uploadedAt: NativeDate;
        tags: string[];
        notes?: string | null | undefined;
        storage?: any;
        reviewDueAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    type: "privacy_notice" | "retention_policy" | "dsr_procedure" | "breach_procedure" | "processor_agreement" | "training_record" | "other";
    orgId: any;
    title: string;
    uploadedAt: NativeDate;
    tags: string[];
    notes?: string | null | undefined;
    storage?: any;
    reviewDueAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type EvidenceDocument = InferSchemaType<typeof EvidenceDocumentSchema>;
declare const AuditPackSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    orgId: any;
    generatedAt: NativeDate;
    generatedByUserId: any;
    versionLabel: string;
    includes?: any;
    artifacts?: any;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    orgId: any;
    generatedAt: NativeDate;
    generatedByUserId: any;
    versionLabel: string;
    includes?: any;
    artifacts?: any;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    orgId: any;
    generatedAt: NativeDate;
    generatedByUserId: any;
    versionLabel: string;
    includes?: any;
    artifacts?: any;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        orgId: any;
        generatedAt: NativeDate;
        generatedByUserId: any;
        versionLabel: string;
        includes?: any;
        artifacts?: any;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        orgId: any;
        generatedAt: NativeDate;
        generatedByUserId: any;
        versionLabel: string;
        includes?: any;
        artifacts?: any;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    orgId: any;
    generatedAt: NativeDate;
    generatedByUserId: any;
    versionLabel: string;
    includes?: any;
    artifacts?: any;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type AuditPack = InferSchemaType<typeof AuditPackSchema>;
declare const AuditEventSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: false;
    versionKey: false;
}, {
    orgId: any;
    actorType: "user" | "system";
    entity: string;
    entityId: any;
    action: string;
    at: NativeDate;
    summary?: string | null | undefined;
    actorUserId?: any;
    diff?: any;
    requestId?: string | null | undefined;
    ip?: string | null | undefined;
    userAgent?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    orgId: any;
    actorType: "user" | "system";
    entity: string;
    entityId: any;
    action: string;
    at: NativeDate;
    summary?: string | null | undefined;
    actorUserId?: any;
    diff?: any;
    requestId?: string | null | undefined;
    ip?: string | null | undefined;
    userAgent?: string | null | undefined;
}, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: false;
    versionKey: false;
}>> & Omit<{
    orgId: any;
    actorType: "user" | "system";
    entity: string;
    entityId: any;
    action: string;
    at: NativeDate;
    summary?: string | null | undefined;
    actorUserId?: any;
    diff?: any;
    requestId?: string | null | undefined;
    ip?: string | null | undefined;
    userAgent?: string | null | undefined;
} & {
    _id: Types.ObjectId;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        orgId: any;
        actorType: "user" | "system";
        entity: string;
        entityId: any;
        action: string;
        at: NativeDate;
        summary?: string | null | undefined;
        actorUserId?: any;
        diff?: any;
        requestId?: string | null | undefined;
        ip?: string | null | undefined;
        userAgent?: string | null | undefined;
    }, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: false;
        versionKey: false;
    }>> & Omit<{
        orgId: any;
        actorType: "user" | "system";
        entity: string;
        entityId: any;
        action: string;
        at: NativeDate;
        summary?: string | null | undefined;
        actorUserId?: any;
        diff?: any;
        requestId?: string | null | undefined;
        ip?: string | null | undefined;
        userAgent?: string | null | undefined;
    } & {
        _id: Types.ObjectId;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    orgId: any;
    actorType: "user" | "system";
    entity: string;
    entityId: any;
    action: string;
    at: NativeDate;
    summary?: string | null | undefined;
    actorUserId?: any;
    diff?: any;
    requestId?: string | null | undefined;
    ip?: string | null | undefined;
    userAgent?: string | null | undefined;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type AuditEvent = InferSchemaType<typeof AuditEventSchema>;
declare const InviteSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    role: "owner" | "admin" | "editor" | "viewer";
    email: string;
    orgId: any;
    invitedByUserId: any;
    expiresAt: NativeDate;
    tokenHash: string;
    usedAt?: NativeDate | null | undefined;
    revokedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    role: "owner" | "admin" | "editor" | "viewer";
    email: string;
    orgId: any;
    invitedByUserId: any;
    expiresAt: NativeDate;
    tokenHash: string;
    usedAt?: NativeDate | null | undefined;
    revokedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    role: "owner" | "admin" | "editor" | "viewer";
    email: string;
    orgId: any;
    invitedByUserId: any;
    expiresAt: NativeDate;
    tokenHash: string;
    usedAt?: NativeDate | null | undefined;
    revokedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        role: "owner" | "admin" | "editor" | "viewer";
        email: string;
        orgId: any;
        invitedByUserId: any;
        expiresAt: NativeDate;
        tokenHash: string;
        usedAt?: NativeDate | null | undefined;
        revokedAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        role: "owner" | "admin" | "editor" | "viewer";
        email: string;
        orgId: any;
        invitedByUserId: any;
        expiresAt: NativeDate;
        tokenHash: string;
        usedAt?: NativeDate | null | undefined;
        revokedAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, import("mongoose").FlattenMaps<{
    role: "owner" | "admin" | "editor" | "viewer";
    email: string;
    orgId: any;
    invitedByUserId: any;
    expiresAt: NativeDate;
    tokenHash: string;
    usedAt?: NativeDate | null | undefined;
    revokedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type Invite = InferSchemaType<typeof InviteSchema>;
export interface GdprModels {
    OrganisationModel: Model<Organisation>;
    UserModel: Model<User>;
    MembershipModel: Model<Membership>;
    RopaRecordModel: Model<RopaRecord>;
    DataSubjectRequestModel: Model<DataSubjectRequest>;
    IncidentModel: Model<Incident>;
    EvidenceDocumentModel: Model<EvidenceDocument>;
    AuditPackModel: Model<AuditPack>;
    AuditEventModel: Model<AuditEvent>;
    InviteModel: Model<Invite>;
}
type MongooseInstance = {
    models: Record<string, Model<unknown>>;
    model: (name: string, schema: Schema) => Model<unknown>;
};
export declare function getModels(mongooseInstance: MongooseInstance): GdprModels;
export {};
//# sourceMappingURL=index.d.ts.map