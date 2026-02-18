# Invitation flow review

## Flow summary

1. **Admin (Settings → Invite user):** Enters email, role, optional membership expiry. Submits.
2. **inviteUser (server action):** Finds or creates User; creates/updates Membership; creates Invite (7-day link); sends email (or shows copyable link on failure).
3. **Invitee:** Opens link → `/audit/accept-invite?token=...` → page validates token, shows “Set password” form if no password yet, or “Go to sign in” if already set.
4. **acceptInvite (server action):** Validates token, sets password, marks invite used. User can then sign in.

## What works

- **New user:** User created with email only → Membership created → Invite created → email/link → accept page → set password → invite marked used. Correct.
- **Token validation:** Invite is looked up by hashed token; `usedAt`, `revokedAt`, `expiresAt` are enforced on both the page and the accept action. Correct.
- **Already has password:** Accept page shows “Your password is already set. Go to sign in.” Correct.
- **Email failure:** `inviteUrl` still returned so admin can copy link; UI shows “Email could not be sent. Copy the link below…”. Correct.
- **Revoke previous invites:** Before creating a new invite, pending invites for same org+email are revoked. Correct.
- **Transaction in acceptInvite:** Password update and invite `usedAt` are done in a single transaction. Correct.
- **Base URL fallback:** `VAULT_BASE_URL` / `NEXT_PUBLIC_BASE_URL` fall back to `http://localhost:3000` so local dev works without env. Correct.

## Issues and improvements

### 1. “User already has access” message (fixed)

When the invited email **already has an account with a password**, the code still **adds them to the org** (creates Membership if missing) and then returns:  
`"User already has access. Ask them to sign in."`  
So the user is added but the message doesn’t say that. This was updated to:  
`"This user already has an account. They’ve been added to the organisation and can sign in."`

### 2. Re-invite with different role (fixed)

If the user is **already a member** (e.g. first invite as viewer, they never set password, admin re-invites as editor), the code created a new invite but **did not update** the existing Membership’s role or expiry. So the new role/expiry on the form were ignored.  
**Change:** When there is an existing membership and we are creating a new invite (user has no password), update that membership’s `role` and `expiresAt` to the new values so the re-invite reflects the chosen role/expiry.

### 3. Invite link base URL in production

If `VAULT_BASE_URL` and `NEXT_PUBLIC_BASE_URL` are **both unset in production**, the invite link uses the fallback `http://localhost:3000`, so links in emails would be wrong.  
**Recommendation:** Document in README/deploy docs that production must set one of these. Optionally: in env validation, when `NODE_ENV === "production"`, require one of them to be set (or warn).

### 4. Optional: Invite expiry from form

The form has an optional “Expiry” (for membership). The **invite link** always expires in 7 days; the **membership** can have a custom expiry. So an auditor with 30-day membership must still use the link within 7 days. This is intentional and acceptable; no change made.

---

## Files touched

- `vault/src/app/audit/dashboard/settings/actions.ts`: clearer “already has access” message; update existing membership role/expires when re-inviting.
