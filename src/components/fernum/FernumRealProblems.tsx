"use client";

import React, { useState } from "react";
import { AlertCircle, Clock, Gamepad2, FolderArchive, Film, ArrowRight } from "lucide-react";
import { playPopSound } from "@/lib/interactive/sound";

export function FernumRealProblems() {
  const [activeMoment, setActiveMoment] = useState<number>(0);

  const moments = [
    {
      title: "THE ASSIGNMENT DEADLINE CRISIS",
      time: "11:42 PM — 18 MINUTES BEFORE PORTAL CLOSES",
      icon: Clock,
      accent: "#FF4B4B",
      scenario: "Your laptop throws a modal: 'Storage Full. Cannot save temp scratch files.'",
      outcome: "Fernum scans your drive in 40 seconds, spots a 16 GB leftover render cache in AppData, and clears it immediately so you submit on time.",
      sizeReclaimed: "+16.2 GB RECLAIMED",
    },
    {
      title: "THE 80 GB GAME UPDATE SHOWDOWN",
      time: "FRIDAY 8:00 PM — SQUAD IS IN DISCORD",
      icon: Gamepad2,
      accent: "#FF8A34",
      scenario: "The new season patch demands 82 GB. Windows Explorer shows only 6.8 GB available.",
      outcome: "Fernum reveals 44 GB of uninstalled game launcher shader residue and 28 GB of shadowplay recordings you didn't even know were recording.",
      sizeReclaimed: "+72.4 GB RECLAIMED",
    },
    {
      title: "THE DOWNLOADS ARCHAEOLOGY EXPEDITION",
      time: "SUNDAY AFTERNOON CLEANUP",
      icon: FolderArchive,
      accent: "#FF4FCD",
      iconColor: "#FF4FCD",
      scenario: "Your Downloads folder contains 3,840 files spanning 4 years of college, memes, and drivers.",
      outcome: "Fernum groups every file by age and size. You wipe 30 duplicate zip files and old installers with three clicks while keeping your essential documents.",
      sizeReclaimed: "+38.9 GB RECLAIMED",
    },
    {
      title: "THE 4K VIDEO SCRATCH DISK CRASH",
      time: "MID-EDIT TIMELINE FREEZE",
      icon: Film,
      accent: "#48C8FF",
      scenario: "Premiere or DaVinci crashes because the media cache drive ran out of sectors.",
      outcome: "Fernum targets orphaned preview peaks and conform files from old exported projects, reclaiming 55 GB in seconds without damaging project files.",
      sizeReclaimed: "+55.1 GB RECLAIMED",
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#0A0B0F] border-b border-[#2A2F3D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15171D] border border-[#2A2F3D] text-xs font-mono-data text-[#FF8A34] uppercase tracking-wider mb-4">
            <span>● REAL-WORLD SCENARIOS</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#F5F7FA] tracking-tight uppercase leading-[0.98] mb-4">
            BUILT FOR REAL
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A34] via-[#FF4FCD] to-[#48C8FF]">
              PC EMERGENCIES.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#A5ABB8] font-normal leading-relaxed">
            Storage panic doesn't happen in a vacuum. It strikes right when you need your PC the most.
          </p>
        </div>

        {/* 4 Interactive Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {moments.map((m, idx) => {
            const Icon = m.icon;
            const isActive = activeMoment === idx;

            return (
              <div
                key={m.title}
                onMouseEnter={() => {
                  setActiveMoment(idx);
                  playPopSound();
                }}
                className={`p-7 sm:p-9 rounded-2xl bg-[#15171D] border transition-all duration-300 flex flex-col justify-between group ${
                  isActive
                    ? "border-[#F5F7FA]/30 -translate-y-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                    : "border-[#2A2F3D] hover:border-[#2A2F3D]/80"
                }`}
              >
                <div>
                  {/* Timestamp header */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono-data text-[#A5ABB8] tracking-wider uppercase">
                      {m.time}
                    </span>

                    <span
                      className="px-2.5 py-1 rounded text-[10px] font-mono-data font-bold uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${m.accent}15`,
                        borderColor: `${m.accent}40`,
                        color: m.accent,
                      }}
                    >
                      {m.sizeReclaimed}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl bg-[#0A0B0F] border flex items-center justify-center shrink-0"
                      style={{ borderColor: `${m.accent}40` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: m.accent }} />
                    </div>

                    <h3 className="font-display font-black text-xl text-[#F5F7FA] uppercase tracking-tight">
                      {m.title}
                    </h3>
                  </div>

                  {/* Scenario Panic */}
                  <div className="p-3.5 rounded-xl bg-[#0A0B0F] border border-[#2A2F3D] mb-4">
                    <div className="text-[10px] font-mono-data text-[#FF4B4B] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>THE BOTTLENECK:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#F5F7FA] font-medium leading-snug">
                      {m.scenario}
                    </p>
                  </div>

                  {/* Outcome */}
                  <p className="text-xs sm:text-sm text-[#A5ABB8] leading-relaxed">
                    {m.outcome}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-[#2A2F3D]/60 flex items-center justify-between text-[10px] font-mono-data text-[#B6FF33]">
                  <span>FERNUM RESOLUTION PROTOCOL</span>
                  <span>100% USER APPROVED</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
