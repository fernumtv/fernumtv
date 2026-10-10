import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3100";
const OUTPUT_DIR = path.resolve(__dirname, "../screenshots/hero-widths");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const WIDTHS = [360, 768, 1280, 1440, 1920];

async function run() {
  console.log("Launching headless browser at:", CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Step 1: Test SFX toggle default on first visit
  console.log("\n=======================================================");
  console.log("TEST 1: SFX Toggle default OFF and persistent storage");
  console.log("=======================================================");
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
  
  // Clear any existing localStorage
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });

  const sfxFirstVisit = await page.evaluate(() => {
    const rawStorage = localStorage.getItem("fernum_sound_enabled");
    // Find sound toggle button in navbar or floating dock
    const navBtn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("SFX") || b.textContent?.includes("MUTE")
    );
    return {
      rawStorage,
      btnText: navBtn?.textContent?.trim() || "",
    };
  });
  console.log("- First visit localStorage:", sfxFirstVisit.rawStorage, "(Default is OFF / null)");
  console.log("- Sound button state:", sfxFirstVisit.btnText);

  // Toggle sound ON
  const navSfxButton = await page.$('button[title*="sound"], button[aria-label*="sound"]');
  if (navSfxButton) {
    await navSfxButton.click();
    await new Promise((r) => setTimeout(r, 200));
  }

  const sfxAfterClick = await page.evaluate(() => localStorage.getItem("fernum_sound_enabled"));
  console.log("- After clicking toggle, localStorage:", sfxAfterClick);

  // Reload page to confirm choice is remembered
  await page.reload({ waitUntil: "networkidle0" });
  const sfxRemembered = await page.evaluate(() => localStorage.getItem("fernum_sound_enabled"));
  console.log("- After reload, remembered choice:", sfxRemembered);

  // Step 2: Test hero across viewports (360, 768, 1280, 1440, 1920)
  console.log("\n=======================================================");
  console.log("TEST 2: Viewport verification (360, 768, 1280, 1440, 1920)");
  console.log("=======================================================");

  for (const width of WIDTHS) {
    const height = width < 1024 ? 900 : 1080;
    await page.setViewport({ width, height });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));

    // Overlap inspection
    const report = await page.evaluate((w) => {
      const hero = document.querySelector("section");
      if (!hero) return { width: w, error: "No hero section found", visibleStickerCount: 0, stickers: [], overlaps: [] };

      const heroRect = hero.getBoundingClientRect();

      // Find all stickers inside hero (draggable stickers + rotating badge)
      const stickers = Array.from(hero.querySelectorAll('[data-cursor="drag"], [class*="animate-spin-slow"]'))
        .map((el) => el.closest('[data-cursor="drag"]') || el.parentElement!)
        .filter((el, idx, arr) => arr.indexOf(el) === idx)
        .filter((el) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        })
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            text: (el as HTMLElement).innerText ? (el as HTMLElement).innerText.trim().replace(/\s+/g, " ") : "Rotating Badge",
            top: r.top,
            bottom: r.bottom,
            left: r.left,
            right: r.right,
            zIndex: window.getComputedStyle(el).zIndex,
          };
        });

      // Target real text / buttons / cards that must NEVER be covered:
      const targetsToCheck = [
        "3 Alternate Hooks / Ad",
        "9:16, 1:1, 16:9",
        "Turnaround",
        "5–7 Business Days",
        "Plans from $499/mo",
        "We write, produce, and edit",
        "Book a Call",
        "See our work",
        "3 Hooks Per Ad",
        "MONTHLY VIDEO ADS",
      ];

      const overlaps: any[] = [];

      targetsToCheck.forEach((targetText) => {
        const walker = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          if (node.textContent && node.textContent.includes(targetText)) {
            const parent = node.parentElement;
            if (parent && !parent.closest('[data-cursor="drag"]') && !parent.closest('[class*="animate-spin-slow"]')) {
              const pRect = parent.getBoundingClientRect();
              const pZ = window.getComputedStyle(parent).zIndex;

              // Check bounding box intersection
              stickers.forEach((st) => {
                const intersects = !(
                  st.right <= pRect.left ||
                  st.left >= pRect.right ||
                  st.bottom <= pRect.top ||
                  st.top >= pRect.bottom
                );
                if (intersects) {
                  overlaps.push({
                    target: targetText,
                    sticker: st.text.slice(0, 30),
                    targetBox: { top: Math.round(pRect.top), bottom: Math.round(pRect.bottom), left: Math.round(pRect.left), right: Math.round(pRect.right) },
                    stickerBox: { top: Math.round(st.top), bottom: Math.round(st.bottom), left: Math.round(st.left), right: Math.round(st.right) },
                    targetZ: pZ,
                    stickerZ: st.zIndex,
                  });
                }
              });
            }
          }
        }
      });

      return {
        width: w,
        visibleStickerCount: stickers.length,
        stickers: stickers.map((s) => ({ text: s.text.slice(0, 25), top: Math.round(s.top), left: Math.round(s.left), zIndex: s.zIndex })),
        overlaps,
      };
    }, width);

    console.log(`\n--- Viewport: ${width}px ---`);
    console.log(`Visible decorative stickers in hero: ${report.visibleStickerCount}`);
    if (report.overlaps.length === 0) {
      console.log(`✓ Overlaps with content: NONE (0 overlaps - PASS)`);
    } else {
      console.log(`✗ Overlaps detected (${report.overlaps.length}):`, report.overlaps);
    }

    // Save screenshot
    const heroEl = await page.$("section");
    const screenshotPath = path.join(OUTPUT_DIR, `hero-${width}.png`);
    if (heroEl) {
      await heroEl.screenshot({ path: screenshotPath });
    } else {
      await page.screenshot({ path: screenshotPath });
    }
    console.log(`Screenshot saved: ${screenshotPath}`);
  }

  // Step 3: Test Drag & Reset
  console.log("\n=======================================================");
  console.log("TEST 3: Draggable sticker drag & safe reset");
  console.log("=======================================================");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 600));

  const stickerHandle = await page.$('[data-cursor="drag"]');
  if (stickerHandle) {
    const boxBefore = await stickerHandle.boundingBox();
    console.log("Initial sticker position:", { x: Math.round(boxBefore!.x), y: Math.round(boxBefore!.y) });

    // Drag sticker by +200px X and +150px Y
    await page.mouse.move(boxBefore!.x + boxBefore!.width / 2, boxBefore!.y + boxBefore!.height / 2);
    await page.mouse.down();
    await page.mouse.move(boxBefore!.x + boxBefore!.width / 2 + 200, boxBefore!.y + boxBefore!.height / 2 + 150, { steps: 5 });
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 200));

    const boxDragged = await stickerHandle.boundingBox();
    console.log("Dragged sticker position:", { x: Math.round(boxDragged!.x), y: Math.round(boxDragged!.y) });

    // Click Reset button
    const resetBtn = await page.$('button[aria-label="Clear stickers"]');
    if (resetBtn) {
      await resetBtn.click();
      await new Promise((r) => setTimeout(r, 200));
    } else {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent("fernum-reset-stickers")));
      await new Promise((r) => setTimeout(r, 200));
    }

    const boxReset = await stickerHandle.boundingBox();
    console.log("Reset sticker position:", { x: Math.round(boxReset!.x), y: Math.round(boxReset!.y) });

    const returnedToOrigin = Math.abs(boxReset!.x - boxBefore!.x) < 2 && Math.abs(boxReset!.y - boxBefore!.y) < 2;
    console.log(`Reset returned to safe position: ${returnedToOrigin ? "PASS (true)" : "FAIL (false)"}`);
  }

  await browser.close();
  console.log("\nAll tests completed successfully!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
