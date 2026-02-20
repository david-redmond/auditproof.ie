import { redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canEditData } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongoose";
import { IncidentModel } from "@/lib/models";
import {
  IncidentsPageTracker,
  IncidentsCtaLink,
  IncidentsExamplesDisclosure,
} from "./IncidentsIntro";
import { IncidentsTable } from "./IncidentsTable";
import { IncidentsEmptyState } from "./IncidentsEmptyState";
import shared from "../../../shared.module.css";
import listStyles from "../list.module.css";

export const metadata = {
  title: "Security incidents — Vault",
  description: "Record security incidents and data breaches.",
};

export default async function IncidentsListPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const list = await IncidentModel.find({ orgId: ctx.orgId })
    .sort({ discoveredAt: -1 })
    .lean();

  const serializedList = list.map((i) => ({
    _id: String(i._id),
    discoveredAt: i.discoveredAt ? new Date(i.discoveredAt).toISOString() : null,
    title: i.title,
    riskLevel: i.riskLevel,
    status: i.status,
    notification: i.notification ? { dpcNotified: i.notification.dpcNotified } : null,
  }));
  const canEdit = canEditData(ctx.role);

  return (
    <main id="main-content" className={shared.section}>
      <IncidentsPageTracker>
        <div className={`${shared.container} ${listStyles.wrap}`}>
          <section
            className={`${listStyles.panel} ${listStyles.introPanel}`}
            aria-labelledby="incidents-page-title"
          >
            <div className={listStyles.titleRow}>
              <div className={listStyles.titleCol}>
                <h1 id="incidents-page-title" className={listStyles.title}>
                  Security incidents
                </h1>
                <span className={listStyles.titleSecondary}>
                  Including personal data breaches
                </span>
                <p className={listStyles.subtitle}>
                  Use this to record anything that could affect personal data (lost device, mis-sent email, unauthorised access).
                </p>
                <IncidentsExamplesDisclosure />
              </div>
              {canEdit && <IncidentsCtaLink />}
            </div>
          </section>

          {list.length === 0 ? (
            <IncidentsEmptyState canEdit={canEdit} />
          ) : (
            <IncidentsTable list={serializedList} canEdit={canEdit} />
          )}
        </div>
      </IncidentsPageTracker>
    </main>
  );
}
