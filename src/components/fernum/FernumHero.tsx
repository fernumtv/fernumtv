"use client";

import React, { useState, useEffect } from "react";
import { Download, Play, ShieldCheck, Zap, HardDrive, RefreshCw, AlertTriangle, Eye, Layers } from "lucide-react";
import { playClickSound, playPopSound, playSuccessSound } from "@/lib/interactive/sound";

export function FernumHero() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(91.4);
  const [activeCategory, setActiveCategory] = useState<string>("games");
  const [safeMode, setSafeMode] = useState(true);

  // Trigger simulated drive scan
  const handleSimulateScan = () => {
    if (isScanning) return;
    playPopSound();
    setIsScanning(true);
    let p = 15;
    const interval = setInterval(() => {
      p += 14;
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        playSuccessSound();
      }
    }, 180);
  };

  const categories = [
    {
      id: "games",
      name: "Games & Launchers",
      size: "38.2 GB",
      color: "#FF8A34",
      highlight: true,
      description: "Old shader caches, uninstalled Steam leftovers, DirectX dumps",
      filesCount: "1,420 files",
    },
    {
      id: "downloads",
      name: "Downloads Dungeon",
      size: "24.6 GB",
      color: "#FF4FCD",
      highlight: false,
      description: "Duplicate .zip archives, forgotten .iso images, old setup.exe",
      filesCount: "842 files",
    },
    {
      id: "videos",
      name: "Screen Recordings & Clips",
      size: "18.9 GB",
      color: "#48C8FF",
      highlight: false,
      description: "Shadowplay clips, OBS temp captures, Discord cache",
      filesCount: "114 files",
    },
    {
      id: "temp",
      name: "Temporary & Shader Cache",
      size: "14.1 GB",
      color: "#8E5CFF",
      highlight: false,
      description: "Windows update backups, AppData/Local/Temp caches",
      filesCount: "8,920 files",
    },
    {
      id: "system",
      name: "System & Core Apps",
      size: "68.2 GB",
      color: "#A5ABB8",
      highlight: false,
      description: "Windows OS protected files (Safe Mode locks these)",
      filesCount: "Protected",
    },
  ];

  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-command-grid">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#B6FF33]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#48C8FF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Direct Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Terminal Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#15171D] border border-[#2A2F3D] text-[11px] font-mono-data uppercase tracking-wider text-[#B6FF33]">
              <span className="w-2 h-2 rounded-full bg-[#B6FF33] animate-pulse" />
              <span>WINDOWS STORAGE, FINALLY EXPLAINED.</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-[68px] leading-[0.98] tracking-tight uppercase text-[#F5F7FA]">
              YOUR PC IS FULL.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF33] via-[#48C8FF] to-[#8E5CFF]">
                LET’S FIND OUT WHY.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#A5ABB8] font-normal leading-relaxed max-w-xl">
              Fernum turns confusing disk space into a clear visual map—so you can find huge files, forgotten folders, and storage clutter without guessing what is safe to remove.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#download"
                onClick={playClickSound}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#B6FF33] text-[#0A0B0F] font-display font-black text-sm uppercase tracking-wider hover:bg-[#c6ff54] active:scale-95 transition-all shadow-[0_0_30px_rgba(182,255,51,0.3)] hover:shadow-[0_0_45px_rgba(182,255,51,0.5)]"
              >
                <Download className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
                <span>SCAN MY PC — FREE</span>
              </a>

              <a
                href="#demo"
                onClick={playClickSound}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#15171D] hover:bg-[#1E2129] border border-[#2A2F3D] text-[#F5F7FA] font-display font-bold text-sm uppercase tracking-wider transition-all"
              >
                <Play className="w-4 h-4 text-[#48C8FF] fill-[#48C8FF]" />
                <span>SEE IT IN ACTION</span>
              </a>
            </div>

            {/* Trust Subtext */}
            <div className="flex items-center gap-6 pt-2 text-xs font-mono-data text-[#A5ABB8]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B6FF33]" />
                <span>Safe cleanup mode default</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#48C8FF]" />
                <span>No bloatware, 42 MB</span>
              </div>
            </div>
          </div>

          {/* Right Column: Next-Gen Storage Command Center Visual */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-[#15171D] border border-[#2A2F3D] p-5 sm:p-7 shadow-2xl overflow-hidden border-hud">
              {/* Scanline radar animation overlay */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B6FF33] to-transparent animate-radar-sweep pointer-events-none z-30" />
              )}

              {/* HUD Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#2A2F3D]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4B4B] animate-ping" />
                  <span className="text-xs font-mono-data font-bold uppercase tracking-wider text-[#FF8A34]">
                    SYSTEM STATUS: STORAGE PRESSURE DETECTED
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playClickSound();
                      setSafeMode(!safeMode);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono-data uppercase tracking-wider border transition-colors ${
                      safeMode
                        ? "bg-[#B6FF33]/10 border-[#B6FF33] text-[#B6FF33]"
                        : "bg-[#1E2129] border-[#2A2F3D] text-[#A5ABB8]"
                    }`}
                  >
                    SAFE MODE: {safeMode ? "ON" : "OFF"}
                  </button>

                  <button
                    onClick={handleSimulateScan}
                    disabled={isScanning}
                    className="p-1.5 rounded bg-[#1E2129] hover:bg-[#252A36] border border-[#2A2F3D] text-[#48C8FF] hover:text-[#F5F7FA] transition-colors"
                    title="Simulate Drive Scan"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Central Drive Gauge & Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center mb-6">
                {/* Gauge */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#0A0B0F] border border-[#2A2F3D]">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="text-[#1E2129]"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="text-[#FF4B4B] transition-all duration-700"
                        strokeWidth="10"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 * (1 - scanProgress / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display font-black text-2xl text-[#F5F7FA]">
                        91.4%
                      </span>
                      <span className="text-[10px] font-mono-data text-[#FF4B4B] font-bold">
                        CRITICAL
                      </span>
                    </div>
                  </div>

                  <span className="mt-2 text-xs font-mono-data text-[#A5ABB8]">
                    NVMe DRIVE C: (512 GB)
                  </span>
                </div>

                {/* Readouts */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="p-3 rounded-lg bg-[#0A0B0F] border border-[#2A2F3D]">
                    <div className="text-[10px] font-mono-data text-[#A5ABB8] uppercase">
                      Free Space Remaining
                    </div>
                    <div className="font-mono-data font-black text-xl text-[#FF4B4B]">
                      7.8 GB AVAILABLE
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1E2129] border border-[#B6FF33]/40 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono-data text-[#B6FF33] font-bold uppercase">
                        Safe Review Target
                      </div>
                      <div className="font-mono-data font-black text-2xl text-[#F5F7FA]">
                        38.2 GB
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#B6FF33]/15 text-[#B6FF33] text-[10px] font-mono-data font-bold">
                      READY FOR REVIEW
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Storage Treemap Block Visualizer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-data text-[#A5ABB8]">
                  <span>STORAGE BREAKDOWN MAP</span>
                  <span>CLICK TO INSPECT</span>
                </div>

                {/* Weighted Segmented Bar */}
                <div className="h-6 w-full rounded-lg overflow-hidden flex border border-[#2A2F3D] cursor-pointer">
                  <div
                    onClick={() => {
                      playClickSound();
                      setActiveCategory("games");
                    }}
                    style={{ width: "35%", backgroundColor: "#FF8A34" }}
                    className="h-full hover:brightness-125 transition-all relative group"
                    title="Games & Launchers (38.2 GB)"
                  />
                  <div
                    onClick={() => {
                      playClickSound();
                      setActiveCategory("downloads");
                    }}
                    style={{ width: "23%", backgroundColor: "#FF4FCD" }}
                    className="h-full hover:brightness-125 transition-all"
                    title="Downloads Dungeon (24.6 GB)"
                  />
                  <div
                    onClick={() => {
                      playClickSound();
                      setActiveCategory("videos");
                    }}
                    style={{ width: "17%", backgroundColor: "#48C8FF" }}
                    className="h-full hover:brightness-125 transition-all"
                    title="Screen Recordings & Clips (18.9 GB)"
                  />
                  <div
                    onClick={() => {
                      playClickSound();
                      setActiveCategory("temp");
                    }}
                    style={{ width: "13%", backgroundColor: "#8E5CFF" }}
                    className="h-full hover:brightness-125 transition-all"
                    title="Temporary & Shader Cache (14.1 GB)"
                  />
                  <div
                    onClick={() => {
                      playClickSound();
                      setActiveCategory("system");
                    }}
                    style={{ width: "12%", backgroundColor: "#6B7280" }}
                    className="h-full hover:brightness-125 transition-all"
                    title="Windows Protected (68.2 GB)"
                  />
                </div>

                {/* Active Category Detail Card */}
                {(() => {
                  const item = categories.find((c) => c.id === activeCategory) || categories[0];
                  return (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#0A0B0F] border border-[#2A2F3D] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <div className="text-sm font-bold text-[#F5F7FA]">
                            {item.name}
                          </div>
                          <div className="text-xs text-[#A5ABB8]">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono-data font-black text-sm text-[#F5F7FA]">
                          {item.size}
                        </div>
                        <div className="text-[10px] font-mono-data text-[#A5ABB8]">
                          {item.filesCount}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Bottom Command Simulator Button */}
              <div className="mt-5 pt-4 border-t border-[#2A2F3D] flex items-center justify-between">
                <span className="text-[11px] font-mono-data text-[#A5ABB8]">
                  {isScanning ? "Scanning MFT index..." : "Live Windows Storage Engine ready"}
                </span>

                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="px-3.5 py-1.5 rounded-lg bg-[#48C8FF]/10 hover:bg-[#48C8FF]/20 border border-[#48C8FF]/40 text-[#48C8FF] text-xs font-mono-data font-bold flex items-center gap-2 transition-colors active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isScanning ? "ANALYZING..." : "SIMULATE SCAN"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
