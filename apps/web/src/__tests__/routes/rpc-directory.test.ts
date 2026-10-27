import { describe, expect, it } from "vitest";
import {
  localizeRpcHref,
  parseRpcPath,
  parseRpcQuery,
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
      expect(new URL(provider.evidenceUrl).protocol).toBe("https:");
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
});
