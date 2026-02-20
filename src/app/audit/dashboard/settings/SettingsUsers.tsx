"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { inviteUser, removeUserWithFormData, updateMemberRoleWithFormData } from "./actions";
import { useSettingsToast } from "./SettingsToast";
import listStyles from "../list.module.css";
import styles from "./settings.module.css";

type MembershipRow = {
  userId: string;
  email: string;
  name: string;
  role: string;
  expiresAt: string;
};

type Props = {
  orgId: string;
  currentUserId: string;
  canManageUsers: boolean;
  inviterDisplayName?: string;
  memberships: MembershipRow[];
};

type InviteState = { error?: string; inviteUrl?: string; emailFailed?: boolean; invitedEmail?: string } | null;

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  owner: "Full control, including billing and user management.",
  admin: "Manage users and organisation settings.",
  editor: "Can create and edit records (RoPA, requests, incidents, evidence).",
  viewer: "Read-only access. Suited for auditors or consultants.",
};

function RemoveUserButton({
  orgId,
  userId,
  userName,
  isOnlyOwner,
}: {
  orgId: string;
  userId: string;
  userName: string;
  isOnlyOwner: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { showToast } = useSettingsToast();
  const [removeState, removeAction] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await removeUserWithFormData(formData);
      if (!result?.error) {
        showToast("User removed");
      }
      return result;
    },
    null
  );

  useEffect(() => {
    if (removeState != null && !removeState.error) {
      queueMicrotask(() => setConfirmOpen(false));
    }
  }, [removeState]);

  useEffect(() => {
    if (!confirmOpen) return;
    const el = modalRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>("button");
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirmOpen(false);
        return;
      }
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    first?.focus();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmOpen]);

  return (
    <>
      {isOnlyOwner ? (
        <span className={styles.muted}>You must have at least one Owner.</span>
      ) : (
        <button
          type="button"
          className={styles.btn}
          onClick={() => setConfirmOpen(true)}
          aria-label={`Remove ${userName || "user"}`}
        >
          Remove
        </button>
      )}
      {confirmOpen && (
        <div
          className={styles.confirmBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-user-dialog-title"
          aria-describedby="remove-user-dialog-desc"
          onClick={(e) => e.target === e.currentTarget && setConfirmOpen(false)}
        >
          <div className={styles.confirmModal} ref={modalRef}>
            <h3 id="remove-user-dialog-title" className={styles.confirmTitle}>
              Remove user?
            </h3>
            <p id="remove-user-dialog-desc" className={styles.confirmBody}>
              This user will lose access immediately.
            </p>
            <form action={removeAction}>
              <input type="hidden" name="orgId" value={orgId} />
              <input type="hidden" name="userId" value={userId} />
              <div className={styles.confirmActions}>
                <button type="button" className={styles.btn} onClick={() => setConfirmOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Remove
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {removeState?.error && !confirmOpen && (
        <span className={styles.error} style={{ marginLeft: "var(--theme-space-2)" }}>
          {removeState.error}
        </span>
      )}
    </>
  );
}

function EditRoleCell({
  orgId,
  userId,
  currentRole,
  isOnlyOwner,
}: {
  orgId: string;
  userId: string;
  currentRole: string;
  isOnlyOwner: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { showToast } = useSettingsToast();
  const [state, formAction] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await updateMemberRoleWithFormData(formData);
      if (result?.ok) showToast("Role updated");
      return result ?? null;
    },
    null as { error?: string; ok?: boolean } | null
  );

  if (isOnlyOwner) {
    return <span className={styles.rolePill}>{ROLE_LABELS[currentRole] ?? currentRole}</span>;
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className={styles.editRoleForm}
    >
      <input type="hidden" name="orgId" value={orgId} />
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        className={styles.select}
        defaultValue={currentRole}
        onChange={() => formRef.current?.requestSubmit()}
        aria-label="Change role"
      >
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>
      {state?.error && (
        <span className={styles.error} role="alert" style={{ display: "block", marginTop: "var(--theme-space-1)" }}>
          {state.error}
        </span>
      )}
    </form>
  );
}

export function SettingsUsers({
  orgId,
  currentUserId,
  canManageUsers,
  inviterDisplayName,
  memberships,
}: Props) {
  const [state, formAction] = useActionState(
    (_prev: InviteState, formData: FormData) => inviteUser(orgId, formData),
    null as InviteState
  );
  const [copied, setCopied] = useState(false);
  const [inviteRole, setInviteRole] = useState("viewer");
  const [inviteKey, setInviteKey] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const { showToast } = useSettingsToast();

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const ownerCount = memberships.filter((m) => m.role === "owner").length;

  useEffect(() => {
    if (state?.inviteUrl) {
      queueMicrotask(() => setInviteKey((k) => k + 1));
      showToast("Invite sent");
    }
  }, [state?.inviteUrl, showToast]);

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function getStatus(m: MembershipRow, now: number) {
    if (!m.expiresAt) return "Active";
    const exp = new Date(m.expiresAt).getTime();
    return exp < now ? "Expired" : "Active";
  }

  return (
    <>
      <section className={`${listStyles.panel} ${listStyles.tablePanel}`} aria-labelledby="users-heading">
        <h2 id="users-heading" className={styles.cardHeading}>
          Users & access
        </h2>
        <p className={styles.cardHelper}>
          Manage who has access to this organisation and their role.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.settingsTable} aria-labelledby="users-heading">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                {canManageUsers && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => {
                const isOnlyOwner = m.role === "owner" && ownerCount === 1;
                const isCurrentUser = m.userId === currentUserId;
                return (
                  <tr key={m.userId}>
                    <td>{m.name || "—"}</td>
                    <td>{m.email}</td>
                    <td>
                      {canManageUsers && !isCurrentUser ? (
                        <EditRoleCell
                          orgId={orgId}
                          userId={m.userId}
                          currentRole={m.role}
                          isOnlyOwner={isOnlyOwner}
                        />
                      ) : (
                        <span className={styles.rolePill}>{ROLE_LABELS[m.role] ?? m.role}</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${
                          getStatus(m, now) === "Expired" ? styles.statusExpired : styles.statusActive
                        }`}
                      >
                        {getStatus(m, now)}
                      </span>
                    </td>
                    {canManageUsers && (
                      <td>
                        {isCurrentUser ? (
                          <span className={styles.muted}>—</span>
                        ) : (
                          <RemoveUserButton
                            orgId={orgId}
                            userId={m.userId}
                            userName={m.name || m.email}
                            isOnlyOwner={isOnlyOwner}
                          />
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {canManageUsers && (
        <section className={listStyles.panel} aria-labelledby="invite-heading">
          <h2 id="invite-heading" className={styles.cardHeading}>
            Invite user
          </h2>
          <p className={styles.cardHelper}>
            Send an invite link by email. The user sets a password and signs in.
            {inviterDisplayName && (
              <> The invite will say &quot;Invited by: {inviterDisplayName}&quot;.</>
            )}
          </p>
          {state?.inviteUrl && (
            <div className={styles.inviteLinkBox} style={{ marginBottom: "var(--theme-space-4)" }}>
              {state.inviteUrl && (
                <p className={styles.inviteSuccess}>
                  Invite sent to{" "}
                  <a href={`mailto:${state.invitedEmail ?? ""}`}>{state.invitedEmail ?? "user"}</a>
                </p>
              )}
              {state.emailFailed && (
                <p className={styles.inviteLinkMessage}>
                  Email could not be sent. Copy the link below and send it to the user.
                </p>
              )}
              <div className={styles.inviteLinkRow}>
                <input
                  type="text"
                  readOnly
                  value={state.inviteUrl}
                  className={styles.inviteLinkInput}
                  aria-label="Invite link"
                />
                <button
                  type="button"
                  onClick={() => copyLink(state.inviteUrl!)}
                  className={`${styles.btn} ${styles.copyBtn}`}
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
              <p className={styles.muted}>Link expires in 7 days.</p>
            </div>
          )}
          <form key={inviteKey} action={formAction}>
            {state?.error && !state?.inviteUrl && (
              <p className={styles.error} role="alert">
                {state.error}
              </p>
            )}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="invite-email">
                Email
              </label>
              <input
                id="invite-email"
                name="email"
                type="email"
                className={styles.input}
                required
                aria-required="true"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="invite-role">
                Role
              </label>
              <select
                id="invite-role"
                name="role"
                className={styles.select}
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <p className={styles.roleDescription} id="invite-role-desc">
                {ROLE_DESCRIPTIONS[inviteRole] ?? ""}
              </p>
            </div>
            {inviteRole === "viewer" && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="invite-expires">
                  Expiry date (optional)
                </label>
                <input
                  id="invite-expires"
                  name="expiresAt"
                  type="date"
                  className={styles.input}
                  aria-describedby="invite-expires-helper"
                />
                <p id="invite-expires-helper" className={styles.cardHelper} style={{ marginTop: "var(--theme-space-1)", marginBottom: 0 }}>
                  Invite auditor/consultant as read-only with expiry.
                </p>
              </div>
            )}
            <div className={styles.actions}>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                Invite
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
