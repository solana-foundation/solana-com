import { describe, expect, it } from "vitest";
import { publicAssetPath, routePath } from "@/config";

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
    expect(publicAssetPath("/social-card.webp")).toBe("/social-card.webp");
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
