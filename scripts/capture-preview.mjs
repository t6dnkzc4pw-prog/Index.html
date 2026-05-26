import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.PREVIEW_BASE_URL || "http://localhost:3010";
const OUT = "preview";
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const shots = [
  { url: `${BASE}/en`, viewport: { width: 1440, height: 900 }, name: "01-en-desktop" },
  { url: `${BASE}/en`, viewport: { width: 390, height: 844 }, name: "02-en-mobile" },
  { url: `${BASE}/it`, viewport: { width: 1440, height: 900 }, name: "03-it-desktop" }
];

// per-section viewport-clip captures, all at desktop 1440x900
const clips = [
  { url: `${BASE}/en`, name: "10-hero", scrollY: 0 },
  { url: `${BASE}/en`, name: "11-emotion", anchor: "h2:has-text('First of all')" },
  { url: `${BASE}/en`, name: "12-sense", anchor: "h2:has-text('An ancient piece of furniture')" },
  { url: `${BASE}/en`, name: "13-scenes-title", anchor: "h2:has-text('The warmth of bread')" },
  { url: `${BASE}/en`, name: "14-scenes-i", anchor: "h3:has-text('On board')" },
  { url: `${BASE}/en`, name: "15-scenes-ii", anchor: "h3:has-text('In the villa')" },
  { url: `${BASE}/en`, name: "16-scenes-iii", anchor: "h3:has-text('In the suite')" },
  { url: `${BASE}/en`, name: "17-scenes-iv", anchor: "h3:has-text('In the private jet')" },
  { url: `${BASE}/en`, name: "18-roots", anchor: "h2:has-text('The tradition of bread')" },
  { url: `${BASE}/en`, name: "19-epilogue", anchor: "h2:has-text('Five hundred years ago')" },
  { url: `${BASE}/en`, name: "20-inquiry", anchor: "h2:has-text('Reserved for a few')" },
  { url: `${BASE}/it`, name: "30-it-hero", scrollY: 0 },
  { url: `${BASE}/it`, name: "31-it-emotion", anchor: "h2:has-text('Innanzitutto')" },
  { url: `${BASE}/it`, name: "32-it-scenes", anchor: "h2:has-text('Il calore del pane')" }
];

async function dismissPreloader(page) {
  // The preloader has its own 3.5s timer + AnimatePresence exit; just nuke it.
  await page.evaluate(() => {
    const nodes = document.querySelectorAll('div[class*="z-[100]"]');
    nodes.forEach((n) => n.remove());
    document.documentElement.style.overflow = "";
  });
}

const browser = await chromium.launch();

async function capture({ url, viewport, name }) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: "reduce",
    deviceScaleFactor: 2
  });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("madia:preloaded", "1");
    } catch {}
  });
  // also stash on localStorage-friendly side-channel for late hydration paths
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await dismissPreloader(page);
  await page.waitForTimeout(700);
  const out = join(OUT, `${name}.png`);
  await page.screenshot({ path: out, fullPage: true, animations: "disabled" });
  console.log("→", out);
  await context.close();
}

async function captureSection({ url, name, anchor, scrollY }) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
    deviceScaleFactor: 2
  });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("madia:preloaded", "1");
    } catch {}
  });
  // also stash on localStorage-friendly side-channel for late hydration paths
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await dismissPreloader(page);
  await page.waitForTimeout(500);

  if (anchor) {
    const target = page.locator(anchor).first();
    await target.waitFor({ state: "attached" });
    const box = await target.boundingBox();
    if (box) {
      const offset = Math.max(0, box.y - 900 * 0.18);
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "auto" }), offset);
    }
  } else if (typeof scrollY === "number") {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  }
  await page.waitForTimeout(300);
  const out = join(OUT, `${name}.png`);
  await page.screenshot({ path: out, fullPage: false, animations: "disabled" });
  console.log("→", out);
  await context.close();
}

for (const s of shots) await capture(s);
for (const c of clips) await captureSection(c);

await browser.close();
console.log("done");
