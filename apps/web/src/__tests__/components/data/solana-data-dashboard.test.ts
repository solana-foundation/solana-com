import { describe, expect, it } from "vitest";

import type {
  ChartDefinition,
  MetricRow,
  ProviderName,
} from "@/app/[locale]/data/data-config";
import {
  getAvailableProviders,
  getKpiValue,
  getMedian,
  getSelectedProviderList,
  parseProviders,
  updateProvidersParam,
} from "@/app/[locale]/data/solana-data-dashboard";

const availableProviders: ProviderName[] = [
  "Allium",
  "DeFiLlama",
  "Dune",
  "New Provider",
];
const latencyChart = {
  aggregation: "avg",
  id: "rpc-avg-latency",
  metrics: ["RPC Avg Latency"],
  seriesField: "provider",
  tab: "rpc",
  title: "Avg Latency",
  valueLabel: "Milliseconds",
} as const satisfies ChartDefinition;

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

    updateProvidersParam(
      params,
      new Set<ProviderName>(availableProviders),
      availableProviders,
    );

    expect(params.has("providers")).toBe(false);
  });

  it("persists an empty selection as none", () => {
    const params = new URLSearchParams();

    updateProvidersParam(params, new Set<ProviderName>(), availableProviders);

    expect(params.get("providers")).toBe("none");
  });

  it("parses none back to an empty selection", () => {
    expect(parseProviders("none").size).toBe(0);
  });

  it("parses a missing param as all providers", () => {
    expect(parseProviders(null, availableProviders)).toEqual(
      new Set(availableProviders),
    );
  });

  it("round-trips a partial selection", () => {
    const params = new URLSearchParams();
    const selection = new Set<ProviderName>(["Dune", "Allium"]);

    updateProvidersParam(params, selection, availableProviders);

    expect(parseProviders(params.get("providers"), availableProviders)).toEqual(
      selection,
    );
  });

  it("falls back to all providers for unknown values", () => {
    expect(parseProviders("NotAProvider", availableProviders)).toEqual(
      new Set(availableProviders),
    );
  });

  it("normalizes legacy DeFiLlama provider spellings", () => {
    expect(parseProviders("DefiLama", availableProviders)).toEqual(
      new Set<ProviderName>(["DeFiLlama"]),
    );
  });

  it("keeps provider params before SQL rows are available", () => {
    expect(parseProviders("New Provider")).toEqual(
      new Set<ProviderName>(["New Provider"]),
    );
  });

  it("keeps parsed provider labels visible before SQL rows are available", () => {
    const selectedProviders = parseProviders("New Provider,Dune");

    expect(getSelectedProviderList(selectedProviders, [])).toEqual([
      "Dune",
      "New Provider",
    ]);
  });

  it("orders selected provider labels by available SQL providers once loaded", () => {
    const selectedProviders = parseProviders(
      "New Provider,Dune",
      availableProviders,
    );

    expect(
      getSelectedProviderList(selectedProviders, availableProviders),
    ).toEqual(["Dune", "New Provider"]);
  });
});

describe("available providers", () => {
  it("derives provider names from SQL rows", () => {
    const rows: MetricRow[] = [
      {
        date: "2026-06-01",
        metricName: "Supply",
        providerName: "Dune",
        unit: "USD",
        value: 1,
      },
      {
        date: "2026-06-01",
        metricName: "Supply",
        providerName: "Brand New Provider",
        unit: "USD",
        value: 1,
      },
      {
        date: "2026-06-01",
        metricName: "Supply",
        providerName: "DefiLama",
        unit: "USD",
        value: 1,
      },
    ];

    expect(getAvailableProviders(rows)).toEqual([
      "Brand New Provider",
      "DeFiLlama",
      "Dune",
    ]);
  });
});

describe("KPI aggregation", () => {
  const rows: MetricRow[] = [
    {
      date: "2026-06-01T00:00:00.000Z",
      metricName: "RPC Avg Latency",
      providerName: "Alchemy",
      unit: "Milliseconds",
      value: 120,
    },
    {
      date: "2026-06-01T00:00:00.000Z",
      metricName: "RPC Avg Latency",
      providerName: "Helius",
      unit: "Milliseconds",
      value: 40,
    },
    {
      date: "2026-06-01T00:00:00.000Z",
      metricName: "RPC Avg Latency",
      providerName: "QuickNode",
      unit: "Milliseconds",
      value: 80,
    },
  ];
  const selectedProviders = new Set<ProviderName>([
    "Alchemy",
    "Helius",
    "QuickNode",
  ]);

  it("keeps provider KPI aggregation median by default", () => {
    expect(getKpiValue(latencyChart, rows, selectedProviders).value).toBe(80);
  });

  it("supports minimum provider KPI aggregation for RPC latency", () => {
    expect(
      getKpiValue(latencyChart, rows, selectedProviders, "minimum").value,
    ).toBe(40);
  });
});
