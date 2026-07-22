import { describe, expect, it } from "vitest";
import { buildWalletCategories } from "@/app/[locale]/wallets/wallet-directory";

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
