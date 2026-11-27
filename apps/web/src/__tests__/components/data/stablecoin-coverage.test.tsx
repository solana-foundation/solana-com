import { fireEvent, render, screen, within } from "@testing-library/react";
import type { AbstractIntlMessages } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { loadMergedMessages } from "@workspace/i18n/messages";

import {
  filterRows,
  formatRowNumber,
  getVisibleCoverageProviders,
  getRowNumbers,
  shortenAddress,
  StablecoinCoverageTable,
} from "@/app/[locale]/data/stablecoin-coverage";
import type {
  StablecoinCoverageProvider,
  StablecoinCoverageRow,
} from "@/app/[locale]/data/stablecoin-coverage-data";

let messages: AbstractIntlMessages;

beforeAll(async () => {
  messages = await loadMergedMessages({ app: "web", locale: "en" });
});

const tableName =
  "Stablecoins on Solana and the data providers that cover each one";

const rows: StablecoinCoverageRow[] = Array.from(
  { length: 25 },
  (_, index) => ({
    coverage: {
      Allium: true,
      Blockworks: false,
      DeFiLlama: index < 5,
      Dune: index % 5 === 0,
      "Top Ledger": false,
    },
    mintAddress: `Mint${String(index).padStart(2, "0")}xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
    token: `TOKEN${index}`,
  }),
);

function renderTable(
  tableRows = rows,
  props: {
    error?: Error;
    isLoading?: boolean;
    providers?: StablecoinCoverageProvider[];
  } = {},
) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <StablecoinCoverageTable rows={tableRows} {...props} />
    </NextIntlClientProvider>,
  );
}

// The scroll box wrapping the desktop table (the outer <section> is also a
// region with the same name, so look it up from the table instead).
function getScrollBox(table: HTMLElement) {
  const scrollBox = table.closest<HTMLElement>('[role="region"]');
  if (!scrollBox) {
    throw new Error("table is not inside a scroll region");
  }
  return scrollBox;
}

describe("StablecoinCoverageTable", () => {
  it("renders every stablecoin inside a keyboard-scrollable region", () => {
    renderTable();

    const table = screen.getByRole("table", { name: tableName });
    // header row + all 25 stablecoins; the scroll box limits what's visible
    expect(within(table).getAllByRole("row")).toHaveLength(26);
    expect(
      within(table).getByRole("columnheader", { name: "DeFiLlama" }),
    ).toBeInTheDocument();

    const scrollBox = getScrollBox(table);
    expect(scrollBox).toHaveAccessibleName("Stablecoin coverage by provider");
    expect(scrollBox).toHaveAttribute("tabindex", "0");
  });

  it("caps the scroll box at the header plus six rows", () => {
    // jsdom has no layout, so give every row and the header a fixed height
    const offsetHeight = vi
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.matches("thead, tbody > tr") ? 40 : 0;
      });
    renderTable();

    const scrollBox = getScrollBox(
      screen.getByRole("table", { name: tableName }),
    );
    expect(scrollBox).toHaveStyle({ maxHeight: `${40 * 7}px` });

    offsetHeight.mockRestore();
  });

  it("drops the cap when six or fewer stablecoins match", () => {
    const offsetHeight = vi
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.matches("thead, tbody > tr") ? 40 : 0;
      });
    renderTable();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search stablecoins" }),
      { target: { value: "mint07" } },
    );
    const scrollBox = getScrollBox(
      screen.getByRole("table", { name: tableName }),
    );
    expect(scrollBox.style.maxHeight).toBe("");

    offsetHeight.mockRestore();
  });

  it("marks covered and uncovered providers for screen readers", () => {
    renderTable();

    const table = screen.getByRole("table", { name: tableName });
    const firstRow = within(table).getByRole("row", { name: /TOKEN0 / });
    expect(within(firstRow).getAllByText("Covered")).toHaveLength(3);
    expect(within(firstRow).getAllByText("Not covered")).toHaveLength(2);
  });

  it("shows the shortened mint when a stablecoin has no token name", () => {
    const unnamed: StablecoinCoverageRow = {
      ...rows[0],
      mintAddress: "52GzcLDMfBveMRnWXKX7U3Pa5Lf7QLkWWvsJRDjWDBSk",
      token: null,
    };
    renderTable([unnamed]);

    const table = screen.getByRole("table", { name: tableName });
    const header = within(table).getByRole("rowheader");
    expect(header).toHaveTextContent("52Gz…DBSk");
  });

  it("shows a loading state before the first rows arrive", () => {
    renderTable([], { isLoading: true });

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading stablecoin coverage",
    );
  });

  it("shows the fetch error when coverage can't be loaded", () => {
    renderTable([], { error: new Error("Coverage is unavailable") });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Coverage is unavailable",
    );
  });

  it("filters by token or mint address and shows an empty state", () => {
    renderTable();

    const search = screen.getByRole("searchbox", {
      name: "Search stablecoins",
    });
    fireEvent.change(search, { target: { value: "token1" } });
    // header row + TOKEN1 and TOKEN10-19
    expect(
      within(screen.getByRole("table", { name: tableName })).getAllByRole(
        "row",
      ),
    ).toHaveLength(12);

    fireEvent.change(search, { target: { value: "mint07" } });
    const table = screen.getByRole("table", { name: tableName });
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    // TOKEN7 keeps its position in the full list, not "01"
    expect(
      within(within(table).getByRole("row", { name: /TOKEN7/ })).getByText(
        "08",
      ),
    ).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "nothing-matches" } });
    expect(
      screen.getByText("No stablecoins match this search"),
    ).toBeInTheDocument();
  });
});

describe("StablecoinCoverageTable provider columns", () => {
  it("shows only the given providers' columns and marks", () => {
    renderTable(rows, { providers: ["DeFiLlama", "Top Ledger"] });

    const table = screen.getByRole("table", { name: tableName });
    expect(
      within(table).queryByRole("columnheader", { name: "Allium" }),
    ).not.toBeInTheDocument();
    expect(
      within(table).getByRole("columnheader", { name: "Top Ledger" }),
    ).toBeInTheDocument();
    // TOKEN0: DeFiLlama covered, Top Ledger not
    const firstRow = within(table).getByRole("row", { name: /TOKEN0 / });
    expect(within(firstRow).getAllByText("Covered")).toHaveLength(1);
    expect(within(firstRow).getAllByText("Not covered")).toHaveLength(1);
  });
});

describe("stablecoin coverage helpers", () => {
  it("hides providers that are listed in the selector but deselected", () => {
    const available = [
      "Allium",
      "Artemis",
      "Blockworks",
      "DeFiLlama",
      "Dune",
      "Top Ledger",
    ];
    expect(
      getVisibleCoverageProviders(new Set(["DeFiLlama", "Dune"]), available),
    ).toEqual(["DeFiLlama", "Dune"]);
    expect(getVisibleCoverageProviders(new Set(available), available)).toEqual([
      "Allium",
      "Blockworks",
      "DeFiLlama",
      "Dune",
      "Top Ledger",
    ]);
  });

  it("keeps providers the selector doesn't list, e.g. before it loads", () => {
    expect(getVisibleCoverageProviders(new Set(), [])).toEqual([
      "Allium",
      "Blockworks",
      "DeFiLlama",
      "Dune",
      "Top Ledger",
    ]);
    expect(
      getVisibleCoverageProviders(new Set(["Dune"]), ["Allium", "Dune"]),
    ).toEqual(["Blockworks", "DeFiLlama", "Dune", "Top Ledger"]);
  });

  it("shortens mint addresses", () => {
    expect(shortenAddress("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")).toBe(
      "EPjF…Dt1v",
    );
    expect(shortenAddress("SHORT")).toBe("SHORT");
  });

  it("filters case-insensitively and ignores surrounding spaces", () => {
    expect(filterRows(rows, "  TOKEN24 ")).toHaveLength(1);
    expect(filterRows(rows, "")).toHaveLength(25);
  });

  it("matches unnamed stablecoins by mint address only", () => {
    const unnamed = [{ ...rows[0], token: null }];
    expect(filterRows(unnamed, "token")).toHaveLength(0);
    expect(filterRows(unnamed, "mint00")).toHaveLength(1);
  });

  it("numbers rows by their position in the full list", () => {
    const numbers = getRowNumbers(rows);
    expect(numbers.get(rows[0].mintAddress)).toBe(1);
    expect(numbers.get(rows[24].mintAddress)).toBe(25);
    expect(formatRowNumber(1)).toBe("01");
    expect(formatRowNumber(101)).toBe("101");
    expect(formatRowNumber(undefined)).toBe("");
  });
});
