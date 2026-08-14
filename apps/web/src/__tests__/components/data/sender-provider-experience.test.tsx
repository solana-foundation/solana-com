import { fireEvent, render, screen, within } from "@testing-library/react";
import type { AbstractIntlMessages } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { loadMergedMessages } from "@workspace/i18n/messages";

import type { MetricRow, ProviderName } from "@/app/[locale]/data/data-config";
import { SenderProviderExperience } from "@/app/[locale]/data/sender-provider-experience";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverStub);

let messages: AbstractIntlMessages;

beforeAll(async () => {
  messages = await loadMergedMessages({ app: "web", locale: "en" });
});

const providers = Array.from(
  { length: 12 },
  (_, index) => `Provider ${String(index + 1).padStart(2, "0")}`,
) satisfies ProviderName[];
const generatedAt = "2026-07-29T00:10:00.000Z";
const firstSample = "2026-07-29T00:00:00.000Z";
const secondSample = "2026-07-29T00:05:00.000Z";
const rows: MetricRow[] = providers.flatMap((provider, index) => [
  {
    date: generatedAt,
    metricName: "Sender Total Transactions",
    providerName: provider,
    unit: "Count",
    value: 12_000 - index * 500,
  },
  {
    date: generatedAt,
    metricName: "Sender Total Tips",
    providerName: provider,
    unit: "SOL",
    value: 120 - index,
  },
  {
    date: generatedAt,
    metricName: "Sender Total Fees",
    providerName: provider,
    unit: "SOL",
    value: 60 - index,
  },
  {
    date: generatedAt,
    metricName: "Sender Median Tip",
    providerName: provider,
    unit: "Lamports",
    value: 2_000 + index,
  },
  {
    date: generatedAt,
    metricName: "Sender Median Fee",
    providerName: provider,
    unit: "Lamports",
    value: 1_000 + index,
  },
  {
    date: firstSample,
    metricName: "Sender Transactions",
    providerName: provider,
    unit: "Count",
    value: 120 - index,
  },
  {
    date: secondSample,
    metricName: "Sender Transactions",
    providerName: provider,
    unit: "Count",
    value: 100 - index,
  },
]);

type ComparisonChangeHandler = (_providers: Set<ProviderName> | null) => void;

function renderExperience({
  availableProviders = providers,
  comparisonProviders = new Set<ProviderName>(),
  hasExplicitComparison = false,
  onComparisonChange = vi.fn<ComparisonChangeHandler>(),
  rows: experienceRows = rows,
}: {
  availableProviders?: ProviderName[];
  comparisonProviders?: ReadonlySet<ProviderName>;
  hasExplicitComparison?: boolean;
  onComparisonChange?: ComparisonChangeHandler;
  rows?: MetricRow[];
} = {}) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SenderProviderExperience
        availableProviders={availableProviders}
        comparisonProviders={comparisonProviders}
        hasExplicitComparison={hasExplicitComparison}
        isLoading={false}
        isRefreshing={false}
        rows={experienceRows}
        onComparisonChange={onComparisonChange}
      />
    </NextIntlClientProvider>,
  );

  return onComparisonChange;
}

describe("SenderProviderExperience", () => {
  it("defaults to a ten-provider overview with an accessible sortable table", () => {
    renderExperience();

    const table = screen.getByRole("table", {
      name: "Transaction sender provider economics for the selected time frame",
    });
    const transactionHeader = within(table).getByRole("columnheader", {
      name: "Transactions",
    });

    expect(transactionHeader).toHaveAttribute("aria-sort", "descending");
    expect(within(table).getAllByRole("row")).toHaveLength(11);
    expect(screen.getByRole("button", { name: "Show all 12" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands the complete provider list without pagination", () => {
    renderExperience();

    fireEvent.click(screen.getByRole("button", { name: "Show all 12" }));

    const table = screen.getByRole("table", {
      name: "Transaction sender provider economics for the selected time frame",
    });

    expect(within(table).getAllByRole("row")).toHaveLength(13);
    expect(screen.getByRole("button", { name: "Show fewer" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("sorts long-tail economics outliers into view", () => {
    renderExperience();

    const table = screen.getByRole("table", {
      name: "Transaction sender provider economics for the selected time frame",
    });

    fireEvent.click(
      within(table).getByRole("button", { name: "Median fee (lamports)" }),
    );

    expect(
      within(table).getByRole("columnheader", {
        name: "Median fee (lamports)",
      }),
    ).toHaveAttribute("aria-sort", "descending");
    expect(within(table).getAllByRole("rowheader")[0]).toHaveTextContent(
      "Provider 12",
    );
  });

  it("keeps providers visible when an economics metric is not reported", () => {
    renderExperience({
      rows: rows.filter(
        (row) =>
          row.providerName !== "Provider 01" ||
          row.metricName !== "Sender Median Fee",
      ),
    });

    const table = screen.getByRole("table", {
      name: "Transaction sender provider economics for the selected time frame",
    });

    expect(within(table).getAllByRole("rowheader")[0]).toHaveTextContent(
      "Provider 01",
    );
    expect(
      screen.getByText(
        "A dash means that metric was not reported for the selected period. Summary totals include reported values only.",
      ),
    ).toBeInTheDocument();
  });

  it("searches all providers and starts a focused comparison", () => {
    const onComparisonChange = renderExperience();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search transaction sender providers",
      }),
      { target: { value: "Provider 12" } },
    );
    fireEvent.click(
      screen.getAllByRole("button", { name: "Compare Provider 12" })[0]!,
    );

    expect(onComparisonChange).toHaveBeenCalledWith(
      new Set<ProviderName>(["Provider 12"]),
    );
  });

  it("offers a direct route back to the top-provider overview", () => {
    const onComparisonChange = renderExperience({
      comparisonProviders: new Set(["Provider 01"]),
      hasExplicitComparison: true,
    });

    fireEvent.click(screen.getByRole("button", { name: "Back to overview" }));

    expect(onComparisonChange).toHaveBeenCalledWith(null);
  });

  it("disables additional providers once four are selected", () => {
    renderExperience({
      comparisonProviders: new Set([
        "Provider 01",
        "Provider 02",
        "Provider 03",
        "Provider 04",
      ]),
      hasExplicitComparison: true,
    });

    for (const button of screen.getAllByRole("button", {
      name: "Compare Provider 05",
    })) {
      expect(button).toBeDisabled();
    }
  });
});
