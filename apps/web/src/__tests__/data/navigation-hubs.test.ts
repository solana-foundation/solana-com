import { describe, expect, it } from "vitest";
import { mergeHubConfig } from "@/data/navigation-hubs";

describe("mergeHubConfig", () => {
  it("uses static arrays as the navigation topology", () => {
    const result = mergeHubConfig(
      [{ href: "/wallets" }],
      [
        { title: "Wallets" },
        { title: "Stale translated link without a static href" },
      ],
    );

    expect(result).toEqual([{ href: "/wallets", title: "Wallets" }]);
  });

  it("preserves arrays that exist only in translated content", () => {
    const metrics = [{ value: "01", label: "Choose a wallet" }];

    expect(mergeHubConfig(undefined, metrics)).toEqual(metrics);
  });
});
