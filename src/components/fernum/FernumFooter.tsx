"use client";

import React from "react";
import Link from "next/link";
import { HardDrive, Shield, Terminal, ArrowUp } from "lucide-react";
import { playClickSound } from "@/lib/interactive/sound";

export function FernumFooter() {
  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0A0B0F] border-t border-[#2A2F3D] py-16 text-[#A5ABB8] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2A2F3D]/80">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#15171D] border border-[#2A2F3D] flex items-center justify-center">
                <HardDrive className="w-4 h-4 text-[#B6FF33]" />
              </div>
              <span className="font-display font-black text-xl text-[#F5F7FA] tracking-tight">
                FERNUM
              </span>
            </div>

            <p className="text-sm text-[#F5F7FA] font-medium">
              Understand your storage. Keep your space.
            </p>

            <p className="text-xs text-[#A5ABB8] leading-relaxed max-w-sm">
              Next-generation Windows storage analyzer and disk-cleanup utility. Visualizing disk space, isolating space hogs, and cleaning clutter with zero guesswork.
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#15171D] border border-[#2A2F3D] text-[11px] font-mono-data text-[#48C8FF]">
              <span>WINDOWS 10 &amp; WINDOWS 11 COMPLIANT</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-mono-data uppercase tracking-wider text-[#F5F7FA] font-bold">
              PRODUCT
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" onClick={playClickSound} className="hover:text-[#B6FF33] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#demo" onClick={playClickSound} className="hover:text-[#B6FF33] transition-colors">
                  Visual Drive Map
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={playClickSound} className="hover:text-[#B6FF33] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#safety" onClick={playClickSound} className="hover:text-[#B6FF33] transition-colors">
                  Safety Protocol
                </a>
              </li>
              <li>
                <a href="#download" onClick={playClickSound} className="hover:text-[#B6FF33] transition-colors">
                  Free Scanner
                </a>
              </li>
            </ul>
          </div>

          {/* System & Support */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-mono-data uppercase tracking-wider text-[#F5F7FA] font-bold">
              SPECS
            </div>
            <ul className="space-y-2 text-xs font-mono-data">
              <li>Architecture: x64 Win32</li>
              <li>Engine: NTFS MFT Indexer</li>
              <li>Installer: 42.8 MB</li>
              <li>Offline: 100% Native</li>
              <li>Version: v1.2.4</li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono-data uppercase tracking-wider text-[#F5F7FA] font-bold">
              GOVERNANCE
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-[#B6FF33] transition-colors">
                  Privacy Policy (No Telemetry)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#B6FF33] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#B6FF33] transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <a href="mailto:fernumtv@gmail.com" className="hover:text-[#B6FF33] transition-colors">
                  Support: fernumtv@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-data">
          <div>
            &copy; {new Date().getFullYear()} Fernum. All rights reserved. Built for Windows users.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[#B6FF33] transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
