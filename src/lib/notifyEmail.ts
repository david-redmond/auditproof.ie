import { Resend } from "resend";

export type InviteEmailPayload = {
  toEmail: string;
  organisationName: string;
  invitedByName?: string;
  inviteUrl: string;
  expiresAtISO: string;
};

export async function sendInviteEmail(p: InviteEmailPayload): Promise<void> {
  const from = process.env.RESEND_FROM;
  const apiKey = process.env.RESEND_API_KEY;
  if (!from) throw new Error("Missing RESEND_FROM env var");
  if (!apiKey) throw new Error("Missing RESEND_API_KEY env var");

  const resend = new Resend(apiKey);
  const subject = `You’ve been invited to ${p.organisationName} in Vault`;

  const lines = [
    `You’ve been invited to join ${p.organisationName} in Vault.`,
    p.invitedByName ? `Invited by: ${p.invitedByName}` : undefined,
    "",
    `Accept invite: ${p.inviteUrl}`,
    "",
    `This link expires on ${p.expiresAtISO}.`,
    "",
    "If you didn’t expect this, you can ignore this email.",
  ].filter(Boolean) as string[];

  const { data, error } = await resend.emails.send({
    from,
    to: [p.toEmail],
    subject,
    text: lines.join("\n"),
  });

  if (error) {
    console.error("[notifyEmail] Failed to send invite email", {
      to: p.toEmail,
      from,
      subject,
      organisationName: p.organisationName,
      error: error.message,
    });
    throw error;
  }

  console.log("[notifyEmail] Invite email sent successfully", {
    id: data?.id,
    to: p.toEmail,
    from,
    subject,
    organisationName: p.organisationName,
  });
}

export type PartnerNotifyPayload = {
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  website?: string;
  partnerType: string;
  clientCount?: number;
  message?: string;
  createdAtISO: string;
};

export async function notifyPartnerApplicationEmail(
  p: PartnerNotifyPayload
): Promise<void> {
  const to = process.env.PARTNER_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM;
  const apiKey = process.env.RESEND_API_KEY;

  if (!to) throw new Error("Missing PARTNER_NOTIFY_EMAIL env var");
  if (!from) throw new Error("Missing RESEND_FROM env var");
  if (!apiKey) throw new Error("Missing RESEND_API_KEY env var");

  const resend = new Resend(apiKey);
  const subject = `New Partner Application: ${p.companyName} (${p.partnerType})`;

  const lines = [
    "A new partner application has been submitted.",
    "",
    `Name: ${p.fullName}`,
    `Company: ${p.companyName}`,
    `Email: ${p.email}`,
    p.phone ? `Phone: ${p.phone}` : undefined,
    `Partner type: ${p.partnerType}`,
    typeof p.clientCount === "number"
      ? `Approx. SME clients: ${p.clientCount}`
      : undefined,
    p.website ? `Website: ${p.website}` : undefined,
    "",
    p.message ? `Message:\n${p.message}` : "Message: (none)",
    "",
    `Submitted: ${p.createdAtISO}`,
  ].filter(Boolean) as string[];

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text: lines.join("\n"),
  });

  if (error) {
    console.error("[notifyEmail] Failed to send partner notification email", {
      to,
      from,
      subject,
      companyName: p.companyName,
      error: error.message,
    });
    throw error;
  }

  console.log("[notifyEmail] Partner notification email sent successfully", {
    id: data?.id,
    to,
    from,
    subject,
    companyName: p.companyName,
  });
}
