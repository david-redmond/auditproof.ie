"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongoose";
import { InviteModel, OrganisationModel, UserModel } from "@/lib/models";

export async function acceptInvite(formData: FormData) {
  const token = (formData.get("token") as string) || "";
  const password = (formData.get("password") as string) || "";
  const confirm = (formData.get("confirm") as string) || "";

  if (!token) return { error: "Invalid invite." };
  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const mongoose = await connectToDatabase();
  const session = await mongoose.startSession();
  try {
    let inviteEmail: string | undefined;
    let orgName: string | undefined;

    await session.withTransaction(async () => {
      const invite = await InviteModel.findOne({
        tokenHash,
        usedAt: { $exists: false },
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
      }).session(session);

      if (!invite) {
        throw new Error("INVALID_INVITE");
      }

      inviteEmail = invite.email;
      const user = await UserModel.findOne({ email: invite.email }).session(session);
      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }
      if (user.passwordHash) {
        throw new Error("ALREADY_SET");
      }

      const passwordHash = await bcrypt.hash(password, 12);
      await UserModel.updateOne({ _id: user._id }, { passwordHash }).session(session);
      await InviteModel.updateOne({ _id: invite._id }, { usedAt: new Date() }).session(session);

      const org = await OrganisationModel.findById(invite.orgId).select("name").lean().session(session);
      orgName = org?.name || undefined;
    });

    return { ok: true, email: inviteEmail, orgName };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "UNKNOWN";
    if (msg === "INVALID_INVITE") return { error: "Invite link is invalid or expired." };
    if (msg === "ALREADY_SET") return { error: "Password already set for this account." };
    if (msg === "USER_NOT_FOUND") return { error: "User not found for this invite." };
    return { error: "Unable to accept invite." };
  } finally {
    session.endSession();
  }
}
