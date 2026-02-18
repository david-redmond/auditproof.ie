/* Re-export shared models (gdpr-models) used by gdpr app. Server-only. */
import { mongoose } from "@/lib/mongoose";
import { getModels, type Membership, type Organisation, type User, type ObjectId } from "gdpr-models";

const M = getModels(mongoose);

export type { Membership, Organisation, User, ObjectId };

export const OrganisationModel = M.OrganisationModel;
export const UserModel = M.UserModel;
export const MembershipModel = M.MembershipModel;
