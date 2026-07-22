import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";

const redirects = rewritesAndRedirects.redirects;

describe("Wallet redirects", () => {
  it("permanently redirects retired wallet URLs to the new directory", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/solana-wallets",
          destination: "/wallets",
          permanent: true,
        }),
        expect.objectContaining({
          source:
            "/:locale(en|ar|de|el|es|fi|fr|id|it|ja|ko|nl|pl|pt|ru|tr|uk|vi|zh)/solana-wallets",
          destination: "/:locale/wallets",
          permanent: true,
        }),
      ]),
    );
  });
});
