import { test, type Page } from "@playwright/test";
import path from "path";

const screenshotDir = path.join(__dirname, "../docs/screenshots");

async function snap(page: Page, name: string) {
  await page.screenshot({
    path: path.join(screenshotDir, name),
    fullPage: true,
  });
}

/** Bootstrap the Keystatic SPA and wait for sidebar nav to render. */
async function gotoKeystatic(page: Page) {
  await page.goto("/keystatic/branch/staging", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector('nav a:has-text("Posts")', { timeout: 30_000 });
  await page.getByRole("combobox", { name: "Current branch" }).waitFor();
  await page.waitForLoadState("networkidle");
}

/** Click a sidebar link and wait for the view to load. */
async function clickSidebarLink(page: Page, text: string) {
  await page.locator(`nav a:has-text("${text}")`).first().click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
}

/** Click the "Add" button on a collection list page and wait for the form. */
async function clickAddButton(page: Page) {
  await page
    .locator('button:has-text("Add"), a:has-text("Add")')
    .first()
    .click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
}

test("Keystatic walkthrough screenshots", async ({ page }) => {
  test.setTimeout(180_000);

  // 01 — Dashboard (includes sidebar navigation)
  await gotoKeystatic(page);
  await snap(page, "01-dashboard.png");

  // 02 — Posts list
  await clickSidebarLink(page, "Posts");
  await snap(page, "02-posts-list.png");

  // 03 — Post create form
  await clickAddButton(page);
  await snap(page, "03-post-create-form.png");

  // 04 — Post create form, lower fields
  await page.mouse.wheel(0, 1800);
  await page.waitForTimeout(1000);
  await snap(page, "04-post-form-details.png");

  // 05 — Links list
  await gotoKeystatic(page);
  await clickSidebarLink(page, "Links");
  await snap(page, "05-links-list.png");

  // 06 — Link create form
  await clickAddButton(page);
  await snap(page, "06-link-create-form.png");

  // 07 — CTAs list
  await gotoKeystatic(page);
  await clickSidebarLink(page, "CTAs");
  await snap(page, "07-ctas-list.png");

  // 08 — CTA create form
  await clickAddButton(page);
  await snap(page, "08-cta-create-form.png");

  // 09 — Switchbacks list
  await gotoKeystatic(page);
  await clickSidebarLink(page, "Switchbacks");
  await snap(page, "09-switchbacks-list.png");

  // 10 — Switchback create form
  await clickAddButton(page);
  await snap(page, "10-switchback-create-form.png");

  // 11 — Categories list
  await gotoKeystatic(page);
  await clickSidebarLink(page, "Categories");
  await snap(page, "11-categories-list.png");

  // 12 — Category create form
  await clickAddButton(page);
  await snap(page, "12-category-create-form.png");

  // 13 — Tags list
  await gotoKeystatic(page);
  await clickSidebarLink(page, "Tags");
  await snap(page, "13-tags-list.png");

  // 14 — Tag create form
  await clickAddButton(page);
  await snap(page, "14-tag-create-form.png");

  // 15 — Global settings
  await gotoKeystatic(page);
  await clickSidebarLink(page, "Global Settings");
  await snap(page, "15-global-settings.png");
});
