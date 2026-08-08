import { describe, expect, it } from "vitest";
import { config, isProxiedPath } from "@@/src/middleware";

describe("Cross-app middleware routing", () => {
  it("bypasses the main app middleware for media-owned changelog routes", () => {
    expect(isProxiedPath("/changelog")).toBe(true);
    expect(isProxiedPath("/changelog/rss.xml")).toBe(true);
  });

  it.each([
    "/accelerate",
    "/breakpoint/schedule",
    "/developers",
    "/developers/templates/example",
    "/developers/cookbook/tokens",
    "/developers/bootcamp",
    "/docs/core/transactions",
    "/learn",
    "/news",
    "/reports/tokenized-equities",
    "/podcasts/validated",
    "/upgrade",
    "/upgrades/firedancer",
    "/accelerate-assets/_next/static/chunk.js",
    "/breakpoint-assets/img/photo.jpg",
    "/docs-assets/_next/static/chunk.js",
    "/media-assets/uploads/image.png",
    "/templates-assets/_next/static/chunk.js",
    "/opengraph/docs",
  ])("bypasses the main app middleware for %s", (path) => {
    expect(isProxiedPath(path)).toBe(true);
  });

  it.each(["/newsletter", "/developers/guides", "/admin", "/data"])(
    "keeps the existing main-app middleware boundary for %s",
    (path) => {
      expect(isProxiedPath(path)).toBe(false);
    },
  );

  it("excludes the bare changelog route from the middleware matcher", () => {
    const appRouteMatcher = new RegExp(`^${config.matcher[2]}$`);

    expect(appRouteMatcher.test("/changelog")).toBe(false);
    expect(appRouteMatcher.test("/changelog/rss.xml")).toBe(false);
  });
});
