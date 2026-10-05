"use client";

import React, { useState } from "react";
import { FolderDown, Image, Gamepad2, FileQuestion, ArrowUpRight, Sparkles } from "lucide-react";
import { playClickSound, playPopSound } from "@/lib/interactive/sound";

export function FernumProblemSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const suspects = [
    {
      id: "downloads",
      title: "DOWNLOADS DUNGEON",
      typicalSize: "44.6 GB",
      accent: "#FF4FCD",
      icon: FolderDown,
      tag: "THE FORGOTTEN PIT",
      description:
        "Old installers, forgotten ZIP files, duplicate PDFs, and files you downloaded once and never opened again.",
      clutterSamples: ["NVIDIA_driver_v536.exe (640 MB)", "Assignment_Final_v3_FINAL.zip (2.1 GB)", "Archived_Backups_2024.tar (14 GB)"],
    },
    {
      id: "screenshots",
      title: "SCREENSHOT GRAVEYARD",
      typicalSize: "18.2 GB",
      accent: "#48C8FF",
      icon: Image,
      tag: "THE VIBE ARCHIVE",
      description:
        "Thousands of screenshots. One might be important. The rest are just accidental keyboard slips and Discord memes.",
      clutterSamples: ["Screen_2025_02_14_4K.png (12 MB)", "Discord_render_clip_091.mp4 (480 MB)", "Desktop_Receipt_crop.png (8 MB)"],
    },
    {
      id: "games",
      title: "GAME FILE BLACK HOLE",
      typicalSize: "84.9 GB",
      accent: "#FF8A34",
      icon: Gamepad2,
      tag: "ORPHANED LAUNCHERS",
      description:
        "Massive game folders, old launchers, leftover updates, and files from games you uninstalled months ago.",
      clutterSamples: ["CallOfDuty_ShaderPrecache (28.4 GB)", "RiotGames_PatchBackup_Old (12.1 GB)", "Steam_steamapps_downloading (44.4 GB)"],
    },
    {
      id: "mystery",
      title: "MYSTERY STORAGE",
      typicalSize: "32.7 GB",
      accent: "#8E5CFF",
      icon: FileQuestion,
      tag: "CRYPTIC CACHES",
      description:
        "Huge folders with names that look like Wi-Fi passwords. Fernum translates the cryptic paths and helps you see what they actually are.",
      clutterSamples: ["AppData/Local/D3DSCache (14.2 GB)", "C:/Windows/Temp/cbr_dump (9.8 GB)", "Roaming/Adobe/MediaCache (8.7 GB)"],
    },
  ];

  return (
    <section id="the-suspects" className="py-24 sm:py-32 bg-[#0A0B0F] border-b border-[#2A2F3D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15171D] border border-[#2A2F3D] text-xs font-mono-data text-[#48C8FF] uppercase tracking-wider mb-4">
            <span>● THE USUAL SUSPECTS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#F5F7FA] tracking-tight uppercase leading-[0.98] mb-4">
            YOUR STORAGE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A34] via-[#FF4FCD] to-[#8E5CFF]">
              HAS A BACKSTORY.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#A5ABB8] font-normal leading-relaxed">
            Every full drive has a few usual suspects eating gigabytes behind the scenes.
          </p>
        </div>

        {/* 4 Interactive Suspect Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {suspects.map((card, idx) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === idx;

            return (
              <div
                key={card.id}
                onMouseEnter={() => {
                  setHoveredCard(idx);
                  playPopSound();
                }}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative p-7 sm:p-9 rounded-2xl bg-[#15171D] border transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                  isHovered
                    ? "border-[#F5F7FA]/30 -translate-y-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                    : "border-[#2A2F3D] hover:border-[#2A2F3D]/80"
                }`}
              >
                {/* Glow accent in corner */}
                <div
                  className="absolute top-0 right-0 w-36 h-36 rounded-full blur-[60px] opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none"
                  style={{ backgroundColor: card.accent }}
                />

                <div>
                  {/* Top Tag & Size Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="px-2.5 py-1 rounded text-[10px] font-mono-data font-bold uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${card.accent}15`,
                        borderColor: `${card.accent}40`,
                        color: card.accent,
                      }}
                    >
                      {card.tag}
                    </span>

                    <div className="font-mono-data font-black text-sm text-[#F5F7FA] bg-[#0A0B0F] px-3 py-1 rounded-lg border border-[#2A2F3D]">
                      ~{card.typicalSize}
                    </div>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border transition-colors"
                      style={{
                        backgroundColor: "#0A0B0F",
                        borderColor: isHovered ? card.accent : "#2A2F3D",
                      }}
                    >
                      <Icon
                        className="w-6 h-6 transition-transform group-hover:scale-110"
                        style={{ color: card.accent }}
                      />
                    </div>

                    <h3 className="font-display font-black text-xl sm:text-2xl text-[#F5F7FA] tracking-tight uppercase">
                      {card.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#A5ABB8] leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Simulated Clutter Inspector on Hover */}
                <div className="pt-4 border-t border-[#2A2F3D]/80">
                  <div className="text-[10px] font-mono-data uppercase tracking-wider text-[#A5ABB8] mb-2">
                    Common Space Hogs:
                  </div>
                  <div className="space-y-1.5">
                    {card.clutterSamples.map((sample, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between text-xs font-mono-data px-2.5 py-1 rounded bg-[#0A0B0F] border border-[#2A2F3D]/60 text-[#A5ABB8] group-hover:text-[#F5F7FA] transition-colors"
                      >
                        <span className="truncate max-w-[240px]">{sample.split(" (")[0]}</span>
                        <span className="text-[#FF8A34] font-bold">({sample.split(" (")[1]}</span>
                      </div>
                    ))}
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
