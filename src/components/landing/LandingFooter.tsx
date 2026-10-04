"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, PhoneCall, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

interface LandingFooterProps {
  onOpenBookCall: () => void;
  onScrollToBrief: () => void;
}

export function LandingFooter({ onOpenBookCall, onScrollToBrief }: LandingFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-card py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base">
                F
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Fernum</span>
              <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                fernum.online
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              AI-assisted high-converting short-form video ads for D2C & e-commerce brands scaling on Meta and TikTok. 3 alternate hooks included with every ad, 100% human-reviewed before delivery.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Compliant with Meta & TikTok commercial advertising policies</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#showcase" className="hover:text-white transition-colors">
                  Reel Showcase
                </a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-white transition-colors">
                  Production Pipeline
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-white transition-colors">
                  Why Fernum vs Agencies
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Monthly Pricing Plans
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ & Policies
                </a>
              </li>
            </ul>
          </div>

          {/* Actions & Client Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Client Access</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/login" className="text-purple-300 hover:text-white transition-colors font-medium">
                  Client Portal Log In →
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenBookCall}
                  className="hover:text-white transition-colors text-left"
                >
                  Book {siteConfig.callMinutes}-Min Strategy Call
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToBrief}
                  className="hover:text-white transition-colors text-left"
                >
                  Submit Ad Brief
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Fernum (fernum.online). All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>AI Disclosure Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
