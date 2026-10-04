/**
 * Contrast Checker Script
 * Verifies that all fg/bg token pairs for all three vibes satisfy WCAG 2.1 AA:
 * >= 4.5:1 for body text, >= 3.0:1 for large text/headings/borders.
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  return {
    r: parseInt(cleanHex.substring(0, 2), 16),
    g: parseInt(cleanHex.substring(2, 4), 16),
    b: parseInt(cleanHex.substring(4, 6), 16),
  };
}

function getLuminance(rgb: RGB): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hexToRgb(hex1));
  const lum2 = getLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export interface VibeDefinition {
  name: string;
  tokens: {
    pageBg: string;
    pageFg: string;
    block1Bg: string;
    block1Fg: string;
    block2Bg: string;
    block2Fg: string;
    block3Bg: string;
    block3Fg: string;
    block4Bg: string;
    block4Fg: string;
    accent: string;
    accentFg: string;
    marqueeBg: string;
    marqueeFg: string;
    border: string;
    shadowColor: string;
    sticker1: string;
    sticker2: string;
    sticker3: string;
    cursorColor: string;
    focusRing: string;
    selectionBg: string;
    selectionFg: string;
  };
}

export const VIBES: Record<string, VibeDefinition> = {
  orange: {
    name: "ORANGE",
    tokens: {
      pageBg: "#F7F3EB",
      pageFg: "#111111",
      block1Bg: "#F14A0A",
      block1Fg: "#111111",
      block2Bg: "#F7F3EB",
      block2Fg: "#111111",
      block3Bg: "#16C846",
      block3Fg: "#111111",
      block4Bg: "#111111",
      block4Fg: "#F7F3EB",
      accent: "#F14A0A",
      accentFg: "#111111",
      marqueeBg: "#F14A0A",
      marqueeFg: "#111111",
      border: "#111111",
      shadowColor: "#111111",
      sticker1: "#FFD400",
      sticker2: "#6C3BF5",
      sticker3: "#16C846",
      cursorColor: "#F14A0A",
      focusRing: "#F14A0A",
      selectionBg: "#F14A0A",
      selectionFg: "#111111",
    },
  },
  green: {
    name: "GREEN",
    tokens: {
      pageBg: "#F7F3EB",
      pageFg: "#111111",
      block1Bg: "#16C846",
      block1Fg: "#111111",
      block2Bg: "#F7F3EB",
      block2Fg: "#111111",
      block3Bg: "#6C3BF5",
      block3Fg: "#F7F3EB",
      block4Bg: "#111111",
      block4Fg: "#F7F3EB",
      accent: "#16C846",
      accentFg: "#111111",
      marqueeBg: "#16C846",
      marqueeFg: "#111111",
      border: "#111111",
      shadowColor: "#111111",
      sticker1: "#FFD400",
      sticker2: "#F14A0A",
      sticker3: "#F33418",
      cursorColor: "#16C846",
      focusRing: "#16C846",
      selectionBg: "#16C846",
      selectionFg: "#111111",
    },
  },
  purple: {
    name: "PURPLE",
    tokens: {
      pageBg: "#F7F3EB",
      pageFg: "#111111",
      block1Bg: "#6C3BF5",
      block1Fg: "#F7F3EB",
      block2Bg: "#F7F3EB",
      block2Fg: "#111111",
      block3Bg: "#F14A0A",
      block3Fg: "#111111",
      block4Bg: "#111111",
      block4Fg: "#F7F3EB",
      accent: "#6C3BF5",
      accentFg: "#F7F3EB",
      marqueeBg: "#6C3BF5",
      marqueeFg: "#F7F3EB",
      border: "#111111",
      shadowColor: "#111111",
      sticker1: "#FFD400",
      sticker2: "#16C846",
      sticker3: "#F33418",
      cursorColor: "#6C3BF5",
      focusRing: "#6C3BF5",
      selectionBg: "#6C3BF5",
      selectionFg: "#F7F3EB",
    },
  },
};

export function runContrastChecks() {
  console.log("================================================================================");
  console.log("  WCAG 2.1 CONTRAST RATIO VERIFICATION (Requirement: >= 4.5:1 Body, >= 3:1 Large)");
  console.log("================================================================================");

  let hasFailure = false;
  const tableRows: { vibe: string; pair: string; bg: string; fg: string; ratio: string; status: string }[] = [];

  for (const [vibeKey, vibe] of Object.entries(VIBES)) {
    const pairs = [
      { name: "page (bg / fg)", bg: vibe.tokens.pageBg, fg: vibe.tokens.pageFg, min: 4.5 },
      { name: "block-1 (bg / fg)", bg: vibe.tokens.block1Bg, fg: vibe.tokens.block1Fg, min: 4.5 },
      { name: "block-2 (bg / fg)", bg: vibe.tokens.block2Bg, fg: vibe.tokens.block2Fg, min: 4.5 },
      { name: "block-3 (bg / fg)", bg: vibe.tokens.block3Bg, fg: vibe.tokens.block3Fg, min: 4.5 },
      { name: "block-4 (bg / fg)", bg: vibe.tokens.block4Bg, fg: vibe.tokens.block4Fg, min: 4.5 },
      { name: "accent (bg / fg)", bg: vibe.tokens.accent, fg: vibe.tokens.accentFg, min: 4.5 },
      { name: "marquee (bg / fg)", bg: vibe.tokens.marqueeBg, fg: vibe.tokens.marqueeFg, min: 4.5 },
      { name: "selection (bg / fg)", bg: vibe.tokens.selectionBg, fg: vibe.tokens.selectionFg, min: 4.5 },
      { name: "page border (pageBg / border)", bg: vibe.tokens.pageBg, fg: vibe.tokens.border, min: 3.0 },
    ];

    for (const p of pairs) {
      const ratio = getContrastRatio(p.bg, p.fg);
      const passed = ratio >= p.min;
      if (!passed) hasFailure = true;
      tableRows.push({
        vibe: vibe.name,
        pair: p.name,
        bg: p.bg,
        fg: p.fg,
        ratio: ratio.toFixed(2) + ":1",
        status: passed ? "PASS" : "FAIL",
      });
    }
  }

  console.table(tableRows);

  if (hasFailure) {
    console.error("❌ Contrast check FAILED! Some pairs do not meet the minimum contrast threshold.");
    process.exit(1);
  } else {
    console.log("✅ ALL FG/BG TOKEN PAIRS PASS WCAG 2.1 AA (>= 4.5:1 for body text, >= 3.0:1 for borders/large text)!");
  }
}

if (process.argv[1]?.includes("contrast-check")) {
  runContrastChecks();
}
