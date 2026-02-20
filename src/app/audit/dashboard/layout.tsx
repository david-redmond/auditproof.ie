import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canManageUsers } from "@/lib/permissions";
import { DashboardShell } from "./DashboardShell";
import { RefCapture } from "./RefCapture";
import shared from "../../shared.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect(auditPath("/signin"));
  }

  const ctx = await getOrgContext(userId);
  if (!ctx) {
    redirect(auditPath("/signin"));
  }

  const userName = ctx.user.name ?? "";
  const userEmail = ctx.user.email ?? "";
  const organisationName = ctx.organisation.name ?? "My organisation";
  const manageUsers = canManageUsers(ctx.role);

  return (
    <div className={shared.page}>
      <Suspense fallback={null}>
        <RefCapture />
      </Suspense>
      <DashboardShell
        userName={userName}
        userEmail={userEmail}
        organisationName={organisationName}
        canManageUsers={manageUsers}
      >
        {children}
      </DashboardShell>
    </div>
  );
}
