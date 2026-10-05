"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, HardDrive, RefreshCw } from "lucide-react";
import { playClickSound, playSuccessSound } from "@/lib/interactive/sound";

export function FernumBeforeAfter() {
  const [isCleaned, setIsCleaned] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleToggleCleanup = () => {
    if (isCleaning) return;
    playClickSound();

    if (!isCleaned) {
      setIsCleaning(true);
      setTimeout(() => {
        setIsCleaned(true);
        setIsCleaning(false);
        playSuccessSound();
      }, 700);
    } else {
      setIsCleaned(false);
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-[#0A0B0F] border-b border-[#2A2F3D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15171D] border border-[#2A2F3D] text-xs font-mono-data text-[#B6FF33] uppercase tracking-wider mb-4">
            <span>● THE IMPACT SIMULATOR</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#F5F7FA] tracking-tight uppercase leading-[0.98] mb-4">
            FROM STORAGE PANIC
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B4B] via-[#FF8A34] to-[#B6FF33]">
              TO BREATHING ROOM.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#A5ABB8] font-normal max-w-xl mx-auto leading-relaxed">
            You decide what goes. Fernum helps you see the impact before you clean.
          </p>
        </div>

        {/* Before / After Interactive Storage Board */}
        <div className="max-w-4xl mx-auto">
          {/* Toggle Control Switch */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={`text-xs font-mono-data font-bold uppercase transition-colors ${
                !isCleaned ? "text-[#FF4B4B]" : "text-[#A5ABB8]"
              }`}
            >
              BEFORE (PANIC STATE)
            </span>

            <button
              onClick={handleToggleCleanup}
              disabled={isCleaning}
              className={`relative w-16 h-8 rounded-full p-1 border transition-colors ${
                isCleaned
                  ? "bg-[#B6FF33] border-[#B6FF33]"
                  : "bg-[#1E2129] border-[#2A2F3D]"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#0A0B0F] transition-transform duration-300 ${
                  isCleaned ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>

            <span
              className={`text-xs font-mono-data font-bold uppercase transition-colors ${
                isCleaned ? "text-[#B6FF33]" : "text-[#A5ABB8]"
              }`}
            >
              AFTER FERNUM (BREATHING ROOM)
            </span>
          </div>

          {/* Drive Status Comparison Card */}
          <div className="rounded-2xl bg-[#15171D] border border-[#2A2F3D] p-6 sm:p-10 shadow-2xl relative overflow-hidden border-hud">
            {/* Header readouts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#2A2F3D] gap-4">
              <div className="flex items-center gap-3">
                <HardDrive className={`w-6 h-6 ${isCleaned ? "text-[#B6FF33]" : "text-[#FF4B4B]"}`} />
                <div>
                  <div className="font-display font-black text-2xl text-[#F5F7FA]">
                    PRIMARY DRIVE (C:)
                  </div>
                  <div className="text-xs font-mono-data text-[#A5ABB8]">
                    NVMe PCIE 4.0 SSD — 512 GB TOTAL CAPACITY
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div
                  className={`font-mono-data font-black text-3xl transition-colors ${
                    isCleaned ? "text-[#B6FF33]" : "text-[#FF4B4B]"
                  }`}
                >
                  {isCleaned ? "126.4 GB AVAILABLE" : "7.8 GB AVAILABLE"}
                </div>
                <div className="text-xs font-mono-data text-[#A5ABB8]">
                  {isCleaned ? "63% FULL (HEALTHY)" : "91% FULL (CRITICAL PRESSURE)"}
                </div>
              </div>
            </div>

            {/* Storage Gauge Bar */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between text-xs font-mono-data text-[#A5ABB8]">
                <span>DRIVE OCCUPANCY</span>
                <span>{isCleaned ? "385.6 GB / 512 GB" : "504.2 GB / 512 GB"}</span>
              </div>

              {/* Multi-segment visual bar */}
              <div className="h-7 w-full rounded-xl bg-[#0A0B0F] border border-[#2A2F3D] overflow-hidden p-1 flex items-center">
                <div
                  style={{ width: isCleaned ? "63%" : "91%" }}
                  className={`h-full rounded-lg transition-all duration-700 ${
                    isCleaned
                      ? "bg-gradient-to-r from-[#48C8FF] via-[#8E5CFF] to-[#B6FF33]"
                      : "bg-gradient-to-r from-[#FF8A34] to-[#FF4B4B]"
                  }`}
                />
              </div>
            </div>

            {/* Clutter Blocks Status Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-[#0A0B0F] border border-[#2A2F3D]">
                <div className="text-xs font-mono-data text-[#A5ABB8] mb-1">
                  Orphaned Game Shaders
                </div>
                <div className={`font-mono-data font-bold text-lg ${isCleaned ? "text-[#B6FF33]" : "text-[#FF8A34]"}`}>
                  {isCleaned ? "0 GB (Purged)" : "38.2 GB"}
                </div>
                <div className="text-[10px] font-mono-data text-[#A5ABB8] mt-1">
                  {isCleaned ? "Safely eliminated" : "From uninstalled titles"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0B0F] border border-[#2A2F3D]">
                <div className="text-xs font-mono-data text-[#A5ABB8] mb-1">
                  Downloads Clutter
                </div>
                <div className={`font-mono-data font-bold text-lg ${isCleaned ? "text-[#B6FF33]" : "text-[#FF4FCD]"}`}>
                  {isCleaned ? "4.2 GB (Reviewed)" : "42.8 GB"}
                </div>
                <div className="text-[10px] font-mono-data text-[#A5ABB8] mt-1">
                  {isCleaned ? "Kept only important files" : "Duplicate ISOs & old zips"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0B0F] border border-[#2A2F3D]">
                <div className="text-xs font-mono-data text-[#A5ABB8] mb-1">
                  Cryptic Temp & Logs
                </div>
                <div className={`font-mono-data font-bold text-lg ${isCleaned ? "text-[#B6FF33]" : "text-[#8E5CFF]"}`}>
                  {isCleaned ? "1.1 GB (Optimized)" : "37.6 GB"}
                </div>
                <div className="text-[10px] font-mono-data text-[#A5ABB8] mt-1">
                  {isCleaned ? "Stale caches wiped" : "Discord & Adobe dumps"}
                </div>
              </div>
            </div>

            {/* Interactive Cleanup Trigger Button */}
            <div className="pt-6 border-t border-[#2A2F3D] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono-data text-[#A5ABB8]">
                <Sparkles className="w-4 h-4 text-[#B6FF33]" />
                <span>
                  {isCleaned
                    ? "Simulation complete: +118.6 GB breathing room unlocked!"
                    : "Simulate clicking 'Clean Approved Space Hogs'"}
                </span>
              </div>

              <button
                onClick={handleToggleCleanup}
                disabled={isCleaning}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#B6FF33] text-[#0A0B0F] font-display font-black text-xs uppercase tracking-wider hover:bg-[#c6ff54] active:scale-95 transition-all shadow-[0_0_20px_rgba(182,255,51,0.25)] flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isCleaning ? "animate-spin" : ""}`} />
                <span>{isCleaned ? "RESET SIMULATOR" : "SIMULATE CLEANUP (+118.6 GB)"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
