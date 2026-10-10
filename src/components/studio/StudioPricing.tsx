"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall, Check } from "lucide-react";
import { siteConfig, getCheckoutUrl, isCheckoutEnabled } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { PricingStickerPack } from "./DraggableSticker";

export function StudioPricing() {
  const plans = [
    {
      ...siteConfig.plans.launch,
      buttonLabel: "Subscribe to Launch ($499/month)",
      highlight: false,
    },
    {
      ...siteConfig.plans.growth,
      buttonLabel: "Subscribe to Growth ($799/month)",
      highlight: true,
      badge: "Most Popular",
    },
    {
      ...siteConfig.plans.scale,
      buttonLabel: "Subscribe to Scale ($1,099/month)",
      highlight: false,
      badge: "Best Value",
    },
  ];

  return (
    <section id="pricing" className="relative overflow-hidden py-24 sm:py-36 bg-[var(--page-bg)] border-t-2 border-[var(--border)] text-[var(--page-fg)]">
      {/* Draggable Pricing Stickers */}
      <PricingStickerPack />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Transparent Subscription</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.95] mb-4">
            MONTHLY PRICING PLANS
          </h2>
          <p className="text-[17px] sm:text-lg text-[var(--page-fg)]/80 font-normal max-w-xl mx-auto leading-relaxed">
            All ads delivered in Full HD across 9:16, 1:1, and 16:9 with 3 alternate hooks and 2 revisions. Cancel anytime. Cancellation takes effect at the end of the current billing period.
          </p>
        </div>

        {/* 3 Columns High-Contrast Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {plans.map((p) => (
            <div
              key={p.slug}
              className={`relative p-8 sm:p-10 flex flex-col justify-between border-2 border-[var(--border)] transition-all duration-200 ${
                p.highlight
                  ? "bg-[var(--block-4-bg)] text-[var(--block-4-fg)] shadow-brutal-xl lg:-translate-y-2"
                  : "bg-[var(--block-2-bg)] text-[var(--block-2-fg)] shadow-brutal-lg hover:shadow-brutal-xl"
              }`}
            >
              {/* Optional Pill Badge */}
              {p.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-mono uppercase tracking-widest font-black border-2 border-[var(--border)] shadow-brutal ${
                    p.highlight ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--sticker-3)] text-[var(--border)]"
                  }`}
                >
                  {p.badge}
                </div>
              )}

              <div>
                {/* Plan Title & Monthly Price */}
                <div className="mb-6">
                  <h3 className="font-display font-black text-2xl tracking-tight uppercase mb-2">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-black text-4xl sm:text-5xl tracking-tighter">
                      ${p.price.toLocaleString("en-US")}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold uppercase ${
                        p.highlight ? "text-[var(--block-4-fg)]/70" : "text-[var(--block-2-fg)]/70"
                      }`}
                    >
                      {p.period}
                    </span>
                  </div>
                </div>

                {/* Structured Rows Table */}
                <div
                  className={`space-y-4 pt-6 border-t-2 text-xs sm:text-sm font-medium ${
                    p.highlight ? "border-[var(--block-4-fg)]/20" : "border-[var(--border)]/20"
                  }`}
                >
                  {/* Row 1: Total Ads */}
                  <div className="flex justify-between items-center py-1">
                    <span
                      className={p.highlight ? "text-[var(--block-4-fg)]/70" : "text-[var(--block-2-fg)]/70"}
                    >
                      Total Ads
                    </span>
                    <span className="font-bold">{p.totalAds}</span>
                  </div>

                  {/* Row 2: Alternate Hooks */}
                  <div className="flex justify-between items-center py-1">
                    <span
                      className={p.highlight ? "text-[var(--block-4-fg)]/70" : "text-[var(--block-2-fg)]/70"}
                    >
                      Testing Hooks
                    </span>
                    <span className="font-bold text-[var(--accent)]">3 Hooks Per Ad</span>
                  </div>

                  {/* Row 3: Campaign Planning */}
                  <div className="flex justify-between items-center py-1">
                    <span
                      className={p.highlight ? "text-[var(--block-4-fg)]/70" : "text-[var(--block-2-fg)]/70"}
                    >
                      Campaign Planning
                    </span>
                    <span
                      className={`font-bold ${
                        p.campaignPlanningIncluded
                          ? "text-[var(--accent)]"
                          : p.highlight
                          ? "text-[var(--block-4-fg)]/50"
                          : "text-[var(--block-2-fg)]/50"
                      }`}
                    >
                      {p.campaignPlanning}
                    </span>
                  </div>

                  {/* Row 4: What's Included */}
                  <div className="flex justify-between items-start py-1">
                    <span
                      className={p.highlight ? "text-[var(--block-4-fg)]/70" : "text-[var(--block-2-fg)]/70"}
                    >
                      Scope
                    </span>
                    <span className="font-semibold text-right max-w-[190px]">
                      {p.whatsIncluded}
                    </span>
                  </div>

                  {/* Row 5: Revisions + Timeline */}
                  <div className="flex justify-between items-center py-1">
                    <span
                      className={p.highlight ? "text-[var(--block-4-fg)]/70" : "text-[var(--block-2-fg)]/70"}
                    >
                      Revision + Timeline
                    </span>
                    <span className="font-bold">{p.revisionsTimeline}</span>
                  </div>

                  {/* Row 6: Price Per Video */}
                  <div
                    className={`flex justify-between items-center py-2.5 px-3.5 border-2 border-[var(--border)] ${
                      p.highlight ? "bg-[var(--border)]/40" : "bg-[var(--border)]/10"
                    }`}
                  >
                    <span
                      className={`text-xs font-mono font-bold uppercase ${
                        p.highlight ? "text-[var(--block-4-fg)]/80" : "text-[var(--block-2-fg)]/80"
                      }`}
                    >
                      Price Per Video
                    </span>
                    <span className="font-display font-black text-sm text-[var(--accent)]">
                      {p.pricePerVideo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Subscribe */}
              <div className="pt-8">
                {(() => {
                  const checkoutUrl = p.checkoutUrl || getCheckoutUrl(p.slug);
                  const isEnabled = p.checkoutEnabled !== false && isCheckoutEnabled(p.slug);

                  if (!isEnabled) {
                    return (
                      <div className="space-y-2.5">
                        <div
                          className={`p-2.5 text-center text-xs font-mono font-bold uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal-sm ${
                            p.highlight ? "bg-[var(--border)] text-[var(--block-4-fg)]" : "bg-[var(--page-bg)] text-[var(--page-fg)]"
                          }`}
                        >
                          Checkout opens soon, book a call instead
                        </div>
                        <a
                          href={siteConfig.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="book"
                          className={`btn-squish btn-magnetic w-full h-[50px] font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-[var(--border)] shadow-brutal ${
                            p.highlight
                              ? "bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--block-2-bg)] hover:text-[var(--block-2-fg)]"
                              : "bg-[var(--block-4-bg)] text-[var(--block-4-fg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)]"
                          }`}
                        >
                          <span>Book a Call</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    );
                  }

                  return (
                    <a
                      href={checkoutUrl}
                      target="_self"
                      data-cursor="lets-go"
                      onClick={() => trackEvent("Subscribe Click", { plan: p.slug, price: p.price })}
                      className={`btn-squish btn-magnetic w-full h-[50px] font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-[var(--border)] shadow-brutal ${
                        p.highlight
                          ? "bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--block-2-bg)] hover:text-[var(--block-2-fg)]"
                          : "bg-[var(--block-4-bg)] text-[var(--block-4-fg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)]"
                      }`}
                    >
                      <span>{p.buttonLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* Single Book a Call Line under the plans */}
        <div className="max-w-xl mx-auto mb-10 p-6 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--block-2-fg)] shadow-brutal text-center">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-1">
            Questions before subscribing? Let's talk.
          </div>
          <div className="text-[11px] font-mono text-[var(--block-2-fg)]/70 mb-4">
            {siteConfig.callMinutes}-minute call. Bring your product and your current ads.
          </div>
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="book"
            onClick={() => trackEvent("Book a Call Click", { location: "pricing_bottom" })}
            className="btn-squish btn-magnetic inline-flex items-center justify-center gap-2 px-6 h-[46px] font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer border-2 border-[var(--border)] shadow-brutal bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--block-4-bg)] hover:text-[var(--block-4-fg)]"
          >
            <PhoneCall className="w-4 h-4 text-current" />
            <span>Book a Call</span>
          </a>
        </div>

        {/* Single Terms, Refund Policy and Cancellation Agreement under the plans */}
        <div className="text-center text-xs font-mono font-bold tracking-wider text-[var(--page-fg)]/80 pt-2 space-y-2">
          <p>
            By subscribing you agree to the{" "}
            <Link href="/terms" className="underline text-[var(--accent)] hover:text-[var(--page-fg)]">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/refund" className="underline text-[var(--accent)] hover:text-[var(--page-fg)]">
              Refund policy
            </Link>
            .
          </p>
          <p className="text-[11px] text-[var(--page-fg)]/70">
            Cancel anytime. Cancellation takes effect at the end of the current billing period.
          </p>
        </div>
      </div>
    </section>
  );
}
