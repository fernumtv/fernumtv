import { Resend } from "resend";

/**
 * Resend Email Client
 * Initialize with process.env.RESEND_API_KEY (configured in Vercel or .env)
 */
const apiKey = process.env.RESEND_API_KEY || "re_xxxxxxxxx";

export const resend = new Resend(apiKey);

export interface SendEmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  reply_to?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const from = options.from || process.env.BRIEF_FROM_EMAIL || "onboarding@resend.dev";
  const to = Array.isArray(options.to) ? options.to : [options.to];

  return await resend.emails.send({
    from,
    to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo || options.reply_to,
  });
}
