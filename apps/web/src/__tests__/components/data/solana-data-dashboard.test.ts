import { describe, expect, it } from "vitest";

import type {
  ChartDefinition,
  MetricRow,
  ProviderName,
} from "@/app/[locale]/data/data-config";
import {
  applyQueryUpdates,
  getAvailableProviders,
  getKpiValue,
  getMedian,
  getSelectedProviderList,
  getSenderEconomicsItems,
  parseProviders,
  updateProvidersParam,
} from "@/app/[locale]/data/solana-data-dashboard";
import {
  getNextSenderComparison,
  getSenderComparisonSeries,
  sortSenderProviderItems,
  type SenderEconomicsItem,
} from "@/app/[locale]/data/sender-provider-experience";

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

  it("falls back to all providers when a stale selection partially overlaps", () => {
    const rpcProviders = ["Alchemy", "Helius", "QuickNode", "Triton"];

    expect(parseProviders("0Slot,Helius,Temporal", rpcProviders)).toEqual(
      new Set(rpcProviders),
    );
  });

  it("clears provider selections when switching provider namespaces", () => {
    const params = new URLSearchParams(
      "tab=senders&providers=0Slot%2CHelius%2CTemporal&method=getMultipleAccounts",
    );

    applyQueryUpdates(params, { tab: "rpc" }, availableProviders);

    expect(params.get("tab")).toBe("rpc");
    expect(params.has("providers")).toBe(false);
    expect(params.get("method")).toBe("getMultipleAccounts");
  });

  it("preserves provider selections between warehouse tabs", () => {
    const params = new URLSearchParams("tab=overview&providers=Allium");

    applyQueryUpdates(params, { tab: "network" }, availableProviders);

    expect(params.get("providers")).toBe("Allium");
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

describe("transaction sender economics", () => {
  const date = "2026-07-29T00:00:00.000Z";
  const rows: MetricRow[] = [
    {
      date,
      metricName: "Sender Total Transactions",
      providerName: "jito",
      unit: "Count",
      value: 204_212,
    },
    {
      date,
      metricName: "Sender Total Tips",
      providerName: "jito",
      unit: "SOL",
      value: 38.3,
    },
    {
      date,
      metricName: "Sender Total Fees",
      providerName: "jito",
      unit: "SOL",
      value: 5.6,
    },
    {
      date,
      metricName: "Sender Median Tip",
      providerName: "jito",
      unit: "Lamports",
      value: 4_000,
    },
    {
      date,
      metricName: "Sender Median Fee",
      providerName: "jito",
      unit: "Lamports",
      value: 5_000,
    },
  ];

  it("normalizes provider labels and returns complete economics rows", () => {
    expect(
      getSenderEconomicsItems(rows, new Set<ProviderName>(["Jito"])),
    ).toEqual([
      {
        medianFeeLamports: 5_000,
        medianTipLamports: 4_000,
        provider: "Jito",
        totalFeesSol: 5.6,
        totalTipsSol: 38.3,
        transactions: 204_212,
      },
    ]);
  });

  it("honors the provider selection", () => {
    expect(getSenderEconomicsItems(rows, new Set<ProviderName>())).toEqual([]);
  });

  it("keeps active providers when economics metrics are incomplete", () => {
    const incompleteRows: MetricRow[] = [
      {
        date,
        metricName: "Sender Total Transactions",
        providerName: "temporal",
        unit: "Count",
        value: 150,
      },
      {
        date,
        metricName: "Sender Total Tips",
        providerName: "temporal",
        unit: "SOL",
        value: 2.5,
      },
    ];

    expect(
      getSenderEconomicsItems(
        incompleteRows,
        new Set<ProviderName>(["Temporal"]),
      ),
    ).toEqual([
      {
        medianFeeLamports: null,
        medianTipLamports: null,
        provider: "Temporal",
        totalFeesSol: null,
        totalTipsSol: 2.5,
        transactions: 150,
      },
    ]);
  });

  it("uses transaction observations when the total metric is delayed", () => {
    const observationRows: MetricRow[] = [
      {
        date: "2026-07-29T00:00:00.000Z",
        metricName: "Sender Transactions",
        providerName: "0slot",
        unit: "Count",
        value: 60,
      },
      {
        date: "2026-07-29T00:05:00.000Z",
        metricName: "Sender Transactions",
        providerName: "0slot",
        unit: "Count",
        value: 40,
      },
    ];

    expect(
      getSenderEconomicsItems(
        observationRows,
        new Set<ProviderName>(["0Slot"]),
      ),
    ).toEqual([
      {
        medianFeeLamports: null,
        medianTipLamports: null,
        provider: "0Slot",
        totalFeesSol: null,
        totalTipsSol: null,
        transactions: 100,
      },
    ]);
  });
});

describe("transaction sender provider experience", () => {
  const economicsItems: SenderEconomicsItem[] = Array.from(
    { length: 6 },
    (_, index) => ({
      medianFeeLamports: 1_000 + index,
      medianTipLamports: 2_000 + index,
      provider: `Provider ${index + 1}`,
      totalFeesSol: 10 + index,
      totalTipsSol: 20 + index,
      transactions: 600 - index * 100,
    }),
  );
  const firstDate = "2026-07-29T00:00:00.000Z";
  const secondDate = "2026-07-29T00:05:00.000Z";
  const transactionRows: MetricRow[] = economicsItems.flatMap((item, index) => [
    {
      date: firstDate,
      metricName: "Sender Transactions",
      providerName: item.provider,
      unit: "Count",
      value: 60 - index * 10,
    },
    ...(index < 5
      ? [
          {
            date: secondDate,
            metricName: "Sender Transactions",
            providerName: item.provider,
            unit: "Count",
            value: 50 - index * 5,
          },
        ]
      : []),
  ]);

  it("shows the five volume leaders and an aggregate other series by default", () => {
    const series = getSenderComparisonSeries({
      economicsItems,
      otherLabel: "Other observed providers",
      overview: true,
      rows: transactionRows,
      selectedProviders: new Set(),
    });

    expect(series.map((item) => item.label)).toEqual([
      "Provider 1",
      "Provider 2",
      "Provider 3",
      "Provider 4",
      "Provider 5",
      "Other observed providers",
    ]);
    expect(series.at(-1)?.points).toMatchObject([
      { defined: true, value: 10 },
      { defined: false, value: 0 },
    ]);
  });

  it("preserves missing comparison observations as gaps", () => {
    const series = getSenderComparisonSeries({
      economicsItems,
      otherLabel: "Other observed providers",
      overview: false,
      rows: transactionRows,
      selectedProviders: new Set(["Provider 6"]),
    });

    expect(series).toHaveLength(1);
    expect(series[0]?.points).toMatchObject([
      { defined: true, value: 10 },
      { defined: false, value: 0 },
    ]);
  });

  it("starts a focused comparison from the overview and caps it at four", () => {
    expect(
      getNextSenderComparison({
        hasExplicitComparison: false,
        provider: "Provider 3",
        selectedProviders: new Set(),
      }),
    ).toEqual(new Set(["Provider 3"]));

    expect(
      getNextSenderComparison({
        hasExplicitComparison: true,
        provider: "Provider 5",
        selectedProviders: new Set([
          "Provider 1",
          "Provider 2",
          "Provider 3",
          "Provider 4",
        ]),
      }),
    ).toEqual(
      new Set(["Provider 1", "Provider 2", "Provider 3", "Provider 4"]),
    );
  });

  it("sorts every economics metric without discarding long-tail providers", () => {
    const sorted = sortSenderProviderItems(
      economicsItems,
      "medianFeeLamports",
      "descending",
    );

    expect(sorted).toHaveLength(6);
    expect(sorted.map((item) => item.provider)).toEqual([
      "Provider 6",
      "Provider 5",
      "Provider 4",
      "Provider 3",
      "Provider 2",
      "Provider 1",
    ]);
  });

  it("keeps missing economics values at the end in either sort direction", () => {
    const itemsWithMissingValue: SenderEconomicsItem[] = [
      ...economicsItems.slice(0, 2),
      {
        ...economicsItems[2]!,
        medianFeeLamports: null,
      },
    ];

    expect(
      sortSenderProviderItems(
        itemsWithMissingValue,
        "medianFeeLamports",
        "descending",
      ).at(-1)?.provider,
    ).toBe("Provider 3");
    expect(
      sortSenderProviderItems(
        itemsWithMissingValue,
        "medianFeeLamports",
        "ascending",
      ).at(-1)?.provider,
    ).toBe("Provider 3");
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
