import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Builder.io migration comparison tests.
 * Compares production (solana.com) pages against local (localhost:3000) migrated pages.
 */
export default defineConfig({
  testDir: "./e2e/migration",
  // Use serial mode to avoid overwhelming localhost dev server
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Single worker to prevent overloading the Next.js dev server
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "playwright-results.json" }],
  ],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  outputDir: "test-results",
  // Only use desktop for migration content comparison tests
  // We're comparing content, not testing responsive layouts
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
