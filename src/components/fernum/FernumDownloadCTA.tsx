"use client";

import React, { useState } from "react";
import { Download, HardDrive, ShieldCheck, Check, Sparkles, Terminal } from "lucide-react";
import { playClickSound, playSuccessSound } from "@/lib/interactive/sound";

export function FernumDownloadCTA() {
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const handleDownload = () => {
    playSuccessSound();
    setDownloadTriggered(true);
  };

  return (
    <section id="download" className="py-28 sm:py-36 bg-[#0A0B0F] relative overflow-hidden">
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 bg-command-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#B6FF33]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Terminal badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15171D] border border-[#2A2F3D] text-xs font-mono-data text-[#B6FF33] uppercase tracking-wider mb-8 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#B6FF33]" />
          <span>INSTANT INSTALLER • ZERO BLOATWARE • 42 MB</span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-[#F5F7FA] tracking-tight uppercase leading-[0.95] mb-6">
          MAKE SPACE
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF33] via-[#48C8FF] to-[#8E5CFF]">
            FOR WHAT’S NEXT.
          </span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-[#A5ABB8] font-normal max-w-2xl mx-auto leading-relaxed mb-10">
          Scan your Windows drive for free. Find the files eating your storage. Keep control of every cleanup decision.
        </p>

        {/* Central Download Action & Storage Meter Preview */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#15171D] border border-[#2A2F3D] shadow-2xl mb-8 border-hud">
          {/* Animated Storage Meter Reaching Healthy Green */}
          <div className="mb-6 space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-mono-data">
              <span className="text-[#A5ABB8]">POST-CLEANUP HEALTH TARGET</span>
              <span className="text-[#B6FF33] font-bold">126.4 GB BREATHING ROOM READY</span>
            </div>

            <div className="h-4 w-full rounded-full bg-[#0A0B0F] border border-[#2A2F3D] overflow-hidden p-0.5">
              <div className="h-full rounded-full bg-gradient-to-r from-[#48C8FF] via-[#8E5CFF] to-[#B6FF33] w-[62%] transition-all duration-1000" />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono-data text-[#A5ABB8]">
              <span>62% USED (OPTIMAL)</span>
              <span>DRIVE C: HEALTHY</span>
            </div>
          </div>

          {/* Primary Download Button */}
          <a
            href="/download/FernumSetup.exe"
            onClick={handleDownload}
            download="FernumSetup.exe"
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-[#B6FF33] text-[#0A0B0F] font-display font-black text-base uppercase tracking-wider hover:bg-[#c6ff54] active:scale-95 transition-all shadow-[0_0_35px_rgba(182,255,51,0.35)] hover:shadow-[0_0_50px_rgba(182,255,51,0.55)] group"
          >
            <Download className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
            <span>DOWNLOAD FERNUM FOR WINDOWS</span>
          </a>

          {downloadTriggered && (
            <div className="mt-3 text-xs font-mono-data text-[#B6FF33] flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Installer downloaded. Double click FernumSetup.exe to start.</span>
            </div>
          )}

          {/* Small Trust Details */}
          <div className="mt-4 pt-4 border-t border-[#2A2F3D]/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono-data text-[#A5ABB8]">
            <span>Free drive scanner for Windows 10 &amp; 11</span>
            <span>Version 1.2.4 (64-Bit)</span>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono-data text-[#A5ABB8]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B6FF33]" />
            <span>Code-Signed &amp; Notarized Binary</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#48C8FF]" />
            <span>No Telemetry / Offline First</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8E5CFF]" />
            <span>Zero Registry Hijacking</span>
          </div>
        </div>
      </div>
    </section>
  );
}
