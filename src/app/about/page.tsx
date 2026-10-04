"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { StudioAbout } from "@/components/studio/StudioAbout";
import { BackToTop } from "@/components/studio/BackToTop";
import { siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans">
      <StudioNavbar />

      <main className="py-12 sm:py-16">
        {/* Page Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Studio Transparency</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[var(--page-fg)] tracking-tighter uppercase leading-[0.95] mb-4">
            ABOUT FERNUM
          </h1>
          <p className="text-lg sm:text-xl opacity-80 font-normal max-w-2xl leading-relaxed">
            Who makes the ads, why we built Fernum, and our transparent AI disclosure policy.
          </p>
        </div>

        {/* Full About Section Component */}
        <StudioAbout />

        {/* Bottom CTA to Booking / Pricing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight">
                Ready to partner with Fernum?
              </h3>
              <p className="text-xs font-mono opacity-75 mt-1">
                30-minute intro call. Bring your product and your current ads.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/#pricing"
                className="btn-squish btn-magnetic h-[48px] px-6 bg-[var(--page-bg)] hover:bg-[var(--block-2-bg)] text-[var(--page-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2"
              >
                <span>View Plans</span>
              </Link>
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-squish btn-magnetic h-[48px] px-6 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2"
              >
                <span>Book a 30-Min Call</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <BackToTop />
      <StudioFooter />
    </div>
  );
}
