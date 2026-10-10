"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check stored consent choice after first paint so hero render is never delayed
    const timer = setTimeout(() => {
      try {
        const consent = localStorage.getItem("fernum_cookie_consent");
        if (!consent) {
          setVisible(true);
        } else if (consent === "accepted") {
          loadAnalyticsScript();
        }
      } catch {
        // Storage access blocked or restricted
      }
    }, 1500);

    // Listen for manual settings open event from footer
    const handleOpenSettings = () => {
      setVisible(true);
    };

    window.addEventListener("fernum-open-cookie-settings", handleOpenSettings);
    return () => {
      window.removeEventListener("fernum-open-cookie-settings", handleOpenSettings);
    };
  }, []);

  const loadAnalyticsScript = () => {
    if (typeof window === "undefined") return;
    if (document.getElementById("plausible-analytics-script")) return;

    try {
      const script = document.createElement("script");
      script.id = "plausible-analytics-script";
      script.defer = true;
      script.setAttribute("data-domain", "fernum.online");
      script.src = "https://plausible.io/js/script.tagged-events.js";
      document.head.appendChild(script);
    } catch (e) {
      console.warn("Could not load analytics script:", e);
    }
  };

  const handleAccept = () => {
    try {
      localStorage.setItem("fernum_cookie_consent", "accepted");
    } catch {}
    loadAnalyticsScript();
    setVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem("fernum_cookie_consent", "rejected");
      // Remove script if already present
      const script = document.getElementById("plausible-analytics-script");
      if (script) script.remove();
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie and storage consent"
      role="region"
      className="fixed bottom-0 left-0 right-0 z-[9990] p-4 sm:p-6 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-5 sm:p-6 shadow-brutal-xl pointer-events-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Notice Copy */}
        <div className="space-y-1.5 flex-1 pr-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
            <ShieldCheck className="w-4 h-4" />
            <span>STORAGE & PRIVACY CHOICES</span>
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
            We use essential local storage to remember your aesthetic vibe, custom cursor, and audio preferences.
            With your consent, we load privacy-friendly, cookieless Plausible analytics to measure visits without tracking you.
            Learn more in our{" "}
            <Link
              href="/privacy"
              className="underline font-bold text-[var(--accent)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              Privacy Policy
            </Link>.
          </p>
        </div>

        {/* Equal-Weight Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 sm:flex-initial h-11 px-5 bg-[var(--page-bg)] hover:bg-[var(--border)]/10 text-[var(--page-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
          >
            Reject All Non-Essential
          </button>

          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 sm:flex-initial h-11 px-5 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
