"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectToDatabase } from "@/lib/mongoose";
import { EvidenceDocumentModel } from "@/lib/models";
import { DocumentType, auditPath } from "@/lib/constants";
import { getSessionUserId } from "@/lib/auth";
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

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export async function uploadEvidence(formData: FormData) {
  const { orgId, userId, role } = await getCtx();
  if (!canEditData(role)) return { error: "You don't have permission to add or edit data." };
  await connectToDatabase();

  const type = (formData.get("type") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const tagsStr = (formData.get("tags") as string)?.trim();
  const reviewDueStr = (formData.get("reviewDueAt") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim();
  const file = formData.get("file") as File | null;

  if (!type || !title) return { error: "Type and title are required." };

  const tags = tagsStr ? tagsStr.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const reviewDueAt = reviewDueStr ? new Date(reviewDueStr) : undefined;

  let storageKey: string | null = null;
  let contentType: string | undefined;
  let sizeBytes: number | undefined;

  if (file && file.size > 0) {
    const _ext = path.extname(file.name) || "";
    const safeName = `${Date.now()}-${(file.name || "file").replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const relPath = path.join(orgId, safeName);
    const absPath = path.join(UPLOAD_DIR, relPath);
    await mkdir(path.dirname(absPath), { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(absPath, bytes);
    storageKey = relPath;
    contentType = file.type || undefined;
    sizeBytes = bytes.length;
  }

  const doc = await EvidenceDocumentModel.create({
    orgId,
    type: type as (keyof typeof DocumentType),
    title,
    storage: {
      provider: "local",
      key: storageKey ?? `placeholder/${orgId}/${Date.now()}`,
      contentType,
      sizeBytes,
    },
    reviewDueAt,
    notes: notes || undefined,
    tags,
  });
  await logAuditEvent({
    orgId,
    entity: "evidence",
    entityId: doc._id,
    action: "create",
    summary: title,
    actorUserId: userId,
  });

  revalidatePath(auditPath("/dashboard"));
  revalidatePath(auditPath("/dashboard/evidence"));
  redirect(auditPath("/dashboard/evidence"));
}
