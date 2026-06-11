import { describe, expect, it } from "vitest";

import { providers, type ProviderName } from "@/app/[locale]/data/data-config";
import {
  getMedian,
  parseProviders,
  updateProvidersParam,
} from "@/app/[locale]/data/solana-data-dashboard";

describe("getMedian", () => {
  it("returns the middle value for an odd count", () => {
    expect(getMedian([5, 1, 3])).toBe(3);
  });

  it("averages the two middle values for an even count", () => {
    expect(getMedian([1, 2, 3, 10])).toBe(2.5);
  });

  it("returns the value itself for a single entry", () => {
    expect(getMedian([7])).toBe(7);
  });

  it("is robust to outliers, unlike a mean", () => {
    expect(getMedian([100, 101, 102, 1_000_000])).toBe(101.5);
  });

  it("does not mutate the input array", () => {
    const values = [3, 1, 2];

    getMedian(values);

    expect(values).toEqual([3, 1, 2]);
  });
});

describe("provider query state", () => {
  it("drops the param when all providers are selected", () => {
    const params = new URLSearchParams("providers=Allium");

    updateProvidersParam(params, new Set<ProviderName>(providers));

    expect(params.has("providers")).toBe(false);
  });

  it("persists an empty selection as none", () => {
    const params = new URLSearchParams();

    updateProvidersParam(params, new Set<ProviderName>());

    expect(params.get("providers")).toBe("none");
  });

  it("parses none back to an empty selection", () => {
    expect(parseProviders("none").size).toBe(0);
  });

  it("parses a missing param as all providers", () => {
    expect(parseProviders(null).size).toBe(providers.length);
  });

  it("round-trips a partial selection", () => {
    const params = new URLSearchParams();
    const selection = new Set<ProviderName>(["Dune", "Allium"]);

    updateProvidersParam(params, selection);

    expect(parseProviders(params.get("providers"))).toEqual(selection);
  });

  it("falls back to all providers for unknown values", () => {
    expect(parseProviders("NotAProvider").size).toBe(providers.length);
  });
});
