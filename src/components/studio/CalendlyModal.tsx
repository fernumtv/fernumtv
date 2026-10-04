"use client";

import React, { useEffect } from "react";
import { X, Calendar, Sparkles } from "lucide-react";
import { CalendlyWidget } from "./CalendlyWidget";
import { siteConfig } from "@/config/site";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

export function CalendlyModal({ isOpen, onClose, url }: CalendlyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendly-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-[var(--block-4-bg)]/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[var(--page-bg)] text-[var(--page-fg)] border-3 border-[var(--border)] rounded-2xl shadow-brutal-xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-b-2 border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="calendly-modal-title"
                className="font-display font-black text-base sm:text-lg tracking-tight uppercase"
              >
                Schedule Creative Strategy Call
              </h2>
              <p className="text-[11px] font-mono opacity-70 uppercase tracking-wider">
                {siteConfig.callMinutes}-Min Zoom with Fernum Creative Direction
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close scheduling modal"
            className="w-10 h-10 bg-[var(--page-bg)] hover:bg-[var(--accent)] border-2 border-[var(--border)] text-[var(--page-fg)] hover:text-[var(--accent-fg)] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Embedded Calendly Widget */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <CalendlyWidget url={url} height="650px" />
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-[var(--block-2-bg)] border-t-2 border-[var(--border)] text-center text-xs font-mono text-[var(--block-2-fg)] opacity-85 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Instant calendar confirmation. Zero agency pitch decks.</span>
        </div>
      </div>
    </div>
  );
}
