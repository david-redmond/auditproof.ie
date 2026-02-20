import { notFound, redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { connectToDatabase } from "@/lib/mongoose";
import { RopaRecordModel } from "@/lib/models";
import { RopaForm } from "../RopaForm";
import { TemplateReviewBanner } from "../TemplateReviewBanner";
import shared from "../../../../shared.module.css";
import styles from "../ropaForm.module.css";

export const metadata = { title: "Edit RoPA record — Vault", description: "Edit Record of Processing Activities." };

export default async function RopaEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const record = await RopaRecordModel.findOne({ _id: id, orgId: ctx.orgId }).lean();
  if (!record) notFound();

  const initial = {
    name: record.name,
    purpose: record.purpose,
    dataSubjects: record.dataSubjects ?? [],
    personalDataCategories: record.personalDataCategories ?? [],
    lawfulBasis: record.lawfulBasis,
    lawfulBasisNotes: record.lawfulBasisNotes ?? "",
    retentionPeriod: record.retention?.period ?? "",
    retentionRationale: record.retention?.rationale ?? "",
    lastReviewedAt: record.lastReviewedAt ? new Date(record.lastReviewedAt).toISOString().slice(0, 10) : "",
    recipients: record.recipients ?? [],
    internationalOccurs: record.internationalTransfers?.occurs ?? false,
    internationalCountries: record.internationalTransfers?.countries ?? [],
    internationalSafeguards: record.internationalTransfers?.safeguards ?? "",
    processors: (record.processors ?? []).map((p: { name: string; country?: string | null; dpaOnFile?: boolean }) => ({
      name: p.name,
      country: p.country ?? "",
      dpaOnFile: p.dpaOnFile ?? false,
    })),
    securityAccessControls: record.security?.accessControls ?? true,
    securityEncryptionAtRest: record.security?.encryptionAtRest ?? false,
    securityEncryptionInTransit: record.security?.encryptionInTransit ?? true,
    securityBackups: record.security?.backups ?? true,
    securityNotes: record.security?.notes ?? "",
    status: record.status ?? "active",
  };

  const showTemplateBanner =
    (record as { source?: string; lastReviewedAt?: Date | null }).source === "template" &&
    (record as { lastReviewedAt?: Date | null }).lastReviewedAt == null;

  return (
    <main id="main-content" className={shared.section}>
      <div className={shared.container}>
        <div className={styles.wrap}>
          <h1 className={styles.title}>Edit RoPA record</h1>
          {showTemplateBanner && <TemplateReviewBanner recordId={id} />}
          <RopaForm mode="edit" id={id} initial={initial} />
        </div>
      </div>
    </main>
  );
}
