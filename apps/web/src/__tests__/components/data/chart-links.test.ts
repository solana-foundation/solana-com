import { describe, expect, it } from "vitest";

import {
  chartDefinitions,
  type ChartDefinition,
} from "@/app/[locale]/data/data-config";
import {
  canLinkToChart,
  getChartLinkUrl,
  getLinkedChart,
} from "@/app/[locale]/data/dashboard-query";

const charts: readonly ChartDefinition[] = chartDefinitions;

function chart(id: string) {
  const match = charts.find((item) => item.id === id);

  if (!match) {
    throw new Error(`Unknown chart ${id}`);
  }

  return match;
}

describe("canLinkToChart", () => {
  it("covers the data tabs but not RPC or Tx Senders", () => {
    const linkableTabs = new Set(
      charts.filter(canLinkToChart).map((item) => item.tab),
    );

    expect([...linkableTabs].sort()).toEqual([
      "defi",
      "lending",
      "network",
      "overview",
      "perps",
      "stablecoins",
    ]);
  });
});

describe("getLinkedChart", () => {
  it("finds the chart named by the hash", () => {
    expect(getLinkedChart("#application-revenue")?.tab).toBe("overview");
    expect(getLinkedChart("#dex-volume")?.tab).toBe("defi");
  });

  it("ignores empty or unknown hashes", () => {
    expect(getLinkedChart("")).toBeUndefined();
    expect(getLinkedChart("#")).toBeUndefined();
    expect(getLinkedChart("#not-a-chart")).toBeUndefined();
  });

  it("doesn't throw on malformed percent-encoding", () => {
    expect(() => getLinkedChart("#%E0%A4%A")).not.toThrow();
    expect(getLinkedChart("#%E0%A4%A")).toBeUndefined();
  });

  it("relies on chart IDs being URL-safe, so hashes need no decoding", () => {
    const unsafe = charts
      .map((item) => item.id)
      .filter((id) => !/^[a-z0-9-]+$/.test(id));

    expect(unsafe).toEqual([]);
  });

  it("ignores RPC and Tx Senders charts", () => {
    expect(getLinkedChart("#rpc-p95-latency")).toBeUndefined();
    expect(getLinkedChart("#sender-transactions-over-time")).toBeUndefined();
  });
});

describe("getChartLinkUrl", () => {
  it("links to the chart's tab and anchor", () => {
    expect(
      getChartLinkUrl(
        chart("application-revenue"),
        "https://solana.com",
        "/data",
        "",
      ),
    ).toBe("https://solana.com/data?tab=overview#application-revenue");
  });

  it("keeps the locale prefix in the path", () => {
    expect(
      getChartLinkUrl(
        chart("dex-volume"),
        "https://solana.com",
        "/ja/data",
        "",
      ),
    ).toBe("https://solana.com/ja/data?tab=defi#dex-volume");
  });

  it("carries over the sender's range and providers", () => {
    expect(
      getChartLinkUrl(
        chart("dex-volume"),
        "https://solana.com",
        "/data",
        "?tab=defi&days=365&providers=Allium%2CDeFiLlama",
      ),
    ).toBe(
      "https://solana.com/data?tab=defi&days=365&providers=Allium%2CDeFiLlama#dex-volume",
    );
  });

  it("leaves out parameters that aren't range or providers", () => {
    expect(
      getChartLinkUrl(
        chart("dex-volume"),
        "https://solana.com",
        "/data",
        "?tab=defi&utm_source=x&utm_campaign=launch&days=180&region=fra",
      ),
    ).toBe("https://solana.com/data?tab=defi&days=180#dex-volume");
  });

  it("round-trips: every linkable chart's link resolves back to it", () => {
    for (const item of charts.filter(canLinkToChart)) {
      const url = new URL(
        getChartLinkUrl(item, "https://solana.com", "/data", "?days=365"),
      );

      expect(getLinkedChart(url.hash)?.id).toBe(item.id);
      // The link opens the chart's own tab, so the chart is there to scroll to.
      expect(url.searchParams.get("tab")).toBe(item.tab);
      expect(url.searchParams.get("days")).toBe("365");
    }
  });
});
