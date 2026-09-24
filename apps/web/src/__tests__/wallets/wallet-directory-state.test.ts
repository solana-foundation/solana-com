import { describe, expect, it } from "vitest";
import {
  buildDirectorySearchParams,
  DEFAULT_DIRECTORY_STATE,
  parseDirectoryState,
} from "@/app/[locale]/wallets/wallet-directory-state";

describe("wallet directory query state", () => {
  it("defaults to Solana-native wallets", () => {
    expect(parseDirectoryState(new URLSearchParams())).toEqual(
      DEFAULT_DIRECTORY_STATE,
    );
  });

  it("keeps the legacy Solana-native feature URL working", () => {
    expect(
      parseDirectoryState(
        new URLSearchParams("features=solana_native,staking"),
      ),
    ).toMatchObject({
      scope: "native",
      features: ["staking"],
    });
  });

  it("uses an explicit, durable URL state for the wider ecosystem", () => {
    const state = {
      ...DEFAULT_DIRECTORY_STATE,
      scope: "all" as const,
      features: ["staking" as const],
    };
    const params = buildDirectorySearchParams(state);

    expect(params.toString()).toBe("scope=all&features=staking");
    expect(parseDirectoryState(params)).toEqual(state);
  });

  it("lets the explicit ecosystem scope override a legacy native facet", () => {
    expect(
      parseDirectoryState(
        new URLSearchParams("scope=all&features=solana_native,staking"),
      ),
    ).toMatchObject({
      scope: "all",
      features: ["staking"],
    });
  });
});
