"use client";

import React from "react";
import { Check, X, Sparkles, HelpCircle } from "lucide-react";

export function ComparisonSection() {
  const rows = [
    {
      feature: "Cost Per Ad",
      fernum: "$333 – $499 / ad (Flat fixed plans)",
      agency: "Variable per ad (with multi-month retainer)",
      freelancer: "$250 – $600 / ad (Hit-or-miss quality)",
    },
    {
      feature: "Alternate Hooks Included",
      fernum: "3 Alternate Hooks with EVERY ad",
      agency: "1 single hook (extra fees for variations)",
      freelancer: "Rarely included, charges per revision",
    },
    {
      feature: "Turnaround Speed",
      fernum: "48-72h post script approval (~2-3 weeks per slot)",
      agency: "4 – 6 weeks with endless kickoff calls",
      freelancer: "Unpredictable / frequent ghosting",
    },
    {
      feature: "Aspect Ratios Included",
      fernum: "9:16 Vertical + 1:1 Feed + 16:9 Landscape",
      agency: "9:16 only (charges extra for resizing)",
      freelancer: "Single format only",
    },
    {
      feature: "Revisions Included",
      fernum: "2 Revisions included on all plans",
      agency: "1 or billed hourly for changes",
      freelancer: "Often resists feedback",
    },
    {
      feature: "Brand Memory System",
      fernum: "Stores brand kit, voice, and past winners forever",
      agency: "Re-briefing required when staff changes",
      freelancer: "None (starts from scratch each time)",
    },
    {
      feature: "Human Quality Gate",
      fernum: "Senior creative editor reviews every video",
      agency: "Junior account manager QA",
      freelancer: "No internal QA",
    },
  ];

  return (
    <section id="comparison" className="py-20 bg-background/40 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Clear Comparison
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Why High-Growth D2C Brands Switch to Fernum
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Get the creative agility of an in-house studio without full-time payroll or agency retainer drag.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 font-semibold text-muted-foreground w-1/4">Feature / Metric</th>
                <th className="py-4 px-4 font-bold text-purple-300 bg-purple-950/40 border-x border-t border-purple-500/30 rounded-t-xl w-1/3">
                  <div className="flex items-center gap-1.5 text-base">
                    <span>⚡ Fernum</span>
                    <span className="text-[10px] uppercase font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full">
                      AI + Human Studio
                    </span>
                  </div>
                </th>
                <th className="py-4 px-4 font-semibold text-muted-foreground w-1/5">Traditional Video Agency</th>
                <th className="py-4 px-4 font-semibold text-muted-foreground w-1/5">Freelance Marketplaces</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-foreground">{r.feature}</td>
                  <td className="py-4 px-4 font-semibold text-white bg-purple-950/20 border-x border-purple-500/20">
                    <div className="flex items-center gap-2 text-purple-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{r.fernum}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400/70 shrink-0" />
                      <span>{r.agency}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400/70 shrink-0" />
                      <span>{r.freelancer}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
