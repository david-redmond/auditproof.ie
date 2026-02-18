"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { RopaRecordModel } from "@/lib/models";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canEditData } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

function getCtx(): Promise<{ orgId: import("mongoose").Types.ObjectId; userId: string; role: string }> {
  return (async () => {
    const userId = await getSessionUserId();
    if (!userId) redirect(auditPath("/signin"));
    const ctx = await getOrgContext(userId);
    if (!ctx) redirect(auditPath("/signin"));
    return { orgId: ctx.orgId, userId, role: ctx.role };
  })();
}

export async function createRopa(formData: FormData) {
  const { orgId, userId, role } = await getCtx();
  if (!canEditData(role)) return { error: "You don't have permission to add or edit data." };
  await connectToDatabase();

  const name = (formData.get("name") as string)?.trim();
  const purpose = (formData.get("purpose") as string)?.trim();
  const lawfulBasis = (formData.get("lawfulBasis") as string)?.trim();
  const retentionPeriod = (formData.get("retentionPeriod") as string)?.trim();
  if (!name || !purpose || !lawfulBasis || !retentionPeriod) {
    return { error: "Name, purpose, lawful basis and retention period are required." };
  }
  const retentionRationaleCreate = (formData.get("retentionRationale") as string)?.trim() || undefined;
  if (retentionPeriod.toLowerCase() === "other" && !retentionRationaleCreate) {
    return { error: "When retention is 'Other', a short retention note is required." };
  }

  const dataSubjects = (formData.get("dataSubjects") as string)?.trim()
    ? (formData.get("dataSubjects") as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const personalDataCategories = (formData.get("personalDataCategories") as string)?.trim()
    ? (formData.get("personalDataCategories") as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const lawfulBasisNotes = (formData.get("lawfulBasisNotes") as string)?.trim() || undefined;
  const lastReviewedAtStrCreate = (formData.get("lastReviewedAt") as string)?.trim();
  const recipientsCreate = (formData.get("recipients") as string)?.trim()
    ? (formData.get("recipients") as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const internationalOccurs = formData.get("internationalOccurs") === "on";
  const internationalCountries = (formData.get("internationalCountries") as string)?.trim()
    ? (formData.get("internationalCountries") as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const internationalSafeguards = (formData.get("internationalSafeguards") as string)?.trim() || undefined;
  const processorsJson = (formData.get("processors") as string)?.trim();
  let processors: { name: string; country?: string; dpaOnFile: boolean }[] = [];
  if (processorsJson) {
    try {
      processors = JSON.parse(processorsJson);
    } catch {
      processors = [];
    }
  }
  const securityAccessControls = formData.get("securityAccessControls") === "on";
  const securityEncryptionAtRest = formData.get("securityEncryptionAtRest") === "on";
  const securityEncryptionInTransit = formData.get("securityEncryptionInTransit") === "on";
  const securityBackups = formData.get("securityBackups") === "on";
  const securityNotes = (formData.get("securityNotes") as string)?.trim() || undefined;
  const status = (formData.get("status") as string) === "inactive" ? "inactive" : "active";

  const doc = await RopaRecordModel.create({
    orgId,
    source: "manual",
    name,
    purpose,
    dataSubjects,
    personalDataCategories,
    lawfulBasis,
    lawfulBasisNotes,
    retention: { period: retentionPeriod, rationale: retentionRationaleCreate },
    lastReviewedAt: lastReviewedAtStrCreate ? new Date(lastReviewedAtStrCreate) : undefined,
    recipients: recipientsCreate,
    internationalTransfers: {
      occurs: internationalOccurs,
      countries: internationalCountries,
      safeguards: internationalSafeguards,
    },
    processors,
    security: {
      accessControls: securityAccessControls,
      encryptionAtRest: securityEncryptionAtRest,
      encryptionInTransit: securityEncryptionInTransit,
      backups: securityBackups,
      notes: securityNotes,
    },
    status,
  });
  await logAuditEvent({
    orgId,
    entity: "ropa",
    entityId: doc._id,
    action: "create",
    summary: name,
    actorUserId: userId,
  });

  revalidatePath(auditPath("/dashboard"));
  revalidatePath(auditPath("/dashboard/ropa"));
  redirect(auditPath("/dashboard/ropa"));
}

export async function updateRopa(id: string, formData: FormData) {
  const { orgId, userId, role } = await getCtx();
  if (!canEditData(role)) return { error: "You don't have permission to add or edit data." };
  await connectToDatabase();

  const name = (formData.get("name") as string)?.trim();
  const purpose = (formData.get("purpose") as string)?.trim();
  const lawfulBasis = (formData.get("lawfulBasis") as string)?.trim();
  const retentionPeriod = (formData.get("retentionPeriod") as string)?.trim();
  if (!name || !purpose || !lawfulBasis || !retentionPeriod) {
    return { error: "Name, purpose, lawful basis and retention period are required." };
  }
  const retentionRationaleVal = (formData.get("retentionRationale") as string)?.trim() || undefined;
  if (retentionPeriod.toLowerCase() === "other" && !retentionRationaleVal) {
    return { error: "When retention is 'Other', a short retention note is required." };
  }

  const dataSubjects = (formData.get("dataSubjects") as string)?.trim()
    ? (formData.get("dataSubjects") as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const personalDataCategories = (formData.get("personalDataCategories") as string)?.trim()
    ? (formData.get("personalDataCategories") as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const lawfulBasisNotes = (formData.get("lawfulBasisNotes") as string)?.trim() || undefined;
  const lastReviewedAtStr = (formData.get("lastReviewedAt") as string)?.trim();
  const recipients = (formData.get("recipients") as string)?.trim()
    ? (formData.get("recipients") as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const internationalOccurs = formData.get("internationalOccurs") === "on";
  const internationalCountries = (formData.get("internationalCountries") as string)?.trim()
    ? (formData.get("internationalCountries") as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const internationalSafeguards = (formData.get("internationalSafeguards") as string)?.trim() || undefined;
  const processorsJson = (formData.get("processors") as string)?.trim();
  let processors: { name: string; country?: string; dpaOnFile: boolean }[] = [];
  if (processorsJson) {
    try {
      processors = JSON.parse(processorsJson);
    } catch {
      processors = [];
    }
  }
  const securityAccessControls = formData.get("securityAccessControls") === "on";
  const securityEncryptionAtRest = formData.get("securityEncryptionAtRest") === "on";
  const securityEncryptionInTransit = formData.get("securityEncryptionInTransit") === "on";
  const securityBackups = formData.get("securityBackups") === "on";
  const securityNotes = (formData.get("securityNotes") as string)?.trim() || undefined;
  const status = (formData.get("status") as string) === "inactive" ? "inactive" : "active";

  const updated = await RopaRecordModel.findOneAndUpdate(
    { _id: id, orgId },
    {
      name,
      purpose,
      dataSubjects,
      personalDataCategories,
      lawfulBasis,
      lawfulBasisNotes,
      retention: { period: retentionPeriod, rationale: retentionRationaleVal },
      lastReviewedAt: lastReviewedAtStr ? new Date(lastReviewedAtStr) : null,
      recipients,
      internationalTransfers: {
        occurs: internationalOccurs,
        countries: internationalCountries,
        safeguards: internationalSafeguards,
      },
      processors,
      security: {
        accessControls: securityAccessControls,
        encryptionAtRest: securityEncryptionAtRest,
        encryptionInTransit: securityEncryptionInTransit,
        backups: securityBackups,
        notes: securityNotes,
      },
      status,
    }
  );
  if (!updated) return { error: "Record not found." };
  await logAuditEvent({
    orgId,
    entity: "ropa",
    entityId: id,
    action: "update",
    summary: name,
    actorUserId: userId,
  });

  revalidatePath(auditPath("/dashboard"));
  revalidatePath(auditPath("/dashboard/ropa"));
  revalidatePath(auditPath(`/dashboard/ropa/${id}`));
  redirect(auditPath("/dashboard/ropa"));
}

export async function deleteRopa(id: string) {
  const { orgId, userId, role } = await getCtx();
  if (!canEditData(role)) return { error: "You don't have permission to delete data." };
  await connectToDatabase();

  const doc = await RopaRecordModel.findOne({ _id: id, orgId }).lean();
  if (!doc) return { error: "Record not found." };

  await RopaRecordModel.deleteOne({ _id: id, orgId });
  await logAuditEvent({
    orgId,
    entity: "ropa",
    entityId: id,
    action: "delete",
    summary: doc.name,
    actorUserId: userId,
  });

  revalidatePath(auditPath("/dashboard"));
  revalidatePath(auditPath("/dashboard/ropa"));
  revalidatePath(auditPath(`/dashboard/ropa/${id}`));
  redirect(auditPath("/dashboard/ropa"));
}

/** Mark a RoPA record (from template) as reviewed by setting lastReviewedAt to now. */
export async function markRopaReviewed(id: string) {
  const { orgId, role } = await getCtx();
  if (!canEditData(role)) return { error: "You don't have permission to edit data." };
  await connectToDatabase();

  const updated = await RopaRecordModel.findOneAndUpdate(
    { _id: id, orgId },
    { lastReviewedAt: new Date() },
    { new: true }
  );
  if (!updated) return { error: "Record not found." };

  revalidatePath(auditPath("/dashboard/ropa"));
  revalidatePath(auditPath(`/dashboard/ropa/${id}`));
  return { success: true };
}
