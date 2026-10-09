"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { AdStructureSection } from "@/components/studio/AdStructureSection";
import { ExpectationsSection } from "@/components/studio/ExpectationsSection";
import { PositioningSection } from "@/components/studio/PositioningSection";
import { BackToTop } from "@/components/studio/BackToTop";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

const breadcrumbData = [
  { name: "Home", url: "https://fernum.online" },
  { name: "Ad Structure", url: "https://fernum.online/structure" },
];

export default function StructurePage() {
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbData);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans">
      <JsonLd schema={breadcrumbSchema} />
      <StudioNavbar />

      <main className="py-12 sm:py-16">
        {/* Page Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Creative Architecture</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[var(--page-fg)] tracking-tighter uppercase leading-[0.95] mb-4">
            AD STRUCTURE
          </h1>
          <p className="text-lg sm:text-xl opacity-80 font-normal max-w-2xl leading-relaxed">
            How we think about direct-response ads: 5-segment pacing, clear deliverables, client expectations, and honest brand fit.
          </p>
        </div>

        {/* 1. Full Ad Structure Breakdown with Concept Timeline */}
        <AdStructureSection />

        {/* 2. What We Need From You / What You Get */}
        <ExpectationsSection />

        {/* 3. Who This Is For / Not For */}
        <PositioningSection />

        {/* Bottom CTA to Pricing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                Start with a 30-minute creative strategy call
              </h2>
              <p className="text-xs font-mono opacity-75 mt-1">
                We'll go through your product and ads on the call.
              </p>
            </div>
            <Link
              href="/#pricing"
              className="btn-squish btn-magnetic h-[48px] px-6 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2 shrink-0"
            >
              <span>View Pricing Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <BackToTop />
      <StudioFooter />
    </div>
  );
}
