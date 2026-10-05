"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { playClickSound } from "@/lib/interactive/sound";

export function FernumFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is Fernum safe? Will it accidentally delete Windows system files?",
      a: "Yes, Fernum is 100% safe. Critical Windows directories (such as System32, WinSxS, and kernel boot records) are cryptographically write-protected by our System File Immunity engine. More importantly, Fernum never auto-deletes files in the background without your explicit review and confirmation.",
    },
    {
      q: "How is Fernum different from Windows Disk Cleanup or generic cleaners?",
      a: "Windows Disk Cleanup only targets a handful of preset system temp folders, ignoring 90% of your real disk hogs (orphaned game launcher files, massive shadowplay clips, forgotten ISOs, and bloated AppData caches). Fernum maps your entire storage footprint spatially with interactive treemaps so you can see exactly where gigabytes are hiding.",
    },
    {
      q: "How fast does Fernum scan a drive?",
      a: "Because Fernum reads directly from the NTFS Master File Table (MFT) journal rather than scanning files one-by-one, an average 512 GB or 1 TB NVMe SSD is completely indexed in under 45 to 60 seconds with minimal CPU and memory impact.",
    },
    {
      q: "Does Fernum collect my data or inspect document contents?",
      a: "Never. Fernum operates 100% offline on your device. It only reads file metadata (file size, path, extension, and last-modified timestamp). It never opens, reads, uploads, or sends your document contents, personal media, or private data anywhere.",
    },
    {
      q: "Which Windows versions are supported?",
      a: "Fernum is natively compiled for 64-bit Windows 10 (version 1909 and newer) and all editions of Windows 11. It supports NVMe SSDs, SATA SSDs, external hard drives, and USB storage.",
    },
    {
      q: "Can I undo or restore deleted files?",
      a: "By default, Fernum moves selected files to your Windows Recycle Bin so you can easily restore any file with one click if needed. Permanent shredding is strictly an opt-in toggle when you need to immediately reclaim physical drive clusters.",
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#0A0B0F] border-b border-[#2A2F3D] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15171D] border border-[#2A2F3D] text-xs font-mono-data text-[#B6FF33] uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#B6FF33]" />
            <span>● FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#F5F7FA] tracking-tight uppercase leading-[0.98] mb-4">
            QUESTIONS ANSWERED.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF33] via-[#48C8FF] to-[#8E5CFF]">
              ZERO GUESSWORK.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#A5ABB8] font-normal leading-relaxed">
            Everything you need to know about scanning, safety, and freeing disk space.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-xl bg-[#15171D] border border-[#2A2F3D] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => {
                    playClickSound();
                    setOpenIndex(isOpen ? null : idx);
                  }}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B6FF33]"
                >
                  <span className="font-display font-bold text-base sm:text-lg text-[#F5F7FA]">
                    {faq.q}
                  </span>

                  <ChevronDown
                    className={`w-5 h-5 text-[#B6FF33] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[#A5ABB8] leading-relaxed border-t border-[#2A2F3D]/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
