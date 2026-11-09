import { fireEvent, render, screen, within } from "@testing-library/react";
import type { AbstractIntlMessages } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { loadMergedMessages } from "@workspace/i18n/messages";
import type { MetricRow } from "@/app/[locale]/data/data-config";
import type {
  GrpcStream,
  GrpcCommitment,
} from "@/app/[locale]/data/grpc-config";
import { GrpcProviderExperience } from "@/app/[locale]/data/grpc-provider-experience";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);
vi.mock("@visx/responsive", () => ({
  ParentSize: ({
    children,
  }: {
    children: (_size: { width: number; height: number }) => React.ReactNode;
  }) => children({ width: 900, height: 360 }),
}));

let messages: AbstractIntlMessages;
beforeAll(async () => {
  messages = await loadMergedMessages({ app: "web", locale: "en" });
});

const rows: MetricRow[] = ["Helius", "Alchemy"].flatMap(
  (providerName, index) => [
    ...["P50", "P95", "P99", "P99.9", "Avg"].flatMap((label, metricIndex) => [
      {
        providerName,
        metricName: `gRPC ${label} Lag Entire Period`,
        value: index + metricIndex,
        date: "2026-10-26T20:10:00.000Z",
        unit: "Milliseconds",
      },
      {
        providerName,
        metricName: `gRPC ${label} Lag`,
        value: index + metricIndex,
        date: "2026-10-26T20:00:00.000Z",
        unit: "Milliseconds",
      },
    ]),
    {
      providerName,
      metricName: "gRPC Miss Rate",
      value: index * 0.25,
      date: "2026-10-26T20:10:00.000Z",
      unit: "Percent",
    },
    {
      providerName,
      metricName: "gRPC Miss Rate Trend",
      value: index * 0.5,
      date: "2026-10-26T20:00:00.000Z",
      unit: "Percent",
    },
    {
      providerName,
      metricName: "gRPC Downtime",
      value: index * 90,
      date: "2026-10-26T20:10:00.000Z",
      unit: "Seconds",
    },
    {
      providerName,
      metricName: "gRPC Reconnects",
      value: index * 2,
      date: "2026-10-26T20:10:00.000Z",
      unit: "Count",
    },
    {
      providerName,
      metricName: "gRPC Downtime Trend",
      value: index * 30,
      date: "2026-10-26T20:00:00.000Z",
      unit: "Seconds",
    },
    {
      providerName,
      metricName: "gRPC Reconnects Trend",
      value: index,
      date: "2026-10-26T20:00:00.000Z",
      unit: "Count",
    },
    {
      providerName,
      metricName: "gRPC Reconnect Event",
      value: index,
      date: "2026-10-26T20:00:30.000Z",
      unit: "Count",
    },
  ],
);

function renderExperience(
  selectedProviders = new Set(["Helius", "Alchemy"]),
  scope: { stream: GrpcStream; commitment: GrpcCommitment } = {
    stream: "transaction",
    commitment: "processed",
  },
) {
  const onRegionChange = vi.fn();
  const onCloudProviderChange = vi.fn();
  const onProvidersChange = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <GrpcProviderExperience
        rows={rows}
        filters={{
          regions: ["EWR", "FRA"],
          cloudProviders: ["Teraswitch", "AWS"],
          cloudProvidersByRegion: {
            EWR: ["Teraswitch"],
            FRA: ["AWS", "Teraswitch"],
          },
          providers: ["Helius", "Alchemy"],
          streams: ["transaction", "slot"],
          commitments: ["processed", "finalized"],
        }}
        region="EWR"
        cloudProvider="all"
        stream={scope.stream}
        commitment={scope.commitment}
        timeframe="6h"
        generatedAt="2026-10-26T20:10:00.000Z"
        selectedProviders={selectedProviders}
        isLoading={false}
        isRefreshing={false}
        onRegionChange={onRegionChange}
        onCloudProviderChange={onCloudProviderChange}
        onStreamChange={vi.fn()}
        onCommitmentChange={vi.fn()}
        onProvidersChange={onProvidersChange}
      />
    </NextIntlClientProvider>,
  );
  return { onRegionChange, onCloudProviderChange, onProvidersChange };
}

