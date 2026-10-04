import React from "react";
import Link from "next/link";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Refund Policy | Fernum AdPass",
  description: "Refund and cancellation policy for Fernum monthly video ad subscription plans.",
  alternates: {
    canonical: "https://fernum.online/refund",
  },
  openGraph: {
    title: "Refund Policy | Fernum AdPass",
    description: "Refund and cancellation policy for Fernum monthly video ad subscription plans.",
    url: "https://fernum.online/refund",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | Fernum AdPass",
    description: "Refund and cancellation policy for Fernum monthly video ad subscription plans.",
  },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans flex flex-col justify-between">
      <StudioNavbar />

      <main className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <article className="max-w-[70ch] mx-auto bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-8 sm:p-14 shadow-brutal-xl">
          {/* Header */}
          <div className="border-b-2 border-[var(--border)]/15 pb-8 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--page-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal-sm">
              <span>● Refund Policy</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase leading-[0.95] mb-4">
              REFUND POLICY
            </h1>
            <p className="text-xs font-mono font-bold uppercase tracking-wider opacity-60">
              Last updated: {siteConfig.lastUpdated}
            </p>
          </div>

          {/* Intro text */}
          <p className="text-lg sm:text-xl font-medium mb-10 leading-relaxed">
            We want you to be happy with your ads. This is how refunds work.
          </p>

          {/* Body Content: 17px body font, generous spacing, max ~70ch line length */}
          <div className="space-y-10 text-[17px] leading-relaxed opacity-90 font-normal">
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                Before production starts.
              </h2>
              <p>
                If you cancel before your script is approved, we refund the month in full.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                An unusable ad.
              </h2>
              <p>
                If a delivered ad cannot be used because of a technical or quality problem on our side (for example broken video, wrong format, or content that does not match the approved script), we will fix it within 5 business days. If we cannot fix it, we will refund the price of that ad.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                Revisions used up.
              </h2>
              <p>
                If you have used both revisions and still want changes, we can quote extra revisions. Disliking a style that matched the approved script is not a reason for a refund.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                After delivery.
              </h2>
              <p>
                Once an ad has been delivered and is usable, that month&apos;s payment is not refundable.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                Cancelling.
              </h2>
              <p>
                Cancel anytime. Cancellation takes effect at the end of the current billing period. We do not refund a month that has already been delivered. After cancellation you are not charged again.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                How to ask.
              </h2>
              <p>
                Email{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className="underline font-bold text-[var(--accent)] hover:underline">
                  {siteConfig.contactEmail}
                </a>{" "}
                with your order email and what went wrong. We reply within 2 business days.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                Payment processor.
              </h2>
              <p>
                Payments are handled by Dodo Payments. Refunds are returned to your original payment method, and timing depends on your bank.
              </p>
            </section>
          </div>

          {/* Quick Cross-Links */}
          <div className="mt-12 pt-8 border-t-2 border-[var(--border)]/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono font-bold uppercase tracking-wider">
            <Link href="/terms" className="text-[var(--accent)] hover:underline">
              See Terms of Service →
            </Link>
            <Link href="/privacy" className="opacity-70 hover:opacity-100">
              Privacy Policy →
            </Link>
          </div>
        </article>
      </main>

      <StudioFooter />
    </div>
  );
}
