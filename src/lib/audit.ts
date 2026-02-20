"use server";

import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { AuditEventModel } from "@/lib/models";

/** Append-only audit log for RoPA, DSR, Incident, Evidence. Supports accountability; no legal advice. */
export async function logAuditEvent(params: {
  orgId: Types.ObjectId | string;
  entity: "ropa" | "dsr" | "incident" | "evidence";
  entityId: Types.ObjectId | string;
  action: "create" | "update" | "delete";
  summary?: string;
  actorUserId?: Types.ObjectId | string | null;
}): Promise<void> {
  await connectToDatabase();
  const orgId = typeof params.orgId === "string" ? new Types.ObjectId(params.orgId) : params.orgId;
  const entityId = typeof params.entityId === "string" ? new Types.ObjectId(params.entityId) : params.entityId;
  const actorUserId = params.actorUserId
    ? typeof params.actorUserId === "string"
      ? new Types.ObjectId(params.actorUserId)
      : params.actorUserId
    : undefined;
  await AuditEventModel.create({
    orgId,
    actorUserId: actorUserId ?? undefined,
    actorType: "user",
    entity: params.entity,
    entityId,
    action: params.action,
    at: new Date(),
    summary: params.summary?.slice(0, 2000) ?? undefined,
  });
}
