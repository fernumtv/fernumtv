import { Resend } from "resend";

/**
 * Replace 're_xxxxxxxxx' with your actual Resend API key,
 * or add RESEND_API_KEY=re_xxxxxxxxx to your .env file.
 */
const apiKey = process.env.RESEND_API_KEY || "re_xxxxxxxxx";

const resend = new Resend(apiKey);

async function run() {
  console.log("Sending test email using Resend SDK...");

  if (apiKey === "re_xxxxxxxxx") {
    console.warn("⚠️ Warning: Using placeholder API key 're_xxxxxxxxx'. Please replace with your real Resend API key.");
  }

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "fernumtv@gmail.com",
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });

  if (error) {
    console.error("❌ Resend error:", error);
    process.exit(1);
  }

  console.log("✅ Email sent successfully! Message ID:", data?.id);
}

run();
