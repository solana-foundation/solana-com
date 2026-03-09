import { chromium } from "playwright";

async function check() {
  const browser = await chromium.launch();

  // Helper to scroll through full page to trigger all whileInView animations
  async function triggerAnimations(page: any) {
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 400) {
      await page.evaluate((scrollY: number) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  }

  // Desktop 1920
  const desktop = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  await desktop.goto("http://localhost:3004/en", { waitUntil: "networkidle" });
  await desktop.waitForTimeout(2000);
  await triggerAnimations(desktop);
  await desktop.screenshot({
    path: "/tmp/check-desktop-full.png",
    fullPage: true,
  });

  // Section screenshots
  await desktop.evaluate(() => window.scrollTo(0, 0));
  await desktop.waitForTimeout(300);
  await desktop.screenshot({
    path: "/tmp/check-hero.png",
    clip: { x: 0, y: 0, width: 1920, height: 1000 },
  });

  await desktop.evaluate(() => window.scrollTo(0, 1200));
  await desktop.waitForTimeout(300);
  await desktop.screenshot({
    path: "/tmp/check-lineup.png",
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });

  await desktop.evaluate(() => window.scrollTo(0, 2100));
  await desktop.waitForTimeout(300);
  await desktop.screenshot({
    path: "/tmp/check-highlights.png",
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });

  await desktop.evaluate(() => window.scrollTo(0, 2900));
  await desktop.waitForTimeout(300);
  await desktop.screenshot({
    path: "/tmp/check-videos.png",
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });

  await desktop.evaluate(() =>
    window.scrollTo(0, document.body.scrollHeight - 1200),
  );
  await desktop.waitForTimeout(300);
  await desktop.screenshot({
    path: "/tmp/check-stayupdated.png",
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });

  await desktop.evaluate(() =>
    window.scrollTo(0, document.body.scrollHeight - 400),
  );
  await desktop.waitForTimeout(300);
  await desktop.screenshot({
    path: "/tmp/check-footer.png",
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });
  await desktop.close();

  // Tablet 768
  const tablet = await browser.newPage({
    viewport: { width: 768, height: 1024 },
  });
  await tablet.goto("http://localhost:3004/en", { waitUntil: "networkidle" });
  await tablet.waitForTimeout(2000);
  await triggerAnimations(tablet);
  await tablet.screenshot({
    path: "/tmp/check-tablet-full.png",
    fullPage: true,
  });
  await tablet.close();

  // Mobile 375
  const mobile = await browser.newPage({
    viewport: { width: 375, height: 812 },
  });
  await mobile.goto("http://localhost:3004/en", { waitUntil: "networkidle" });
  await mobile.waitForTimeout(2000);
  await triggerAnimations(mobile);
  await mobile.screenshot({
    path: "/tmp/check-mobile-full.png",
    fullPage: true,
  });
  await mobile.close();

  console.log("Screenshots saved");
  await browser.close();
}

check().catch(console.error);
