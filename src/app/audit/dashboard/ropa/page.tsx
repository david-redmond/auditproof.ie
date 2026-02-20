import { redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canEditData } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongoose";
import { RopaRecordModel } from "@/lib/models";
import { RopaRegisterClient, type RopaRecordRow } from "./RopaRegisterClient";
import { RopaTopCtas } from "./RopaTopCtas";
import shared from "../../../shared.module.css";
import listStyles from "../list.module.css";

export const metadata = {
  title: "Your Data Processing Register — Vault",
  description: "RoPA: a simple list of how your business uses personal data.",
};

export default async function RopaListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; basis?: string; international?: string }>;
}) {
  const params = await searchParams;
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const filter: Record<string, unknown> = { orgId: ctx.orgId };
  if (params.status === "active" || params.status === "inactive") filter.status = params.status;
  if (params.basis) filter.lawfulBasis = params.basis;
  if (params.international === "yes") filter["internationalTransfers.occurs"] = true;
  if (params.international === "no") filter["internationalTransfers.occurs"] = false;
  const list = await RopaRecordModel.find(filter)
    .sort({ name: 1 })
    .lean();

  const lawfulBasisLabel: Record<string, string> = {
    consent: "Consent",
    contract: "Contract",
    legal_obligation: "Legal obligation",
    vital_interests: "Vital interests",
    public_task: "Public task",
    legitimate_interests: "Legitimate interests",
  };
  const canEdit = canEditData(ctx.role);

  const initialList: RopaRecordRow[] = list.map((r) => ({
    id: String(r._id),
    name: r.name ?? "",
    purpose: r.purpose ?? "",
    lawfulBasis: r.lawfulBasis ?? "",
    retentionPeriod: r.retention?.period ?? "",
    processorsCount: Array.isArray(r.processors) ? r.processors.length : 0,
    lastReviewedAt: r.lastReviewedAt ? new Date(r.lastReviewedAt).toISOString() : null,
    status: r.status === "inactive" ? "inactive" : "active",
    internationalTransfers: Boolean(r.internationalTransfers?.occurs),
  }));

  return (
    <main id="main-content" className={shared.section}>
      <div className={`${shared.container} ${listStyles.wrap}`}>
        <section className={`${listStyles.panel} ${listStyles.introPanel}`} aria-labelledby="ropa-page-title">
          <div className={listStyles.titleRow}>
            <div className={listStyles.titleCol}>
              <h1 id="ropa-page-title" className={listStyles.title}>Your Data Processing Register</h1>
              <span className={listStyles.titleSecondary}>RoPA (Record of Processing Activities)</span>
              <p className={listStyles.subtitle}>
                A simple list of how your business uses personal data.
              </p>
              <p className={listStyles.subtitleAction}>
                Add one entry for each activity that uses personal data (customers, staff, suppliers).
              </p>
              <details className={listStyles.whyBlock}>
                <summary className={listStyles.whySummary}>Why do I need this?</summary>
                <p className={listStyles.whyText}>
                  Keeping a RoPA helps demonstrate GDPR accountability. Most SMEs only need a clear, up-to-date list of processing activities (e.g. website enquiries, CCTV, payroll).
                </p>
              </details>
            </div>
            <RopaTopCtas recordCount={initialList.length} canEdit={canEdit} />
          </div>
        </section>

        <RopaRegisterClient
          initialList={initialList}
          lawfulBasisLabel={lawfulBasisLabel}
          canEdit={canEdit}
        />
      </div>
    </main>
  );
}
