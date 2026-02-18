"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { IncidentModel } from "@/lib/models";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canEditData } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

async function getCtx() {
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));
  return { orgId: String(ctx.orgId), userId, role: ctx.role };
}

export async function createIncident(formData: FormData) {
  const { orgId, userId, role } = await getCtx();
  if (!canEditData(role)) return { error: "You don't have permission to add or edit data." };
  await connectToDatabase();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const discoveredAtStr = (formData.get("discoveredAt") as string)?.trim();
  const occurredAtStr = (formData.get("occurredAt") as string)?.trim();
  const riskLevel = ((formData.get("riskLevel") as string)?.trim()) || "low";
  const likelyRiskToIndividuals = formData.get("likelyRiskToIndividuals") === "on";
  const dpcNotified = formData.get("dpcNotified") === "on";
  const dpcNotifiedAtStr = (formData.get("dpcNotifiedAt") as string)?.trim();
  const individualsNotified = formData.get("individualsNotified") === "on";
  const individualsNotifiedAtStr = (formData.get("individualsNotifiedAt") as string)?.trim();
  const rationaleIfNotNotified = (formData.get("rationaleIfNotNotified") as string)?.trim();
  const stepsStr = (formData.get("containmentSteps") as string)?.trim();
  const steps = stepsStr ? stepsStr.split("\n").map((s) => s.trim()).filter(Boolean) : [];
  const closeIncident = formData.get("closeIncident") === "on";

  if (!title) return { error: "Title is required." };

  const discoveredAt = discoveredAtStr ? new Date(discoveredAtStr) : new Date();
  const occurredAt = occurredAtStr ? new Date(occurredAtStr) : undefined;

  const doc = await IncidentModel.create({
    orgId,
    title,
    description,
    discoveredAt,
    occurredAt,
    riskLevel,
    likelyRiskToIndividuals,
    notification: {
      dpcNotified,
      dpcNotifiedAt: dpcNotifiedAtStr ? new Date(dpcNotifiedAtStr) : undefined,
      individualsNotified,
      individualsNotifiedAt: individualsNotifiedAtStr ? new Date(individualsNotifiedAtStr) : undefined,
      rationaleIfNotNotified: rationaleIfNotNotified || undefined,
    },
    containment: { steps },
    status: closeIncident ? "closed" : "open",
    closedAt: closeIncident ? new Date() : undefined,
  });
  await logAuditEvent({
    orgId,
    entity: "incident",
    entityId: doc._id,
    action: "create",
    summary: title,
    actorUserId: userId,
  });

  revalidatePath(auditPath("/dashboard"));
  revalidatePath(auditPath("/dashboard/incidents"));
  redirect(auditPath("/dashboard/incidents"));
}

export async function updateIncident(id: string, formData: FormData) {
  const { orgId, userId, role } = await getCtx();
  if (!canEditData(role)) return { error: "You don't have permission to add or edit data." };
  await connectToDatabase();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const discoveredAtStr = (formData.get("discoveredAt") as string)?.trim();
  const occurredAtStr = (formData.get("occurredAt") as string)?.trim();
  const riskLevel = ((formData.get("riskLevel") as string)?.trim()) || "low";
  const likelyRiskToIndividuals = formData.get("likelyRiskToIndividuals") === "on";
  const dpcNotified = formData.get("dpcNotified") === "on";
  const dpcNotifiedAtStr = (formData.get("dpcNotifiedAt") as string)?.trim();
  const individualsNotified = formData.get("individualsNotified") === "on";
  const individualsNotifiedAtStr = (formData.get("individualsNotifiedAt") as string)?.trim();
  const rationaleIfNotNotified = (formData.get("rationaleIfNotNotified") as string)?.trim();
  const stepsStr = (formData.get("containmentSteps") as string)?.trim();
  const steps = stepsStr ? stepsStr.split("\n").map((s) => s.trim()).filter(Boolean) : [];
  const closeIncident = formData.get("closeIncident") === "on";

  if (!title) return { error: "Title is required." };

  const discoveredAt = discoveredAtStr ? new Date(discoveredAtStr) : new Date();
  const occurredAt = occurredAtStr ? new Date(occurredAtStr) : undefined;

  const existing = await IncidentModel.findOne({ _id: id, orgId }).lean();
  const wasClosed = existing?.status === "closed";
  const status = closeIncident ? "closed" : existing?.status ?? "open";
  const closedAt = closeIncident ? new Date() : existing?.closedAt;

  const updated = await IncidentModel.findOneAndUpdate(
    { _id: id, orgId },
    {
      title,
      description,
      discoveredAt,
      occurredAt,
      riskLevel,
      likelyRiskToIndividuals,
      notification: {
        dpcNotified,
        dpcNotifiedAt: dpcNotifiedAtStr ? new Date(dpcNotifiedAtStr) : undefined,
        individualsNotified,
        individualsNotifiedAt: individualsNotifiedAtStr ? new Date(individualsNotifiedAtStr) : undefined,
        rationaleIfNotNotified: rationaleIfNotNotified || undefined,
      },
      containment: { steps },
      status,
      closedAt,
    }
  );
  if (!updated) return { error: "Incident not found." };
  await logAuditEvent({
    orgId,
    entity: "incident",
    entityId: id,
    action: "update",
    summary: title,
    actorUserId: userId,
  });

  revalidatePath(auditPath("/dashboard"));
  revalidatePath(auditPath("/dashboard/incidents"));
  revalidatePath(auditPath(`/dashboard/incidents/${id}`));
  redirect(auditPath("/dashboard/incidents"));
}
