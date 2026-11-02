"use client";

import { ArrowOutUpRightSquare as ExternalLink } from "@boxicons/react/ArrowOutUpRightSquare";
import { Check } from "@boxicons/react/Check";
import { ChevronDown } from "@boxicons/react/ChevronDown";
import { ChevronUp } from "@boxicons/react/ChevronUp";
import { Search } from "@boxicons/react/Search";
import { X } from "@boxicons/react/X";
import { useMemo, useRef, useState, type RefObject } from "react";
import { useTranslations } from "@workspace/i18n/client";

import {
  stablecoinCoverageProviders,
  stablecoinCoverageRows,
  type StablecoinCoverageProvider,
  type StablecoinCoverageRow,
} from "./stablecoin-coverage-data";
import { scrollBelowStickyControls } from "./dashboard-scroll";

const defaultVisibleTokenCount = 4;

type StablecoinCoverageTableProps = {
  rows?: StablecoinCoverageRow[];
  stickyControlsRef?: RefObject<HTMLElement | null>;
};

export function StablecoinCoverageTable({
  rows = stablecoinCoverageRows,
  stickyControlsRef,
}: StablecoinCoverageTableProps) {
  const t = useTranslations("dataDashboard");
  const sectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  function toggleShowAll() {
    if (showAll && sectionRef.current) {
      // Collapsing removes most of the list, so bring the table's title back
      // into view instead of leaving the reader far below it.
      scrollBelowStickyControls(
        sectionRef.current,
        stickyControlsRef?.current ?? null,
      );
    }
    setShowAll(!showAll);
  }

  const filteredRows = useMemo(() => filterRows(rows, query), [rows, query]);
  const visibleRows = showAll
    ? filteredRows
    : filteredRows.slice(0, defaultVisibleTokenCount);
  const providerCounts = useMemo(() => getProviderCounts(rows), [rows]);

  return (
    <section
      aria-labelledby="stablecoin-coverage-title"
      className="mt-10 border border-nd-border-light xl:mt-14"
      ref={sectionRef}
    >
      <div className="flex flex-col gap-5 border-b border-nd-border-light px-4 py-5 md:px-6 xl:px-8">
        <h2
          className="m-0 text-[20px] leading-[1.25] font-medium tracking-normal xl:text-[24px]"
          id="stablecoin-coverage-title"
        >
          {t("stablecoinCoverage.title")}
        </h2>

        <label className="relative block min-w-0 sm:max-w-[360px]">
          <span className="sr-only">{t("stablecoinCoverage.searchLabel")}</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nd-mid-em-text"
          />
          <input
            className="h-10 w-full rounded-none border border-nd-border-prominent bg-transparent pl-9 pr-9 font-brand-mono text-[12px] text-nd-high-em-text outline-none placeholder:text-nd-mid-em-text/60 focus:border-nd-primary [&::-webkit-search-cancel-button]:appearance-none"
            onChange={(event) => {
              setQuery(event.target.value);
              setShowAll(false);
            }}
            placeholder={t("stablecoinCoverage.searchPlaceholder")}
            type="search"
            value={query}
          />
          {query ? (
            <button
              aria-label={t("stablecoinCoverage.clearSearch")}
              className="absolute right-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center text-nd-mid-em-text transition-colors hover:text-nd-high-em-text"
              onClick={() => setQuery("")}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </label>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[960px] border-collapse">
          <caption className="sr-only">
            {t("stablecoinCoverage.tableCaption")}
          </caption>
          <thead>
            <tr className="font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text">
              <th className="px-4 py-3 text-left xl:px-6" scope="col">
                {t("stablecoinCoverage.token")}
              </th>
              <th className="px-4 py-3 text-left" scope="col">
                {t("stablecoinCoverage.mintAddress")}
              </th>
              {stablecoinCoverageProviders.map((provider) => (
                <th
                  className="px-3 py-3 text-center"
                  key={provider}
                  scope="col"
                >
                  <span className="block">{provider}</span>
                  <span className="block text-[10px] text-nd-mid-em-text/60">
                    {t("stablecoinCoverage.providerCount", {
                      count: providerCounts[provider],
                      total: rows.length,
                    })}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr
                className="border-t border-nd-border-light font-brand-mono text-[12px] leading-[1.42] font-bold text-nd-high-em-text"
                key={row.mintAddress}
              >
                <th
                  className="border-r border-nd-border-light px-4 py-3 text-left uppercase xl:px-6"
                  scope="row"
                >
                  {row.token}
                </th>
                <td className="px-4 py-3">
                  <MintAddressLink mintAddress={row.mintAddress} />
                </td>
                {stablecoinCoverageProviders.map((provider) => (
                  <td className="px-3 py-3 text-center" key={provider}>
                    <CoverageMark value={row.coverage[provider]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-nd-border-light md:hidden">
        {visibleRows.map((row) => (
          <article className="px-4 py-4" key={row.mintAddress}>
            <h3 className="m-0 font-brand-mono text-[12px] font-bold uppercase text-nd-high-em-text">
              {row.token}
            </h3>
            <div className="mt-1">
              <MintAddressLink mintAddress={row.mintAddress} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2">
              {stablecoinCoverageProviders.map((provider) => (
                <div className="flex items-center gap-2" key={provider}>
                  <dt className="font-brand-mono text-[10px] font-bold uppercase text-nd-mid-em-text">
                    {provider}
                  </dt>
                  <dd className="m-0">
                    <CoverageMark value={row.coverage[provider]} />
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      {filteredRows.length === 0 ? (
        <div className="border-t border-nd-border-light px-6 py-12 text-center font-brand-mono text-[12px] uppercase text-nd-mid-em-text">
          {t("stablecoinCoverage.noSearchResults")}
        </div>
      ) : null}

      {filteredRows.length > defaultVisibleTokenCount ? (
        <div className="flex flex-col gap-3 border-t border-nd-border-light px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 xl:px-8">
          <span
            aria-live="polite"
            className="font-brand-mono text-[11px] font-bold uppercase text-nd-mid-em-text"
          >
            {t("stablecoinCoverage.showingTokens", {
              count: visibleRows.length,
              total: filteredRows.length,
            })}
          </span>
          <button
            aria-expanded={showAll}
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-nd-border-prominent px-3 font-brand-mono text-[11px] font-bold uppercase text-nd-high-em-text transition-colors hover:bg-white/[0.06]"
            onClick={toggleShowAll}
            type="button"
          >
            {showAll
              ? t("stablecoinCoverage.showFewer")
              : t("stablecoinCoverage.showAll", {
                  count: filteredRows.length,
                })}
            {showAll ? (
              <ChevronUp aria-hidden="true" className="h-4 w-4" />
            ) : (
              <ChevronDown aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function CoverageMark({ value }: { value: boolean }) {
  const t = useTranslations("dataDashboard");

  return value ? (
    <span className="inline-flex items-center justify-center text-nd-primary">
      <Check aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">{t("stablecoinCoverage.covered")}</span>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center text-nd-mid-em-text/50">
      <X aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">{t("stablecoinCoverage.notCovered")}</span>
    </span>
  );
}

function MintAddressLink({ mintAddress }: { mintAddress: string }) {
  return (
    <a
      className="inline-flex items-center gap-1.5 font-brand-mono text-[11px] text-nd-mid-em-text transition-colors hover:text-nd-primary"
      href={`https://explorer.solana.com/address/${mintAddress}`}
      rel="noopener noreferrer"
      target="_blank"
      title={mintAddress}
    >
      {shortenAddress(mintAddress)}
      <ExternalLink aria-hidden="true" className="h-3 w-3" />
    </a>
  );
}

export function shortenAddress(address: string) {
  return address.length > 10
    ? `${address.slice(0, 4)}…${address.slice(-4)}`
    : address;
}

export function filterRows(rows: StablecoinCoverageRow[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return rows;
  }
  return rows.filter(
    (row) =>
      row.token.toLowerCase().includes(normalized) ||
      row.mintAddress.toLowerCase().includes(normalized),
  );
}

export function getProviderCounts(rows: StablecoinCoverageRow[]) {
  return Object.fromEntries(
    stablecoinCoverageProviders.map((provider) => [
      provider,
      rows.filter((row) => row.coverage[provider]).length,
    ]),
  ) as Record<StablecoinCoverageProvider, number>;
}
