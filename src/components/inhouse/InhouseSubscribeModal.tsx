"use client";

import React, { useState } from "react";
import { X, CreditCard, Lock, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";

interface InhouseSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planSlug: string;
  checkoutUrl: string;
}

const PLAN_INFO: Record<string, { name: string; price: string; ads: string; perVideo: string }> = {
  "fernum-sprint": {
    name: "Fernum Sprint",
    price: "$499/mo",
    ads: "1 finished video ad per month",
    perVideo: "$500 per video",
  },
  "fernum-growth": {
    name: "Fernum Growth",
    price: "$799/mo",
    ads: "2 finished video ads per month",
    perVideo: "$400 per video",
  },
  "fernum-scale": {
    name: "Fernum Scale",
    price: "$1,099/mo",
    ads: "3 finished video ads per month (Campaign planning included)",
    perVideo: "$333 per video",
  },
};

export function InhouseSubscribeModal({
  isOpen,
  onClose,
  planSlug,
  checkoutUrl,
}: InhouseSubscribeModalProps) {
  const plan = PLAN_INFO[planSlug] || PLAN_INFO["fernum-growth"];
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  if (!isOpen) return null;

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setRedirecting(true);

    // If a custom or external Dodo link is provided, redirect to Dodo Payments checkout
    // appending customer email if available
    const separator = checkoutUrl.includes("?") ? "&" : "?";
    const finalUrl = email
      ? `${checkoutUrl}${separator}email=${encodeURIComponent(email)}&brand=${encodeURIComponent(brandName)}`
      : checkoutUrl;

    setTimeout(() => {
      window.open(finalUrl, "_blank");
      setRedirecting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-2">
          Secure Checkout • Dodo Payments
        </div>

        <h3 className="text-2xl font-black tracking-tight text-neutral-950 mb-1">
          Subscribe to {plan.name}
        </h3>
        <p className="text-xs text-neutral-500 mb-6">
          {plan.ads} • {plan.perVideo}
        </p>

        {/* Plan summary badge */}
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl mb-6 flex justify-between items-center text-xs">
          <div>
            <span className="font-bold text-neutral-950 block">{plan.name}</span>
            <span className="text-neutral-500">Billed monthly • Pause or cancel anytime</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-neutral-950 block">{plan.price}</span>
            <span className="text-[10px] font-mono text-neutral-500">{plan.perVideo}</span>
          </div>
        </div>

        <form onSubmit={handleProceed} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Billing Email *
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@yourbrand.com"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Brand / Store Name *
            </label>
            <input
              required
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. LumaGlow"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={redirecting}
              className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-full text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {redirecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Dodo Payments...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Dodo Payments</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-neutral-500 text-center">
            <Lock className="w-3 h-3 text-neutral-700" />
            <span>Encrypted checkout via Dodo Payments</span>
          </div>
        </form>
      </div>
    </div>
  );
}
