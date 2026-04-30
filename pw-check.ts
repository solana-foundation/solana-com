import { chromium } from "playwright";

async function check() {
  const browser = await chromium.launch();

  async function triggerAnimations(page: any) {
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 400) {
      await page.evaluate((scrollY: number) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(150);
    }
  }

  const desktop = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  await desktop.goto("http://localhost:3004/en", { waitUntil: "networkidle" });
  await desktop.waitForTimeout(2000);
  await triggerAnimations(desktop);

  // Scroll to bottom to capture stay updated + footer
  const totalHeight = await desktop.evaluate(() => document.body.scrollHeight);
  await desktop.evaluate((h: number) => window.scrollTo(0, h), totalHeight);
  await desktop.waitForTimeout(500);
  await desktop.screenshot({
    path: "/tmp/check-footer-only.png",
  });

  await desktop.close();
  await browser.close();
  console.log("Done");
}

check().catch(console.error);
