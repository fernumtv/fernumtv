"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export function BookCallModal({ isOpen, onClose, defaultPlan }: BookCallModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    brandName: "",
    website: "",
    monthlyAdSpend: "$5k - $20k",
    notes: defaultPlan ? `Interested in ${defaultPlan}` : "",
    preferredSlot: "Tomorrow afternoon (EST)",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Strategy Call Requested!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Thanks {formData.name}. We've received your request for <span className="text-white font-medium">{formData.brandName}</span>. A calendar invitation has been sent to <span className="text-white font-medium">{formData.email}</span>.
            </p>
            <div className="p-4 bg-secondary/50 rounded-xl border border-white/5 text-left text-xs space-y-2 mb-6 text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Clock className="w-4 h-4 text-purple-400" />
                {siteConfig.callMinutes}-Min Creative Strategy & Ad Breakdown
              </div>
              <div>• We'll review your current Meta/TikTok ad creative angles.</div>
              <div>• We'll recommend 3 high-impact hooks specifically for your D2C product.</div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
              <Calendar className="w-4 h-4" />
              {siteConfig.callMinutes}-Min Intro Call
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Book a Creative Strategy Call</h3>
            <p className="text-xs text-muted-foreground mb-5">
              Discuss your D2C brand's creative bottlenecks, test angles, and see how Fernum cuts cost per acquisition on Meta & TikTok.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-destructive/20 border border-destructive/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-3 py-2 bg-secondary/40 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Work Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@yourbrand.com"
                    className="w-full px-3 py-2 bg-secondary/40 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Brand / Store Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g. Aura Health"
                    className="w-full px-3 py-2 bg-secondary/40 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Store URL / Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourbrand.com"
                    className="w-full px-3 py-2 bg-secondary/40 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Estimated Monthly Meta/TikTok Ad Spend
                </label>
                <select
                  value={formData.monthlyAdSpend}
                  onChange={(e) => setFormData({ ...formData, monthlyAdSpend: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/40 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="<$5k/mo">Less than $5,000 / mo</option>
                  <option value="$5k - $20k/mo">$5,000 - $20,000 / mo</option>
                  <option value="$20k - $50k/mo">$20,000 - $50,000 / mo</option>
                  <option value="$50k - $100k+/mo">$50,000 - $100,000+ / mo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Questions or Creative Focus (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tell us what product you want to scale or hooks you want to test..."
                  className="w-full px-3 py-2 bg-secondary/40 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Reserving Slot...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm {siteConfig.callMinutes}-Min Strategy Session</span>
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
