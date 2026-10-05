"use client";

import React, { useState } from "react";
import { LayoutGrid, FolderTree, PieChart, Copy, ShieldCheck, Zap, FileSpreadsheet, Monitor, Sparkles } from "lucide-react";
import { playPopSound } from "@/lib/interactive/sound";

export function FernumFeatureGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const features = [
    {
      title: "VISUAL DRIVE MAP",
      category: "TREEMAP VISUALIZER",
      description: "Interactive visual blocks map every gigabyte proportionately, turning raw folder hierarchies into an intuitive spatial map.",
      icon: LayoutGrid,
      accent: "#48C8FF",
      badge: "CORE ENGINE",
    },
    {
      title: "LARGEST FOLDERS FINDER",
      category: "DEEP INDEXING",
      description: "Instantly bubble up the heavyweight culprits consuming 10 GB+ across nested directories without manual digging.",
      icon: FolderTree,
      accent: "#FF8A34",
      badge: "INSTANT DISCOVERY",
    },
    {
      title: "FILE TYPE ANALYSIS",
      category: "METRIC BREAKDOWN",
      description: "Break down space usage by media category: ISO disk images, raw screen captures, game shaders, or dormant zip files.",
      icon: PieChart,
      accent: "#8E5CFF",
      badge: "CATEGORIZATION",
    },
    {
      title: "DUPLICATE-FILE DISCOVERY",
      category: "INTELLIGENT DEDUP",
      description: "Byte-by-byte SHA-256 hash comparison to isolate identical installer archives and multi-downloaded assets.",
      icon: Copy,
      accent: "#FF4FCD",
      badge: "COMING SOON",
    },
    {
      title: "SAFE CLEANUP REVIEW",
      category: "PROTECTED STAGING",
      description: "Stage files into a sandbox review queue before executing any action. Clear summaries of exact space to be reclaimed.",
      icon: ShieldCheck,
      accent: "#B6FF33",
      badge: "SAFETY FIRST",
    },
    {
      title: "FAST DRIVE SCANNING",
      category: "NTFS MFT ENGINE",
      description: "Scans up to 1,000,000 files in under 45 seconds using direct NTFS journal traversal with negligible CPU overhead.",
      icon: Zap,
      accent: "#48C8FF",
      badge: "ULTRA FAST",
    },
    {
      title: "CLEAR STORAGE REPORTS",
      category: "EXPORTABLE AUDIT",
      description: "Export clean CSV and JSON disk health audits to document before-and-after storage stats for client or gaming PCs.",
      icon: FileSpreadsheet,
      accent: "#FF8A34",
      badge: "REPORTS",
    },
    {
      title: "WINDOWS-FRIENDLY INTERFACE",
      category: "NATIVE INTEGRATION",
      description: "Optimized for Windows 10 & 11 with dark mode, high-DPI scaling, smooth DirectX acceleration, and zero bloat.",
      icon: Monitor,
      accent: "#B6FF33",
      badge: "WIN 10 & 11",
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 bg-[#0A0B0F] border-b border-[#2A2F3D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15171D] border border-[#2A2F3D] text-xs font-mono-data text-[#B6FF33] uppercase tracking-wider mb-4">
            <span>● PRODUCT CAPABILITIES</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#F5F7FA] tracking-tight uppercase leading-[0.98] mb-4">
            YOUR STORAGE.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF33] via-[#48C8FF] to-[#FF8A34]">
              EXPLAINED.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#A5ABB8] font-normal max-w-xl mx-auto leading-relaxed">
            Smart tools engineered to give you clarity, control, and breathing room on your Windows PC.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={feat.title}
                onMouseEnter={() => {
                  setHoveredIdx(idx);
                  playPopSound();
                }}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-6 sm:p-7 rounded-2xl bg-[#15171D] border transition-all duration-300 flex flex-col justify-between group ${
                  isHovered
                    ? "border-[#F5F7FA]/30 -translate-y-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
                    : "border-[#2A2F3D] hover:border-[#2A2F3D]/80"
                }`}
              >
                <div>
                  {/* Top Category & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono-data text-[#A5ABB8] uppercase tracking-wider">
                      {feat.category}
                    </span>

                    <span
                      className={`text-[9px] font-mono-data font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        feat.badge === "COMING SOON"
                          ? "bg-[#FF4FCD]/15 border-[#FF4FCD]/40 text-[#FF4FCD]"
                          : "bg-[#0A0B0F] border-[#2A2F3D] text-[#A5ABB8]"
                      }`}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl bg-[#0A0B0F] border border-[#2A2F3D] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform"
                    style={{ borderColor: `${feat.accent}40` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: feat.accent }} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-black text-lg text-[#F5F7FA] uppercase tracking-tight mb-2.5">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A5ABB8] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#2A2F3D]/60 flex items-center gap-1.5 text-[10px] font-mono-data text-[#A5ABB8]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: feat.accent }} />
                  <span>INTEL ENGINE MODULE</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
