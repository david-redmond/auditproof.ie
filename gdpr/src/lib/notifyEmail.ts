import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  if (!to) throw new Error("Missing PARTNER_NOTIFY_EMAIL env var");
  if (!from) throw new Error("Missing RESEND_FROM env var");
  if (!process.env.RESEND_API_KEY)
    throw new Error("Missing RESEND_API_KEY env var");

  const subject = `New Partner Application: ${p.companyName} (${p.partnerType})`;

  console.log("[notifyEmail] Sending partner notification", {
    to,
    from,
    subject,
    companyName: p.companyName,
  });

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

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      text: lines.join("\n"),
    });

    if (error) {
      console.error("[notifyEmail] Resend API error", {
        message: error.message,
        name: error.name,
        statusCode: (error as { statusCode?: number }).statusCode,
        companyName: p.companyName,
      });
      throw error;
    }

    console.log("[notifyEmail] Partner notification sent", {
      id: data?.id,
      to,
      companyName: p.companyName,
    });
  } catch (err) {
    console.error("[notifyEmail] Failed to send partner notification", {
      to,
      from,
      subject,
      companyName: p.companyName,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err;
  }
}
