"use client";

import React from "react";
import { ArrowRight, Check, X, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";

interface InhousePricingProps {
  onOpenBookCall: (planName?: string) => void;
  onSubscribe: (planSlug: string, checkoutUrl: string) => void;
}

export function InhousePricing({ onOpenBookCall, onSubscribe }: InhousePricingProps) {
  const plans = [
    {
      name: "Fernum Sprint",
      slug: "fernum-sprint",
      price: "$499",
      period: "/mo",
      totalAds: "1 ad per month",
      campaignPlanning: "Excluded",
      campaignPlanningIncluded: false,
      whatsIncluded: "Writing, AI Production, Editing",
      revisionsTimeline: "2 Revisions • About 3 Weeks",
      pricePerVideo: "$500 per video",
      highlight: false,
      checkoutUrl: siteConfig.plans.launch.checkoutUrl,
    },
    {
      name: "Fernum Growth",
      slug: "fernum-growth",
      price: "$799",
      period: "/mo",
      totalAds: "2 ads per month",
      campaignPlanning: "Excluded",
      campaignPlanningIncluded: false,
      whatsIncluded: "Writing, AI Production, Editing",
      revisionsTimeline: "2 Revisions • About 2 Weeks",
      pricePerVideo: "$400 per video",
      highlight: true,
      badge: "Most Popular",
      checkoutUrl: siteConfig.plans.growth.checkoutUrl,
    },
    {
      name: "Fernum Scale",
      slug: "fernum-scale",
      price: "$1,099",
      period: "/mo",
      totalAds: "3 ads per month",
      campaignPlanning: "Included",
      campaignPlanningIncluded: true,
      whatsIncluded: "Writing, AI Production, Editing",
      revisionsTimeline: "2 Revisions • About 2 Weeks",
      pricePerVideo: "$333 per video",
      highlight: false,
      badge: "Best Value",
      checkoutUrl: siteConfig.plans.scale.checkoutUrl,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-neutral-950 mb-4">
            Pricing Chart
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-medium max-w-xl mx-auto">
            All videos will be made in Full HD Format (9:16, 1:1, and 16:9 versions included with 3 alternate hooks).
          </p>
        </div>

        {/* 3 Columns Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {plans.map((p) => (
            <div
              key={p.slug}
              className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between border transition-all duration-300 ${
                p.highlight
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-2xl lg:-translate-y-2"
                  : "border-neutral-200 bg-white text-neutral-950 shadow-sm hover:border-neutral-400"
              }`}
            >
              {/* Optional Pill Badge */}
              {p.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold ${
                    p.highlight
                      ? "bg-white text-neutral-950 shadow"
                      : "bg-neutral-950 text-white"
                  }`}
                >
                  {p.badge}
                </div>
              )}

              <div>
                {/* Plan Title & Monthly Price */}
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black tracking-tighter">
                      {p.price}
                    </span>
                    <span
                      className={`text-xs font-mono uppercase ${
                        p.highlight ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      {p.period}
                    </span>
                  </div>
                </div>

                {/* Structured Rows */}
                <div
                  className={`space-y-4 pt-6 border-t text-xs sm:text-sm ${
                    p.highlight ? "border-neutral-800" : "border-neutral-100"
                  }`}
                >
                  {/* Row 1: Total Ads */}
                  <div className="flex justify-between items-center py-1">
                    <span
                      className={p.highlight ? "text-neutral-400" : "text-neutral-500"}
                    >
                      Total Ads
                    </span>
                    <span className="font-bold">{p.totalAds}</span>
                  </div>

                  {/* Row 2: Campaign Planning */}
                  <div className="flex justify-between items-center py-1">
                    <span
                      className={p.highlight ? "text-neutral-400" : "text-neutral-500"}
                    >
                      Campaign Planning
                    </span>
                    <span
                      className={`font-semibold ${
                        p.campaignPlanningIncluded
                          ? p.highlight
                            ? "text-emerald-400"
                            : "text-emerald-600"
                          : p.highlight
                          ? "text-neutral-400"
                          : "text-neutral-500"
                      }`}
                    >
                      {p.campaignPlanning}
                    </span>
                  </div>

                  {/* Row 3: What's Included */}
                  <div className="flex justify-between items-start py-1">
                    <span
                      className={p.highlight ? "text-neutral-400" : "text-neutral-500"}
                    >
                      What's Included
                    </span>
                    <span className="font-medium text-right max-w-[180px]">
                      {p.whatsIncluded}
                    </span>
                  </div>

                  {/* Row 4: Revisions + Timeline */}
                  <div className="flex justify-between items-center py-1">
                    <span
                      className={p.highlight ? "text-neutral-400" : "text-neutral-500"}
                    >
                      Revision + Timeline
                    </span>
                    <span className="font-medium">{p.revisionsTimeline}</span>
                  </div>

                  {/* Row 5: Price Per Video */}
                  <div
                    className={`flex justify-between items-center py-2 px-3 rounded-xl ${
                      p.highlight
                        ? "bg-neutral-900 border border-neutral-800"
                        : "bg-neutral-50 border border-neutral-100"
                    }`}
                  >
                    <span
                      className={`text-xs font-mono uppercase ${
                        p.highlight ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      Price Per Video
                    </span>
                    <span className="font-black text-sm">{p.pricePerVideo}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Subscribe & Book a Call */}
              <div className="pt-8 space-y-3">
                <button
                  onClick={() => onSubscribe(p.slug, p.checkoutUrl)}
                  className={`w-full py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    p.highlight
                      ? "bg-white text-neutral-950 hover:bg-neutral-100"
                      : "bg-neutral-950 text-white hover:bg-neutral-800"
                  }`}
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenBookCall(p.name)}
                  className={`w-full py-3 rounded-full font-semibold text-xs sm:text-sm tracking-tight transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
                    p.highlight
                      ? "border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600"
                      : "border-neutral-300 text-neutral-700 hover:text-neutral-950 hover:border-neutral-950"
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Book a Call</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Full HD Quality Assurance Footnote */}
        <div className="text-center text-xs font-mono uppercase tracking-wider text-neutral-500">
          Note: All videos are delivered in Full HD across 9:16, 1:1, and 16:9 with 3 alternate hooks.
        </div>
      </div>
    </section>
  );
}
