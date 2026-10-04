import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3100";
const OUTPUT_DIR = path.resolve(__dirname, "../screenshots");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const PAGES = [
  { name: "home", path: "/" },
  { name: "work", path: "/work" },
  { name: "structure", path: "/structure" },
  { name: "how-we-test", path: "/how-we-test" },
  { name: "faq", path: "/faq" },
  { name: "about", path: "/about" },
  { name: "terms", path: "/terms" },
  { name: "refund", path: "/refund" },
  { name: "privacy", path: "/privacy" },
  { name: "thanks", path: "/thanks" },
  { name: "not-found", path: "/nonexistent-page-404" },
];

const VIBES = [
  { name: "orange", themeColor: "#F14A0A" },
  { name: "green", themeColor: "#16C846" },
  { name: "purple", themeColor: "#6C3BF5" },
];

async function run() {
  console.log("Launching headless browser at:", CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const summary: any[] = [];

  for (const vibe of VIBES) {
    console.log(`\n=== TESTING VIBE: ${vibe.name.toUpperCase()} ===`);

    // Set localStorage before navigating
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.evaluate((v) => {
      localStorage.setItem("fernum_vibe", v);
    }, vibe.name);

    for (const p of PAGES) {
      const url = `${BASE_URL}${p.path}`;
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await new Promise((r) => setTimeout(r, 200));

      // Verify data-vibe and theme-color
      const check = await page.evaluate(() => {
        const rootVibe = document.documentElement.getAttribute("data-vibe");
        const metaColor = document.querySelector('meta[name="theme-color"]')?.getAttribute("content");
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        const pageBgVar = window.getComputedStyle(document.documentElement).getPropertyValue("--page-bg").trim();
        const accentVar = window.getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
        return { rootVibe, metaColor, bodyBg, pageBgVar, accentVar };
      });

      const passVibe = check.rootVibe === vibe.name;
      const passMeta = check.metaColor?.toUpperCase() === vibe.themeColor.toUpperCase();

      // Screenshot desktop
      const desktopShot = path.join(OUTPUT_DIR, `${p.name}-${vibe.name}-1440.png`);
      await page.screenshot({ path: desktopShot, fullPage: false });

      // Screenshot mobile
      await page.setViewport({ width: 375, height: 812 });
      await new Promise((r) => setTimeout(r, 100));
      const mobileShot = path.join(OUTPUT_DIR, `${p.name}-${vibe.name}-375.png`);
      await page.screenshot({ path: mobileShot, fullPage: false });

      summary.push({
        page: p.name,
        vibe: vibe.name,
        rootVibe: check.rootVibe,
        metaThemeColor: check.metaColor,
        accentVar: check.accentVar,
        desktopShot: path.basename(desktopShot),
        mobileShot: path.basename(mobileShot),
        status: passVibe && passMeta ? "PASS" : "FAIL",
      });

      process.stdout.write(`  [${p.name}] ${vibe.name} -> data-vibe: ${check.rootVibe}, theme: ${check.metaColor} (${passVibe && passMeta ? "OK" : "ERR"})\n`);
    }
  }

  // Also test interactive click switching on the navbar
  console.log("\n=== TESTING INTERACTIVE SWITCHING IN NAVBAR ===");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

  // Click Green
  await page.click('button[aria-label="Green vibe"]');
  await new Promise((r) => setTimeout(r, 300));
  const greenState = await page.evaluate(() => ({
    vibe: document.documentElement.getAttribute("data-vibe"),
    saved: localStorage.getItem("fernum_vibe"),
    themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
  }));
  console.log("Clicked Green button:", greenState);

  // Click Purple
  await page.click('button[aria-label="Purple vibe"]');
  await new Promise((r) => setTimeout(r, 300));
  const purpleState = await page.evaluate(() => ({
    vibe: document.documentElement.getAttribute("data-vibe"),
    saved: localStorage.getItem("fernum_vibe"),
    themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
  }));
  console.log("Clicked Purple button:", purpleState);

  // Click Orange
  await page.click('button[aria-label="Orange vibe"]');
  await new Promise((r) => setTimeout(r, 300));
  const orangeState = await page.evaluate(() => ({
    vibe: document.documentElement.getAttribute("data-vibe"),
    saved: localStorage.getItem("fernum_vibe"),
    themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
  }));
  console.log("Clicked Orange button:", orangeState);

  await browser.close();
  console.log("\nAll visual tests and screenshots completed successfully!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
