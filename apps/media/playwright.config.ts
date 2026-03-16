import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3002";
const storageState = process.env.PLAYWRIGHT_STORAGE_STATE;
const isLocalKeystatic =
  (process.env.NEXT_PUBLIC_KEYSTATIC_LOCAL ?? "true") === "true";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL,
    viewport: { width: 1440, height: 900 },
    screenshot: "off",
    trace: "off",
    ...(storageState ? { storageState } : {}),
  },
  ...(isLocalKeystatic
    ? {
        webServer: {
          command: "NEXT_PUBLIC_KEYSTATIC_LOCAL=true pnpm dev",
          url: "http://127.0.0.1:3002/keystatic",
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }
    : {}),
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
