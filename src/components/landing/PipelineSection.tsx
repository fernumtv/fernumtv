"use client";

import React from "react";
import { FileText, CheckCircle2, Cpu, Sparkles, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";

export function PipelineSection() {
  const steps = [
    {
      step: "01",
      icon: FileText,
      title: "Submit Your 5-Minute Brief",
      desc: "Tell us about your product, your core offer (e.g. BOGO, 20% off), your audience's biggest pain point, and any TikTok/Reels references you love.",
      badge: "Intake",
    },
    {
      step: "02",
      icon: CheckCircle2,
      title: "Approve Script & 3 Hooks",
      desc: "We write 3 high-converting script angles tailored to Meta & TikTok psychology. You approve or comment on the exact script before any video renders begin.",
      badge: "You Approve First",
    },
    {
      step: "03",
      icon: Cpu,
      title: "AI Synthesis & Sound Design",
      desc: "Shots are generated with fine-tuned visual models, hyper-realistic voiceover, sound effects, and animated kinetic subtitles stitched via FFmpeg.",
      badge: "Compute Engine",
    },
    {
      step: "04",
      icon: UserCheck,
      title: "Human Creative Director Polish",
      desc: "No raw AI hallucinations. A human video editor reviews pacing, caption sync, brand colors, and loudness before delivering all 3 aspect ratios.",
      badge: "Human QA Gate",
    },
  ];

  return (
    <section id="pipeline" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            The Fernum Production Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            From Approved Script to Final Cut in 48 to 72 Hours
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Our hybrid AI + human pipeline eliminates agency bureaucracy while maintaining studio-grade creative quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative bg-card/60 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/40 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/50 border border-purple-800/30 px-2 py-0.5 rounded">
                      STEP {s.step}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      {s.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-purple-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2 Revisions Included</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
