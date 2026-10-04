"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

interface InhouseBookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export function InhouseBookCallModal({ isOpen, onClose, defaultPlan }: InhouseBookCallModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    brandName: "",
    website: "",
    monthlyAdSpend: "$5k - $20k",
    notes: defaultPlan ? `Inquiry regarding ${defaultPlan}` : "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to schedule call. Please try again.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-2xl text-neutral-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-neutral-100 border border-neutral-300 rounded-full flex items-center justify-center mx-auto mb-5 text-neutral-900">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-950 mb-2">Call Requested</h3>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              Thank you {formData.name}. We've received your inquiry for <strong className="text-neutral-950">{formData.brandName}</strong>. A calendar invite and prep agenda have been sent to <strong className="text-neutral-950">{formData.email}</strong>.
            </p>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-left text-xs space-y-2 mb-6 text-neutral-600">
              <div className="flex items-center gap-2 text-neutral-950 font-semibold">
                <Clock className="w-4 h-4 text-neutral-800" />
                {siteConfig.callMinutes}-Minute Ad Strategy Breakdown
              </div>
              <div>• Audit of your current Meta/TikTok video ad bottlenecks.</div>
              <div>• 3 hook ideas tailored to your specific product USP.</div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-medium rounded-full text-sm transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              {siteConfig.callMinutes}-Min Intro Call
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mb-2">
              Book a Strategy Call
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6 leading-relaxed">
              Discuss your D2C brand's creative requirements, test angles, and see how Fernum's 3-hook methodology scales paid media.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@yourbrand.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Brand / Store Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g. Kinetix Athletics"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Store URL / Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourbrand.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Monthly Meta & TikTok Ad Spend
                </label>
                <select
                  value={formData.monthlyAdSpend}
                  onChange={(e) => setFormData({ ...formData, monthlyAdSpend: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                >
                  <option value="<$5k/mo">Less than $5,000 / month</option>
                  <option value="$5k - $20k/mo">$5,000 – $20,000 / month</option>
                  <option value="$20k - $50k/mo">$20,000 – $50,000 / month</option>
                  <option value="$50k+/mo">$50,000+ / month</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Notes or Target Product (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="What product are you looking to scale?"
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold rounded-full text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm {siteConfig.callMinutes}-Min Intro Call</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
