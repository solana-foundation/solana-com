import { describe, expect, it } from "vitest";
import { config, isProxiedPath } from "@@/src/middleware";

describe("Cross-app middleware routing", () => {
  it("bypasses the main app middleware for media-owned changelog routes", () => {
    expect(isProxiedPath("/changelog")).toBe(true);
    expect(isProxiedPath("/changelog/rss.xml")).toBe(true);
  });

  it("bypasses the main app middleware for the Builder app", () => {
    const appRouteMatcher = new RegExp(`^${config.matcher.at(-1)}$`);

    expect(isProxiedPath("/builder")).toBe(true);
    expect(isProxiedPath("/builder/faq")).toBe(true);
    expect(appRouteMatcher.test("/builder")).toBe(false);
    expect(appRouteMatcher.test("/uk/builder")).toBe(true);
  });

  it("keeps Learn routes in the main app", () => {
    expect(isProxiedPath("/learn")).toBe(false);
    expect(isProxiedPath("/learn/what-is-solana")).toBe(false);
  });

  it("excludes the bare changelog route from the middleware matcher", () => {
    const appRouteMatcher = new RegExp(`^${config.matcher.at(-1)}$`);

    expect(appRouteMatcher.test("/changelog")).toBe(false);
    expect(appRouteMatcher.test("/changelog/rss.xml")).toBe(false);
    expect(appRouteMatcher.test("/wsop")).toBe(true);
  });
});
