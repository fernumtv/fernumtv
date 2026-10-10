/**
 * Easter Eggs and Achievements Tracker
 * 5 cosmetic-only studio secrets to discover.
 * Rewards are strictly cosmetic (e.g., custom cursor/sticker packs).
 * No fake discounts or invented statistics.
 */

export interface Achievement {
  id: string;
  title: string;
  hint: string;
  icon: string;
  rewardName: string;
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: "logo_tap",
    title: "Brand Mascot",
    hint: "Rapid-tap the Fernum logo in the header 5 times",
    icon: "⚡",
    rewardName: "Cosmetic Perk: Rainbow Sparkle Trail",
  },
  {
    id: "konami_code",
    title: "Arcade Veteran",
    hint: "Enter the classic Konami code (↑ ↑ ↓ ↓ ← → ← → B A)",
    icon: "🕹️",
    rewardName: "Cosmetic Perk: Retro Pixel Cursor",
  },
  {
    id: "work_clapper",
    title: "Director's Cut",
    hint: "Find and click the clapperboard secret on /work",
    icon: "🎬",
    rewardName: "Cosmetic Perk: Gold Film Badge",
  },
  {
    id: "test_stopwatch",
    title: "Speed Demon",
    hint: "Click the 3-second retention stopwatch on /how-we-test",
    icon: "⏱️",
    rewardName: "Cosmetic Perk: Neon Cyber Theme Accent",
  },
  {
    id: "footer_secret",
    title: "Fine Print Hunter",
    hint: "Click the tiny copyright dot in the footer",
    icon: "🔍",
    rewardName: "Cosmetic Perk: Studio VIP Sticker Pack",
  },
];

export function getUnlockedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("fernum_achievements");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function unlockAchievement(id: string): { newlyUnlocked: boolean; achievement: Achievement | null } {
  if (typeof window === "undefined") return { newlyUnlocked: false, achievement: null };
  const achievement = ACHIEVEMENTS_LIST.find((a) => a.id === id) || null;
  if (!achievement) return { newlyUnlocked: false, achievement: null };

  const current = getUnlockedAchievements();
  if (current.includes(id)) {
    return { newlyUnlocked: false, achievement };
  }

  const updated = [...current, id];
  try {
    localStorage.setItem("fernum_achievements", JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("fernum-achievement-unlocked", {
        detail: { achievement, count: updated.length, total: ACHIEVEMENTS_LIST.length },
      })
    );
  } catch {}

  return { newlyUnlocked: true, achievement };
}
