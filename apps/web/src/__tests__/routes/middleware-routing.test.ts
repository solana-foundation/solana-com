import { describe, expect, it } from "vitest";
import { config, isProxiedPath } from "@@/src/middleware";

describe("Cross-app middleware routing", () => {
  it("runs the developer portal through the web app middleware", () => {
    expect(isProxiedPath("/developers")).toBe(false);
    expect(isProxiedPath("/developers/cookbook")).toBe(true);
    expect(isProxiedPath("/developers/templates")).toBe(true);
  });

  it("bypasses the main app middleware for media-owned changelog routes", () => {
    expect(isProxiedPath("/changelog")).toBe(true);
    expect(isProxiedPath("/changelog/rss.xml")).toBe(true);
  });

  it("excludes the bare changelog route from the middleware matcher", () => {
    const appRouteMatcher = new RegExp(`^${config.matcher[2]}$`);

    expect(appRouteMatcher.test("/changelog")).toBe(false);
    expect(appRouteMatcher.test("/changelog/rss.xml")).toBe(false);
  });
});
