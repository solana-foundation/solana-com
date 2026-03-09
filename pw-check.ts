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

  // Scroll to very bottom
  await desktop.evaluate(() =>
    window.scrollTo(0, document.body.scrollHeight - 360),
  );
  await desktop.waitForTimeout(500);
  await desktop.screenshot({
    path: "/tmp/check-footer-only.png",
    clip: { x: 100, y: 680, width: 1720, height: 400 },
  });

  await desktop.close();
  await browser.close();
  console.log("Done");
}

check().catch(console.error);
