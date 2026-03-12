import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: "http://localhost:3002",
    viewport: { width: 1440, height: 900 },
    screenshot: "off",
    trace: "off",
  },
  webServer: {
    command: "NEXT_PUBLIC_KEYSTATIC_LOCAL=true pnpm dev",
    url: "http://localhost:3002/keystatic",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
