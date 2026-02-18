import { redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canEditData } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongoose";
import { EvidenceDocumentModel } from "@/lib/models";
import {
  EvidencePageTracker,
  EvidenceHelpDisclosure,
} from "./EvidenceIntro";
import { EvidenceUpload } from "./EvidenceUpload";
import { EvidenceTable } from "./EvidenceTable";
import { EvidenceEmptyState } from "./EvidenceEmptyState";
import { EvidenceComplianceStrip } from "./EvidenceComplianceStrip";
import shared from "../../../shared.module.css";
import listStyles from "../list.module.css";

export const metadata = {
  title: "Policies & supporting documents — Vault",
  description: "Upload and store policies and evidence documents.",
};

const DOC_TYPE_LABELS: Record<string, string> = {
  privacy_notice: "Privacy notice",
  retention_policy: "Retention policy",
  dsr_procedure: "DSR procedure",
  breach_procedure: "Breach procedure",
  processor_agreement: "Processor agreement",
  training_record: "Training record",
  other: "Other",
};

export default async function EvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ upload?: string }>;
}) {
  const params = await searchParams;
  const showUpload = params.upload === "1";
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const list = await EvidenceDocumentModel.find({ orgId: ctx.orgId })
    .sort({ uploadedAt: -1 })
    .lean();

  const serializedList = list.map((doc) => ({
    _id: String(doc._id),
    type: doc.type,
    title: doc.title,
    uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt).toISOString() : null,
    reviewDueAt: doc.reviewDueAt ? new Date(doc.reviewDueAt).toISOString() : null,
    tags: doc.tags ?? [],
    storage: doc.storage ? { key: doc.storage.key } : null,
  }));

  const canEdit = canEditData(ctx.role);

  return (
    <main id="main-content" className={shared.section}>
      <EvidencePageTracker>
        <div className={`${shared.container} ${listStyles.wrap}`}>
          <section
            className={`${listStyles.panel} ${listStyles.introPanel}`}
            aria-labelledby="evidence-page-title"
          >
            <div className={listStyles.titleRow}>
              <div className={listStyles.titleCol}>
                <h1 id="evidence-page-title" className={listStyles.title}>
                  Policies & supporting documents
                </h1>
                <p className={listStyles.subtitle}>
                  Upload the documents that show how you manage personal data.
                </p>
                <p className={listStyles.subtitleAction}>
                  Most SMEs start with a privacy policy and add more over time.
                </p>
                <EvidenceHelpDisclosure />
              </div>
              {canEdit && (
                <div className={listStyles.ctaGroup}>
                  <EvidenceUpload initialOpen={showUpload} />
                </div>
              )}
            </div>
          </section>

          <EvidenceComplianceStrip list={serializedList} />

          {list.length === 0 ? (
            <EvidenceEmptyState canEdit={canEdit} />
          ) : (
            <EvidenceTable list={serializedList} typeLabels={DOC_TYPE_LABELS} canEdit={canEdit} />
          )}
        </div>
      </EvidencePageTracker>
    </main>
  );
}
