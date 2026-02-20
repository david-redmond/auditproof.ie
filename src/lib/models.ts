/* Re-export shared models. Server-only. */
import { mongoose } from "@/lib/mongoose";
import {
  getModels,
  type AuditPack,
  type Invite,
  type DataSubjectRequest,
  type EvidenceDocument,
  type Incident,
  type Membership,
  type Organisation,
  type RopaRecord,
  type User,
  type ObjectId,
  RequestType,
  RequestOutcome,
  IncidentRiskLevel,
  DocumentType,
  LawfulBasis,
} from "@/lib/gdpr-models";

const M = getModels(mongoose);

export type { AuditPack, Invite, DataSubjectRequest, EvidenceDocument, Incident, Membership, Organisation, RopaRecord, User, ObjectId };
export { RequestType, RequestOutcome, IncidentRiskLevel, DocumentType, LawfulBasis };

export const OrganisationModel = M.OrganisationModel;
export const UserModel = M.UserModel;
export const MembershipModel = M.MembershipModel;
export const RopaRecordModel = M.RopaRecordModel;
export const DataSubjectRequestModel = M.DataSubjectRequestModel;
export const IncidentModel = M.IncidentModel;
export const EvidenceDocumentModel = M.EvidenceDocumentModel;
export const AuditPackModel = M.AuditPackModel;
export const AuditEventModel = M.AuditEventModel;
export const InviteModel = M.InviteModel;
