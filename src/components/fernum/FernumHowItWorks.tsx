"use client";

import React, { useState } from "react";
import { Search, Eye, Trash2, ArrowRight } from "lucide-react";
import { playClickSound, playPopSound } from "@/lib/interactive/sound";

export function FernumHowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "SCAN",
      accent: "#48C8FF",
      tagline: "HIGH-SPEED MFT DRIVE INDEXING",
      summary: "Fernum maps your drive and shows the complete storage picture in under 60 seconds.",
      detail:
        "Using direct NTFS Master File Table indexing with negligible CPU overhead, Fernum maps millions of disk clusters into a high-performance visual footprint without slowing down your games or apps.",
      icon: Search,
      metric: "< 60 SECONDS",
      metricLabel: "Average SSD Scan Time",
    },
    {
      num: "02",
      title: "SPOT",
      accent: "#FF8A34",
      tagline: "INTELLIGENT SPACE HOG REVELATION",
      summary: "Find huge folders, old downloads, hidden files, and apps using more space than expected.",
      detail:
        "Fernum categorizes massive file clusters into clear visual hierarchies. It highlights forgotten game shader caches, 4K screen recordings, uninstalled launcher residue, and duplicate archives.",
      icon: Eye,
      metric: "100% VISIBILITY",
      metricLabel: "True Folder Tree Depth",
    },
    {
      num: "03",
      title: "CLEAR",
      accent: "#B6FF33",
      tagline: "SAFE REVIEW & CONTROLLED PURGE",
      summary: "Review every item, keep what matters, and remove only what you choose.",
      detail:
        "Nothing ever disappears automatically. You preview every file, see safe-to-delete safety badges, and send unwanted junk to the Recycle Bin or permanently shred with total confidence.",
      icon: Trash2,
      metric: "ZERO RISK",
      metricLabel: "Windows System Protection",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#0A0B0F] border-b border-[#2A2F3D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15171D] border border-[#2A2F3D] text-xs font-mono-data text-[#48C8FF] uppercase tracking-wider mb-4">
            <span>● THE WORKFLOW</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#F5F7FA] tracking-tight uppercase leading-[0.98] mb-4">
            THREE STEPS.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#48C8FF] via-[#FF8A34] to-[#B6FF33]">
              ZERO GUESSWORK.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#A5ABB8] font-normal max-w-xl mx-auto leading-relaxed">
            From storage panic to complete drive control in three straightforward stages.
          </p>
        </div>

        {/* 3 Large Stacked Interactive Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={s.num}
                onMouseEnter={() => {
                  setActiveStep(idx);
                  playPopSound();
                }}
                className={`p-8 sm:p-10 rounded-2xl bg-[#15171D] border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                  isSelected
                    ? "border-[#F5F7FA]/30 -translate-y-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                    : "border-[#2A2F3D] hover:border-[#2A2F3D]/80"
                }`}
              >
                {/* Glow accent */}
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[70px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ backgroundColor: s.accent }}
                />

                <div>
                  {/* Top Row: Oversized Number & Tag */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className="font-display font-black text-5xl sm:text-6xl tracking-tighter"
                      style={{ color: s.accent }}
                    >
                      {s.num}
                    </span>

                    <span className="text-[10px] font-mono-data font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#0A0B0F] border border-[#2A2F3D] text-[#A5ABB8]">
                      STAGE {s.num}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-4">
                    <div
                      className="text-xs font-mono-data font-bold uppercase tracking-wider mb-1"
                      style={{ color: s.accent }}
                    >
                      {s.tagline}
                    </div>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-[#F5F7FA] uppercase tracking-tight">
                      {s.title}
                    </h3>
                  </div>

                  {/* Summary & Detail */}
                  <p className="text-base text-[#F5F7FA] font-medium leading-snug mb-3">
                    {s.summary}
                  </p>

                  <p className="text-xs sm:text-sm text-[#A5ABB8] leading-relaxed mb-8">
                    {s.detail}
                  </p>
                </div>

                {/* Bottom Metric Pill */}
                <div className="pt-6 border-t border-[#2A2F3D] flex items-center justify-between">
                  <div>
                    <div className="font-mono-data font-black text-sm text-[#F5F7FA]">
                      {s.metric}
                    </div>
                    <div className="text-[10px] font-mono-data text-[#A5ABB8]">
                      {s.metricLabel}
                    </div>
                  </div>

                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
                    style={{
                      backgroundColor: "#0A0B0F",
                      borderColor: isSelected ? s.accent : "#2A2F3D",
                      color: s.accent,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
