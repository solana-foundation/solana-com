import { describe, expect, it } from "vitest";
import {
  createUpgradeSocialImage,
  formatUpgradePublishedDate,
  getUpgradeSocialImageUrl,
  getUpgradeTitleFontSize,
  UPGRADE_SOCIAL_IMAGE_SIZE,
} from "@/lib/upgrades/social-image";

describe("upgrade social images", () => {
  it("builds a stable public image URL for an upgrade", () => {
    expect(getUpgradeSocialImageUrl("bls-pubkey-vat")).toBe(
      "https://solana.com/upgrades/bls-pubkey-vat/social-image",
    );
  });

  it("encodes slugs before placing them in the image URL", () => {
    expect(getUpgradeSocialImageUrl("upgrade preview")).toContain(
      "/upgrade%20preview/social-image",
    );
  });

  it("creates a complete Open Graph image descriptor", () => {
    expect(createUpgradeSocialImage("alpenglow", "Alpenglow")).toEqual({
      url: "https://solana.com/upgrades/alpenglow/social-image",
      width: UPGRADE_SOCIAL_IMAGE_SIZE.width,
      height: UPGRADE_SOCIAL_IMAGE_SIZE.height,
      type: "image/png",
      alt: "Alpenglow — Solana Upgrades",
    });
  });

  it("formats the metadata date in UTC", () => {
    expect(formatUpgradePublishedDate("2026-07-16T00:00:00.000Z")).toBe(
      "July 2026",
    );
    expect(formatUpgradePublishedDate(undefined)).toBeNull();
    expect(formatUpgradePublishedDate("not-a-date")).toBeNull();
  });

  it("scales longer titles down to fit the card", () => {
    expect(getUpgradeTitleFontSize("Short title")).toBe(64);
    expect(getUpgradeTitleFontSize("A".repeat(60))).toBe(54);
    expect(getUpgradeTitleFontSize("A".repeat(80))).toBe(46);
  });
});
