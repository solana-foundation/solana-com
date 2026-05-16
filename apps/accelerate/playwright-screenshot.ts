import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const BASE_URL = "http://localhost:3004";
const OUTPUT_DIR = path.join(__dirname, "screenshots");

const pages = [
  { name: "miami", path: "/en/miami" },
  { name: "hong-kong", path: "/en/hong-kong" },
];

const viewports = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  for (const pageConfig of pages) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        // Reduce motion to avoid capturing mid-animation frames
        reducedMotion: "reduce",
      });
      const page = await context.newPage();

      const url = `${BASE_URL}${pageConfig.path}`;
      console.log(
        `Capturing ${pageConfig.name} @ ${viewport.name} (${viewport.width}x${viewport.height})...`,
      );

      await page.goto(url, { waitUntil: "networkidle" });
      // Wait for any remaining animations/images
      await page.waitForTimeout(2000);

      const filename = `${pageConfig.name}-${viewport.name}.png`;
      await page.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        fullPage: true,
      });

      console.log(`  -> ${filename}`);
      await context.close();
    }
  }

  await browser.close();
  console.log(`\nDone! Screenshots saved to ${OUTPUT_DIR}`);
}

main().catch(console.error);
