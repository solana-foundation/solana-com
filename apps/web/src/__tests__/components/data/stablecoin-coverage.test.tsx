import { fireEvent, render, screen, within } from "@testing-library/react";
import type { AbstractIntlMessages } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { loadMergedMessages } from "@workspace/i18n/messages";

import {
  filterRows,
  getProviderCounts,
  shortenAddress,
  StablecoinCoverageTable,
} from "@/app/[locale]/data/stablecoin-coverage";
import {
  stablecoinCoverageProviders,
  stablecoinCoverageRows,
  type StablecoinCoverageRow,
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
      DeFiLlama: index < 5,
      Dune: false,
      RWA: index % 5 === 0,
      "Top Ledger": false,
    },
    mintAddress: `Mint${String(index).padStart(2, "0")}xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
    token: `TOKEN${index}`,
  }),
);

function renderTable(tableRows = rows) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <StablecoinCoverageTable rows={tableRows} />
    </NextIntlClientProvider>,
  );
}

describe("StablecoinCoverageTable", () => {
  it("shows the first four stablecoins with per-provider counts", () => {
    renderTable();

    const table = screen.getByRole("table", { name: tableName });
    // header row + 4 stablecoins
    expect(within(table).getAllByRole("row")).toHaveLength(5);
    expect(
      within(table).getByRole("columnheader", { name: "DeFiLlama 5 of 25" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show all 25" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands to every stablecoin", () => {
    renderTable();

    fireEvent.click(screen.getByRole("button", { name: "Show all 25" }));

    const table = screen.getByRole("table", { name: tableName });
    expect(within(table).getAllByRole("row")).toHaveLength(26);
    expect(screen.getByRole("button", { name: "Show fewer" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("scrolls back to the table when collapsing, not when expanding", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false }) as unknown as MediaQueryList),
    );
    renderTable();

    fireEvent.click(screen.getByRole("button", { name: "Show all 25" }));
    expect(scrollTo).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Show fewer" }));
    expect(scrollTo).toHaveBeenCalledOnce();
    expect(
      within(screen.getByRole("table", { name: tableName })).getAllByRole(
        "row",
      ),
    ).toHaveLength(5);

    scrollTo.mockRestore();
    vi.unstubAllGlobals();
  });

  it("marks covered and uncovered providers for screen readers", () => {
    renderTable();

    const table = screen.getByRole("table", { name: tableName });
    const firstRow = within(table).getByRole("row", { name: /^TOKEN0 / });
    expect(within(firstRow).getAllByText("Covered")).toHaveLength(3);
    expect(within(firstRow).getAllByText("Not covered")).toHaveLength(2);
  });

  it("filters by token or mint address and shows an empty state", () => {
    renderTable();

    const search = screen.getByRole("searchbox", {
      name: "Search stablecoins",
    });
    fireEvent.change(search, { target: { value: "token1" } });
    // TOKEN1 and TOKEN10-19 match; the first four are shown
    expect(
      within(screen.getByRole("table", { name: tableName })).getAllByRole(
        "row",
      ),
    ).toHaveLength(5);
    expect(
      screen.getByRole("button", { name: "Show all 11" }),
    ).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "mint07" } });
    expect(
      within(screen.getByRole("table", { name: tableName })).getAllByRole(
        "row",
      ),
    ).toHaveLength(2);

    fireEvent.change(search, { target: { value: "nothing-matches" } });
    expect(
      screen.getByText("No stablecoins match this search"),
    ).toBeInTheDocument();
  });
});

describe("stablecoin coverage helpers", () => {
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

  it("counts covered stablecoins per provider", () => {
    expect(getProviderCounts(rows)).toEqual({
      Allium: 25,
      DeFiLlama: 5,
      Dune: 0,
      RWA: 5,
      "Top Ledger": 0,
    });
  });
});

describe("stablecoin coverage snapshot", () => {
  it("has one row per mint with a flag for every provider", () => {
    const mints = stablecoinCoverageRows.map((row) => row.mintAddress);
    expect(new Set(mints).size).toBe(mints.length);
    for (const row of stablecoinCoverageRows) {
      expect(Object.keys(row.coverage).sort()).toEqual(
        [...stablecoinCoverageProviders].sort(),
      );
    }
  });
});
