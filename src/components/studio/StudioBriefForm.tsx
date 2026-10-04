"use client";

import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function StudioBriefForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    brandName: "",
    websiteUrl: "",
    productToAdvertise: "",
    offer: "",
    planChosen: "Growth ($799/mo)",
    "bot-field": "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [prefilledFromBattle, setPrefilledFromBattle] = useState(false);

  // Listen to Hook Battle prefill event
  useEffect(() => {
    const handlePrefill = (e: Event) => {
      const customEvent = e as CustomEvent<{ product: string; hook: string }>;
      if (customEvent.detail) {
        setFormData((prev) => ({
          ...prev,
          productToAdvertise: customEvent.detail.product || prev.productToAdvertise,
          offer: customEvent.detail.hook
            ? `Winning Hook from Hook Battle:\n"${customEvent.detail.hook}"\n\nTarget offer details: `
            : prev.offer,
        }));
        setPrefilledFromBattle(true);
        setTimeout(() => setPrefilledFromBattle(false), 5000);
      }
    };

    window.addEventListener("fernum-prefill-brief", handlePrefill);
    return () => window.removeEventListener("fernum-prefill-brief", handlePrefill);
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.brandName.trim()) errs.brandName = "Brand name is required";
    if (!formData.websiteUrl.trim()) {
      errs.websiteUrl = "Store / Website URL is required";
    } else if (!/^https?:\/\//i.test(formData.websiteUrl)) {
      formData.websiteUrl = `https://${formData.websiteUrl}`;
    }
    if (!formData.productToAdvertise.trim()) {
      errs.productToAdvertise = "Product name or URL is required";
    }
    if (!formData.offer.trim()) {
      errs.offer = "Please describe the core offer, discount, or campaign angle";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[e.target.name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (formData["bot-field"]) return;

    setIsSubmitting(true);

    try {
      // 1. Submit to Netlify Forms endpoint
      const netlifyBody = new URLSearchParams({
        "form-name": "ad-brief",
        ...formData,
      }).toString();

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: netlifyBody,
      }).catch((err) => {
        console.warn("Netlify form post fallback:", err);
      });

      // 2. Local database API backup
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.name,
          clientEmail: formData.email,
          brandName: formData.brandName,
          websiteUrl: formData.websiteUrl,
          productToAdvertise: formData.productToAdvertise,
          offer: formData.offer,
          planSlug: formData.planChosen.toLowerCase().includes("launch")
            ? "plan_fernum_launch"
            : formData.planChosen.toLowerCase().includes("scale")
            ? "plan_fernum_scale"
            : "plan_fernum_growth",
        }),
      }).catch((err) => {
        console.warn("Local DB recording fallback:", err);
      });

      trackEvent("Brief Form Submitted", {
        brand: formData.brandName,
        plan: formData.planChosen,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="brief" className="py-24 sm:py-32 bg-[var(--page-bg)] border-t-2 border-[var(--border)] text-[var(--page-fg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span className="w-2 h-2 bg-[var(--accent)]" />
            <span>AdPass Onboarding</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.95] mb-4">
            SUBMIT YOUR AD BRIEF
          </h2>
          <p className="text-sm sm:text-base text-[var(--page-fg)]/75 font-medium">
            Fill in your brand and product details. We'll turn it into 3 conversion-tested script concepts and hook angles within 24 hours.
          </p>

          {/* Prefilled alert toast */}
          {prefilledFromBattle && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] shadow-brutal text-xs font-mono font-black uppercase animate-bounce">
              <Zap className="w-4 h-4" />
              <span>Hook Battle Winner prefilled below!</span>
            </div>
          )}
        </div>

        {/* Card Container */}
        <div className="bg-[var(--block-2-bg)] border-2 border-[var(--border)] p-6 sm:p-12 shadow-brutal-xl text-[var(--block-2-fg)]">
          {isSuccess ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 bg-[var(--accent)] border-2 border-[var(--border)] flex items-center justify-center mx-auto shadow-brutal text-[var(--accent-fg)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-xs font-mono font-bold uppercase">
                  Locked in.
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--block-2-fg)] uppercase tracking-tight">
                  BRIEF RECEIVED!
                </h3>
                <p className="text-sm sm:text-base text-[var(--block-2-fg)]/80 font-medium max-w-md mx-auto">
                  We've logged your brand kit and brief for{" "}
                  <span className="font-bold text-[var(--accent)]">{formData.brandName}</span>.
                  You'll receive 3 tailored script concepts via{" "}
                  <span className="font-bold text-[var(--block-2-fg)]">{formData.email}</span> within 24 hours.
                </p>
              </div>

              <div className="p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] max-w-md mx-auto text-left text-xs font-mono space-y-1 text-[var(--page-fg)]">
                <div className="font-bold uppercase">Timeline:</div>
                <div className="opacity-70">1. Creative director script review (24h)</div>
                <div className="opacity-70">2. Approve your favorite hook angle</div>
                <div className="opacity-70">3. Video generated & shipped in Full HD (48-72h)</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    name: "",
                    email: "",
                    brandName: "",
                    websiteUrl: "",
                    productToAdvertise: "",
                    offer: "",
                    planChosen: "Growth ($799/mo)",
                    "bot-field": "",
                  });
                }}
                className="btn-squish inline-flex items-center gap-2 px-6 py-3 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all"
              >
                <span>Submit Another Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form
              name="ad-brief"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Hidden inputs for Netlify Forms */}
              <input type="hidden" name="form-name" value="ad-brief" />
              <p className="hidden">
                <label>
                  Don't fill this out if you're human:{" "}
                  <input
                    name="bot-field"
                    value={formData["bot-field"]}
                    onChange={handleChange}
                  />
                </label>
              </p>

              {/* Grid Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                      errors.name ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@yourbrand.com"
                    className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                      errors.email ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Grid Row 2: Brand Name & Store URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="e.g. Luma Glow Skincare"
                    className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                      errors.brandName ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                    }`}
                  />
                  {errors.brandName && (
                    <p className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.brandName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://lumaglow.com"
                    className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                      errors.websiteUrl ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                    }`}
                  />
                  {errors.websiteUrl && (
                    <p className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.websiteUrl}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Product to advertise */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                  Product To Advertise *
                </label>
                <input
                  type="text"
                  name="productToAdvertise"
                  value={formData.productToAdvertise}
                  onChange={handleChange}
                  placeholder="e.g. Barrier Recovery Ceramide Serum (or link to product page)"
                  className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                    errors.productToAdvertise ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                  }`}
                />
                {errors.productToAdvertise && (
                  <p className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.productToAdvertise}</span>
                  </p>
                )}
              </div>

              {/* Row 4: Offer Details */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                  Core Offer & Campaign Angle *
                </label>
                <textarea
                  name="offer"
                  rows={3}
                  value={formData.offer}
                  onChange={handleChange}
                  placeholder="e.g. Buy 1 Get 1 Free for first-time buyers with code GLOW50. Target audience: Women 24-40 experiencing winter skin irritation."
                  className={`w-full p-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors resize-none ${
                    errors.offer ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                  }`}
                />
                {errors.offer && (
                  <p className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.offer}</span>
                  </p>
                )}
              </div>

              {/* Row 5: Plan Chosen */}
              <div>
                <label htmlFor="planChosen" className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                  Plan Chosen
                </label>
                <select
                  id="planChosen"
                  name="planChosen"
                  value={formData.planChosen}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-[var(--page-bg)] border-2 border-[var(--border)] text-sm font-bold text-[var(--page-fg)] focus:outline-none focus:bg-[var(--block-2-bg)] focus:border-[var(--accent)] transition-colors"
                >
                  <option value="Launch ($499/mo)">Launch ($499/mo) — 1 ad/mo</option>
                  <option value="Growth ($799/mo)">Growth ($799/mo) — 2 ads/mo [Most Popular]</option>
                  <option value="Scale ($1,099/mo)">Scale ($1,099/mo) — 3 ads/mo + Planning</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-squish w-full h-[52px] bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting brief…</span>
                  ) : (
                    <>
                      <span>Send brief</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[11px] font-mono text-[var(--block-2-fg)]/60 pt-1">
                🔒 Encrypted intake. Direct to studio directors. Zero spam.
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
