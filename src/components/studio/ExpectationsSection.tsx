"use client";

import React from "react";
import { Check, ArrowRight, UploadCloud, Film } from "lucide-react";

export function ExpectationsSection() {
  const brandResponsibilities = [
    {
      title: "Product details and visual assets",
      desc: "High-resolution product photos, store URL, ingredient/material callouts, and any raw customer footage or B-roll you already have.",
    },
    {
      title: "An active promotional offer",
      desc: "A genuine reason for someone to buy: starter discounts, free shipping thresholds, product bundles, or a clear guarantee.",
    },
    {
      title: "Brand guidelines and guardrails",
      desc: "Your preferred tone, forbidden claims, required logos, and any FTC-regulated compliance disclosures your industry requires.",
    },
    {
      title: "Concept approvals within 48 hours",
      desc: "Fast feedback on scripts and cut approvals so production schedules remain on track and turnaround stays predictable.",
    },
  ];

  const fernumDeliverables = [
    {
      title: "3 distinct hook scripts per ad",
      desc: "Every ad concept begins with 3 written hook angles (Problem, Curiosity, Outcome) submitted for your green light before production.",
    },
    {
      title: "Finished Full HD master video files",
      desc: "Crisp, fully sound-designed, color-graded, and subtitled ad exports delivered ready to upload into Meta and TikTok ad managers.",
    },
    {
      title: "3 native aspect ratios (9:16, 1:1, 16:9)",
      desc: "Full framing coverage for TikTok/Reels/Shorts (9:16), Instagram/Facebook Feed (1:1), and Desktop/YouTube (16:9) with zero awkward cropping.",
    },
    {
      title: "2 revision rounds per ad slot",
      desc: "Pacing adjustments, caption tweaks, audio swaps, or cut refinements completed promptly upon receiving your notes.",
    },
  ];

  return (
    <section id="expectations" className="py-24 sm:py-32 bg-[var(--page-bg)] text-[var(--page-fg)] border-t-2 border-[var(--border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Client Partnership</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.95] mb-4">
            WHAT WE NEED FROM YOU / WHAT YOU GET
          </h2>
          <p className="text-[17px] sm:text-lg text-[var(--page-fg)]/80 font-normal leading-relaxed max-w-2xl">
            We work as an efficient production extension of your growth team. Clear inputs yield fast, high-converting ad creative.
          </p>
        </div>

        {/* Two-Column Comparison Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Column 1: What You Provide (Brand) */}
          <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-6 sm:p-10 shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--border)]/15 pb-4 mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[var(--page-bg)] border-2 border-[var(--border)] flex items-center justify-center">
                    <UploadCloud className="w-4 h-4 text-current" />
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase">
                    What You Provide
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold uppercase opacity-70 bg-[var(--page-bg)] text-[var(--page-fg)] px-2.5 py-1 border border-[var(--border)]">
                  Brand Inputs
                </span>
              </div>

              <div className="space-y-6">
                {brandResponsibilities.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-6 h-6 border-2 border-[var(--border)] bg-[var(--page-bg)] text-[var(--page-fg)] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm opacity-75 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)]/15 text-xs font-mono opacity-70">
              Filtering rule: We require active product inventory and clear marketing permission.
            </div>
          </div>

          {/* Column 2: What We Deliver (Fernum) */}
          <div className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] p-6 sm:p-10 shadow-brutal-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--block-4-fg)]/20 pb-4 mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] flex items-center justify-center font-bold">
                    <Film className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase">
                    What We Deliver
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold uppercase text-[var(--border)] bg-[var(--sticker-3)] px-2.5 py-1 border border-[var(--border)]">
                  Studio Output
                </span>
              </div>

              <div className="space-y-6">
                {fernumDeliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-6 h-6 border-2 border-[var(--border)] bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center shrink-0 mt-0.5 font-mono font-black text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm opacity-80 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--block-4-fg)]/20 text-xs font-mono opacity-80 flex items-center justify-between">
              <span>Delivery Time: 2 to 3 weeks based on plan</span>
              <span className="text-[var(--accent)]">✓ Commercial use of delivered ads included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
