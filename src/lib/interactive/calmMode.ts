/**
 * Calm Mode Utility
 * Disables non-essential motion, sound, cursor trails, and animations.
 * Synchronizes with user preference and prefers-reduced-motion.
 */

export function isCalmModeActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem("fernum_calm_mode");
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {}

  // Default to OS reduced motion preference if not explicitly set
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setCalmMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("fernum_calm_mode", enabled ? "on" : "off");
    if (enabled) {
      document.documentElement.classList.add("calm-mode");
    } else {
      document.documentElement.classList.remove("calm-mode");
    }
    window.dispatchEvent(new CustomEvent("fernum-calm-mode-change", { detail: { enabled } }));
  } catch {}
}
