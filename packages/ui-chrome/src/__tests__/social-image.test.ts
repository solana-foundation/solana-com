import { describe, expect, it } from "vitest";
import {
  createDefaultSocialImage,
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_URL,
} from "../social-image";

describe("default social image", () => {
  it("provides the canonical Solana social card metadata", () => {
    expect(DEFAULT_SOCIAL_IMAGE).toEqual({
      url: DEFAULT_SOCIAL_IMAGE_URL,
      secureUrl: DEFAULT_SOCIAL_IMAGE_URL,
      width: 1200,
      height: 630,
      alt: "Solana logo on a purple, blue, and green gradient background",
      type: "image/png",
    });
  });

  it("allows callers to provide page-specific alt text", () => {
    expect(createDefaultSocialImage("Solana Developers")).toEqual({
      ...DEFAULT_SOCIAL_IMAGE,
      alt: "Solana Developers",
    });
  });
});
