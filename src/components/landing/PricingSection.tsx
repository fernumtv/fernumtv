"use client";

import React from "react";
import { Check, Sparkles, PhoneCall, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";

interface PricingSectionProps {
  onSelectPlan: (planSlug: string) => void;
  onOpenBookCall: () => void;
}

export function PricingSection({ onSelectPlan, onOpenBookCall }: PricingSectionProps) {
  const plans = [
    {
      name: "Fernum Sprint",
      slug: "fernum-sprint",
      price: 499,
      perAdPrice: 499,
      adsPerMonth: 1,
      revisions: 2,
      turnaround: "Delivered in ~3 weeks",
      campaignPlanning: false,
      popular: false,
      tagline: "Great for validating new creative angles and hook styles on Meta & TikTok.",
      features: [
        "1 finished high-converting video ad per month",
        "$499 per ad effective price",
        "3 alternate hooks included with the ad",
        "Full HD in 9:16, 1:1, and 16:9 versions",
        "2 revisions included",
        "Delivered in about 3 weeks",
        "Script writing, AI production & human polish",
        "Dynamic kinetic subtitles & sound design",
        "Campaign planning not included",
      ],
      ctaText: "Order Sprint Plan",
    },
    {
      name: "Fernum Growth",
      slug: "fernum-growth",
      price: 799,
      perAdPrice: 400,
      adsPerMonth: 2,
      revisions: 2,
      turnaround: "Delivered in ~2 weeks",
      campaignPlanning: false,
      popular: true,
      tagline: "Our most popular plan for D2C brands scaling ad accounts with regular creative refreshes.",
      features: [
        "2 finished high-converting video ads per month",
        "$400 per ad effective price (Save $198)",
        "3 alternate hooks per ad (6 total hook variants)",
        "Full HD in 9:16, 1:1, and 16:9 versions",
        "2 revisions included per ad",
        "Delivered in about 2 weeks",
        "Script writing, AI production & human polish",
        "Dynamic kinetic subtitles & sound design",
        "Persistent Brand Kit & Memory stored",
        "Campaign planning not included",
      ],
      ctaText: "Order Growth Plan",
    },
    {
      name: "Fernum Scale",
      slug: "fernum-scale",
      price: 1099,
      perAdPrice: 333,
      adsPerMonth: 3,
      revisions: 2,
      turnaround: "Delivered in ~2 weeks",
      campaignPlanning: true,
      popular: false,
      tagline: "High volume testing with strategic campaign direction and audience hook roadmaps.",
      features: [
        "3 finished high-converting video ads per month",
        "$333 per ad effective price (Save $398 / Best Value)",
        "Campaign planning included (Angle research & roadmap)",
        "3 alternate hooks per ad (9 total hook variants)",
        "Full HD in 9:16, 1:1, and 16:9 versions",
        "2 revisions included per ad",
        "Delivered in about 2 weeks",
        "Script writing, AI production & human polish",
        "Dynamic kinetic subtitles & sound design",
        "Priority production queue & dedicated strategist",
      ],
      ctaText: "Order Scale Plan",
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Transparent Monthly Subscriptions
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Predictable Pricing for D2C Brands
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            All plans include script writing, AI production, human editing, Full HD renders, 9:16 + 1:1 + 16:9 versions, and 3 alternate hooks per ad. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {plans.map((p) => (
            <div
              key={p.slug}
              className={`relative bg-card rounded-2xl p-7 flex flex-col justify-between border transition-all duration-300 ${
                p.popular
                  ? "border-purple-500/80 shadow-2xl shadow-purple-600/20 ring-1 ring-purple-500/60 lg:-translate-y-2 bg-gradient-to-b from-card via-card to-purple-950/20"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  Most Popular For Scaling
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                  {/* Per-ad price badge */}
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                    ${p.perAdPrice} / ad
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-6 min-h-[36px]">
                  {p.tagline}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    ${p.price}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">/ month</span>
                </div>

                {/* Key Turnaround & Revisions spec */}
                <div className="flex items-center gap-3 text-xs font-medium text-purple-300 mb-6 py-2 px-3 rounded-lg bg-secondary/50 border border-white/5">
                  <span>⚡ {p.turnaround}</span>
                  <span>•</span>
                  <span>🛡️ {p.revisions} Revisions</span>
                </div>

                {/* Campaign Planning Badge */}
                <div className="mb-6">
                  {p.campaignPlanning ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Campaign Planning Included</span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-lg border border-white/5">
                      Campaign Planning: Not Included
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-8">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => onSelectPlan(p.slug)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    p.popular
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30"
                      : "bg-secondary hover:bg-secondary/80 text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Book a Call Prompt Box on Pricing Page */}
        <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-purple-950/40 via-card to-indigo-950/40 rounded-2xl border border-white/10 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base sm:text-lg font-bold text-white mb-1">
              Have questions about your ad account or custom creative volume?
            </h4>
            <p className="text-xs text-muted-foreground">
              Book a {siteConfig.callMinutes}-minute creative strategy call with our creative director to discuss your target hooks and ROAS goals.
            </p>
          </div>

          <button
            onClick={onOpenBookCall}
            className="shrink-0 px-5 py-2.5 bg-secondary/80 hover:bg-secondary text-foreground hover:text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
            <span>Book a Strategy Call</span>
          </button>
        </div>
      </div>
    </section>
  );
}
