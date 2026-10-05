"use client";

import React from "react";
import { Shield, Lock, Eye, CheckCircle2, Cpu, FileCheck } from "lucide-react";
import { playClickSound } from "@/lib/interactive/sound";

export function FernumSafetySection() {
  const trustCards = [
    {
      title: "PREVIEW BEFORE DELETING",
      description: "See exact file paths, creation dates, and true disk weight before taking any action. Never fly blind.",
      icon: Eye,
      accent: "#48C8FF",
    },
    {
      title: "YOU CHOOSE WHAT GOES",
      description: "No rogue background auto-deletions. Nothing is ever touched or removed without your deliberate confirmation.",
      icon: Lock,
      accent: "#B6FF33",
    },
    {
      title: "FIND BIG FILES FAST",
      description: "Understand what is eating your drive in seconds without tedious manual digging through deep subdirectories.",
      icon: FileCheck,
      accent: "#FF8A34",
    },
    {
      title: "START WITH A FREE SCAN",
      description: "Get complete drive transparency first. Inspect the exact clutter footprint before making any cleanup decisions.",
      icon: CheckCircle2,
      accent: "#8E5CFF",
    },
    {
      title: "BUILT NATIVE FOR WINDOWS",
      description: "Purpose-built for Windows 10 & 11 with direct Win32 & NTFS integration. Low memory footprint, zero bloatware.",
      icon: Cpu,
      accent: "#48C8FF",
    },
  ];

  return (
    <section id="safety" className="py-24 sm:py-32 bg-[#0A0B0F] border-b border-[#2A2F3D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15171D] border border-[#2A2F3D] text-xs font-mono-data text-[#B6FF33] uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5 text-[#B6FF33]" />
            <span>● CONTROL & TRUST ARCHITECTURE</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#F5F7FA] tracking-tight uppercase leading-[0.98] mb-4">
            YOU’RE IN CONTROL.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF33] via-[#48C8FF] to-[#F5F7FA]">
              NOT THE CLEANUP BOT.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#A5ABB8] font-normal leading-relaxed">
            Fernum shows you what is taking space. You choose what stays and what goes.
          </p>
        </div>

        {/* Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {trustCards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="p-7 sm:p-8 rounded-2xl bg-[#15171D] border border-[#2A2F3D] hover:border-[#2A2F3D]/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="w-11 h-11 rounded-xl bg-[#0A0B0F] border border-[#2A2F3D] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform"
                    style={{ borderColor: `${card.accent}40` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.accent }} />
                  </div>

                  <h3 className="font-display font-black text-lg sm:text-xl text-[#F5F7FA] uppercase tracking-tight mb-3">
                    {card.title}
                  </h3>

                  <p className="text-sm text-[#A5ABB8] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#2A2F3D]/60 flex items-center gap-2 text-[10px] font-mono-data text-[#A5ABB8]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.accent }} />
                  <span>VERIFIED SAFE PROTOCOL</span>
                </div>
              </div>
            );
          })}

          {/* Windows Certified Card */}
          <div className="p-7 sm:p-8 rounded-2xl bg-gradient-to-br from-[#15171D] to-[#1E2129] border border-[#B6FF33]/30 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#B6FF33]/15 border border-[#B6FF33]/40 flex items-center justify-center mb-6">
                <Shield className="w-5 h-5 text-[#B6FF33]" />
              </div>

              <h3 className="font-display font-black text-lg sm:text-xl text-[#F5F7FA] uppercase tracking-tight mb-3">
                SYSTEM FILE IMMUNITY
              </h3>

              <p className="text-sm text-[#A5ABB8] leading-relaxed">
                Critical Windows system folders (WinSxS, System32, kernel boot files) are cryptographically write-protected from accidental deletion.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#2A2F3D]/60 flex items-center justify-between text-[10px] font-mono-data text-[#B6FF33]">
              <span>IMMUNITY ENGINE v1.2</span>
              <span>LOCKED &amp; SECURED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
