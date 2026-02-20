import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { connectToDatabase } from "@/lib/mongoose";
import {
  RopaRecordModel,
  DataSubjectRequestModel,
  IncidentModel,
  EvidenceDocumentModel,
} from "@/lib/models";
import { HelpTooltip } from "./HelpTooltip";
import DashboardPageViewTracker from "./DashboardPageViewTracker";
import shared from "../../shared.module.css";
import styles from "./page.module.css";

export const metadata = {
  title: "Dashboard — Vault",
  description: "Vault dashboard.",
};

export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const orgId = ctx.orgId;
  const userName = ctx.user.name?.trim() || "";
  const userEmail = ctx.user.email ?? "";
  // eslint-disable-next-line react-hooks/purity -- server component, one value per request
  const now = Date.now();
  const todayLabel = new Intl.DateTimeFormat("en-IE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(now));

  const [ropaCount, dsrOpenCount, incidentOpenCount, evidenceCount, dsrDueSoon, dsrOverdue] =
    await Promise.all([
      RopaRecordModel.countDocuments({ orgId }),
      DataSubjectRequestModel.countDocuments({ orgId, $or: [{ outcome: null }, { outcome: { $exists: false } }] }),
      IncidentModel.countDocuments({ orgId, status: "open" }),
      EvidenceDocumentModel.countDocuments({ orgId }),
      DataSubjectRequestModel.find({
        orgId,
        $or: [{ outcome: null }, { outcome: { $exists: false } }],
        dueAt: { $gte: new Date(now), $lte: new Date(now + 7 * 24 * 60 * 60 * 1000) },
      })
        .sort({ dueAt: 1 })
        .limit(5)
        .lean(),
      DataSubjectRequestModel.find({
        orgId,
        $or: [{ outcome: null }, { outcome: { $exists: false } }],
        dueAt: { $lt: new Date(now) },
      })
        .sort({ dueAt: 1 })
        .limit(5)
        .lean(),
    ]);

  const policiesCount = evidenceCount; // "Policies: N docs"
  const hasAnyData = ropaCount + dsrOpenCount + incidentOpenCount + evidenceCount > 0;
  const overdueCount = dsrOverdue.length;
  const dueSoonCount = dsrDueSoon.length;
  const statusTone =
    overdueCount > 0
      ? "overdue"
      : dueSoonCount > 0
        ? "soon"
        : "clear";
  const statusCopy =
    overdueCount > 0
      ? "You have requests overdue. Prioritise these first."
      : dueSoonCount > 0
        ? "A few requests are due soon. You’re in good shape, stay ahead."
        : "You’re all caught up. Keep the steady momentum.";

  return (
    <main id="main-content" className={shared.section}>
      <DashboardPageViewTracker />
      <div className={`${shared.container} ${styles.wrap}`}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>ORGANISATION OVERVIEW • {todayLabel}</p>
            <h1 className={styles.title}>
              Welcome back{userName ? `, ${userName}` : ""}
              {!userName && userEmail ? <span className={styles.greetingSecondary}>{userEmail}</span> : null}
              <HelpTooltip text="Your overview: what’s in the vault, what needs attention, and quick actions to keep compliance steady." />
            </h1>
            {userName && userEmail ? <p className={styles.greetingEmail}>Signed in as {userEmail}</p> : null}
            <p className={styles.subTitle}>
              {ctx.organisation?.name || "Your organisation"} • Role: {ctx.role}
            </p>
          </div>
          <div className={`${styles.statusCard} ${styles[`statusCard-${statusTone}`]}`}>
            <p className={styles.statusTitle}>Today’s focus</p>
            <p className={styles.statusBody}>{statusCopy}</p>
          </div>
        </header>

        <div className={styles.statGrid}>
          <section className={styles.statCard} aria-labelledby="stat-ropa">
            <p id="stat-ropa" className={styles.statLabel}>
              RoPA records
            </p>
            <p className={styles.statValue}>{ropaCount}</p>
            <p className={styles.statHint}>Your processing activities</p>
          </section>
          <section className={styles.statCard} aria-labelledby="stat-dsr">
            <p id="stat-dsr" className={styles.statLabel}>
              Open DSRs
            </p>
            <p className={styles.statValue}>{dsrOpenCount}</p>
            <p className={styles.statHint}>Requests awaiting closure</p>
          </section>
          <section className={styles.statCard} aria-labelledby="stat-incidents">
            <p id="stat-incidents" className={styles.statLabel}>
              Open incidents
            </p>
            <p className={styles.statValue}>{incidentOpenCount}</p>
            <p className={styles.statHint}>Active investigations</p>
          </section>
          <section className={styles.statCard} aria-labelledby="stat-policies">
            <p id="stat-policies" className={styles.statLabel}>
              Policies & evidence
            </p>
            <p className={styles.statValue}>{policiesCount}</p>
            <p className={styles.statHint}>Documents on file</p>
          </section>
        </div>

        <div className={styles.cards}>
          <section className={styles.card} aria-labelledby="due-soon-heading">
            <h2 id="due-soon-heading" className={styles.cardTitle}>
              Overdue / due soon
            </h2>
            <ul className={styles.dueList}>
              {dsrOverdue.length === 0 && dsrDueSoon.length === 0 && (
                <li className={styles.dueEmpty}>Nothing overdue or due in the next 7 days.</li>
              )}
              {dsrOverdue.map((dsr) => (
                <li key={String(dsr._id)}>
                  <span className={`${styles.dueBadge} ${styles.dueBadgeOverdue}`}>Overdue</span>
                  <Link href={auditPath(`/dashboard/requests/${dsr._id}`)}>
                    DSR due {dsr.dueAt instanceof Date ? dsr.dueAt.toLocaleDateString() : ""}
                  </Link>
                </li>
              ))}
              {dsrDueSoon.map((dsr) => (
                <li key={String(dsr._id)}>
                  <span className={`${styles.dueBadge} ${styles.dueBadgeSoon}`}>Due in 7 days</span>
                  <Link href={auditPath(`/dashboard/requests/${dsr._id}`)}>
                    DSR due {dsr.dueAt instanceof Date ? dsr.dueAt.toLocaleDateString() : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.quickActionsCard} aria-labelledby="next-actions-heading">
            <h2 id="next-actions-heading" className={styles.cardTitle}>
              Quick actions
            </h2>
            <div className={styles.quickActions}>
              <Link href={auditPath("/dashboard/audit-exports") + "?generate=1"} className={styles.primaryAction}>
                Create audit pack
              </Link>
              <Link href={auditPath("/dashboard/ropa/new")} className={styles.secondaryAction}>
                Add data use
              </Link>
              <Link href={auditPath("/dashboard/requests/new")} className={styles.secondaryAction} aria-label="Log customer request">
                Log customer request
              </Link>
              <Link href={auditPath("/dashboard/incidents/new")} className={styles.secondaryAction}>
                Log a security incident
              </Link>
              <Link href={auditPath("/dashboard/evidence") + "?upload=1"} className={styles.secondaryAction}>
                Upload document
              </Link>
            </div>
            {!hasAnyData && (
              <p className={styles.emptyHint}>
                Start small. Add your first RoPA record and one policy to unlock your audit pack.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
