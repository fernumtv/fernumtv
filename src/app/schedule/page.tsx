import type { Metadata } from "next";
import { Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { CalendlyWidget } from "@/components/studio/CalendlyWidget";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

const breadcrumbData = [
  { name: "Home", url: "https://fernum.online" },
  { name: "Schedule", url: "https://fernum.online/schedule" },
];

export const metadata: Metadata = {
  title: "Schedule a Strategy Call | Fernum",
  description: "Book a 30-minute creative strategy call with Fernum. Bring your product and current ads for live review of hooks and monthly production options.",
  alternates: {
    canonical: "https://fernum.online/schedule",
  },
  openGraph: {
    title: "Schedule a Strategy Call | Fernum",
    description: "Book a 30-minute creative strategy call with Fernum. Bring your product and current ads for live review of hooks and monthly production options.",
    url: "https://fernum.online/schedule",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.jpg", width: 1200, height: 630, alt: "Fernum AdPass Creative Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedule a Strategy Call | Fernum",
    description: "Book a 30-minute creative strategy call with Fernum. Bring your product and current ads for live review of hooks and monthly production options.",
    images: ["https://fernum.online/images/og-image.jpg"],
  },
};

export default function SchedulePage() {
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbData);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans flex flex-col justify-between">
      <JsonLd schema={breadcrumbSchema} />
      <StudioNavbar />

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

      <StudioFooter />
    </div>
  );
}
