import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canGenerateReports } from "@/lib/permissions";
import { getSubscriptionStatus } from "@/lib/billing";
import { connectToDatabase } from "@/lib/mongoose";
import { AuditPackModel, UserModel } from "@/lib/models";
import {
  AuditExportsPageTracker,
  AuditExportsIntro,
} from "./AuditExportsIntro";
import { AuditExportsSummaryStrip } from "./AuditExportsSummaryStrip";
import { AuditExportsTable } from "./AuditExportsTable";
import { AuditExportsEmptyState } from "./AuditExportsEmptyState";
import shared from "../../../shared.module.css";
import listStyles from "../list.module.css";

export const metadata = {
  title: "Export an audit pack — Vault",
  description: "Create a read-only snapshot of your GDPR records to share with advisors or auditors.",
};

export default async function AuditExportsPage({
  searchParams,
}: {
  searchParams: Promise<{ generate?: string }>;
}) {
  const params = await searchParams;
  const showGenerate = params.generate === "1";
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const list = await AuditPackModel.find({ orgId: ctx.orgId })
    .sort({ generatedAt: -1 })
    .limit(50)
    .lean();

  const userIds = [...new Set(list.map((e) => String(e.generatedByUserId)))];
  const users = await UserModel.find({ _id: { $in: userIds } }).lean();
  const userMap = Object.fromEntries(
    users.map((u) => [String(u._id), u.name || u.email || "Unknown"])
  );
  const allowGenerate = canGenerateReports(ctx.role);
  const subscription = await getSubscriptionStatus(ctx.orgId);
  const hasActiveSubscription = subscription.isActive;

  const latestLabel =
    list.length > 0 && list[0].generatedAt
      ? new Date(list[0].generatedAt).toLocaleDateString(undefined, {
          dateStyle: "medium",
        })
      : null;

  const serializedList = list.map((e) => ({
    _id: String(e._id),
    generatedAt: e.generatedAt ? new Date(e.generatedAt).toISOString() : null,
    generatedByUserId: String(e.generatedByUserId),
    versionLabel: e.versionLabel ?? null,
    includes: e.includes ?? null,
    artifacts: e.artifacts
      ? {
          pdf: e.artifacts.pdf ? { key: e.artifacts.pdf.key } : undefined,
          zip: e.artifacts.zip ? { key: e.artifacts.zip.key } : undefined,
        }
      : null,
  }));

  return (
    <main id="main-content" className={shared.section}>
      <AuditExportsPageTracker>
        <div className={`${shared.container} ${listStyles.wrap}`}>
          <AuditExportsIntro
            showGenerate={showGenerate}
            allowGenerate={allowGenerate}
            hasActiveSubscription={hasActiveSubscription}
            latestLabel={latestLabel}
          />

          <AuditExportsSummaryStrip list={list} />

          {list.length === 0 ? (
            <AuditExportsEmptyState
              allowGenerate={allowGenerate}
              hasActiveSubscription={hasActiveSubscription}
            />
          ) : (
            <AuditExportsTable
              list={serializedList}
              userMap={userMap}
              allowGenerate={allowGenerate}
              hasActiveSubscription={hasActiveSubscription}
            />
          )}
        </div>
      </AuditExportsPageTracker>
    </main>
  );
}
