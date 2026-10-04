"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

interface InhouseNavbarProps {
  onOpenBookCall: () => void;
}

export function InhouseNavbar({ onOpenBookCall }: InhouseNavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-neutral-950 flex items-baseline gap-1.5">
            Fernum
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">
              AdPass®
            </span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-neutral-600">
          <a href="#work" className="hover:text-neutral-950 transition-colors">
            Some of our work
          </a>
          <a href="#process" className="hover:text-neutral-950 transition-colors">
            Process
          </a>
          <a href="#pricing" className="hover:text-neutral-950 transition-colors">
            Pricing
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 px-3 py-2 transition-colors hidden sm:block"
          >
            Client Portal
          </Link>

          <button
            onClick={onOpenBookCall}
            className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <span>Book a Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
