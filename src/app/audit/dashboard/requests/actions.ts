"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { DataSubjectRequestModel } from "@/lib/models";
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

export async function createDsr(formData: FormData) {
  const { orgId, userId, role } = await getCtx();
  if (!canEditData(role)) return { error: "You don't have permission to add or edit data." };
  await connectToDatabase();

  const requestType = (formData.get("requestType") as string)?.trim();
  const receivedAtStr = (formData.get("receivedAt") as string)?.trim();
  const subjectScheme = (formData.get("subjectScheme") as string)?.trim();
  const subjectValue = (formData.get("subjectValue") as string)?.trim();
  const channel = (formData.get("channel") as string)?.trim() || "email";
  const summary = (formData.get("summary") as string)?.trim();

  if (!requestType || !subjectScheme || !subjectValue) {
    return { error: "Request type and subject reference are required." };
  }

  const extensionUsed = formData.get("extensionUsed") === "on";
  const extensionNewDueStr = (formData.get("extensionNewDueAt") as string)?.trim();
  const extensionJustification = (formData.get("extensionJustification") as string)?.trim();
  if (extensionUsed && !extensionNewDueStr) {
    return { error: "When extension is applied, extension date is required." };
  }
  if (extensionUsed && !extensionJustification?.trim()) {
    return { error: "When extension is applied, a brief reason is required." };
  }

  const receivedAt = receivedAtStr ? new Date(receivedAtStr) : new Date();
  const dueAt = new Date(receivedAt);
  dueAt.setDate(dueAt.getDate() + 30);
  let dueAtFinal = dueAt;
  if (extensionUsed && extensionNewDueStr) dueAtFinal = new Date(extensionNewDueStr);

  const extension =
    extensionUsed
      ? { used: true, newDueAt: extensionNewDueStr ? new Date(extensionNewDueStr) : undefined, justification: extensionJustification || undefined }
      : { used: false };

  const doc = await DataSubjectRequestModel.create({
    orgId,
    requestType,
    receivedAt,
    dueAt: dueAtFinal,
    subjectRef: { scheme: subjectScheme, value: subjectValue },
    channel,
    summary,
    extension,
  });
  await logAuditEvent({
    orgId,
    entity: "dsr",
    entityId: doc._id,
    action: "create",
    summary: requestType,
    actorUserId: userId,
  });

  revalidatePath(auditPath("/dashboard"));
  revalidatePath(auditPath("/dashboard/requests"));
  redirect(auditPath("/dashboard/requests"));
}

export async function updateDsr(id: string, formData: FormData) {
  const { orgId, userId, role } = await getCtx();
  if (!canEditData(role)) return { error: "You don't have permission to add or edit data." };
  await connectToDatabase();

  const requestType = (formData.get("requestType") as string)?.trim();
  const receivedAtStr = (formData.get("receivedAt") as string)?.trim();
  const subjectScheme = (formData.get("subjectScheme") as string)?.trim();
  const subjectValue = (formData.get("subjectValue") as string)?.trim();
  const channel = (formData.get("channel") as string)?.trim() || "email";
  const summary = (formData.get("summary") as string)?.trim();
  const outcome = (formData.get("outcome") as string)?.trim() || undefined;
  const outcomeReason = (formData.get("outcomeReason") as string)?.trim() || undefined;
  const completedAtStr = (formData.get("completedAt") as string)?.trim();
  const responseSent = formData.get("responseSent") === "on";
  const responseSentAtStr = (formData.get("responseSentAt") as string)?.trim();
  const extensionUsed = formData.get("extensionUsed") === "on";
  const extensionNewDueStr = (formData.get("extensionNewDueAt") as string)?.trim();
  const extensionJustification = (formData.get("extensionJustification") as string)?.trim();
  const identityVerifiedAtStr = (formData.get("identityVerifiedAt") as string)?.trim();
  const overdueNote = (formData.get("overdueNote") as string)?.trim() || undefined;

  if (!requestType || !subjectScheme || !subjectValue) {
    return { error: "Request type and subject reference are required." };
  }
  if (extensionUsed && !extensionNewDueStr) {
    return { error: "When extension is applied, extension date is required." };
  }
  if (extensionUsed && !extensionJustification?.trim()) {
    return { error: "When extension is applied, a brief reason is required." };
  }

  const receivedAt = receivedAtStr ? new Date(receivedAtStr) : new Date();
  let dueAt = new Date(receivedAt);
  dueAt.setDate(dueAt.getDate() + 30);
  if (extensionUsed && extensionNewDueStr) dueAt = new Date(extensionNewDueStr);

  const extension = extensionUsed
    ? { used: true, newDueAt: extensionNewDueStr ? new Date(extensionNewDueStr) : undefined, justification: extensionJustification || undefined }
    : { used: false };

  const update: Record<string, unknown> = {
    requestType,
    receivedAt,
    dueAt,
    subjectRef: { scheme: subjectScheme, value: subjectValue },
    channel,
    summary,
    outcome,
    outcomeReason,
    responseSent,
    extension,
    overdueNote,
  };
  if (completedAtStr) update.completedAt = new Date(completedAtStr);
  if (responseSentAtStr) update.responseSentAt = new Date(responseSentAtStr);
  update.identityVerifiedAt = identityVerifiedAtStr ? new Date(identityVerifiedAtStr) : null;
  if (outcome) update.outcome = outcome;

  const updated = await DataSubjectRequestModel.findOneAndUpdate(
    { _id: id, orgId },
    update
  );
  if (!updated) return { error: "Request not found." };
  await logAuditEvent({
    orgId,
    entity: "dsr",
    entityId: id,
    action: "update",
    summary: requestType,
    actorUserId: userId,
  });

  revalidatePath(auditPath("/dashboard"));
  revalidatePath(auditPath("/dashboard/requests"));
  revalidatePath(auditPath(`/dashboard/requests/${id}`));
  redirect(auditPath("/dashboard/requests"));
}
