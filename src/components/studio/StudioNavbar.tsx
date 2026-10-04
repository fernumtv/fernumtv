"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Calendar } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { usePathname } from "next/navigation";

type VibeColor = "orange" | "green" | "purple";

const VIBE_OPTIONS: { id: VibeColor; label: string; color: string }[] = [
  { id: "orange", label: "Orange vibe", color: "var(--swatch-orange)" },
  { id: "green", label: "Green vibe", color: "var(--swatch-green)" },
  { id: "purple", label: "Purple vibe", color: "var(--swatch-purple)" },
];

export function StudioNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentVibe, setCurrentVibe] = useState<VibeColor>("orange");
  const [announcement, setAnnouncement] = useState<string>("");
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedVibe = localStorage.getItem("fernum_vibe") as VibeColor | null;
        if (savedVibe && ["orange", "green", "purple"].includes(savedVibe)) {
          setCurrentVibe(savedVibe);
          document.documentElement.setAttribute("data-vibe", savedVibe);
        }
      } catch {}
    }
  }, []);

  const handleVibeChange = (vibe: VibeColor) => {
    setCurrentVibe(vibe);
    setAnnouncement(`${vibe.charAt(0).toUpperCase() + vibe.slice(1)} vibe activated`);
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-vibe", vibe);
      const metaTheme =
        document.getElementById("fernum-theme-color") ||
        document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        const activeAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
        metaTheme.setAttribute("content", activeAccent);
      }
      try {
        localStorage.setItem("fernum_vibe", vibe);
      } catch {}
      window.dispatchEvent(new CustomEvent("fernum-vibe-change", { detail: { vibe } }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % VIBE_OPTIONS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + VIBE_OPTIONS.length) % VIBE_OPTIONS.length;
    }

    if (nextIndex !== -1) {
      const nextVibe = VIBE_OPTIONS[nextIndex].id;
      handleVibeChange(nextVibe);
      buttonRefs.current[nextIndex]?.focus();
    }
  };

  const navLinks = [
    { label: "Work", href: "/work" },
    { label: "Structure", href: "/structure" },
    { label: "How We Test", href: "/how-we-test" },
    { label: "Pricing", href: pathname === "/" ? "#pricing" : "/#pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--page-bg)] border-b-2 border-[var(--border)] text-[var(--page-fg)] transition-colors">
      {/* Screen reader live announcement */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo: Fernum AdPass */}
        <div className="flex items-center gap-2 select-none">
          <Link
            href="/"
            aria-label="FERNUM AdPass"
            className="flex items-center gap-2 group text-left focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
          >
            <span className="font-display font-black text-2xl sm:text-3xl text-[var(--page-fg)] tracking-tight uppercase group-hover:text-[var(--accent)] transition-colors">
              FERNUM
            </span>
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

        {/* Right Controls: Vibe Switcher + Book a Call CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Pick Your Vibe Accent Selector */}
          <div
            role="radiogroup"
            aria-label="Pick your vibe"
            className="hidden sm:flex items-center gap-1.5 p-1.5 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal-sm"
          >
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--page-fg)]/70 px-1 select-none">
              VIBE:
            </span>
            {VIBE_OPTIONS.map((vibe, idx) => {
              const isSelected = currentVibe === vibe.id;
              return (
                <button
                  key={vibe.id}
                  ref={(el) => {
                    buttonRefs.current[idx] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={vibe.label}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleVibeChange(vibe.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  style={{ backgroundColor: vibe.color }}
                  className={`w-5 h-5 border-2 border-[var(--border)] transition-transform cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none ${
                    isSelected
                      ? "scale-110 shadow-brutal-sm ring-2 ring-[var(--border)]"
                      : "opacity-60 hover:opacity-100"
                  }`}
                />
              );
            })}
          </div>

          {/* Book a Call Button */}
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="book"
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

          {/* Mobile Vibe Selector */}
          <div
            role="radiogroup"
            aria-label="Pick your vibe (mobile)"
            className="pt-2 flex items-center justify-between p-3 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal-sm"
          >
            <span className="text-xs font-mono font-bold uppercase text-[var(--page-fg)]">Vibe:</span>
            <div className="flex items-center gap-2">
              {VIBE_OPTIONS.map((vibe) => {
                const isSelected = currentVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={vibe.label}
                    onClick={() => handleVibeChange(vibe.id)}
                    style={{ backgroundColor: vibe.color }}
                    className={`w-7 h-7 border-2 border-[var(--border)] transition-transform cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                      isSelected
                        ? "scale-110 shadow-brutal-sm ring-2 ring-[var(--border)]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <p className="text-[11px] font-mono text-center text-[var(--page-fg)]/70 font-bold uppercase">
              {siteConfig.callMinutes}-minute call. Bring your product and your current ads.
            </p>
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
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
