import { chromium } from "playwright";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../.screenshots");

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto("http://localhost:3005/en", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.evaluate(() =>
  document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 400))),
);

const info = await page.evaluate(() => {
  const section = document.querySelector("section");
  const h1 = document.querySelector("h1");
  const btn = document.querySelector(
    "section button, section a[class*='inline-flex']",
  );
  const box = (el) =>
    el
      ? JSON.stringify({
          x: Math.round(el.getBoundingClientRect().x),
          y: Math.round(el.getBoundingClientRect().y),
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height),
        })
      : "null";
  return {
    section: box(section),
    h1: box(h1),
    button: box(btn),
  };
});
console.log("DEBUG", JSON.stringify(info, null, 2));

await page.screenshot({
  path: resolve(outDir, "hero-viewport.png"),
  clip: { x: 0, y: 0, width: 1440, height: 700 },
});
await browser.close();
