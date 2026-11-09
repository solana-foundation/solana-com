import { fireEvent, render, screen, within } from "@testing-library/react";
import type { AbstractIntlMessages } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { loadMergedMessages } from "@workspace/i18n/messages";
import type { SendLandingResponse } from "@/app/[locale]/data/send-landing-config";
import { SenderLandingPerformanceView } from "@/app/[locale]/data/sender-landing-performance";

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
  }) => children({ width: 900, height: 320 }),
}));

let messages: AbstractIntlMessages;
beforeAll(async () => {
  messages = await loadMergedMessages({ app: "web", locale: "en" });
});

const start = 1_794_196_800;
const provider = (
  name: string,
  firstOnChain: number,
  indexP50: number | null,
) => ({
  provider: name,
  rounds: 120,
  landed: 118,
  failed: 0,
  dropped: 2,
  scoredRounds: 120,
  firstOnChain,
  indexP50,
  indexP90: indexP50 === null ? null : indexP50 * 2,
  laterSlot: 3,
  slotsToLandP50: 1,
  responseP50Ms: 0.7,
  costLamports: 118 * 110_000,
});

const data: SendLandingResponse = {
  generatedAt: "2026-11-09T12:00:00.000Z",
  region: "fra",
  timeframe: "7d",
  stepSeconds: 3600,
  rounds: { complete: 120, skipped: 4 },
  providers: [
    provider("cascade", 47, 165),
    provider("helius", 4, 170),
    provider("tpu", 41, 135),
  ],
  headToHead: [
    { provider: "cascade", otherProvider: "helius", ahead: 104, rounds: 120 },
    { provider: "helius", otherProvider: "cascade", ahead: 16, rounds: 120 },
    { provider: "cascade", otherProvider: "tpu", ahead: 68, rounds: 120 },
    { provider: "tpu", otherProvider: "cascade", ahead: 52, rounds: 120 },
    { provider: "helius", otherProvider: "tpu", ahead: 27, rounds: 120 },
    { provider: "tpu", otherProvider: "helius", ahead: 93, rounds: 120 },
  ],
  buckets: ["cascade", "helius", "tpu"].flatMap((name, index) => [
    {
      provider: name,
      timestamp: start,
      rounds: 60,
      landed: 59,
      scoredRounds: 60,
      firstOnChain: 20 - index * 5,
    },
    {
      provider: name,
      timestamp: start + 3600,
      rounds: 60,
      landed: 59,
      scoredRounds: 60,
      firstOnChain: 27 - index * 5,
    },
  ]),
};

function renderView(
  props: Partial<Parameters<typeof SenderLandingPerformanceView>[0]> = {},
) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SenderLandingPerformanceView
        data={data}
        isUnavailable={false}
        isLoading={false}
        isRefreshing={false}
        regions={["ewr", "fra"]}
        region="fra"
        timeframe="7d"
        onRegionChange={() => {}}
        {...props}
      />
    </NextIntlClientProvider>,
  );
}

function providerColumn() {
  const table = screen.getByRole("table", {
    name: "Send path landing results for the selected region and time frame",
  });
  return within(table)
    .getAllByRole("rowheader")
    .map((cell) => cell.textContent?.replace(/^\d+/, ""));
}

describe("SenderLandingPerformanceView", () => {
  it("ranks paths by first on chain and shows the method and scope", () => {
    renderView();
    expect(
      screen.getByRole("heading", { name: "Landing performance" }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Each round sends one transaction per path at the same instant, signed by one wallet, and ranks the paths by where their copies land in the block.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Last 7d · 120 complete rounds")).toBeTruthy();
    expect(
      screen.getByText(
        "4 rounds skipped at the spend limit, on low balance, or after a send error",
      ),
    ).toBeTruthy();
    expect(providerColumn()).toEqual(["cascade", "tpu", "helius"]);
    const cascadeRow = screen
      .getAllByRole("row")
      .find(
        (row) =>
          row.textContent?.includes("cascade") &&
          row.textContent.includes("165"),
      )!;
    expect(cascadeRow.textContent).toContain("39.2%");
    expect(cascadeRow.textContent).toContain("110,000 lamports");
    expect(
      screen.getByRole("link", { name: "Read the send benchmark methodology" }),
    ).toHaveProperty(
      "href",
      "https://github.com/Lusitaniae/send-latency-monitor/blob/main/docs/methodology.md",
    );
  });

  it("puts dropped and failed under Landed instead of in columns", () => {
    renderView();
    const table = screen.getByRole("table", {
      name: "Send path landing results for the selected region and time frame",
    });
    const cascadeRow = within(table)
      .getAllByRole("row")
      .find((row) => row.textContent?.includes("cascade"))!;
    expect(cascadeRow.textContent).toContain("98.3%");
    expect(cascadeRow.textContent).toContain("1.7% dropped · 0% failed");
    for (const removed of ["Failed", "Dropped", "Slots to land"])
      expect(within(table).queryByRole("button", { name: removed })).toBeNull();
    // The section has no time frame of its own: the page's control drives it.
    expect(screen.queryByLabelText("Landing results time frame")).toBeNull();
  });

  it("says so when a short page time frame is raised to 24h", () => {
    const note =
      "Landing results cover the last 24h: shorter windows hold too few rounds to rank paths.";
    renderView({ timeframe: "24h", timeframeRaised: true });
    expect(screen.getByText(note)).toBeTruthy();
    expect(screen.getByText("Last 24h · 120 complete rounds")).toBeTruthy();
  });

  it("re-sorts when a metric header is chosen, lower index first", () => {
    renderView();
    fireEvent.click(screen.getByRole("button", { name: "Index P50" }));
    expect(providerColumn()).toEqual(["tpu", "cascade", "helius"]);
    fireEvent.click(screen.getByRole("button", { name: "Index P50" }));
    expect(providerColumn()).toEqual(["helius", "cascade", "tpu"]);
  });

  it("labels each head-to-head cell with the rounds behind it", () => {
    renderView();
    const matrix = screen.getByRole("table", {
      name: "Rounds where the row's path landed ahead of the column's path",
    });
    const cell = within(matrix).getByLabelText(
      "cascade landed ahead of helius in 104 of 120 rounds",
    );
    expect(cell.textContent).toBe("87%104/120");
    expect(
      within(matrix).getByLabelText(
        "helius landed ahead of tpu in 27 of 120 rounds",
      ).textContent,
    ).toBe("23%27/120");
  });

  it("switches the trend chart between first on chain and landed", () => {
    renderView();
    expect(
      screen.getByRole("heading", { name: "First on chain over time" }),
    ).toBeTruthy();
    fireEvent.click(
      within(screen.getByRole("group", { name: "Chart metric" })).getByRole(
        "button",
        { name: "Landed" },
      ),
    );
    expect(
      screen.getByRole("heading", { name: "Landed over time" }),
    ).toBeTruthy();
  });

  it("shows an unavailable state without the table", () => {
    renderView({ data: undefined, isUnavailable: true });
    expect(screen.getByText("Landing data unavailable")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.queryByText("Head to head")).toBeNull();
  });

  it("shows an empty state when no rounds completed", () => {
    renderView({
      data: { ...data, providers: [], headToHead: [], buckets: [] },
    });
    expect(
      screen.getByText("No complete rounds for this region and time frame."),
    ).toBeTruthy();
    expect(screen.queryByText("Head to head")).toBeNull();
  });
});
