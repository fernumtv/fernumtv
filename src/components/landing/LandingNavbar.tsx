"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, PhoneCall, ArrowRight, Menu, X, ShieldCheck } from "lucide-react";

interface LandingNavbarProps {
  onOpenBookCall: () => void;
  onScrollToBrief: () => void;
}

export function LandingNavbar({ onOpenBookCall, onScrollToBrief }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
              F
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                Fernum
                <span className="text-[10px] uppercase font-semibold tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/40 px-1.5 py-0.5 rounded">
                  Studio
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">fernum.online</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#showcase" className="hover:text-white transition-colors">
            Reel Showcase
          </a>
          <a href="#pipeline" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#comparison" className="hover:text-white transition-colors">
            Why Fernum
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenBookCall}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-foreground bg-secondary/60 hover:bg-secondary border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
            <span>Book a Call</span>
          </button>

          <Link
            href="/login"
            className="text-xs font-medium text-muted-foreground hover:text-white px-2 py-1.5 transition-colors"
          >
            Client Portal
          </Link>

          <button
            onClick={onScrollToBrief}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-600/25 transition-all cursor-pointer"
          >
            <span>Start an Ad Brief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenBookCall}
            className="p-1.5 text-xs bg-secondary/80 text-foreground border border-white/10 rounded-lg"
          >
            <PhoneCall className="w-4 h-4 text-purple-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-muted-foreground hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-card p-4 space-y-3">
          <nav className="flex flex-col gap-2.5 text-sm font-medium text-muted-foreground">
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Reel Showcase
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Why Fernum
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              FAQ
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-purple-400 font-semibold"
            >
              Client Portal Log In →
            </Link>
          </nav>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookCall();
              }}
              className="w-full py-2 text-xs font-medium text-foreground bg-secondary/60 border border-white/10 rounded-lg flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
              Book Strategy Call
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToBrief();
              }}
              className="w-full py-2 text-xs font-semibold text-white bg-primary rounded-lg flex items-center justify-center gap-2"
            >
              Start an Ad Brief
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
