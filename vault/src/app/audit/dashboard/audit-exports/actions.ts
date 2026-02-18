"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { AuditPackModel } from "@/lib/models";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canGenerateReports } from "@/lib/permissions";
import { getSubscriptionStatus } from "@/lib/billing";

async function getCtx() {
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));
  return { orgId: ctx.orgId, userId, role: ctx.role };
}

export type GenerateAuditPackState = { error?: "subscription_required" | "forbidden" } | null;

export async function generateAuditPack(
  _prevState: GenerateAuditPackState,
  formData: FormData
): Promise<GenerateAuditPackState> {
  const { orgId, userId, role } = await getCtx();
  if (!canGenerateReports(role)) return { error: "forbidden" };
  const subscription = await getSubscriptionStatus(orgId);
  if (!subscription.isActive) {
    return { error: "subscription_required" };
  }
  await connectToDatabase();
  const includeRopa = formData.get("includeRopa") !== "off";
  const includeDsrs = formData.get("includeDsrs") !== "off";
  const includeIncidents = formData.get("includeIncidents") !== "off";
  const includeEvidenceIndex = formData.get("includeEvidenceIndex") !== "off";
  const includeEvidenceFiles = formData.get("includeEvidenceFiles") !== "off";

  const count = await AuditPackModel.countDocuments({ orgId });
  const versionLabel = `v${new Date().toISOString().slice(0, 10).replace(/-/g, ".")}-${String(count + 1).padStart(3, "0")}`;

  await AuditPackModel.create({
    orgId,
    generatedByUserId: userId,
    includes: {
      ropa: includeRopa,
      dsrs: includeDsrs,
      incidents: includeIncidents,
      evidenceIndex: includeEvidenceIndex,
      evidenceFiles: includeEvidenceFiles,
    },
    versionLabel,
    artifacts: {
      pdf: { provider: "local", key: `audit-${versionLabel}.pdf` },
      zip: includeEvidenceFiles ? { provider: "local", key: `audit-${versionLabel}.zip` } : {},
    },
  });

  revalidatePath(auditPath("/dashboard"));
  revalidatePath(auditPath("/dashboard/audit-exports"));
  redirect(auditPath("/dashboard/audit-exports"));
  return null;
}

export async function deleteAuditPack(id: string) {
  const { orgId, role } = await getCtx();
  if (!canGenerateReports(role)) return { error: "You don't have permission to delete audit packs." };
  await connectToDatabase();

  await AuditPackModel.deleteOne({ _id: id, orgId });

  revalidatePath(auditPath("/dashboard/audit-exports"));
  revalidatePath(auditPath("/dashboard"));
  return { ok: true };
}
