import React from "react";
import Link from "next/link";
import { PhoneCall, AlertCircle, ArrowRight } from "lucide-react";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Checkout Cancelled | Fernum AdPass",
  description: "Your checkout session was cancelled with zero charges made. Schedule a 30-minute strategy call to discuss custom options for your product ads.",
  alternates: {
    canonical: "https://fernum.online/cancelled",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Checkout Cancelled | Fernum AdPass",
    description: "Your checkout session was cancelled with zero charges made. Schedule a 30-minute strategy call to discuss custom options for your product ads.",
    url: "https://fernum.online/cancelled",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout Cancelled | Fernum AdPass",
    description: "Your checkout session was cancelled with zero charges made. Schedule a 30-minute strategy call to discuss custom options for your product ads.",
    images: ["https://fernum.online/images/og-image.webp"],
  },
};

export default function CancelledPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans flex flex-col justify-between">
      <StudioNavbar />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] rounded-2xl p-8 sm:p-12 shadow-brutal-xl text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-[var(--page-bg)] border-2 border-[var(--border)] rounded-2xl flex items-center justify-center mx-auto shadow-brutal text-[var(--accent)]">
            <AlertCircle className="w-9 h-9" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--page-bg)] border border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider">
              <span>Checkout Cancelled • No Charge Made</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase leading-[0.95]">
              CHECKOUT NOT COMPLETED.
            </h1>
            <p className="text-sm sm:text-base opacity-80 font-medium max-w-lg mx-auto leading-relaxed">
              No payment was processed and your card was not charged. If you have questions about deliverables, formats, or want to review your creative angles before getting started, book a call with our creative direction.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-[52px] px-8 bg-[var(--accent)] hover:bg-[var(--block-4-bg)] text-[var(--accent-fg)] hover:text-[var(--block-4-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Book a {siteConfig.callMinutes}-Min Strategy Call</span>
            </a>

            <Link
              href="/#pricing"
              className="w-full sm:w-auto h-[52px] px-8 bg-[var(--page-bg)] hover:bg-[var(--block-1-bg)] text-[var(--page-fg)] hover:text-[var(--block-1-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2"
            >
              <span>Review Pricing Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Subtext info */}
          <div className="pt-6 border-t-2 border-[var(--border)]/15 text-xs font-mono opacity-75">
            Have custom requirements? Email us directly at{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="font-bold underline hover:text-[var(--accent)]"
            >
              {siteConfig.contactEmail}
            </a>
          </div>
        </div>
      </main>

      <StudioFooter />
    </div>
  );
}
