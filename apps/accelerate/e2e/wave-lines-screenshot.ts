/**
 * Playwright script to capture screenshots of the wave lines area
 * for visual comparison with the Figma design.
 *
 * Usage:
 *   NODE_PATH=../web/node_modules npx tsx e2e/wave-lines-screenshot.ts
 *
 * Prerequisites: accelerate dev server running on port 3004
 */
import { chromium } from "@playwright/test";

async function captureWaveLines() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });

  // Disable CSS animations for stable screenshots
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://localhost:3004", { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });

  // Force Framer Motion elements to be visible
  await page.evaluate(() => {
    document.querySelectorAll("[style]").forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.opacity === "0") {
        htmlEl.style.opacity = "1";
      }
    });
  });

  await page.waitForTimeout(1500);

  // Hero section
  await page.screenshot({
    path: "e2e/screenshots/hero-section.png",
    clip: { x: 0, y: 0, width: 1920, height: 1000 },
  });

  // Wave lines close-up
  await page.screenshot({
    path: "e2e/screenshots/wave-lines-close.png",
    clip: { x: 0, y: 750, width: 1920, height: 600 },
  });

  // Hero to lineup transition
  await page.screenshot({
    path: "e2e/screenshots/hero-to-lineup.png",
    clip: { x: 0, y: 0, width: 1920, height: 2000 },
  });

  console.log("Screenshots saved to e2e/screenshots/");
  await browser.close();
}

captureWaveLines().catch(console.error);
