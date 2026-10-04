"use client";

import React from "react";
import { X, ShieldCheck } from "lucide-react";

export type PolicyType = "terms" | "refund" | "privacy" | null;

interface InhousePolicyModalProps {
  policy: PolicyType;
  onClose: () => void;
}

export function InhousePolicyModal({ policy, onClose }: InhousePolicyModalProps) {
  if (!policy) return null;

  const content = {
    terms: {
      title: "Terms of Service",
      subtitle: "Last updated: October 2026",
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <p>
            Welcome to Fernum (fernum.online). By subscribing to Fernum AdPass, you agree to these Terms of Service.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">1. Services & Deliverables</h4>
          <p>
            Fernum provides short-form video ad production services on a monthly subscription basis. Deliverables include finished video ads in Full HD format across 9:16, 1:1, and 16:9 aspect ratios, each accompanied by 3 alternate hook openers.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">2. Script Approval Guarantee</h4>
          <p>
            Clients must approve written script concepts before video generation and editing begin. Each ad slot includes two (2) rounds of revisions to adjust pacing, audio, captions, or visuals.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">3. Commercial Rights & Likeness</h4>
          <p>
            Fernum grants clients a worldwide, perpetual commercial license to distribute the finalized ad deliverables across paid and organic digital channels (including Meta, TikTok, YouTube, and Google). Fernum uses 100% commercially licensed audio and compliant visual generation. We never utilize unauthorized real person or celebrity likenesses.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">4. Cancellation & Pause</h4>
          <p>
            Monthly subscriptions can be paused or cancelled at any time prior to the next billing cycle via your client portal.
          </p>
        </div>
      ),
    },
    refund: {
      title: "Refund Policy",
      subtitle: "Clear, fair, transparent terms",
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <p>
            At Fernum, we maintain a transparent, quality-first approach to production.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">1. Before Script Approval</h4>
          <p>
            If you submit a brief and our creative team has not yet delivered an approved script concept, you may request a 100% full refund within 7 days of payment.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">2. After Script Approval</h4>
          <p>
            Once a script has been approved by the client and compute/editing resources have been allocated, refunds are not issued. However, each ad includes two full rounds of revisions to ensure the final deliverable satisfies your brand standards.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">3. Cancellation</h4>
          <p>
            You may cancel your monthly plan at any time. Your cancellation takes effect at the end of the current billing cycle, and you will retain full access to all deliverables produced.
          </p>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "How we safeguard your data and brand assets",
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <p>
            Fernum respects client privacy. This policy outlines how we handle brand assets, briefs, and personal information.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">1. Asset Confidentiality</h4>
          <p>
            All client brand kits, product photos, footage, and script concepts are stored securely and treated as strictly confidential. We do not sell or share client assets with third parties.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">2. AI Compliance & Platform Policies</h4>
          <p>
            Generated ads comply with Meta, TikTok, and YouTube AI transparency regulations. We automatically provide required platform disclosure tags (#Ad, #AI).
          </p>
          <h4 className="font-bold text-neutral-900 text-sm">3. Payment Security</h4>
          <p>
            Payment transactions are processed securely through certified PCI-DSS compliant providers (Dodo Payments / Stripe). Fernum does not store raw credit card credentials on its servers.
          </p>
        </div>
      ),
    },
  };

  const current = content[policy];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-2xl text-neutral-900 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-200 mb-6 shrink-0">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-neutral-950">
              {current.title}
            </h3>
            <span className="text-xs text-neutral-500 font-mono">{current.subtitle}</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"
            aria-label="Close policy modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-2 flex-1">{current.body}</div>

        {/* Footer */}
        <div className="pt-6 border-t border-neutral-200 mt-6 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
