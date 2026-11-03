"use client";

import { ArrowOutUpRightSquare as ExternalLink } from "@boxicons/react/ArrowOutUpRightSquare";
import { Check } from "@boxicons/react/Check";
import { Search } from "@boxicons/react/Search";
import { X } from "@boxicons/react/X";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useTranslations } from "@workspace/i18n/client";

import {
  stablecoinCoverageProviders,
  stablecoinCoverageRows,
  type StablecoinCoverageProvider,
  type StablecoinCoverageRow,
} from "./stablecoin-coverage-data";

// The scroll box is sized to show this many stablecoins; the rest scroll.
const visibleTokenCount = 6;

type StablecoinCoverageTableProps = {
  rows?: StablecoinCoverageRow[];
};

export function StablecoinCoverageTable({
  rows = stablecoinCoverageRows,
}: StablecoinCoverageTableProps) {
  const t = useTranslations("dataDashboard");
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => filterRows(rows, query), [rows, query]);
  const providerCounts = useMemo(() => getProviderCounts(rows), [rows]);
  const tableMaxHeight = useFirstItemsHeight(
    tableScrollRef,
    "thead",
    "tbody > tr",
    filteredRows,
  );
  const cardMaxHeight = useFirstItemsHeight(
    cardScrollRef,
    null,
    ":scope > article",
    filteredRows,
  );

  return (
    <section
      aria-labelledby="stablecoin-coverage-title"
      className="mt-10 border border-nd-border-light xl:mt-14"
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
            onChange={(event) => setQuery(event.target.value)}
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

      <div
        aria-labelledby="stablecoin-coverage-title"
        className="hidden overflow-auto md:block"
        ref={tableScrollRef}
        role="region"
        style={{ maxHeight: tableMaxHeight }}
        tabIndex={0}
      >
        {/* border-separate: sticky cells lose their borders under border-collapse */}
        <table className="w-full min-w-[960px] border-separate border-spacing-0">
          <caption className="sr-only">
            {t("stablecoinCoverage.tableCaption")}
          </caption>
          <thead>
            <tr className="font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text">
              <th
                className="sticky left-0 top-0 z-20 border-b border-r border-nd-border-light bg-nd-inverse px-4 py-3 text-left xl:px-6"
                scope="col"
              >
                {t("stablecoinCoverage.token")}
              </th>
              <th
                className="sticky top-0 z-10 border-b border-nd-border-light bg-nd-inverse px-4 py-3 text-left"
                scope="col"
              >
                {t("stablecoinCoverage.mintAddress")}
              </th>
              {stablecoinCoverageProviders.map((provider) => (
                <th
                  className="sticky top-0 z-10 border-b border-nd-border-light bg-nd-inverse px-3 py-3 text-center"
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
          <tbody className="[&>tr:first-child>*]:border-t-0">
            {filteredRows.map((row) => (
              <tr
                className="font-brand-mono text-[12px] leading-[1.42] font-bold text-nd-high-em-text"
                key={row.mintAddress}
              >
                <th
                  className="sticky left-0 z-10 border-r border-t border-nd-border-light bg-nd-inverse px-4 py-3 text-left uppercase xl:px-6"
                  scope="row"
                >
                  {row.token}
                </th>
                <td className="border-t border-nd-border-light px-4 py-3">
                  <MintAddressLink mintAddress={row.mintAddress} />
                </td>
                {stablecoinCoverageProviders.map((provider) => (
                  <td
                    className="border-t border-nd-border-light px-3 py-3 text-center"
                    key={provider}
                  >
                    <CoverageMark value={row.coverage[provider]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        aria-labelledby="stablecoin-coverage-title"
        className="divide-y divide-nd-border-light overflow-y-auto md:hidden"
        ref={cardScrollRef}
        role="region"
        style={{ maxHeight: cardMaxHeight }}
        tabIndex={0}
      >
        {filteredRows.map((row) => (
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
    </section>
  );
}

/**
 * Max height for a scroll box that shows its header plus the first
 * `visibleTokenCount` items, measured from the rendered DOM so it follows
 * font and padding changes. Undefined (no cap) when nothing needs scrolling,
 * or while the box is hidden at this breakpoint and measures 0.
 */
function useFirstItemsHeight(
  containerRef: RefObject<HTMLElement | null>,
  headerSelector: string | null,
  itemSelector: string,
  items: readonly unknown[],
) {
  const [maxHeight, setMaxHeight] = useState<number>();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const measure = () => {
      const header = headerSelector
        ? container.querySelector<HTMLElement>(headerSelector)
        : null;
      const firstItems = Array.from(
        container.querySelectorAll<HTMLElement>(itemSelector),
      ).slice(0, visibleTokenCount);
      const height =
        (header?.offsetHeight ?? 0) +
        firstItems.reduce((total, item) => total + item.offsetHeight, 0);

      setMaxHeight(
        items.length > visibleTokenCount && height > 0 ? height : undefined,
      );
    };

    measure();

    // Re-measure when the box appears at another breakpoint or fonts load.
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, headerSelector, itemSelector, items]);

  return maxHeight;
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
