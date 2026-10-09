"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ShieldCheck, ArrowUpRight, Calendar, MousePointer2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

export function StudioFooter() {
  const [cursorEnabled, setCursorEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fernum_cursor_enabled");
        if (saved === "off") setCursorEnabled(false);
      } catch {}
    }
  }, []);

  const toggleCursor = () => {
    const next = !cursorEnabled;
    setCursorEnabled(next);
    try {
      localStorage.setItem("fernum_cursor_enabled", next ? "on" : "off");
    } catch {}
    window.dispatchEvent(
      new CustomEvent("fernum-cursor-toggle", {
        detail: { enabled: next },
      })
    );
  };

  return (
    <footer className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-t-4 border-[var(--accent)] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[var(--block-4-fg)]/20">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <span className="font-display font-black text-3xl sm:text-4xl text-[var(--block-4-fg)] tracking-tighter uppercase block">
              FERNUM <span className="text-[var(--accent)]">ADPASS</span>
            </span>
            <p className="text-sm text-[var(--block-4-fg)]/80 max-w-sm leading-relaxed font-medium">
              We make video ads that sell for D2C brands. Delivered every month with 3 alternate hooks, planned and reviewed by our team.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--block-4-fg)]/10 hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] text-[var(--block-4-fg)] text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-[var(--block-4-fg)]/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{siteConfig.contactEmail}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="book"
                onClick={() => trackEvent("Book a Call Click", { location: "footer" })}
                className="btn-magnetic inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--block-4-fg)] hover:text-[var(--block-4-bg)] text-xs font-mono font-bold uppercase tracking-wider transition-colors border-2 border-[var(--border)] shadow-brutal-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book a Call</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent)]">
              Studio Navigation
            </p>
            <ul className="space-y-2.5 text-sm font-bold text-[var(--block-4-fg)]/90">
              <li>
                <Link href="/work" className="hover:text-[var(--accent)] transition-colors block">
                  Our Work (/work)
                </Link>
              </li>
              <li>
                <Link href="/structure" className="hover:text-[var(--accent)] transition-colors block">
                  Ad Structure (/structure)
                </Link>
              </li>
              <li>
                <Link href="/how-we-test" className="hover:text-[var(--accent)] transition-colors block">
                  How We Test (/how-we-test)
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[var(--accent)] transition-colors block">
                  Pricing Plans (/#pricing)
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[var(--accent)] transition-colors block">
                  FAQ (/faq)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[var(--accent)] transition-colors block font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
                  Client login →
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--accent)] transition-colors block">
                  About (/about)
                </Link>
              </li>
              <li>
                <Link href="/#brief" className="hover:text-[var(--accent)] transition-colors block">
                  Submit Creative Brief
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:underline transition-colors block text-[var(--accent)]">
                  Direct Calendar (/schedule) →
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent)]">
              Policies & Legal
            </p>
            <ul className="space-y-2.5 text-sm font-bold text-[var(--block-4-fg)]/90">
              <li>
                <Link href="/terms" className="hover:text-[var(--accent)] transition-colors block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[var(--accent)] transition-colors block">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors block">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance + Cursor On/Off Toggle */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[var(--block-4-fg)]/80">
          <div>
            © {new Date().getFullYear()} Fernum (fernum.online). All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[var(--block-4-fg)]/70">
            {/* Cursor On/Off toggle */}
            <button
              type="button"
              onClick={toggleCursor}
              aria-label="Toggle custom cursor on or off"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--block-4-fg)]/10 hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] text-[var(--block-4-fg)] border border-[var(--block-4-fg)]/20 text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer"
            >
              <MousePointer2 className="w-3 h-3 text-[var(--accent)]" />
              <span>Cursor: {cursorEnabled ? "ON" : "OFF"}</span>
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[var(--block-4-fg)]/70">
              <span>Some visuals and voices in our ads are AI-generated.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
