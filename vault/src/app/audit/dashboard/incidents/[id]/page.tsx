import { notFound, redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { connectToDatabase } from "@/lib/mongoose";
import { IncidentModel } from "@/lib/models";
import { IncidentForm } from "../IncidentForm";
import shared from "../../../../shared.module.css";
import styles from "../incidentForm.module.css";

export const metadata = { title: "Edit incident — Vault", description: "Edit incident or breach." };

export default async function IncidentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const i = await IncidentModel.findOne({ _id: id, orgId: ctx.orgId }).lean();
  if (!i) notFound();

  const initial = {
    title: i.title,
    description: i.description ?? "",
    occurredAt: i.occurredAt ? new Date(i.occurredAt).toISOString().slice(0, 16) : "",
    discoveredAt: i.discoveredAt ? new Date(i.discoveredAt).toISOString().slice(0, 16) : "",
    riskLevel: i.riskLevel ?? "low",
    likelyRiskToIndividuals: i.likelyRiskToIndividuals ?? false,
    dpcNotified: i.notification?.dpcNotified ?? false,
    dpcNotifiedAt: i.notification?.dpcNotifiedAt ? new Date(i.notification.dpcNotifiedAt).toISOString().slice(0, 16) : "",
    individualsNotified: i.notification?.individualsNotified ?? false,
    individualsNotifiedAt: i.notification?.individualsNotifiedAt ? new Date(i.notification.individualsNotifiedAt).toISOString().slice(0, 16) : "",
    rationaleIfNotNotified: i.notification?.rationaleIfNotNotified ?? "",
    containmentSteps: (i.containment?.steps ?? []).join("\n"),
    status: i.status ?? "open",
  };

  return (
    <main id="main-content" className={shared.section}>
      <div className={shared.container}>
        <div className={styles.wrap}>
          <h1 className={styles.title}>Edit incident</h1>
          <IncidentForm mode="edit" id={id} initial={initial} />
        </div>
      </div>
    </main>
  );
}
