"use client";

import React from "react";
import { Sparkles, ArrowRight, Lock } from "lucide-react";

interface PhasePreviewProps {
  title: string;
  phaseNumber: string;
  description: string;
  features: string[];
}

export function PhasePreview({
  title,
  phaseNumber,
  description,
  features,
}: PhasePreviewProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full p-8 rounded-3xl bg-card/60 border border-border/80 text-center space-y-5 shadow-2xl backdrop-blur-md">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <Lock className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {phaseNumber} Roadmap Milestone
          </span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 text-left space-y-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Planned Deliverables:
          </span>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-purple-400 flex-shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[11px] text-muted-foreground/60 font-mono">
          Phase 1 Foundation is currently active. Awaiting sign-off to begin Phase 2.
        </p>
      </div>
    </div>
  );
}
