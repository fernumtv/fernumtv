import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { CalendlyWidget } from "@/components/studio/CalendlyWidget";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Schedule a Strategy Call | Fernum AdPass",
  description: `Book a ${siteConfig.callMinutes}-minute video ad strategy session with Fernum Creative Direction.`,
  alternates: {
    canonical: "https://fernum.online/schedule",
  },
  openGraph: {
    title: "Schedule a Strategy Call | Fernum AdPass",
    description: `Book a ${siteConfig.callMinutes}-minute video ad strategy session with Fernum Creative Direction.`,
    url: "https://fernum.online/schedule",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedule a Strategy Call | Fernum AdPass",
    description: `Book a ${siteConfig.callMinutes}-minute video ad strategy session with Fernum Creative Direction.`,
  },
};

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b-2 border-[var(--border)] bg-[var(--block-2-bg)] text-[var(--block-2-fg)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <span className="font-display font-black text-2xl sm:text-3xl tracking-tight uppercase group-hover:text-[var(--accent)] transition-colors">
              FERNUM
            </span>
            <span className="bg-[var(--accent)] text-[var(--accent-fg)] text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border border-[var(--border)] shadow-sm">
              AdPass
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--page-bg)] hover:bg-[var(--accent)] text-[var(--page-fg)] hover:text-[var(--accent-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Direct Scheduling</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.95] mb-4">
            BOOK A {siteConfig.callMinutes}-MIN STRATEGY CALL
          </h1>

          <p className="text-sm sm:text-base opacity-75 font-medium leading-relaxed">
            Pick a time that fits your calendar. We will review your current ad creative, test angles, and show you how Fernum AdPass scales paid acquisition.
          </p>
        </div>

        {/* Embedded Calendly Widget */}
        <div className="bg-[var(--block-2-bg)] p-3 sm:p-6 border-3 border-[var(--border)] shadow-brutal-xl rounded-2xl">
          <CalendlyWidget height="720px" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono opacity-75">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>No obligations or pushy sales reps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Direct 1-on-1 with creative direction</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[var(--border)] bg-[var(--block-4-bg)] text-[var(--block-4-fg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono opacity-80">
          <div>© {new Date().getFullYear()} Fernum (fernum.online). All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:underline transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline transition-colors">
              Privacy
            </Link>
            <a href={`mailto:${siteConfig.contactEmail}`} className="hover:underline transition-colors">
              {siteConfig.contactEmail}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
