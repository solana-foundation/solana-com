import { describe, expect, it } from "vitest";
import { locales } from "@workspace/i18n/config";
import rewritesAndRedirects from "@@/rewrites-redirects";

const redirects = rewritesAndRedirects.redirects;
const LOCALE_REGEX = locales.join("|");

describe("Chain migration redirects", () => {
  it("permanently redirects the EVM→SVM guides to migrate-to-solana", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/developers/evm-to-svm/:path+",
          destination: "/developers/migrate-to-solana/:path+",
          permanent: true,
        }),
        expect.objectContaining({
          source: `/:locale(${LOCALE_REGEX})/developers/evm-to-svm/:path+`,
          destination: "/:locale/developers/migrate-to-solana/:path+",
          permanent: true,
        }),
      ]),
    );
  });

  it("permanently redirects the old landing pages to their new hubs", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/developers/evm-to-svm",
          destination: "/developers/migrate-to-solana/ethereum",
          permanent: true,
        }),
        expect.objectContaining({
          source: `/:locale(${LOCALE_REGEX})/developers/evm-to-svm`,
          destination: "/:locale/developers/migrate-to-solana/ethereum",
          permanent: true,
        }),
        expect.objectContaining({
          source: "/developers/cosmos-to-svm",
          destination: "/developers/migrate-to-solana/cosmos",
          permanent: true,
        }),
        expect.objectContaining({
          source: `/:locale(${LOCALE_REGEX})/developers/cosmos-to-svm`,
          destination: "/:locale/developers/migrate-to-solana/cosmos",
          permanent: true,
        }),
      ]),
    );
  });

  it("permanently redirects the top-level cosmwasm alias to the Cosmos CosmWasm guide", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/developers/migrate-to-solana/cosmwasm",
          destination: "/developers/migrate-to-solana/cosmos/cosmwasm",
          permanent: true,
        }),
        expect.objectContaining({
          source: `/:locale(${LOCALE_REGEX})/developers/migrate-to-solana/cosmwasm`,
          destination: "/:locale/developers/migrate-to-solana/cosmos/cosmwasm",
          permanent: true,
        }),
      ]),
    );
  });
});
