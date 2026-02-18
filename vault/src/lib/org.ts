import type { Types } from "mongoose";
// Organisation from InferSchemaType may not include _id; we cast for populated orgId
import { connectToDatabase } from "@/lib/mongoose";
import {
  OrganisationModel,
  MembershipModel,
  UserModel,
  type Membership,
  type Organisation,
  type User,
} from "@/lib/models";

export type OrgContext = {
  orgId: Types.ObjectId;
  organisation: Organisation;
  user: User;
  role: string;
};

/** Mongoose adds _id at runtime; schema-inferred types don't include it. */
type WithId<T> = T & { _id: Types.ObjectId };

/** Get the current user's organisation (first membership). If none, create a default org and membership. */
export async function getOrgContext(userId: string): Promise<OrgContext | null> {
  await connectToDatabase();
  const user: User | null = await UserModel.findById(userId).lean();
  if (!user) return null;

  const membership: Membership | null = await MembershipModel.findOne({ userId }).sort({ createdAt: 1 }).lean();
  if (membership) {
    const orgId = membership.orgId as Types.ObjectId;
    const org = await OrganisationModel.findById(orgId).lean();
    if (org) {
      return { orgId, organisation: org as Organisation & { _id: Types.ObjectId }, user, role: membership.role };
    }
    // Referenced org missing – create default and reassign this membership to it
    const newOrg = (await OrganisationModel.create({
      name: "My organisation",
      dpo: { status: "not_required", justification: "MVP default" },
    })) as WithId<Organisation>;
    await MembershipModel.updateOne(
      { _id: (membership as WithId<Membership>)._id },
      { orgId: newOrg._id }
    );
    const populated = await OrganisationModel.findById(newOrg._id).lean();
    if (!populated) return null;
    return { orgId: newOrg._id, organisation: populated as Organisation, user, role: membership.role };
  }

  const org = (await OrganisationModel.create({
    name: "My organisation",
    dpo: { status: "not_required", justification: "MVP default" },
  })) as WithId<Organisation>;
  await MembershipModel.create({ orgId: org._id, userId, role: "owner" });
  const populated = await OrganisationModel.findById(org._id).lean();
  if (!populated) return null;
  return { orgId: org._id, organisation: populated as Organisation, user, role: "owner" };
}
