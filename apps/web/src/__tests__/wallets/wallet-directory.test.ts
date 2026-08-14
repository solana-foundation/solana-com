import { describe, expect, it } from "vitest";
import {
  buildWalletCategories,
  getFeaturedEverydayWallets,
  type WalletDirectoryEntry,
} from "@/app/[locale]/wallets/wallet-directory";

function wallet(
  id: string,
  category: WalletDirectoryEntry["category"] = "consumer",
): WalletDirectoryEntry {
  return {
    id,
    name: id,
    slug: id,
    category,
    categories: [category],
    platforms: [],
    features: [],
    description: "",
    website: `https://example.com/${id}`,
    supportedChains: [],
    supportedAssets: [],
  };
}

describe("getFeaturedEverydayWallets", () => {
  it("randomly selects four curated consumer wallets", () => {
    const featured = getFeaturedEverydayWallets(
      [
        wallet("backpack"),
        wallet("fuse"),
        wallet("jupiter"),
        wallet("phantom"),
        wallet("solflare"),
        wallet("squadsx", "institutional"),
      ],
      { randomize: true, random: () => 0 },
    );

    expect(featured.map(({ id }) => id)).toEqual([
      "backpack",
      "phantom",
      "fuse",
      "jupiter",
    ]);
    expect(featured).toHaveLength(4);
    expect(featured.every(({ category }) => category === "consumer")).toBe(
      true,
    );
  });
});

describe("buildWalletCategories", () => {
  it.each(["buy_crypto", "sell_crypto", "get_paid", "card_spending"] as const)(
    "adds Payments for the %s capability",
    (feature) => {
      expect(buildWalletCategories("consumer", [feature])).toEqual([
        "consumer",
        "payments",
      ]);
    },
  );

  it("keeps a payment-first wallet in one category", () => {
    expect(buildWalletCategories("payments", ["buy_crypto"])).toEqual([
      "payments",
    ]);
  });

  it("preserves only the primary category without a payment capability", () => {
    expect(buildWalletCategories("hardware", ["staking"])).toEqual([
      "hardware",
    ]);
  });
});
