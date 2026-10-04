"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Lock,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Layers,
  Check,
} from "lucide-react";

interface BriefOrderFormProps {
  selectedPlanSlug: string;
  onPlanChange: (slug: string) => void;
}

const PLAN_DATA: Record<
  string,
  {
    name: string;
    price: number;
    perAdPrice: number;
    adsPerMonth: number;
    revisions: number;
    turnaround: string;
    campaignPlanning: boolean;
  }
> = {
  "fernum-sprint": {
    name: "Fernum Sprint",
    price: 499,
    perAdPrice: 499,
    adsPerMonth: 1,
    revisions: 2,
    turnaround: "~3 weeks",
    campaignPlanning: false,
  },
  "fernum-growth": {
    name: "Fernum Growth",
    price: 799,
    perAdPrice: 400,
    adsPerMonth: 2,
    revisions: 2,
    turnaround: "~2 weeks",
    campaignPlanning: false,
  },
  "fernum-scale": {
    name: "Fernum Scale",
    price: 1099,
    perAdPrice: 333,
    adsPerMonth: 3,
    revisions: 2,
    turnaround: "~2 weeks",
    campaignPlanning: true,
  },
};

export function BriefOrderForm({ selectedPlanSlug, onPlanChange }: BriefOrderFormProps) {
  const currentPlan = PLAN_DATA[selectedPlanSlug] || PLAN_DATA["fernum-growth"];

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    companyName: "",
    website: "",
    productName: "",
    targetAudience: "",
    problemSolved: "",
    offerDetails: "",
    tone: "High-Energy UGC Problem-Solution",
    referenceUrls: "",
    channelFocus: "Meta & TikTok",
    cardNumber: "4242 •••• •••• 4242",
    cardExp: "12/28",
    cardCvc: "123",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug: selectedPlanSlug,
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderConfirmation(data.order);
      } else {
        setErrorMessage(data.error || "Failed to process brief. Please check fields.");
      }
    } catch (err: any) {
      setErrorMessage("Network error while submitting brief. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderConfirmation) {
    return (
      <section id="brief-order" className="py-20 bg-background/80 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-card border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-mono uppercase mb-3">
              Order Confirmed • Ad Slot Briefed
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-2">
              We've Received Your Brief!
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
              Your subscription to <strong className="text-white">{orderConfirmation.plan.name}</strong> is active. Production has been initiated for <strong className="text-white">{orderConfirmation.adSlot.title}</strong>.
            </p>

            {/* Order Details Card */}
            <div className="p-6 bg-secondary/40 rounded-2xl border border-white/5 text-left text-xs space-y-3 mb-8">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-muted-foreground">Order Reference:</span>
                <span className="font-mono text-white">{orderConfirmation.adSlotId}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium text-white">
                  {orderConfirmation.plan.name} (${orderConfirmation.plan.priceUsd}/mo)
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-muted-foreground">Client:</span>
                <span className="text-white">
                  {orderConfirmation.client.name} ({orderConfirmation.client.companyName})
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-muted-foreground">Ad Slot Status:</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono uppercase text-[10px]">
                  {orderConfirmation.adSlot.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Next Milestone:</span>
                <span className="text-emerald-400 font-medium">
                  Script Concepts + 3 Hooks for your review (within 48h)
                </span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded-xl text-xs text-purple-200 text-left mb-8 flex items-start gap-3">
              <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong>What happens next:</strong> Our creative director is reviewing your brief. You will receive an email notification to approve the 3 script angles before any video generation begins.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
              >
                <span>Open Client Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setOrderConfirmation(null)}
                className="w-full sm:w-auto px-6 py-3.5 bg-secondary text-muted-foreground hover:text-white rounded-xl text-sm transition-colors"
              >
                Submit Another Brief
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="brief-order" className="py-20 relative bg-background/60 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            Start Production
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Submit Your Brief & Start Your Plan
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Fill in your D2C product details below. You will review and approve the written script and 3 alternate hooks before we render a single frame.
          </p>
        </div>

        {/* Plan Selector Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.entries(PLAN_DATA).map(([slug, plan]) => (
            <button
              key={slug}
              type="button"
              onClick={() => onPlanChange(slug)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-3 border ${
                selectedPlanSlug === slug
                  ? "bg-purple-950/70 border-purple-500 text-white ring-1 ring-purple-500/60 shadow-lg shadow-purple-600/20"
                  : "bg-secondary/40 border-white/5 text-muted-foreground hover:text-white"
              }`}
            >
              <span>{plan.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs">
                ${plan.price}/mo
              </span>
              <span className="text-[11px] opacity-70">(${plan.perAdPrice}/ad)</span>
            </button>
          ))}
        </div>

        {/* Main Two-Column Brief & Order Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Brief Intake Form (8 cols) */}
          <div className="lg:col-span-7 bg-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs">
                1
              </span>
              Product & Creative Details
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Give our creative team the core facts about your product and audience.
            </p>

            {errorMessage && (
              <div className="mb-6 p-3.5 bg-destructive/20 border border-destructive/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} id="order-form" className="space-y-4">
              {/* Client & Brand Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Work / Billing Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="elena@lumaglow.co"
                    className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Brand / Store Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="LumaGlow Skincare"
                    className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Store URL (Shopify / Amazon)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://lumaglow.co"
                    className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Primary Product Name to Advertise *
                </label>
                <input
                  required
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. Barrier Repair Peptide Serum"
                  className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Core Problem Solved * (What pain point makes them buy?)
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.problemSolved}
                  onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                  placeholder="e.g. Heavy winter moisturizers clog pores; lightweight serums don't heal redness. This repairs the barrier in 7 days without greasy residue."
                  className="w-full px-3.5 py-2 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Target Customer & Audience *
                </label>
                <input
                  required
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g. Women 22-38 struggling with dry winter skin and hormonal flareups"
                  className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Current Offer / Promotion (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.offerDetails}
                    onChange={(e) => setFormData({ ...formData, offerDetails: e.target.value })}
                    placeholder="e.g. Buy 1 Get 1 50% Off with code GLOW50"
                    className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Primary Ad Channels
                  </label>
                  <select
                    value={formData.channelFocus}
                    onChange={(e) => setFormData({ ...formData, channelFocus: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="Meta & TikTok">Both Meta & TikTok (Recommended)</option>
                    <option value="Meta Only">Meta (Instagram Reels & Feed, Facebook)</option>
                    <option value="TikTok Only">TikTok Ads Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Preferred Creative Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="High-Energy UGC Problem-Solution">High-Energy UGC Problem-Solution</option>
                  <option value="Direct Clinical / Scientific Authority">Direct Clinical / Scientific Authority</option>
                  <option value="Sleek Minimalist Aesthetic Commercial">Sleek Minimalist Aesthetic Commercial</option>
                  <option value="Contrarian / Exposé Curiosity Angle">Contrarian / Exposé Curiosity Angle</option>
                  <option value="Satisfying ASMR & Texture Demonstration">Satisfying ASMR & Texture Demonstration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Reference Ad Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.referenceUrls}
                  onChange={(e) => setFormData({ ...formData, referenceUrls: e.target.value })}
                  placeholder="https://tiktok.com/@brand/video/... or Meta ad library link"
                  className="w-full px-3.5 py-2.5 bg-secondary/40 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary & Checkout (5 cols) */}
          <div className="lg:col-span-5 bg-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs">
                2
              </span>
              Order Summary & Payment
            </h3>

            {/* Plan Breakdown Card */}
            <div className="p-4 bg-secondary/50 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-base">{currentPlan.name}</div>
                  <div className="text-xs text-muted-foreground">Monthly subscription</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-white">${currentPlan.price}</div>
                  <div className="text-[11px] text-purple-300 font-medium">
                    ${currentPlan.perAdPrice} / ad
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{currentPlan.adsPerMonth} finished video ad(s) per month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3 alternate hooks included with every ad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Full HD 9:16 + 1:1 + 16:9 versions included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2 revisions included per ad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{currentPlan.turnaround} delivery window</span>
                </div>
              </div>
            </div>

            {/* Simulated Payment Card Form */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  Payment Method
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                  <Lock className="w-3 h-3" />
                  256-Bit Encrypted
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Card Number</label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/30 border border-white/10 rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">Expires</label>
                  <input
                    type="text"
                    value={formData.cardExp}
                    onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary/30 border border-white/10 rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">CVC / CVI</label>
                  <input
                    type="text"
                    value={formData.cardCvc}
                    onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary/30 border border-white/10 rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Total Due & Guarantee */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Today:</span>
                <span className="text-2xl font-black text-white">${currentPlan.price} USD</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Billed monthly. You can pause or cancel at any time in your client portal. No hidden cancellation fees.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              form="order-form"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Brief & Order...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Brief & Start Production (${currentPlan.price})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Script approval required before video generation begins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
