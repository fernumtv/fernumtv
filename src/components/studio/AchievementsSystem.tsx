"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Sparkles, X, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import {
  ACHIEVEMENTS_LIST,
  getUnlockedAchievements,
  unlockAchievement,
  Achievement,
} from "@/lib/interactive/achievements";
import { isCalmModeActive } from "@/lib/interactive/calmMode";

export function AchievementsSystem() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [toast, setToast] = useState<{ achievement: Achievement; count: number } | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setUnlocked(getUnlockedAchievements());

    // Listen for custom unlocked event
    const handleUnlocked = (e: CustomEvent<{ achievement: Achievement; count: number }>) => {
      setUnlocked(getUnlockedAchievements());
      if (!isCalmModeActive()) {
        setToast(e.detail);
        setTimeout(() => {
          setToast(null);
        }, 4200);
      }
    };

    // Konami code detection (↑ ↑ ↓ ↓ ← → ← → B A)
    const konamiSequence = [
      "arrowup",
      "arrowup",
      "arrowdown",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "arrowleft",
      "arrowright",
      "b",
      "a",
    ];
    let keyBuffer: string[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      keyBuffer.push(e.key.toLowerCase());
      if (keyBuffer.length > 10) {
        keyBuffer = keyBuffer.slice(-10);
      }
      if (keyBuffer.join("") === konamiSequence.join("")) {
        keyBuffer = [];
        unlockAchievement("konami_code");
      }
    };

    // Open quest modal event
    const handleOpenModal = () => {
      setModalOpen(true);
    };

    window.addEventListener("fernum-achievement-unlocked" as any, handleUnlocked);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("fernum-open-quests", handleOpenModal);

    return () => {
      window.removeEventListener("fernum-achievement-unlocked" as any, handleUnlocked);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("fernum-open-quests", handleOpenModal);
    };
  }, []);

  return (
    <>
      {/* Toast Notification when an achievement is unlocked */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-24 right-4 sm:right-8 z-[99990] max-w-sm w-full bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-4 border-[var(--border)] p-4 shadow-brutal-xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] flex items-center justify-center text-lg shadow-brutal shrink-0">
              {toast.achievement.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <Trophy className="w-3 h-3 text-[var(--accent)]" />
                <span>QUEST UNLOCKED ({toast.count}/5)</span>
              </div>
              <h4 className="font-display font-black text-sm uppercase tracking-tight text-[var(--block-2-fg)]">
                {toast.achievement.title}
              </h4>
              <p className="text-xs font-mono text-[var(--accent)] mt-0.5">
                {toast.achievement.rewardName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Close notification"
              className="p-1 hover:text-[var(--accent)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Quest Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quest-modal-title"
          className="fixed inset-0 z-[99995] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-4 border-[var(--border)] p-6 sm:p-8 shadow-brutal-xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[var(--border)] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] flex items-center justify-center shadow-brutal font-mono font-bold text-lg">
                  🏆
                </div>
                <div>
                  <h3 id="quest-modal-title" className="font-display font-black text-xl uppercase tracking-tight">
                    STUDIO ACHIEVEMENTS
                  </h3>
                  <span className="text-xs font-mono opacity-70">
                    Found {unlocked.length} of {ACHIEVEMENTS_LIST.length} Easter Eggs
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close achievements modal"
                className="p-2 border-2 border-[var(--border)] bg-[var(--page-bg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] shadow-brutal-sm cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-3 mb-6">
              {ACHIEVEMENTS_LIST.map((ach) => {
                const isFound = unlocked.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 border-2 border-[var(--border)] shadow-brutal flex items-start gap-3 transition-colors ${
                      isFound
                        ? "bg-[var(--page-bg)] text-[var(--page-fg)]"
                        : "bg-[var(--page-bg)]/40 text-[var(--page-fg)]/50 opacity-70"
                    }`}
                  >
                    <div className="text-2xl select-none shrink-0">{isFound ? ach.icon : "🔒"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm uppercase tracking-wide">
                          {ach.title}
                        </span>
                        {isFound && (
                          <span className="px-1.5 py-0.2 bg-emerald-500 text-black text-[9px] font-mono font-black uppercase">
                            FOUND
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono opacity-75 mt-0.5">
                        {isFound ? ach.rewardName : `Hint: ${ach.hint}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[var(--page-bg)] border border-[var(--border)] text-[11px] font-mono opacity-70 text-center">
              All achievement perks are strictly cosmetic rewards. No discounts, fake claims, or pricing alterations.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
