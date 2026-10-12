"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/config/site";

export function StudioBriefForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    brandName: "",
    websiteUrl: "",
    productToAdvertise: "",
    offer: "",
    planChosen: "Growth ($799/month)",
    "bot-field": "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [prefilledFromBattle, setPrefilledFromBattle] = useState(false);

  // Time trap: timestamp recorded when form mounts
  const mountTimeRef = useRef<number>(Date.now());

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
    if (!formData.name.trim()) {
      errs.name = "Full name is required";
    } else if (formData.name.length > 100) {
      errs.name = "Full name must be under 100 characters";
    }

    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    } else if (formData.email.length > 120) {
      errs.email = "Email must be under 120 characters";
    }

    if (!formData.brandName.trim()) {
      errs.brandName = "Brand name is required";
    } else if (formData.brandName.length > 100) {
      errs.brandName = "Brand name must be under 100 characters";
    }

    if (!formData.websiteUrl.trim()) {
      errs.websiteUrl = "Store / Website URL is required";
    } else {
      let formatted = formData.websiteUrl.trim();
      if (!/^https?:\/\//i.test(formatted)) {
        formatted = `https://${formatted}`;
        setFormData((prev) => ({ ...prev, websiteUrl: formatted }));
      }
      try {
        new URL(formatted);
      } catch {
        errs.websiteUrl = "Please enter a valid website URL (e.g. yourbrand.com)";
      }
    }

    if (!formData.productToAdvertise.trim()) {
      errs.productToAdvertise = "Product name or URL is required";
    } else if (formData.productToAdvertise.length > 300) {
      errs.productToAdvertise = "Product description must be under 300 characters";
    }

    if (!formData.offer.trim()) {
      errs.offer = "Please describe the core offer, discount, or campaign angle";
    } else if (formData.offer.length > 1500) {
      errs.offer = "Offer details must be under 1500 characters";
    }

    setErrors(errs);

    // Auto-focus first input with error
    const errKeys = Object.keys(errs);
    if (errKeys.length > 0) {
      const firstField = errKeys[0];
      setTimeout(() => {
        const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `[name="${firstField}"]`
        );
        if (el) el.focus();
      }, 50);
      return false;
    }

    return true;
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
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Time trap check: reject submissions under 3 seconds
    const elapsed = Date.now() - mountTimeRef.current;
    if (elapsed < 3000) {
      setSubmitError(
        "Submission received too quickly. Please review your details and submit again."
      );
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Submit to Vercel Serverless Function endpoint (/api/brief)
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          timestamp: mountTimeRef.current,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setSubmitError(
          data?.error || "There was an error processing your brief. Please verify your details."
        );
        return;
      }

      trackEvent("Brief Form Submitted", {
        brand: formData.brandName,
        plan: formData.planChosen,
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError(
        "There was a network error sending your brief. Please try again or email us directly."
      );
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
            Fill in your brand and product details. We'll turn it into 3 tailored script concepts and hook angles within {siteConfig.briefTurnaround}.
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
            <div className="text-center py-10 space-y-6" role="status" aria-live="polite">
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
                  <span className="font-bold text-[var(--block-2-fg)]">{formData.email}</span> within {siteConfig.briefTurnaround}.
                </p>
              </div>

              <div className="p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] max-w-md mx-auto text-left text-xs font-mono space-y-1 text-[var(--page-fg)]">
                <div className="font-bold uppercase">Timeline:</div>
                <div className="opacity-70">1. Script and concept review ({siteConfig.briefTurnaround})</div>
                <div className="opacity-70">2. Approve your favorite hook angle</div>
                <div className="opacity-70">3. Video generated & shipped in Full HD (48-72h)</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  mountTimeRef.current = Date.now();
                  setFormData({
                    name: "",
                    email: "",
                    brandName: "",
                    websiteUrl: "",
                    productToAdvertise: "",
                    offer: "",
                    planChosen: "Growth ($799/month)",
                    "bot-field": "",
                  });
                }}
                className="btn-squish inline-flex items-center gap-2 px-6 py-3 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all cursor-pointer"
              >
                <span>Submit Another Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form
              id="ad-brief-form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >

              {/* Spam Honeypot: Hidden from sighted users and screen readers */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                  opacity: 0,
                  height: 0,
                  width: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                <label htmlFor="bot-field-department">Department Code</label>
                <input
                  id="bot-field-department"
                  name="bot-field"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={formData["bot-field"]}
                  onChange={handleChange}
                />
              </div>

              {/* Submission Error Banner with Retry */}
              {submitError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="p-4 bg-red-500/10 border-2 border-red-500 text-red-600 dark:text-red-400 text-xs font-mono font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white font-mono font-bold uppercase text-[11px] shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* Grid Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name-input" className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                    Your Name <span className="text-[var(--accent)]">*</span>
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    required
                    maxLength={100}
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "error-name" : undefined}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                      errors.name ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                    }`}
                  />
                  {errors.name && (
                    <p id="error-name" role="alert" aria-live="polite" className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email-input" className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                    Work Email <span className="text-[var(--accent)]">*</span>
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    required
                    maxLength={120}
                    aria-required="true"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "error-email" : undefined}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@yourbrand.com"
                    className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                      errors.email ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                    }`}
                  />
                  {errors.email && (
                    <p id="error-email" role="alert" aria-live="polite" className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Grid Row 2: Brand Name & Store URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="brandName-input" className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                    Brand Name <span className="text-[var(--accent)]">*</span>
                  </label>
                  <input
                    id="brandName-input"
                    type="text"
                    name="brandName"
                    required
                    maxLength={100}
                    aria-required="true"
                    aria-invalid={Boolean(errors.brandName)}
                    aria-describedby={errors.brandName ? "error-brandName" : undefined}
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="e.g. Luma Glow Skincare"
                    className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                      errors.brandName ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                    }`}
                  />
                  {errors.brandName && (
                    <p id="error-brandName" role="alert" aria-live="polite" className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.brandName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="websiteUrl-input" className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                    Website URL <span className="text-[var(--accent)]">*</span>
                  </label>
                  <input
                    id="websiteUrl-input"
                    type="url"
                    name="websiteUrl"
                    required
                    maxLength={200}
                    aria-required="true"
                    aria-invalid={Boolean(errors.websiteUrl)}
                    aria-describedby={errors.websiteUrl ? "error-websiteUrl" : undefined}
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://lumaglow.com"
                    className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                      errors.websiteUrl ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                    }`}
                  />
                  {errors.websiteUrl && (
                    <p id="error-websiteUrl" role="alert" aria-live="polite" className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.websiteUrl}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Product to advertise */}
              <div>
                <label htmlFor="product-input" className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                  Product To Advertise <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  id="product-input"
                  type="text"
                  name="productToAdvertise"
                  required
                  maxLength={300}
                  aria-required="true"
                  aria-invalid={Boolean(errors.productToAdvertise)}
                  aria-describedby={errors.productToAdvertise ? "error-product" : undefined}
                  value={formData.productToAdvertise}
                  onChange={handleChange}
                  placeholder="e.g. Barrier Recovery Ceramide Serum (or link to product page)"
                  className={`w-full h-12 px-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors ${
                    errors.productToAdvertise ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                  }`}
                />
                {errors.productToAdvertise && (
                  <p id="error-product" role="alert" aria-live="polite" className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.productToAdvertise}</span>
                  </p>
                )}
              </div>

              {/* Row 4: Offer Details */}
              <div>
                <label htmlFor="offer-input" className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] mb-2">
                  Core Offer & Campaign Angle <span className="text-[var(--accent)]">*</span>
                </label>
                <textarea
                  id="offer-input"
                  name="offer"
                  rows={3}
                  required
                  maxLength={1500}
                  aria-required="true"
                  aria-invalid={Boolean(errors.offer)}
                  aria-describedby={errors.offer ? "error-offer" : undefined}
                  value={formData.offer}
                  onChange={handleChange}
                  placeholder="e.g. Buy 1 Get 1 Free for first-time buyers with code GLOW50. Target audience: Women 24-40 experiencing winter skin irritation."
                  className={`w-full p-4 bg-[var(--page-bg)] border-2 text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] transition-colors resize-none ${
                    errors.offer ? "border-[var(--sticker-3)]" : "border-[var(--border)] focus:border-[var(--accent)]"
                  }`}
                />
                {errors.offer && (
                  <p id="error-offer" role="alert" aria-live="polite" className="text-[11px] font-mono text-[var(--sticker-3)] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
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
                Sent straight to our team. Zero spam.
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
