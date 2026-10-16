"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Calendar } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/supabase/useAuth";

import { Wordmark } from "@/components/Wordmark";

export function StudioNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { label: "Work", href: "/work" },
    { label: "Structure", href: "/structure" },
    { label: "How We Test", href: "/how-we-test" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "About", href: "/about" },
    ...(siteConfig.portalEnabled
      ? [
          {
            label: isAuthenticated ? "Portal" : "Client login",
            href: isAuthenticated ? "/portal" : "/login",
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--page-bg)] border-b-2 border-[var(--border)] text-[var(--page-fg)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo: Fernum AdPass */}
        <div className="flex items-center gap-2 select-none">
          <Link
            href="/"
            aria-label="Fernum AdPass"
            className="flex items-center gap-2.5 group text-left focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
          >
            <Wordmark size="md" />
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border border-[var(--border)] shadow-sm bg-[var(--accent)] text-[var(--accent-fg)] transition-colors"
            >
              AdPass
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--page-fg)]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all px-2.5 py-1 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none ${
                  isActive
                    ? "bg-[var(--block-4-bg)] text-[var(--block-4-fg)] shadow-brutal border border-[var(--border)]"
                    : "hover:text-[var(--accent)] hover:translate-y-[-1px]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Book a Call CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Book a Call Button */}
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book a 30-minute strategy call"
            onClick={() => trackEvent("Book a Call Click", { location: "navbar_desktop" })}
            className="btn-squish btn-magnetic h-[44px] px-5 sm:px-6 font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2 cursor-pointer bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
          >
            <span>Book a Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-11 h-11 bg-[var(--page-bg)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--page-fg)] shadow-brutal hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--page-bg)] border-b-2 border-[var(--border)] text-[var(--page-fg)] px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-mono font-bold uppercase tracking-wider">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 border-2 border-[var(--border)] transition-colors shadow-brutal flex items-center justify-between ${
                    isActive
                      ? "bg-[var(--block-4-bg)] text-[var(--block-4-fg)]"
                      : "bg-[var(--block-2-bg)] text-[var(--block-2-fg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs">→</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <p className="text-[11px] font-mono text-center text-[var(--page-fg)]/70 font-bold uppercase">
              {siteConfig.callMinutes}-minute call. Bring your product and your current ads.
            </p>
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a 30-minute strategy call"
              onClick={() => {
                trackEvent("Book a Call Click", { location: "navbar_mobile" });
                setMobileMenuOpen(false);
              }}
              className="w-full h-12 bg-[var(--accent)] text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Strategy Call</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
