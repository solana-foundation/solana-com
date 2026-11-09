import { describe, expect, it } from "vitest";

import {
  getProviderLinks,
  providerLinkNames,
  providerLinks,
} from "@/app/[locale]/data/provider-links";

describe("getProviderLinks", () => {
  it("lists only providers with a link, in display order", () => {
    expect(getProviderLinks("network").map((link) => link.name)).toEqual([
      "Allium",
      "Blockworks",
    ]);
    expect(getProviderLinks("stablecoins").map((link) => link.name)).toEqual([
      ...providerLinkNames,
    ]);
  });

  it("has no links on RPC or Tx Senders", () => {
    expect(getProviderLinks("rpc")).toEqual([]);
    expect(getProviderLinks("senders")).toEqual([]);
  });

  it("only links to https URLs", () => {
    for (const links of Object.values(providerLinks)) {
      for (const href of Object.values(links)) {
        expect(new URL(href).protocol).toBe("https:");
      }
    }
  });

  it("uses the requested DefiLlama pages", () => {
    expect(providerLinks.stablecoins.DeFiLlama).toBe(
      "https://defillama.com/stablecoins/solana",
    );
    expect(providerLinks.defi.DeFiLlama).toBe(
      "https://defillama.com/chain/solana?dexsVolume=true&tvl=false",
    );
  });
});
