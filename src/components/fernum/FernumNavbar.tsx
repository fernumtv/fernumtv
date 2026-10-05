"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, HardDrive, Shield, Sparkles, Check, ChevronRight } from "lucide-react";
import { playClickSound } from "@/lib/interactive/sound";

export function FernumNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0B0F]/90 backdrop-blur-md border-b border-[#2A2F3D] shadow-2xl py-3"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Windows Badge */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={playClickSound}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Fernum Home"
          >
            {/* Cyber Radar Pulse Icon */}
            <div className="relative w-9 h-9 rounded-lg bg-[#15171D] border border-[#2A2F3D] flex items-center justify-center overflow-hidden group-hover:border-[#B6FF33] transition-colors">
              <div className="absolute inset-0 bg-radial from-[#B6FF33]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <HardDrive className="w-5 h-5 text-[#B6FF33]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B6FF33] animate-ping" />
            </div>

            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-[#F5F7FA] group-hover:text-[#B6FF33] transition-colors">
                FERNUM
              </span>
              <span className="text-[9px] font-mono-data uppercase tracking-widest text-[#A5ABB8]">
                Storage Command
              </span>
            </div>
          </Link>

          {/* Windows Compatibility Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15171D] border border-[#2A2F3D] text-[11px] font-mono-data text-[#A5ABB8]">
            {/* Windows 4-square icon */}
            <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
              <span className="bg-[#48C8FF] rounded-[0.5px]" />
              <span className="bg-[#48C8FF] rounded-[0.5px]" />
              <span className="bg-[#48C8FF] rounded-[0.5px]" />
              <span className="bg-[#48C8FF] rounded-[0.5px]" />
            </div>
            <span>WINDOWS 10 + 11</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#A5ABB8]">
          <Link
            href="#features"
            onClick={playClickSound}
            className="hover:text-[#F5F7FA] transition-colors focus:outline-none focus:text-[#B6FF33]"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            onClick={playClickSound}
            className="hover:text-[#F5F7FA] transition-colors focus:outline-none focus:text-[#B6FF33]"
          >
            How It Works
          </Link>
          <Link
            href="#demo"
            onClick={playClickSound}
            className="hover:text-[#F5F7FA] transition-colors focus:outline-none focus:text-[#B6FF33]"
          >
            Interactive Map
          </Link>
          <Link
            href="#safety"
            onClick={playClickSound}
            className="hover:text-[#F5F7FA] transition-colors focus:outline-none focus:text-[#B6FF33]"
          >
            Safety
          </Link>
          <Link
            href="#faq"
            onClick={playClickSound}
            className="hover:text-[#F5F7FA] transition-colors focus:outline-none focus:text-[#B6FF33]"
          >
            FAQ
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <a
            href="#download"
            onClick={playClickSound}
            className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B6FF33] text-[#0A0B0F] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#c6ff54] active:scale-95 transition-all shadow-[0_0_20px_rgba(182,255,51,0.25)] hover:shadow-[0_0_30px_rgba(182,255,51,0.4)]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>DOWNLOAD FREE</span>
          </a>
        </div>
      </div>
    </header>
  );
}
