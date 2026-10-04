import React from "react";
import { dodo } from "@/config/site";
import { AlertTriangle } from "lucide-react";

export function TestModeBanner() {
  if (!dodo.testMode) {
    return null;
  }

  return (
    <aside
      aria-label="Test Mode Active"
      className="bg-[var(--sticker-1)] text-[var(--page-fg)] border-b-2 border-[var(--border)] px-4 py-2 text-center text-xs font-mono font-black uppercase tracking-wider sticky top-0 z-[100] flex items-center justify-center gap-2 shadow-brutal-sm"
    >
      <AlertTriangle className="w-4 h-4 text-[var(--accent)] shrink-0" />
      <span>
        TEST MODE ACTIVE — Checkouts point to Dodo Sandbox. Switch{" "}
        <code className="bg-[var(--page-bg)] px-1.5 py-0.5 border border-[var(--border)] font-bold text-[11px] rounded-none">
          testMode: false
        </code>{" "}
        in site config before live launch.
      </span>
    </aside>
  );
}
