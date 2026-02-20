import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { connectToDatabase } from "@/lib/mongoose";
import { MembershipModel } from "@/lib/models";
import { SettingsToastProvider } from "../SettingsToast";
import { SettingsProfileCard } from "../SettingsProfileCard";
import { SettingsPassword } from "../SettingsPassword";
import { SettingsDeleteAccountCard } from "../SettingsDeleteAccountCard";
import shared from "../../../../shared.module.css";
import listStyles from "../../list.module.css";

export const metadata = {
  title: "My account — Vault",
  description: "Account security and delete account.",
};

export default async function AccountSettingsPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  await connectToDatabase();
  const ownerCount = await MembershipModel.countDocuments({
    orgId: ctx.orgId,
    role: "owner",
  });
  const isSoleOwner = ctx.role === "owner" && ownerCount === 1;
  const hasPassword = Boolean(ctx.user.passwordHash);

  return (
    <main id="main-content" className={shared.section}>
      <SettingsToastProvider>
        <div className={`${shared.container} ${listStyles.wrap}`}>
          <section
            className={`${listStyles.panel} ${listStyles.introPanel}`}
            aria-labelledby="account-page-title"
          >
            <h1 id="account-page-title" className={listStyles.title}>
              My account
            </h1>
            <p className={listStyles.subtitle}>
              Manage your profile, password and account.
            </p>
          </section>

          <SettingsProfileCard
            initialName={ctx.user.name ?? ""}
            initialEmail={ctx.user.email ?? ""}
          />
          <SettingsPassword hasPassword={hasPassword} />

          <SettingsDeleteAccountCard
            hasPassword={hasPassword}
            isSoleOwner={isSoleOwner}
          />
        </div>
      </SettingsToastProvider>
    </main>
  );
}
