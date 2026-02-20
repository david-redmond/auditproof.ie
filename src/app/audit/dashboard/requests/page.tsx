import { redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canEditData } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongoose";
import { DataSubjectRequestModel } from "@/lib/models";
import shared from "../../../shared.module.css";
import listStyles from "../list.module.css";
import { RequestsPageClient, type DsrRow } from "./RequestsPageClient";
import { getRequestTypeLabel, OUTCOME_LABELS } from "./labels";

export const metadata = {
  title: "Customer Data Requests — Vault",
  description: "Log and track customer personal data requests (data subject requests).",
};

export { getRequestTypeLabel };

export default async function RequestsListPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const list = await DataSubjectRequestModel.find({ orgId: ctx.orgId })
    .sort({ receivedAt: -1 })
    .lean();

  const canEdit = canEditData(ctx.role);

  const initialList: DsrRow[] = list.map((r) => ({
    id: String(r._id),
    requestType: r.requestType ?? "",
    receivedAtIso: r.receivedAt ? new Date(r.receivedAt).toISOString() : null,
    dueAtIso: r.dueAt ? new Date(r.dueAt).toISOString() : null,
    subjectRefScheme: r.subjectRef?.scheme ?? "",
    subjectRefValue: r.subjectRef?.value ?? "",
    outcome: r.outcome ?? null,
    outcomeLabel: r.outcome ? (OUTCOME_LABELS[r.outcome] ?? r.outcome) : "",
  }));

  return (
    <main id="main-content" className={shared.section}>
      <div className={`${shared.container} ${listStyles.wrap}`}>
        <RequestsPageClient initialList={initialList} canEdit={canEdit} />
      </div>
    </main>
  );
}
