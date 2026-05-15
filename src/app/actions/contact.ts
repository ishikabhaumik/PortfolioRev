"use server";

import { Resend } from "resend";

type ContactResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendContactMessage(formData: FormData): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || name.length < 2) {
    return { ok: false, message: "Please share your name." };
  }
  if (!email || !isEmail(email)) {
    return { ok: false, message: "Please enter a valid email." };
  }
  if (!message || message.length < 10) {
    return { ok: false, message: "Tell me a little more about the project." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = process.env.CONTACT_TO_EMAIL ?? "bhaumikiman26@gmail.com";
  const fromAddress = process.env.CONTACT_FROM_EMAIL ?? "Ishika Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY is not set — message stored to logs only.");
    console.info("[contact] new message", { name, email, message });
    return {
      ok: true,
      message: "Message received. I'll be in touch soon.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `New portfolio enquiry — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("[contact] resend error", error);
      return {
        ok: false,
        message: "Couldn't send right now. Email me directly.",
      };
    }

    return { ok: true, message: "Message sent. Speak soon." };
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return {
      ok: false,
      message: "Couldn't send right now. Email me directly.",
    };
  }
}
