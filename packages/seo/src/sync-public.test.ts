import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  appConfigs,
  buildManifest,
  generatedFiles,
  generateIconFiles,
  syncPublicAssets,
} from "../scripts/sync-public-lib.mjs";

describe("buildManifest", () => {
  it("builds a web manifest with standard icon entries", () => {
    expect(
      buildManifest({
        name: "Test App",
        short_name: "Test",
        theme_color: "#fff",
        background_color: "#000",
        display: "standalone",
      }),
    ).toEqual({
      name: "Test App",
      short_name: "Test",
      icons: [
        {
          src: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      theme_color: "#fff",
      background_color: "#000",
      display: "standalone",
    });
  });
});

describe("syncPublicAssets", () => {
  it("generates the expected icon outputs from a single svg source", async () => {
    const assetsDir = mkdtempSync(join(tmpdir(), "seo-icons-assets-"));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="12" fill="#000"/><circle cx="50" cy="50" r="30" fill="#14f195"/></svg>`;
    writeFileSync(join(assetsDir, "favicon.svg"), svg);

    const iconFiles = await generateIconFiles({ assetsDir });

    expect(Object.keys(iconFiles)).toEqual(generatedFiles);
    expect(iconFiles["favicon.svg"].toString("utf8")).toBe(svg);
    expect(iconFiles["favicon.ico"].length).toBeGreaterThan(0);
    expect(iconFiles["icon-512.png"].length).toBeGreaterThan(0);
  });

  it("prefers packaged icon PNGs when they are present", async () => {
    const assetsDir = mkdtempSync(join(tmpdir(), "seo-icons-assets-"));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="12" fill="#000"/><circle cx="50" cy="50" r="30" fill="#14f195"/></svg>`;
    const icon192 = Buffer.from("icon-192-source");
    const icon512 = Buffer.from("icon-512-source");

    writeFileSync(join(assetsDir, "favicon.svg"), svg);
    writeFileSync(join(assetsDir, "icon-192.png"), icon192);
    writeFileSync(join(assetsDir, "icon-512.png"), icon512);

    const iconFiles = await generateIconFiles({ assetsDir });

    expect(iconFiles["icon-192.png"]).toEqual(icon192);
    expect(iconFiles["icon-512.png"]).toEqual(icon512);
  });

  it("syncs only the requested app output", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "seo-sync-repo-"));
    const assetsDir = mkdtempSync(join(tmpdir(), "seo-sync-assets-"));
    writeFileSync(
      join(assetsDir, "favicon.svg"),
      `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="12" fill="#000"/><circle cx="50" cy="50" r="30" fill="#14f195"/></svg>`,
    );

    await syncPublicAssets({ repoRoot, assetsDir, appFilter: "breakpoint" });

    const breakpointPublic = join(repoRoot, "apps/breakpoint/public");
    const manifest = JSON.parse(
      readFileSync(join(breakpointPublic, "site.webmanifest"), "utf8"),
    );

    expect(readFileSync(join(breakpointPublic, "favicon.svg"), "utf8")).toContain(
      "<svg",
    );
    expect(readFileSync(join(breakpointPublic, "icon-192.png")).length).toBeGreaterThan(0);
    expect(manifest.name).toBe("Breakpoint 2026");

    const docsPublic = join(repoRoot, "apps/docs/public");
    expect(() => readFileSync(join(docsPublic, "site.webmanifest"), "utf8")).toThrow();
  });

  it("throws for an unknown app name", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "seo-sync-repo-"));
    const assetsDir = mkdtempSync(join(tmpdir(), "seo-sync-assets-"));
    mkdirSync(repoRoot, { recursive: true });
    mkdirSync(assetsDir, { recursive: true });

    await expect(
      syncPublicAssets({ repoRoot, assetsDir, appFilter: "unknown" }),
    ).rejects.toThrow("Unknown app 'unknown'");
  });

  it("covers all configured apps", () => {
    expect(appConfigs.map((config) => config.app)).toEqual([
      "web",
      "docs",
      "breakpoint",
      "media",
      "accelerate",
    ]);
  });
});
