import { describe, expect, it } from "vitest";
import { publicAssetPath } from "@/config";

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
