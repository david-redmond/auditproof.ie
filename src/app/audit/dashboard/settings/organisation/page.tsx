import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canManageUsers } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongoose";
import { MembershipModel } from "@/lib/models";
import { SettingsToastProvider } from "../SettingsToast";
import { SettingsOrgProfileCard } from "../SettingsOrgProfileCard";
import { SettingsDpoCard } from "../SettingsDpoCard";
import { SettingsAccountabilityCard } from "../SettingsAccountabilityCard";
import { SettingsUsers } from "../SettingsUsers";
import { SettingsDeleteOrganisationCard } from "../SettingsDeleteOrganisationCard";
import shared from "../../../../shared.module.css";
import listStyles from "../../list.module.css";

export const metadata = {
  title: "Organisation settings — Vault",
  description: "Organisation profile, DPO, and user access.",
};

const initialFromOrg = (org: {
  name?: string;
  controllerContact?:
    | { name?: string | null; email?: string | null; phone?: string | null }
    | null;
  dpo?:
    | {
        status?: string | null;
        name?: string | null;
        email?: string | null;
        justification?: string | null;
      }
    | null;
  lastReviewAt?: Date | null;
}) => ({
  name: org.name ?? "",
  contactName: org.controllerContact?.name ?? "",
  contactEmail: org.controllerContact?.email ?? "",
  contactPhone: org.controllerContact?.phone ?? "",
  dpoStatus: org.dpo?.status ?? "not_required",
  dpoName: org.dpo?.name ?? "",
  dpoEmail: org.dpo?.email ?? "",
  dpoJustification: org.dpo?.justification ?? "",
  lastReviewAt: org.lastReviewAt ? new Date(org.lastReviewAt).toISOString().slice(0, 10) : "",
});

export default async function OrganisationSettingsPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const memberships = await MembershipModel.find({ orgId: ctx.orgId })
    .populate("userId", "email name")
    .lean();
  const org = ctx.organisation;
  const manageUsers = canManageUsers(ctx.role);
  const initial = initialFromOrg(org);

  return (
    <main id="main-content" className={shared.section}>
      <SettingsToastProvider>
        <div className={`${shared.container} ${listStyles.wrap}`}>
          <section
            className={`${listStyles.panel} ${listStyles.introPanel}`}
            aria-labelledby="org-page-title"
          >
            <h1 id="org-page-title" className={listStyles.title}>
              Organisation settings
            </h1>
            <p className={listStyles.subtitle}>
              Organisation profile, accountability, and user access.
            </p>
          </section>

          {manageUsers && (
            <>
              <SettingsOrgProfileCard orgId={String(ctx.orgId)} initial={initial} />
              <SettingsDpoCard orgId={String(ctx.orgId)} initial={initial} />
              <SettingsAccountabilityCard orgId={String(ctx.orgId)} initial={initial} />
              <SettingsUsers
                orgId={String(ctx.orgId)}
                currentUserId={userId}
                canManageUsers={manageUsers}
                inviterDisplayName={ctx.user.name || ctx.user.email || undefined}
                memberships={memberships.map((m) => {
                  const u = m.userId as { _id: unknown; email?: string; name?: string } | null;
                  return {
                    userId: String(u?._id ?? m.userId),
                    email: (u?.email ?? "") as string,
                    name: (u?.name ?? "") as string,
                    role: m.role,
                    expiresAt: m.expiresAt ? new Date(m.expiresAt).toISOString().slice(0, 10) : "",
                  };
                })}
              />
              <SettingsDeleteOrganisationCard organisationName={org.name ?? "My organisation"} />
            </>
          )}

          {!manageUsers && (
            <section className={listStyles.panel} aria-labelledby="org-view-only">
              <p id="org-view-only" className={listStyles.subtitle}>
                You can view organisation data but only Owners and Admins can change settings or delete the organisation.
              </p>
            </section>
          )}
        </div>
      </SettingsToastProvider>
    </main>
  );
}
