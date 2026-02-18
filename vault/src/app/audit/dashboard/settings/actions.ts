"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { unlink } from "fs/promises";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getSessionUserId, clearSession } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { canManageUsers } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongoose";
import {
  InviteModel,
  OrganisationModel,
  MembershipModel,
  UserModel,
  RopaRecordModel,
  DataSubjectRequestModel,
  IncidentModel,
  EvidenceDocumentModel,
  AuditPackModel,
} from "@/lib/models";
import { sendInviteEmail } from "@/lib/notifyEmail";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

async function getCtx() {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("UNAUTHORIZED");
  const ctx = await getOrgContext(userId);
  if (!ctx) throw new Error("UNAUTHORIZED");
  return { orgId: ctx.orgId, userId, role: ctx.role };
}

export async function updateOrganisation(orgId: string, formData: FormData) {
  const { orgId: ctxOrgId, role } = await getCtx();
  if (!canManageUsers(role)) return { error: "You don't have permission to change organisation settings." };
  if (String(ctxOrgId) !== orgId) return { error: "Forbidden" };

  await connectToDatabase();
  const name = (formData.get("name") as string)?.trim();
  const contactName = (formData.get("contactName") as string)?.trim();
  const contactEmail = (formData.get("contactEmail") as string)?.trim();
  const contactPhone = (formData.get("contactPhone") as string)?.trim();
  const dpoStatus = (formData.get("dpoStatus") as string)?.trim() || "not_required";
  const dpoName = (formData.get("dpoName") as string)?.trim();
  const dpoEmail = (formData.get("dpoEmail") as string)?.trim();
  const dpoJustification = (formData.get("dpoJustification") as string)?.trim();
  const lastReviewStr = (formData.get("lastReviewAt") as string)?.trim();

  await OrganisationModel.updateOne(
    { _id: orgId },
    {
      name: name || undefined,
      controllerContact: { name: contactName || undefined, email: contactEmail || undefined, phone: contactPhone || undefined },
      dpo: {
        status: dpoStatus,
        name: dpoName || undefined,
        email: dpoEmail || undefined,
        justification: dpoJustification || undefined,
      },
      lastReviewAt: lastReviewStr ? new Date(lastReviewStr) : undefined,
    }
  );

  revalidatePath(auditPath("/dashboard/settings"));
  revalidatePath(auditPath("/dashboard/settings/account"));
  revalidatePath(auditPath("/dashboard/settings/organisation"));
  return null;
}

