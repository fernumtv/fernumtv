import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Video, Calendar, Mail } from "lucide-react";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "404 Page Not Found | Fernum AdPass",
  description:
    "The requested page or video asset could not be located on the Fernum server. Return to our creative studio home or contact support for help.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "404 Page Not Found | Fernum AdPass",
    description:
      "The requested page or video asset could not be located on the Fernum server. Return to our creative studio home or contact support for help.",
    url: "https://fernum.online/404",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://fernum.online/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fernum AdPass Creative Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "404 Page Not Found | Fernum AdPass",
    description:
      "The requested page or video asset could not be located on the Fernum server. Return to our creative studio home or contact support for help.",
    images: ["https://fernum.online/images/og-image.jpg"],
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans flex flex-col justify-between">
      <StudioNavbar />

      {/* Main 404 Card */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full my-auto">
        <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-8 sm:p-14 shadow-brutal-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[var(--accent)] border-2 border-[var(--border)] flex items-center justify-center mx-auto shadow-brutal text-[var(--accent-fg)]">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-xs font-mono font-bold uppercase tracking-widest border border-[var(--border)]">
              <span>404 // FRAME DROPPED</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight uppercase leading-[0.93]">
              LOST IN THE FEED.
            </h1>
            <p className="text-sm sm:text-base opacity-85 font-medium max-w-md mx-auto leading-relaxed">
              The page, concept draft, or intake link you requested doesn't exist or has moved. Let's redirect you back to active creative production.
            </p>
          </div>

          {/* Action Links: Home, Work, Book a Call */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="btn-squish h-[48px] px-6 bg-[var(--accent)] hover:bg-[var(--block-4-bg)] text-[var(--accent-fg)] hover:text-[var(--block-4-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Home Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/work"
              className="btn-squish h-[48px] px-6 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Our Work</span>
            </Link>

            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="book"
              className="btn-squish btn-magnetic h-[48px] px-6 bg-[var(--page-bg)] hover:bg-[var(--border)]/10 text-[var(--page-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[var(--accent)]" />
              <span>Book a Call</span>
            </a>
          </div>

          <div className="pt-2 text-xs font-mono opacity-70">
            Need urgent assistance?{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="underline font-bold text-[var(--accent)] hover:underline"
            >
              Email {siteConfig.contactEmail}
            </a>
          </div>
        </div>
      </main>

      <StudioFooter />
    </div>
  );
}
