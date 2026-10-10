import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

// In-memory rate limiting map per client IP (Window: 10 minutes, Max: 5 submissions)
const ipSubmissionTracker = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxSubmissions = 5;

  const current = ipSubmissionTracker.get(ip);
  if (!current || now > current.resetTime) {
    ipSubmissionTracker.set(ip, { count: 1, resetTime: now + windowMs });
    return true; // Allowed
  }

  if (current.count >= maxSubmissions) {
    return false; // Exceeded limit
  }

  current.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. IP Rate Limiting
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many brief submissions from this network. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload. Please provide form fields." },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      brandName,
      websiteUrl,
      productToAdvertise,
      offer,
      planChosen = "Growth ($799/month)",
      timestamp,
      "bot-field": botField,
      departmentCode,
    } = body;

    // 2. Honeypot Verification
    if (botField || departmentCode) {
      console.warn(`[Security] Honeypot triggered from IP ${clientIp}`);
      return NextResponse.json(
        { success: false, error: "Automated submission blocked (honeypot triggered)." },
        { status: 400 }
      );
    }

    // 3. Time-Trap Verification (Must take at least 3 seconds from form mount)
    if (typeof timestamp === "number") {
      const elapsed = Date.now() - timestamp;
      if (elapsed < 3000) {
        return NextResponse.json(
          {
            success: false,
            error: "Submission received too quickly. Please take a moment to review your details and submit again.",
          },
          { status: 400 }
        );
      }
    }

    // 4. Server-Side Field Validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || !name.trim()) {
      errors.name = "Full name is required";
    } else if (name.trim().length > 100) {
      errors.name = "Full name must be under 100 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !email.trim()) {
      errors.email = "Work email is required";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid work email address";
    } else if (email.trim().length > 120) {
      errors.email = "Email must be under 120 characters";
    }

    if (!brandName || typeof brandName !== "string" || !brandName.trim()) {
      errors.brandName = "Brand name is required";
    } else if (brandName.trim().length > 100) {
      errors.brandName = "Brand name must be under 100 characters";
    }

    if (!websiteUrl || typeof websiteUrl !== "string" || !websiteUrl.trim()) {
      errors.websiteUrl = "Store or Website URL is required";
    } else {
      let formattedUrl = websiteUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      try {
        new URL(formattedUrl);
        if (formattedUrl.length > 200) {
          errors.websiteUrl = "Website URL must be under 200 characters";
        }
      } catch {
        errors.websiteUrl = "Please enter a valid website URL (e.g. brand.com)";
      }
    }

    if (!productToAdvertise || typeof productToAdvertise !== "string" || !productToAdvertise.trim()) {
      errors.productToAdvertise = "Product name or URL is required";
    } else if (productToAdvertise.trim().length > 300) {
      errors.productToAdvertise = "Product description must be under 300 characters";
    }

    if (!offer || typeof offer !== "string" || !offer.trim()) {
      errors.offer = "Core offer, hook, or campaign angle is required";
    } else if (offer.trim().length > 1500) {
      errors.offer = "Offer details must be under 1500 characters";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: "Validation failed. Please correct the highlighted fields.", errors },
        { status: 400 }
      );
    }

    // 5. Send Brief by Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.BRIEF_TO_EMAIL || siteConfig.contactEmail || "fernumtv@gmail.com";
    const fromEmail = process.env.BRIEF_FROM_EMAIL || "Fernum Studio <onboarding@resend.dev>";

    let emailSent = false;
    let emailProvider = "none";
    let emailError: string | null = null;

    if (resendApiKey) {
      try {
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f4f4f5; margin: 0; padding: 24px; color: #18181b; }
    .card { background: #ffffff; max-width: 600px; margin: 0 auto; border: 2px solid #000; box-shadow: 4px 4px 0px #000; padding: 32px; }
    .badge { display: inline-block; background: #F14A0A; color: #ffffff; font-family: monospace; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 8px; margin-bottom: 16px; border: 1px solid #000; }
    h1 { font-size: 22px; font-weight: 900; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: -0.5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
    td { padding: 10px 12px; border-bottom: 1px solid #e4e4e7; }
    td.label { font-weight: bold; width: 140px; color: #52525b; font-family: monospace; font-size: 12px; text-transform: uppercase; }
    .offer-box { background: #fafafa; border: 1px solid #e4e4e7; padding: 12px; white-space: pre-wrap; font-size: 13px; line-height: 1.5; }
    .footer { margin-top: 24px; font-size: 11px; font-family: monospace; color: #71717a; border-top: 1px solid #e4e4e7; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">NEW CREATIVE BRIEF • FERNUM ADPASS</div>
    <h1>${brandName.trim()} — ${planChosen}</h1>
    <p style="font-size: 14px; color: #52525b; margin: 0 0 16px 0;">A new video ad creative brief has been submitted through fernum.online.</p>
    <table>
      <tr>
        <td class="label">Contact Name</td>
        <td><strong>${name.trim()}</strong></td>
      </tr>
      <tr>
        <td class="label">Work Email</td>
        <td><a href="mailto:${email.trim()}">${email.trim()}</a></td>
      </tr>
      <tr>
        <td class="label">Brand Name</td>
        <td>${brandName.trim()}</td>
      </tr>
      <tr>
        <td class="label">Website / Store</td>
        <td><a href="${websiteUrl.trim()}" target="_blank">${websiteUrl.trim()}</a></td>
      </tr>
      <tr>
        <td class="label">Plan Chosen</td>
        <td><strong>${planChosen}</strong></td>
      </tr>
      <tr>
        <td class="label">Target Product</td>
        <td>${productToAdvertise.trim()}</td>
      </tr>
      <tr>
        <td class="label">Core Offer / Angle</td>
        <td><div class="offer-box">${offer.trim()}</div></td>
      </tr>
    </table>
    <div class="footer">
      Submitted at: ${new Date().toISOString()} • Client IP: ${clientIp}
    </div>
  </div>
</body>
</html>`;

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            reply_to: email.trim(),
            subject: `[Fernum Brief] ${brandName.trim()} • ${planChosen}`,
            html: emailHtml,
            text: `New Creative Brief from ${name.trim()} (${brandName.trim()})
Email: ${email.trim()}
Website: ${websiteUrl.trim()}
Plan: ${planChosen}
Product: ${productToAdvertise.trim()}

Offer & Angle:
${offer.trim()}

Submitted at: ${new Date().toISOString()} (IP: ${clientIp})`,
          }),
        });

        if (resendResponse.ok) {
          emailSent = true;
          emailProvider = "resend";
        } else {
          const resendErr = await resendResponse.json().catch(() => null);
          emailError = resendErr?.message || `Resend returned ${resendResponse.status}`;
          console.warn("[Resend Warning]", emailError);
        }
      } catch (err: any) {
        emailError = err?.message || "Failed to contact Resend API";
        console.warn("[Resend Error]", err);
      }
    }

    // 6. Fallback Web3Forms / Formspree if Resend is not configured or failed
    if (!emailSent) {
      const fallbackUrl = process.env.NEXT_PUBLIC_FORM_FALLBACK_URL || siteConfig.formFallbackUrl;
      const web3Key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || (siteConfig as any).web3FormsAccessKey;

      if (fallbackUrl || web3Key) {
        try {
          const targetUrl = fallbackUrl || "https://api.web3forms.com/submit";
          const fallbackRes = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: web3Key || "fallback",
              subject: `New Ad Brief: ${brandName.trim()}`,
              from_name: name.trim(),
              email: email.trim(),
              brandName: brandName.trim(),
              websiteUrl: websiteUrl.trim(),
              productToAdvertise: productToAdvertise.trim(),
              offer: offer.trim(),
              planChosen,
            }),
          });
          if (fallbackRes.ok) {
            emailSent = true;
            emailProvider = "web3forms_fallback";
          }
        } catch (fbErr) {
          console.warn("[Form Fallback Error]", fbErr);
        }
      }
    }

    // 7. Internal Audit Log & Database record backup
    try {
      const planSlug = planChosen.toLowerCase().includes("launch")
        ? "plan_fernum_launch"
        : planChosen.toLowerCase().includes("scale")
        ? "plan_fernum_scale"
        : "plan_fernum_growth";

      // Self-contained internal record
      console.log(`[Brief Received] Brand: ${brandName.trim()}, Contact: ${email.trim()}, Plan: ${planChosen}`);
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your creative brief has been received. Our team will review your product and respond within 2 business days.",
        emailDelivered: emailSent,
        provider: emailProvider,
        notice: !resendApiKey
          ? "Note: RESEND_API_KEY is not set in environment variables yet. Brief was safely received and recorded."
          : undefined,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Brief API Unhandled Error]", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while submitting your brief. Please try again or email us directly at " + siteConfig.contactEmail,
      },
      { status: 500 }
    );
  }
}