export async function inviteUser(orgId: string, formData: FormData) {
  const { orgId: userOrgId, userId: inviterId, role } = await getCtx();
  if (!canManageUsers(role)) return { error: "You don't have permission to invite users." };
  if (String(userOrgId) !== orgId) return { error: "Forbidden" };

  await connectToDatabase();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const inviteRole = (formData.get("role") as string)?.trim() || "viewer";
  const expiresStr = (formData.get("expiresAt") as string)?.trim();

  if (!email) return { error: "Email is required." };

  let userId: import("mongoose").Types.ObjectId;
  const found = await UserModel.findOne({ email }).select("_id passwordHash name").lean();
  if (found) userId = found._id;
  else {
    const created = await UserModel.create({ email, name: email.split("@")[0] });
    userId = created._id;
  }

  const existing = await MembershipModel.findOne({ orgId, userId }).lean();
  const expiresAt = expiresStr ? new Date(expiresStr) : undefined;
  if (!existing) {
    await MembershipModel.create({
      orgId,
      userId,
      role: inviteRole,
      invitedByUserId: inviterId,
      expiresAt,
    });
  } else {
    if (expiresAt !== undefined) {
      await MembershipModel.updateOne({ orgId, userId }, { $set: { role: inviteRole, expiresAt } });
    } else {
      await MembershipModel.updateOne({ orgId, userId }, { $set: { role: inviteRole }, $unset: { expiresAt: 1 } });
    }
  }

  if (found?.passwordHash) {
    return { error: "This user already has an account. They've been added to the organisation and can sign in." };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await InviteModel.updateMany(
    { orgId, email, usedAt: { $exists: false }, revokedAt: { $exists: false } },
    { revokedAt: new Date() }
  );

  const invite = await InviteModel.create({
    orgId,
    email,
    role: inviteRole,
    tokenHash,
    invitedByUserId: inviterId,
    expiresAt: inviteExpiresAt,
  });

  const org = await OrganisationModel.findById(orgId).select("name").lean();
  const inviter = await UserModel.findById(inviterId).select("name email").lean();
  const baseUrl =
    process.env.VAULT_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";
  const base = String(baseUrl).replace(/\/$/, "");
  const inviteUrl = `${base}${auditPath("/accept-invite")}?token=${token}`;

  let emailFailed = false;
  try {
    await sendInviteEmail({
      toEmail: email,
      organisationName: org?.name || "your organisation",
      invitedByName: inviter?.name || inviter?.email || undefined,
      inviteUrl,
      expiresAtISO: inviteExpiresAt.toISOString().slice(0, 10),
    });
  } catch {
    emailFailed = true;
    // Don't revoke: show link in UI so admin can copy and send manually
  }

  revalidatePath(auditPath("/dashboard/settings"));
  revalidatePath(auditPath("/dashboard/settings/account"));
  revalidatePath(auditPath("/dashboard/settings/organisation"));
  return { inviteUrl, emailFailed, invitedEmail: email };
}

export async function updateMemberRole(orgId: string, targetUserId: string, newRole: string) {
  const { orgId: ctxOrgId, role } = await getCtx();
  if (!canManageUsers(role)) return { error: "You don't have permission to change roles." };
  if (String(ctxOrgId) !== orgId) return { error: "Forbidden" };

  const allowedRoles = ["owner", "admin", "editor", "viewer"];
  if (!allowedRoles.includes(newRole)) return { error: "Invalid role." };

  await connectToDatabase();
  const membership = await MembershipModel.findOne({ orgId, userId: targetUserId }).lean();
  if (!membership) return { error: "User not found in this organisation." };

  if (membership.role === "owner") {
    const ownerCount = await MembershipModel.countDocuments({ orgId, role: "owner" });
    if (ownerCount <= 1 && newRole !== "owner") {
      return { error: "You must have at least one Owner. Add another Owner first or transfer ownership." };
    }
  }

  await MembershipModel.updateOne({ orgId, userId: targetUserId }, { $set: { role: newRole } });

  revalidatePath(auditPath("/dashboard/settings"));
  revalidatePath(auditPath("/dashboard/settings/account"));
  revalidatePath(auditPath("/dashboard/settings/organisation"));
  return { ok: true };
}

export async function removeUser(orgId: string, userIdToRemove: string) {
  const { orgId: ctxOrgId, userId: currentUserId, role } = await getCtx();
  if (!canManageUsers(role)) return { error: "You don't have permission to remove users." };
  if (String(ctxOrgId) !== orgId) return { error: "Forbidden" };
  if (userIdToRemove === currentUserId) return { error: "You cannot remove yourself." };

  await connectToDatabase();
  const deleted = await MembershipModel.deleteOne({
    orgId,
    userId: userIdToRemove,
  });
  if (deleted.deletedCount === 0) return { error: "User not found in this organisation." };

  revalidatePath(auditPath("/dashboard/settings"));
  revalidatePath(auditPath("/dashboard/settings/account"));
  revalidatePath(auditPath("/dashboard/settings/organisation"));
  return null;
}

export async function removeUserWithFormData(formData: FormData) {
  const orgId = (formData.get("orgId") as string)?.trim();
  const userIdToRemove = (formData.get("userId") as string)?.trim();
  if (!orgId || !userIdToRemove) return { error: "Missing parameters." };
  return removeUser(orgId, userIdToRemove);
}

export async function updateMemberRoleWithFormData(formData: FormData) {
  const orgId = (formData.get("orgId") as string)?.trim();
  const userId = (formData.get("userId") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  if (!orgId || !userId || !role) return { error: "Missing parameters." };
  return updateMemberRole(orgId, userId, role);
}

export async function setPassword(formData: FormData) {
  const { userId } = await getCtx();

  const password = (formData.get("password") as string) || "";
  const confirm = (formData.get("confirm") as string) || "";

  if (password.length < 8) {
    return { error: "Use at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  await connectToDatabase();
  const user = await UserModel.findById(userId).select("passwordHash").lean();
  if (!user) return { error: "User not found." };
  if (user.passwordHash) return { error: "Password already set." };

  const passwordHash = await bcrypt.hash(password, 12);
  await UserModel.updateOne({ _id: userId }, { passwordHash });

  revalidatePath(auditPath("/dashboard/settings"));
  revalidatePath(auditPath("/dashboard/settings/account"));
  revalidatePath(auditPath("/dashboard/settings/organisation"));
  return { ok: true };
}

export async function changePassword(formData: FormData) {
  const { userId } = await getCtx();

  const currentPassword = (formData.get("currentPassword") as string) || "";
  const newPassword = (formData.get("password") as string) || "";
  const confirm = (formData.get("confirm") as string) || "";

  if (!currentPassword) {
    return { error: "Enter your current password." };
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirm) {
    return { error: "New passwords do not match." };
  }

  await connectToDatabase();
  const user = await UserModel.findById(userId).select("passwordHash").lean();
  if (!user) return { error: "User not found." };
  if (!user.passwordHash) return { error: "You do not have a password set." };

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await UserModel.updateOne({ _id: userId }, { passwordHash });

  revalidatePath(auditPath("/dashboard/settings"));
  revalidatePath(auditPath("/dashboard/settings/account"));
  revalidatePath(auditPath("/dashboard/settings/organisation"));
  return { ok: true };
}

export async function updateProfile(formData: FormData) {
  const { userId } = await getCtx();

  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim().toLowerCase() ?? "";

  if (!email) return { error: "Email is required." };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { error: "Please enter a valid email address." };

  await connectToDatabase();
  const existing = await UserModel.findOne({ email, _id: { $ne: userId } }).lean();
  if (existing) return { error: "That email is already used by another account." };

  await UserModel.updateOne(
    { _id: userId },
    { name: name || undefined, email }
  );

  revalidatePath(auditPath("/dashboard/settings"));
  revalidatePath(auditPath("/dashboard/settings/account"));
  revalidatePath(auditPath("/dashboard/settings/organisation"));
  return { ok: true };
}

/**
 * Delete the current user's account: remove memberships, delete user, clear session.
 * Organisation data is NOT deleted (only owner can delete org via Organisation settings).
 */
export async function deleteAccount(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You are not signed in." };

  const password = (formData.get("password") as string) || "";
  const confirmText = (formData.get("confirmText") as string)?.trim() || "";
  const understood = formData.get("understood") === "on";

  await connectToDatabase();
  const user = await UserModel.findById(userId).select("passwordHash").lean();
  if (!user) return { error: "User not found." };

  if (user.passwordHash) {
    if (!password) return { error: "Enter your password to confirm." };
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return { error: "Password is incorrect." };
  }

  if (confirmText !== "DELETE") return { error: "Type DELETE to confirm." };
  if (!understood) return { error: "Please confirm you understand this cannot be undone." };

  await MembershipModel.deleteMany({ userId });
  await UserModel.deleteOne({ _id: userId });

  await clearSession();
  redirect(auditPath("/signin?deleted=1"));
}

/**
 * Delete organisation and all its data. Owner/Admin only.
 */
export async function deleteOrganisation(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You are not signed in." };
  const ctx = await getOrgContext(userId);
  if (!ctx) return { error: "Unauthorized." };
  if (!canManageUsers(ctx.role)) return { error: "Only Owners and Admins can delete the organisation." };

  const orgId = ctx.orgId;
  const orgNameConfirm = (formData.get("orgNameConfirm") as string)?.trim() || "";
  const confirmText = (formData.get("confirmText") as string)?.trim() || "";
  const understood = formData.get("understood") === "on";

  await connectToDatabase();
  const org = await OrganisationModel.findById(orgId).select("name").lean();
  if (!org) return { error: "Organisation not found." };
  if (orgNameConfirm !== (org.name || "").trim()) {
    return { error: "Organisation name does not match." };
  }
  if (confirmText !== "DELETE") return { error: "Type DELETE to confirm." };
  if (!understood) return { error: "Please confirm you understand this is permanent." };

  const evidenceDocs = await EvidenceDocumentModel.find({ orgId }).select("storage").lean();
  for (const doc of evidenceDocs) {
    const storage = doc.storage as { provider?: string; key?: string } | undefined;
    const key = storage?.key;
    if (key && storage?.provider === "local") {
      try {
        const absPath = path.join(UPLOAD_DIR, key);
        if (path.resolve(absPath).startsWith(path.resolve(UPLOAD_DIR))) {
          await unlink(absPath);
        }
      } catch {
        // ignore missing or permission errors
      }
    }
  }

  await EvidenceDocumentModel.deleteMany({ orgId });
  await RopaRecordModel.deleteMany({ orgId });
  await DataSubjectRequestModel.deleteMany({ orgId });
  await IncidentModel.deleteMany({ orgId });
  await AuditPackModel.deleteMany({ orgId });
  await InviteModel.deleteMany({ orgId });
  await MembershipModel.deleteMany({ orgId });
  await OrganisationModel.deleteOne({ _id: orgId });

  await clearSession();
  redirect(auditPath("/signin?org_deleted=1"));
}
