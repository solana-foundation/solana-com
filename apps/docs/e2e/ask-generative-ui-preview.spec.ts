import { expect, test, type Page } from "@playwright/test";

const FIXTURES = [
  { name: "token lifecycle", slug: "token-lifecycle" },
  { name: "PDA derivation", slug: "pda-derivation" },
  { name: "transaction signing", slug: "transaction-signing" },
  { name: "CPI flow", slug: "cpi-flow" },
  { name: "account initialization", slug: "account-initialization" },
  { name: "RPC request lifecycle", slug: "rpc-request-lifecycle" },
] as const;

async function stabilizePreviewPage(page: Page) {
  const optOutButton = page.getByRole("button", { name: "Opt-out" });
  if (await optOutButton.isVisible().catch(() => false)) {
    await optOutButton.click();
  }

  await page.addStyleTag({
    content: `
      iframe[src*="googletagmanager"] {
        display: none !important;
      }
    `,
  });
}

async function openPreviewFixture(page: Page, slug: string) {
  await page.goto("/ask-ui-preview");
  await stabilizePreviewPage(page);
  await page.getByTestId(`fixture-${slug}`).click();
  await expect(page.getByTestId("diagnostics-summary")).toContainText(
    "0 errors",
  );
}

for (const fixture of FIXTURES) {
  test(`visual snapshot: ${fixture.name}`, async ({ page }) => {
    await openPreviewFixture(page, fixture.slug);

    await expect(page.getByTestId("desktop-preview")).toHaveScreenshot(
      `${fixture.slug}-desktop.png`,
      {
        animations: "disabled",
        maxDiffPixelRatio: 0.01,
      },
    );
    await expect(page.getByTestId("mobile-preview")).toHaveScreenshot(
      `${fixture.slug}-mobile.png`,
      {
        animations: "disabled",
        maxDiffPixelRatio: 0.01,
      },
    );
  });
}

test("applies reveal, connect, and update effects with optional actions collapsed", async ({
  page,
}) => {
  await openPreviewFixture(page, "token-lifecycle");

  const desktop = page.getByTestId("desktop-preview");
  await expect(desktop).toContainText("Model");
  await expect(desktop).toContainText("Before you start");
  await expect(desktop).toContainText("More actions (1)");

  await desktop.getByRole("button", { name: "Execute" }).click();
  await expect(desktop).toContainText("Mint account");
  await expect(desktop).toContainText("initialized");

  await desktop.getByRole("button", { name: "Execute" }).click();
  await expect(desktop).toContainText("Token account");
  await expect(desktop).toContainText("owns");
  await expect(desktop).toContainText("reads");

  await desktop.getByRole("button", { name: "Execute" }).click();
  await expect(desktop).toContainText("supply");
  await expect(desktop).toContainText("100");
  await expect(desktop).toContainText("balance");
  await expect(desktop.getByRole("button", { name: "Replay" })).toBeVisible();
});

test("mobile preview frame does not overflow horizontally", async ({
  page,
}) => {
  for (const fixture of FIXTURES) {
    await openPreviewFixture(page, fixture.slug);

    const hasHorizontalOverflow = await page
      .getByTestId("mobile-preview-surface")
      .evaluate((element) => element.scrollWidth > element.clientWidth + 1);

    expect(hasHorizontalOverflow, fixture.name).toBe(false);
  }
});
