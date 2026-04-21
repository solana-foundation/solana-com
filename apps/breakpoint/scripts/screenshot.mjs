import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../.screenshots");
mkdirSync(outDir, { recursive: true });

const url = "http://localhost:3005/en";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  console.log(`[${vp.name}] navigating ${url}`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.evaluate(() =>
    document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 400))),
  );
  await page.screenshot({
    path: resolve(outDir, `home-${vp.name}.png`),
    fullPage: true,
  });
  console.log(`[${vp.name}] saved`);
  await ctx.close();
}

await browser.close();
console.log(`screenshots → ${outDir}`);