describe("gRPC provider experience", () => {
  it("shows filters and a sortable latency table without region cards or a search field", () => {
    renderExperience();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "gRPC subscriber cloud provider" }),
    ).toHaveTextContent("All providers");
    expect(
      screen.queryByRole("button", { name: /^View .* providers$/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "gRPC subscriber region" }),
    ).toHaveTextContent("EWR");
    const table = screen.getByRole("table", {
      name: "gRPC provider latency for the selected region and time frame",
    });
    expect(within(table).getAllByRole("row")).toHaveLength(3);
    for (const header of within(table).getAllByRole("columnheader"))
      expect(header).not.toHaveAttribute("aria-sort");
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Helius");
    expect(
      screen.getByText(
        "By default, we sort providers by miss rate, then by average lag. Select a column header to sort by that column alone.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "How we measure" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "By default, we sort by miss rate first, then average lag, so a fast stream that drops updates ranks below one that delivers everything.",
      ),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole("columnheader", { name: "Downtime" }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole("columnheader", { name: "Reconnects" }),
    ).toBeInTheDocument();
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("0s");
    expect(within(table).getAllByRole("row")[2]).toHaveTextContent("1.5m");
    fireEvent.click(within(table).getByRole("button", { name: "P50" }));
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Helius");
    fireEvent.click(within(table).getByRole("button", { name: "P50" }));
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Alchemy");
  });

  it("explains what each column measures in a tooltip", async () => {
    renderExperience();
    const table = screen.getByRole("table");
    fireEvent.focus(within(table).getByRole("button", { name: "P95" }));
    expect(
      (
        await screen.findAllByText(
          "95% of delivered updates arrived within this many milliseconds of the first provider. Shows how far the slower deliveries trail. Lower is better.",
        )
      ).length,
    ).toBeGreaterThan(0);
  });

  it("shows all slot statuses without a commitment selector when viewing slots", () => {
    renderExperience(undefined, { stream: "slot", commitment: "finalized" });
    expect(
      screen.getByRole("combobox", { name: "gRPC stream" }),
    ).toHaveTextContent("Slot");
    expect(
      screen.queryByRole("combobox", { name: "gRPC commitment" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("All slot statuses")).toBeInTheDocument();
  });

  it("lets table buttons select providers", () => {
    const { onProvidersChange } = renderExperience();
    const table = screen.getByRole("table", {
      name: "gRPC provider latency for the selected region and time frame",
    });
    fireEvent.click(
      within(table).getByRole("button", {
        name: "Remove Helius from comparison",
      }),
    );
    expect(onProvidersChange).toHaveBeenCalledWith(new Set(["Alchemy"]));
  });

  it("switches to P99.9 and keeps an empty comparison empty", () => {
    renderExperience(new Set());
    expect(
      screen.getByText(
        "Select at least one provider in the table to see its latency trend.",
      ),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "P99.9" }));
    expect(
      screen.getByRole("heading", { name: "P99.9 lag vs. ideal provider" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "P99.9" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows miss rates and switches the comparison to miss rate over time", () => {
    renderExperience();
    const table = screen.getByRole("table");
    const providerRows = within(table).getAllByRole("row").slice(1);
    expect(within(providerRows[0]).getAllByRole("cell")[5]).toHaveTextContent(
      /^0%$/,
    );
    expect(within(providerRows[1]).getAllByRole("cell")[5]).toHaveTextContent(
      /^0\.25%$/,
    );
    fireEvent.click(within(table).getByRole("button", { name: "Miss rate" }));
    expect(
      within(table).getByRole("columnheader", { name: "Miss rate" }),
    ).toHaveAttribute("aria-sort", "ascending");
    const controls = screen.getByRole("group", { name: "Chart metric" });
    fireEvent.click(
      within(controls).getByRole("button", { name: "Miss rate" }),
    );
    expect(
      screen.getByRole("heading", { name: "Miss rate over time" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Miss rate over time" }),
    ).toBeInTheDocument();
    expect(
      within(controls).getByRole("button", { name: "Miss rate" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("shows provider status bands and reconnect markers under Uptime", () => {
    renderExperience();
    const controls = screen.getByRole("group", { name: "Chart metric" });
    expect(within(controls).getAllByRole("button")).toHaveLength(6);
    fireEvent.click(within(controls).getByRole("button", { name: "Uptime" }));
    expect(
      screen.getByRole("heading", { name: "Uptime timeline" }),
    ).toBeInTheDocument();
    const timeline = screen.getByRole("group", { name: "Uptime timeline" });
    expect(
      within(timeline).getByText("No recorded downtime"),
    ).toBeInTheDocument();
    expect(within(timeline).getByText("Outage recorded")).toBeInTheDocument();
    expect(
      within(timeline).queryByText("No observations"),
    ).not.toBeInTheDocument();
    expect(
      within(timeline).getByRole("button", {
        name: /Alchemy · Outage recorded/,
      }),
    ).toBeInTheDocument();
    const marker = screen.getByRole("button", {
      name: "Alchemy · 1 reconnect",
    });
    fireEvent.focus(marker);
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Alchemy · 1 reconnect",
    );
    expect(
      screen.queryByText(
        "Hover over or select a bucket or reconnect marker to see its time and details.",
      ),
    ).not.toBeInTheDocument();
    expect(
      within(controls).getByRole("button", { name: "Uptime" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
