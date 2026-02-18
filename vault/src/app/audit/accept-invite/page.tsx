import crypto from "crypto";

import { auditPath } from "@/lib/constants";
import { connectToDatabase } from "@/lib/mongoose";
import { InviteModel, OrganisationModel, UserModel } from "@/lib/models";
import shared from "../../shared.module.css";
import styles from "./page.module.css";
import { AcceptInviteForm } from "./AcceptInviteForm";

export const metadata = {
  title: "Accept invite — Vault",
  description: "Set your password to join your organisation vault.",
};

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token?.trim() || "";

  if (!token) {
    return (
      <div className={shared.page}>
        <main id="main-content" className={shared.section}>
          <div className={`${shared.container} ${styles.layout}`}>
            <div className={styles.card}>
              <h1 className={styles.title}>Invalid invite link</h1>
              <p className={styles.body}>Please ask your admin to send a new invite.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  await connectToDatabase();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const invite = await InviteModel.findOne({
    tokenHash,
    usedAt: { $exists: false },
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!invite) {
    return (
      <div className={shared.page}>
        <main id="main-content" className={shared.section}>
          <div className={`${shared.container} ${styles.layout}`}>
            <div className={styles.card}>
              <h1 className={styles.title}>Invite expired or used</h1>
              <p className={styles.body}>This link is no longer valid. Please request a new invite.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const org = await OrganisationModel.findById(invite.orgId).select("name").lean();
  const user = await UserModel.findOne({ email: invite.email }).select("passwordHash").lean();
  const hasPassword = Boolean(user?.passwordHash);

  return (
    <div className={shared.page}>
      <main id="main-content" className={shared.section}>
        <div className={`${shared.container} ${styles.layout}`}>
          <div className={styles.card}>
            <p className={styles.kicker}>You’re invited</p>
            <h1 className={styles.title}>Join {org?.name || "your organisation"}</h1>
            <p className={styles.body}>
              This invite is for <strong>{invite.email}</strong>. Set your password to continue.
            </p>

            {hasPassword ? (
              <div className={styles.notice}>
                <p>Your password is already set. You can sign in now.</p>
                <a className={styles.primaryAction} href={auditPath("/signin")}>
                  Go to sign in
                </a>
              </div>
            ) : (
              <AcceptInviteForm token={token} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
