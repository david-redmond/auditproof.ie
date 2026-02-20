import { notFound, redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { connectToDatabase } from "@/lib/mongoose";
import { DataSubjectRequestModel } from "@/lib/models";
import { DsrForm } from "../DsrForm";
import shared from "../../../../shared.module.css";
import styles from "../dsrForm.module.css";

export const metadata = { title: "Edit DSR request — Vault", description: "Edit data subject request." };

export default async function DsrEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const r = await DataSubjectRequestModel.findOne({ _id: id, orgId: ctx.orgId }).lean();
  if (!r) notFound();

  const initial = {
    requestType: r.requestType,
    channel: r.channel ?? "email",
    receivedAt: r.receivedAt ? new Date(r.receivedAt).toISOString().slice(0, 16) : "",
    subjectScheme: r.subjectRef?.scheme ?? "customer_id",
    subjectValue: r.subjectRef?.value ?? "",
    summary: r.summary ?? "",
    outcome: r.outcome ?? "",
    outcomeReason: r.outcomeReason ?? "",
    completedAt: r.completedAt ? new Date(r.completedAt).toISOString().slice(0, 16) : "",
    responseSent: r.responseSent ?? false,
    responseSentAt: r.responseSentAt ? new Date(r.responseSentAt).toISOString().slice(0, 16) : "",
    extensionUsed: r.extension?.used ?? false,
    extensionNewDueAt: r.extension?.newDueAt ? new Date(r.extension.newDueAt).toISOString().slice(0, 16) : "",
    extensionJustification: (r as { extension?: { justification?: string } }).extension?.justification ?? "",
    identityVerifiedAt: (() => {
      const iv = (r as { identityVerifiedAt?: Date }).identityVerifiedAt;
      return iv ? new Date(iv).toISOString().slice(0, 16) : "";
    })(),
    overdueNote: (r as { overdueNote?: string }).overdueNote ?? "",
    dueAt: r.dueAt ? new Date(r.dueAt).toISOString() : "",
  };

  return (
    <main id="main-content" className={shared.section}>
      <div className={shared.container}>
        <div className={styles.wrap}>
          <h1 className={styles.title}>Edit DSR request</h1>
          <DsrForm mode="edit" id={id} initial={initial} />
        </div>
      </div>
    </main>
  );
}
