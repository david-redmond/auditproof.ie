import { NextResponse } from "next/server";
import { Resend } from "resend";

const TOPICS = ["Support", "Partner", "Privacy", "Other"] as const;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      topic,
      message,
      website: honeypot,
    } = body as Record<string, unknown>;

    if (typeof honeypot === "string" && honeypot.trim() !== "") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const errors: Record<string, string> = {};
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.name = "Name is required.";
    }
    if (!email || typeof email !== "string") {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!topic || typeof topic !== "string" || !TOPICS.includes(topic as (typeof TOPICS)[number])) {
      errors.topic = "Please select a topic.";
    }
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      errors.message = "Message is required.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const to = process.env.PARTNER_NOTIFY_EMAIL;
    const from = process.env.RESEND_FROM_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;

    if (!to || !from || !apiKey) {
      console.error("[contact] Missing env: PARTNER_NOTIFY_EMAIL, RESEND_FROM_EMAIL, or RESEND_API_KEY");
      return NextResponse.json(
        { ok: false, error: "Contact form is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const companyLine = company && typeof company === "string" && company.trim() ? `Company: ${String(company).trim()}\n` : "";
    const text = [
      `Contact form submission`,
      "",
      `Name: ${String(name).trim()}`,
      `Email: ${String(email).trim()}`,
      companyLine,
      `Topic: ${topic}`,
      "",
      `Message:`,
      String(message).trim(),
    ].filter(Boolean).join("\n");

    const subject = `[Contact Form] ${topic} — ${String(name).trim()}`;

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: String(email).trim(),
      subject,
      text,
    });

    if (error) {
      console.error("[contact] Resend error", { error: error.message });
      return NextResponse.json(
        { ok: false, error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id }, { status: 200 });
  } catch (e) {
    console.error("[contact] Unexpected error", e);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
