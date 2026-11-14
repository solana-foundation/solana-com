import { describe, expect, it } from "vitest";
import {
  filterRpcProviders,
  localizeRpcHref,
  parseRpcFeatures,
  parseRpcPath,
  parseRpcPins,
  parseRpcQuery,
  parseRpcView,
  rpcFeatureDiffers,
  rpcProviderHost,
  searchRpcProviders,
} from "@/app/[locale]/rpc/directory-state";
import { RPC_PROVIDERS } from "@/app/[locale]/rpc/providers";

describe("RPC directory", () => {
  it("accepts only known connection paths from the URL", () => {
    expect(parseRpcPath(new URLSearchParams("path=local"))).toBe("local");
    expect(parseRpcPath(new URLSearchParams("path=public"))).toBe("public");
    expect(parseRpcPath(new URLSearchParams("path=unexpected"))).toBe(
      "production",
    );
  });
  it("keeps the locale on cross-app documentation links", () => {
    expect(localizeRpcHref("/docs/rpc/providers", "es")).toBe(
      "/es/docs/rpc/providers",
    );
    expect(localizeRpcHref("/docs/rpc/providers", "en")).toBe(
      "/docs/rpc/providers",
    );
    expect(localizeRpcHref("#providers", "es")).toBe("#providers");
  });
  it("keeps one safe, sourced link per provider in neutral alphabetical order", () => {
    expect(new Set(RPC_PROVIDERS.map((provider) => provider.id)).size).toBe(
      RPC_PROVIDERS.length,
    );
    expect(new Set(RPC_PROVIDERS.map((provider) => provider.name)).size).toBe(
      RPC_PROVIDERS.length,
    );
    expect(RPC_PROVIDERS.map((provider) => provider.name)).toEqual(
      [...RPC_PROVIDERS.map((provider) => provider.name)].sort((a, b) =>
        a.localeCompare(b),
      ),
    );
    for (const provider of RPC_PROVIDERS) {
      expect(new URL(provider.url).protocol).toBe("https:");
      for (const evidence of Object.values(provider.features)) {
        expect(new URL(evidence.sourceUrl).protocol).toBe("https:");
      }
      expect(provider.url).not.toMatch(
        /rpc\.digital-energy\.io|rpc\.ankr\.com|instantnodes\.io/,
      );
    }
  });

  it("searches names without changing the source list", () => {
    expect(
      searchRpcProviders(RPC_PROVIDERS, " hElIuS ").map((item) => item.id),
    ).toEqual(["helius"]);
    expect(searchRpcProviders(RPC_PROVIDERS, "no such provider")).toEqual([]);
    expect(searchRpcProviders(RPC_PROVIDERS, "")).toHaveLength(
      RPC_PROVIDERS.length,
    );
  });

  it("accepts bounded search state from a shared URL", () => {
    expect(parseRpcQuery(new URLSearchParams("q=%20Helius%20&other=1"))).toBe(
      "Helius",
    );
    expect(
      parseRpcQuery(new URLSearchParams(`q=${"x".repeat(150)}`)),
    ).toHaveLength(100);
  });

  it("uses allowlisted feature and provider ids from shareable state", () => {
    expect(
      parseRpcFeatures(new URLSearchParams("f=grpc,unknown,grpc,free")),
    ).toEqual(["grpc", "free"]);
    expect(
      parseRpcPins(
        new URLSearchParams("pin=helius,unknown,alchemy,getblock,ankr"),
        RPC_PROVIDERS,
      ),
    ).toEqual(["alchemy", "ankr", "getblock"]);
  });

  it("matches only sourced affirmative features and intersects with search", () => {
    expect(
      filterRpcProviders(RPC_PROVIDERS, "helius", ["grpc", "history"]).map(
        (provider) => provider.id,
      ),
    ).toEqual(["helius"]);
    expect(filterRpcProviders(RPC_PROVIDERS, "chainflow", ["grpc"])).toEqual(
      [],
    );
    expect(filterRpcProviders(RPC_PROVIDERS, "helius", ["trial"])).toEqual([]);
  });

  it("accepts only known directory views from the URL", () => {
    expect(parseRpcView(new URLSearchParams("view=table"))).toBe("table");
    expect(parseRpcView(new URLSearchParams("view=grid"))).toBe("cards");
    expect(parseRpcView(new URLSearchParams(""))).toBe("cards");
  });

  it("flags comparison rows only where evidence differs", () => {
    const byId = (...ids: string[]) =>
      RPC_PROVIDERS.filter((provider) => ids.includes(provider.id));
    expect(rpcFeatureDiffers(byId("helius", "chainflow"), "grpc")).toBe(true);
    expect(rpcFeatureDiffers(byId("helius", "chainstack"), "websocket")).toBe(
      false,
    );
    expect(rpcFeatureDiffers(byId("chainflow", "syndica"), "sla")).toBe(false);
  });

  it("shows a bare host for each provider destination", () => {
    expect(rpcProviderHost("https://www.helius.dev/solana-rpc-nodes")).toBe(
      "helius.dev",
    );
  });
});
