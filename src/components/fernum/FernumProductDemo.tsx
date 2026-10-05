"use client";

import React, { useState } from "react";
import { Folder, HardDrive, FileText, CheckCircle2, Search, SlidersHorizontal, Trash2, ArrowRight } from "lucide-react";
import { playClickSound, playPopSound } from "@/lib/interactive/sound";

export function FernumProductDemo() {
  const [activeAnnotation, setActiveAnnotation] = useState<string>("giants");
  const [selectedFolder, setSelectedFolder] = useState<string>("steam");

  const annotations = [
    { id: "folders", label: "SEE EVERY FOLDER", color: "#48C8FF", desc: "Browse every sub-directory ordered by true byte footprint, including hidden AppData." },
    { id: "sort", label: "SORT BY SIZE", color: "#B6FF33", desc: "No more guessing which folder is heavy. Everything is indexed descending from GB to KB." },
    { id: "giants", label: "FIND THE GIANTS", color: "#FF8A34", desc: "Instant detection of files >1 GB that haven't been opened in 90+ days." },
    { id: "hidden", label: "REVEAL HIDDEN SPACE", color: "#8E5CFF", desc: "Uncover cryptic cache dumps, dormant virtual memory logs, and driver installer backups." },
    { id: "check", label: "CHECK BEFORE DELETE", color: "#FF4FCD", desc: "Visual dependency safety checker ensures you never delete Windows system files." },
    { id: "control", label: "CLEAN WITH CONTROL", color: "#B6FF33", desc: "Stage files into a review queue. Send to Recycle Bin or permanently shred at your command." },
  ];

  const demoFolders = [
    {
      id: "steam",
      name: "Steam/steamapps/common",
      size: "148.6 GB",
      percent: "32%",
      color: "#FF8A34",
      items: [
        { name: "Cyberpunk2077/archive/pc/content (68.4 GB)", safe: false, note: "Game Data" },
        { name: "ApexLegends/shader_cache_nv (14.2 GB)", safe: true, note: "Re-buildable Cache" },
        { name: "Old_Beta_Fallout4_Build (42.0 GB)", safe: true, note: "Orphaned Folder" },
      ],
    },
    {
      id: "downloads",
      name: "Users/Alex/Downloads",
      size: "42.8 GB",
      percent: "12%",
      color: "#FF4FCD",
      items: [
        { name: "Win11_23H2_English_x64.iso (6.2 GB)", safe: true, note: "Old ISO Installer" },
        { name: "Blender_4.2.0_Windows_x64.msi (380 MB)", safe: true, note: "Already Installed" },
        { name: "Premiere_Renders_Archive.zip (18.4 GB)", safe: true, note: "Duplicate Archive" },
      ],
    },
    {
      id: "appdata",
      name: "Users/Alex/AppData/Local",
      size: "38.9 GB",
      percent: "9%",
      color: "#8E5CFF",
      items: [
        { name: "D3DSCache/DirectXShaderPointers (11.8 GB)", safe: true, note: "Stale Cache" },
        { name: "Google/Chrome/User Data/Default/Cache (8.4 GB)", safe: true, note: "Browser Cache" },
        { name: "Discord/app-1.0.9024/temp_voice (4.6 GB)", safe: true, note: "Temporary Voice Dumps" },
      ],
    },
    {
      id: "videos",
      name: "Users/Alex/Videos/Captures",
      size: "26.4 GB",
      percent: "6%",
      color: "#48C8FF",
      items: [
        { name: "Shadowplay_2025_01_28_Clutch.mp4 (4.8 GB)", safe: false, note: "Personal Clip" },
        { name: "OBS_ReplayBuffer_Dump_02.mp4 (8.2 GB)", safe: true, note: "Unused Raw Capture" },
        { name: "Clip_Discord_Stream_Backup.mp4 (6.1 GB)", safe: true, note: "Raw Stream" },
      ],
    },
  ];

  const currentFolder = demoFolders.find((f) => f.id === selectedFolder) || demoFolders[0];

  return (
    <section id="demo" className="py-24 sm:py-32 bg-[#0A0B0F] border-b border-[#2A2F3D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15171D] border border-[#2A2F3D] text-xs font-mono-data text-[#B6FF33] uppercase tracking-wider mb-4">
            <span>● COMMAND CENTER VISUALIZER</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#F5F7FA] tracking-tight uppercase leading-[0.98] mb-4">
            SEE THE WHOLE DRIVE.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF33] via-[#48C8FF] to-[#8E5CFF]">
              NOT JUST THE MESS.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#A5ABB8] font-normal max-w-2xl mx-auto leading-relaxed">
            Fernum makes it easy to move from “my PC is full” to “I know exactly what is taking space.”
          </p>
        </div>

        {/* Interactive Annotations Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {annotations.map((ann) => {
            const isActive = activeAnnotation === ann.id;
            return (
              <button
                key={ann.id}
                onClick={() => {
                  playClickSound();
                  setActiveAnnotation(ann.id);
                }}
                className={`px-3.5 py-2 rounded-lg font-mono-data text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                  isActive
                    ? "bg-[#1E2129] text-[#F5F7FA] border-[#F5F7FA]/40 shadow-lg scale-105"
                    : "bg-[#15171D] text-[#A5ABB8] border-[#2A2F3D] hover:text-[#F5F7FA] hover:border-[#2A2F3D]/80"
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ann.color }} />
                <span>{ann.label}</span>
              </button>
            );
          })}
        </div>

        {/* Annotation active description banner */}
        <div className="max-w-2xl mx-auto mb-10 p-3.5 rounded-xl bg-[#15171D] border border-[#2A2F3D] text-center text-xs font-mono-data text-[#B6FF33] flex items-center justify-center gap-2">
          <span>⚡ FOCUS:</span>
          <span className="text-[#F5F7FA]">
            {annotations.find((a) => a.id === activeAnnotation)?.desc}
          </span>
        </div>

        {/* Large Central Command Center Interface Mockup */}
        <div className="rounded-2xl bg-[#15171D] border border-[#2A2F3D] shadow-2xl overflow-hidden border-hud">
          {/* Windows Window Title Bar */}
          <div className="bg-[#0A0B0F] px-4 py-3 border-b border-[#2A2F3D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF4B4B]" />
              <div className="w-3 h-3 rounded-full bg-[#FF8A34]" />
              <div className="w-3 h-3 rounded-full bg-[#B6FF33]" />
              <span className="ml-3 text-xs font-mono-data text-[#A5ABB8]">
                Fernum Storage Analyzer v1.2.4 — [C:\ 468.2 GB / 512 GB]
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono-data text-[#A5ABB8]">
              <span className="text-[#B6FF33]">SAFE CLEANUP MODE: ACTIVE</span>
            </div>
          </div>

          {/* Inner Command Center Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Left Folder Tree Explorer */}
            <div className="lg:col-span-4 border-r border-[#2A2F3D] bg-[#0A0B0F]/60 p-4 sm:p-5">
              <div className="text-[11px] font-mono-data uppercase tracking-wider text-[#A5ABB8] mb-3 flex items-center justify-between">
                <span>LARGEST DIRECTORIES</span>
                <span>SORT BY SIZE ↓</span>
              </div>

              <div className="space-y-2">
                {demoFolders.map((folder) => {
                  const isSelected = selectedFolder === folder.id;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedFolder(folder.id);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#1E2129] border-[#B6FF33] text-[#F5F7FA] shadow-md"
                          : "bg-[#15171D] border-[#2A2F3D] text-[#A5ABB8] hover:text-[#F5F7FA] hover:border-[#2A2F3D]/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate max-w-[210px]">
                        <Folder
                          className="w-4 h-4 shrink-0"
                          style={{ color: folder.color }}
                        />
                        <span className="font-mono-data text-xs truncate">
                          {folder.name}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono-data font-bold text-xs text-[#F5F7FA]">
                          {folder.size}
                        </div>
                        <div className="text-[10px] font-mono-data text-[#A5ABB8]">
                          {folder.percent} of drive
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Sub-File Inspector and Safety Analysis */}
            <div className="lg:col-span-8 p-5 sm:p-7 flex flex-col justify-between bg-[#15171D]">
              <div>
                {/* Active Directory Breadcrumb */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2A2F3D]">
                  <div className="flex items-center gap-2 text-xs font-mono-data text-[#48C8FF]">
                    <HardDrive className="w-4 h-4" />
                    <span>C:\ &gt; {currentFolder.name}</span>
                  </div>

                  <span className="px-2.5 py-1 rounded bg-[#FF8A34]/10 text-[#FF8A34] text-xs font-mono-data font-bold border border-[#FF8A34]/30">
                    Total: {currentFolder.size}
                  </span>
                </div>

                {/* Sub-File Items List */}
                <div className="space-y-3">
                  <div className="text-[11px] font-mono-data uppercase tracking-wider text-[#A5ABB8]">
                    TOP SPACE-HOG FILES IN THIS PATH:
                  </div>

                  {currentFolder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0A0B0F] border border-[#2A2F3D] flex items-center justify-between group hover:border-[#F5F7FA]/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-[#A5ABB8] group-hover:text-[#B6FF33] transition-colors" />
                        <div>
                          <div className="font-mono-data text-xs text-[#F5F7FA]">
                            {item.name}
                          </div>
                          <div className="text-[10px] font-mono-data text-[#A5ABB8]">
                            Classification: {item.note}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.safe ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono-data font-bold bg-[#B6FF33]/15 text-[#B6FF33] border border-[#B6FF33]/30">
                            SAFE TO REMOVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono-data font-bold bg-[#48C8FF]/15 text-[#48C8FF] border border-[#48C8FF]/30">
                            REVIEW REQUIRED
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick-Action Bar */}
              <div className="mt-8 pt-4 border-t border-[#2A2F3D] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono-data text-[#A5ABB8]">
                  Zero automatic deletions. You review every folder before any action.
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={playPopSound}
                    className="px-4 py-2 rounded-lg bg-[#B6FF33] text-[#0A0B0F] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#c6ff54] transition-colors shadow-sm active:scale-95"
                  >
                    SELECT JUNK FILES (24.8 GB)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
