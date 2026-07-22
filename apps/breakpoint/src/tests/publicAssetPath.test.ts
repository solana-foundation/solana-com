import { describe, expect, it } from "vitest";
import {
  config,
  localizedRoutePath,
  localizedRouteUrl,
  publicLocalizedRouteUrl,
  publicAssetPath,
  routePath,
} from "@/config";

describe("routePath", () => {
  it("prefixes Breakpoint app routes", () => {
    expect(routePath("/")).toBe("/breakpoint");
    expect(routePath("/travel")).toBe("/breakpoint/travel");
    expect(routePath("faq")).toBe("/breakpoint/faq");
  });

  it("leaves already-prefixed, asset, and non-route hrefs unchanged", () => {
    expect(routePath("/breakpoint/travel")).toBe("/breakpoint/travel");
    expect(routePath("/breakpoint-assets/assets/home-hero.webp")).toBe(
      "/breakpoint-assets/assets/home-hero.webp",
    );
    expect(routePath("#flights")).toBe("#flights");
    expect(routePath("https://example.com")).toBe("https://example.com");
  });
});

describe("localizedRoutePath", () => {
  it("matches the public Breakpoint rewrites for default and localized routes", () => {
    expect(localizedRoutePath("en")).toBe("/breakpoint");
    expect(localizedRoutePath("en", "/travel")).toBe("/breakpoint/travel");
    expect(localizedRoutePath("ar")).toBe("/ar/breakpoint");
    expect(localizedRoutePath("ar", "/travel")).toBe("/ar/breakpoint/travel");
  });

  it("builds absolute localized Breakpoint URLs", () => {
    expect(localizedRouteUrl("en")).toBe("https://solana.com/breakpoint");
    expect(localizedRouteUrl("de", "/registration")).toBe(
      "https://solana.com/de/breakpoint/registration",
    );
    expect(publicLocalizedRouteUrl("de", "/registration")).toBe(
      "https://solana.com/de/breakpoint/registration",
    );
  });
});

describe("publicAssetPath", () => {
  it("prefixes Breakpoint public asset directories", () => {
    expect(publicAssetPath("/assets/home-hero.webp")).toBe(
      "/breakpoint-assets/assets/home-hero.webp",
    );
    expect(publicAssetPath("/img/gallery/photo-1.jpg")).toBe(
      "/breakpoint-assets/img/gallery/photo-1.jpg",
    );
    expect(publicAssetPath("/live/session.jpg")).toBe(
      "/breakpoint-assets/live/session.jpg",
    );
    expect(publicAssetPath("/_next/static/media/logo.svg")).toBe(
      "/breakpoint-assets/_next/static/media/logo.svg",
    );
  });

  it("leaves non-Breakpoint asset paths unchanged", () => {
    expect(publicAssetPath("/breakpoint")).toBe("/breakpoint");
    expect(publicAssetPath("/social-card.jpg")).toBe("/social-card.jpg");
    expect(publicAssetPath("/breakpoint-assets/assets/home-hero.webp")).toBe(
      "/breakpoint-assets/assets/home-hero.webp",
    );
    expect(publicAssetPath("https://example.com/image.jpg")).toBe(
      "https://example.com/image.jpg",
    );
    expect(publicAssetPath("data:image/svg+xml;base64,abc")).toBe(
      "data:image/svg+xml;base64,abc",
    );
  });
});

describe("site metadata", () => {
  it("uses an absolute Breakpoint social card URL", () => {
    expect(config.siteMetadata.socialShare).toMatch(
      /^https?:\/\/.+\/breakpoint\/social-card\.jpg$/,
    );
    expect(config.siteMetadata.socialShare).not.toContain(
      "/breakpoint/breakpoint/",
    );
  });
});
