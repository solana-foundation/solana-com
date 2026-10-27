"use client";

import { Fragment, useEffect, useState } from "react";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Check } from "@boxicons/react/Check";
import { Filter } from "@boxicons/react/Filter";
import { Grid } from "@boxicons/react/Grid";
import { Minus } from "@boxicons/react/Minus";
import { Plus } from "@boxicons/react/Plus";
import { Search } from "@boxicons/react/Search";
import { Table } from "@boxicons/react/Table";
import { X } from "@boxicons/react/X";
import {
  RPC_FEATURES,
  type RpcFeatureGroup,
  type RpcFeatureId,
} from "./provider-features";
import { RPC_PROVIDERS, type RpcProvider } from "./providers";
import {
  filterRpcProviders,
  parseRpcFeatures,
  parseRpcPins,
  parseRpcQuery,
  parseRpcView,
  rpcFeatureDiffers,
  rpcProviderHost,
  searchRpcProviders,
  type RpcView,
} from "./directory-state";
import type { RpcCopy } from "./rpc";
import { typeScale } from "./typography";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const shell = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
const listingUrl =
  "https://github.com/solana-foundation/solana-com/blob/main/apps/web/CONTRIBUTING.md#rpc-providers";
const popularFeatures: RpcFeatureId[] = [
  "websocket",
  "grpc",
  "history",
  "free",
  "dedicated",
];
const groups: RpcFeatureGroup[] = [
  "streaming",
  "data",
  "access",
  "reliability",
];

function documentedCount(provider: RpcProvider) {
  return RPC_FEATURES.filter((feature) => provider.features[feature.id]).length;
}

export function RpcProviderDirectory({ copy }: { copy: RpcCopy }) {
  const [query, setQuery] = useState("");
  const [features, setFeatures] = useState<RpcFeatureId[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  const [view, setView] = useState<RpcView>("cards");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showUnsourced, setShowUnsourced] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [resultAnnouncement, setResultAnnouncement] = useState("");

  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(parseRpcQuery(params));
      setFeatures(parseRpcFeatures(params));
      setPins(parseRpcPins(params, RPC_PROVIDERS));
      setView(parseRpcView(params));
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const results = filterRpcProviders(RPC_PROVIDERS, query, features);
  const resultSummary = `${results.length} ${query || features.length ? `${copy.resultsOf} ${RPC_PROVIDERS.length} ` : ""}${copy.resultMany}`;
  useEffect(() => {
    const timer = setTimeout(() => setResultAnnouncement(resultSummary), 300);
    return () => clearTimeout(timer);
  }, [resultSummary]);
  const unsourced = features.length
    ? searchRpcProviders(RPC_PROVIDERS, query).filter((provider) =>
        features.some((feature) => !provider.features[feature]?.sourceUrl),
      )
    : [];
  const selected = RPC_PROVIDERS.filter((provider) =>
    pins.includes(provider.id),
  );
  const compareRows = RPC_FEATURES.filter(
    ({ id }) =>
      !diffOnly || selected.length < 2 || rpcFeatureDiffers(selected, id),
  );
  const setUrl = (
    name: "q" | "f" | "pin" | "view",
    value: string,
    replace = false,
  ) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(name, value);
    else url.searchParams.delete(name);
    window.history[replace ? "replaceState" : "pushState"](
      window.history.state,
      "",
      url,
    );
  };
  const updateQuery = (value: string) => {
    const bounded = value.slice(0, 100);
    setQuery(bounded);
    setAnnouncement("");
    setUrl("q", bounded.trim(), true);
  };
  const changeView = (next: RpcView) => {
    setView(next);
    setUrl("view", next === "cards" ? "" : next, true);
  };
  const toggleFeature = (id: RpcFeatureId) => {
    const next = features.includes(id)
      ? features.filter((feature) => feature !== id)
      : RPC_FEATURES.map((feature) => feature.id).filter(
          (feature) => feature === id || features.includes(feature),
        );
    setFeatures(next);
    setShowUnsourced(false);
    setUrl("f", next.join(","));
    setAnnouncement("");
  };
  const clearFilters = () => {
    setFeatures([]);
    setShowUnsourced(false);
    setUrl("f", "");
    setAnnouncement("");
    window.requestAnimationFrame(() => {
      document.getElementById("rpc-search")?.focus();
    });
  };
  const removeFeatureChip = (id: RpcFeatureId) => {
    const index = features.indexOf(id);
    toggleFeature(id);
    window.requestAnimationFrame(() => {
      const remaining = document.querySelectorAll<HTMLButtonElement>(
        "#rpc-active-filters button",
      );
      (
        remaining[Math.min(index, remaining.length - 1)] ??
        document.getElementById("rpc-search")
      )?.focus();
    });
  };
  const togglePin = (provider: RpcProvider) => {
    if (!pins.includes(provider.id) && pins.length === 3) {
      setAnnouncement(copy.compareLimit);
      return;
    }
    const next = pins.includes(provider.id)
      ? pins.filter((id) => id !== provider.id)
      : [...pins, provider.id];
    setPins(next);
    setUrl("pin", next.join(","));
    setAnnouncement(
      `${provider.name} ${pins.includes(provider.id) ? copy.removedFromCompare : copy.addedToCompare}. ${next.length} ${copy.selectedForCompare}.`,
    );
  };
  const removeEmptyStateFilter = (id: RpcFeatureId) => {
    toggleFeature(id);
    window.requestAnimationFrame(() => {
      (
        document.querySelector<HTMLButtonElement>(
          "#rpc-empty-filters button",
        ) ?? document.getElementById("rpc-results")
      )?.focus();
    });
  };
  const clearAll = () => {
    setQuery("");
    setFeatures([]);
    setShowUnsourced(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    url.searchParams.delete("f");
    window.history.pushState(window.history.state, "", url);
    setAnnouncement("");
  };
  const pinButton = (provider: RpcProvider, compact = false) => {
    const pinned = pins.includes(provider.id);
    return (
      <button
        type="button"
        aria-pressed={pinned}
        aria-label={compact ? `${copy.shortlist}: ${provider.name}` : undefined}
        onClick={() => togglePin(provider)}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border text-sm ${compact ? "size-8 justify-center" : "px-3 py-1.5"} ${pinned ? "border-white !bg-white text-black" : "border-nd-border-prominent text-white hover:border-white"} ${focus}`}
      >
        {pinned ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Plus className="size-4" aria-hidden="true" />
        )}
        {!compact && (pinned ? copy.shortlisted : copy.shortlist)}
      </button>
    );
  };

  const featureCount = (id: RpcFeatureId) =>
    filterRpcProviders(
      RPC_PROVIDERS,
      query,
      features.includes(id) ? features : [...features, id],
    ).length;
  const label =
    "font-brand-mono text-xs uppercase tracking-wide text-nd-mid-em-text";

  return (
    <section
      id="providers"
      className="border-b border-nd-border-light"
      aria-labelledby="providers-heading"
    >
      <div className={`${shell} py-16 md:py-28 xl:py-40`}>
        <div className="grid border-y border-nd-border-light lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
          <div className="py-8 lg:py-10 lg:pr-10">
            <p className={label}>{copy.eyebrow}</p>
            <h2 id="providers-heading" className={`${typeScale.headingL} mt-3`}>
              {copy.directoryTitle}
            </h2>
          </div>
          <div className="border-t border-nd-border-light py-8 lg:border-l lg:border-t-0 lg:py-10 lg:pl-10">
            <p className={label}>{copy.policyLabel}</p>
            <p className="mt-3 text-sm text-nd-mid-em-text">
              {copy.directoryBody}
            </p>
            <a
              href={listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex items-center gap-2 text-sm text-white underline underline-offset-4 hover:text-nd-highlight-green ${focus}`}
            >
              {copy.listingLink}
              <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="sr-only">({copy.newTab})</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-nd-border-light py-5 md:flex-row md:items-center md:gap-6">
          <span id="rpc-popular-heading" className={`shrink-0 ${label}`}>
            {copy.popularNeeds}
          </span>
          <div
            role="group"
            aria-labelledby="rpc-popular-heading"
            className="flex flex-wrap gap-2"
          >
            {popularFeatures.map((id) => {
              const checked = features.includes(id);
              const count = featureCount(id);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={checked}
                  disabled={count === 0 && !checked}
                  onClick={() => toggleFeature(id)}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-40 ${checked ? "border-white !bg-white text-black" : "border-nd-border-prominent text-white hover:border-white"} ${focus}`}
                >
                  {checked && <Check className="size-3.5" aria-hidden="true" />}
                  {copy.featureLabels[id]}
                  <span className="font-brand-mono text-xs opacity-70">
                    {count}
                    <span className="sr-only">
                      {" "}
                      {count === 1 ? copy.resultOne : copy.resultMany}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-nd-border-light py-5">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="rpc-search" className="sr-only">
              {copy.searchLabel}
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-3.5 size-5 text-nd-mid-em-text"
              aria-hidden="true"
            />
            <input
              id="rpc-search"
              type="search"
              maxLength={100}
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className={`h-12 w-full border border-nd-border-prominent bg-transparent pl-11 pr-9 text-base text-white placeholder:text-nd-mid-em-text focus:border-white focus:outline-none ${focus}`}
            />
            {query && (
              <button
                type="button"
                onClick={() => updateQuery("")}
                aria-label={copy.clear}
                className={`absolute right-2 top-3 inline-flex size-6 items-center justify-center text-nd-mid-em-text hover:text-white ${focus}`}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <button
            id="rpc-filter-toggle"
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="rpc-feature-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`inline-flex h-12 shrink-0 items-center gap-2 border border-nd-border-prominent px-4 text-sm text-white lg:hidden ${focus}`}
          >
            <Filter className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{copy.filterToggle}</span>
            {features.length > 0 && (
              <span className="rounded-full bg-white px-1.5 font-brand-mono text-xs text-black">
                {features.length}
              </span>
            )}
          </button>
          <div
            role="group"
            aria-label={copy.viewLabel}
            className="flex h-12 shrink-0 border border-nd-border-prominent"
          >
            {(
              [
                ["cards", copy.viewCards, Grid],
                ["table", copy.viewTable, Table],
              ] as const
            ).map(([id, viewName, Icon]) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => changeView(id)}
                className={`inline-flex items-center gap-2 px-3 text-sm first:border-r first:border-nd-border-prominent ${view === id ? "!bg-white/10 text-white" : "text-nd-mid-em-text hover:text-white"} ${focus}`}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{viewName}</span>
              </button>
            ))}
          </div>
        </div>

        {features.length > 0 && (
          <div
            id="rpc-active-filters"
            className="flex flex-wrap items-center gap-2 border-b border-nd-border-light py-4"
          >
            <span className={`mr-1 ${label}`}>{copy.filterToggle}</span>
            {features.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => removeFeatureChip(id)}
                aria-label={`${copy.remove} ${copy.featureLabels[id]}`}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white py-1.5 pl-3 pr-2 text-[13px] text-white hover:!bg-white/10 ${focus}`}
              >
                {copy.featureLabels[id]}
                <X className="size-4" aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className={`ml-auto text-sm text-white underline underline-offset-4 ${focus}`}
            >
              {copy.clearFilters}
            </button>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside
            id="rpc-feature-filters"
            aria-labelledby="rpc-filter-heading"
            className={`${filtersOpen ? "block" : "hidden"} border-b border-nd-border-light py-6 lg:block lg:border-b-0 lg:py-8`}
          >
            <h3 id="rpc-filter-heading" className="text-base font-medium">
              {copy.filterTitle}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-nd-mid-em-text">
              {copy.filterRule}
            </p>
            {groups.map((group) => (
              <fieldset key={group} className="mt-7 min-w-0">
                <legend className={`float-none mb-2 ${label}`}>
                  {copy.featureGroups[group]}
                </legend>
                {RPC_FEATURES.filter((feature) => feature.group === group).map(
                  ({ id }) => {
                    const count = featureCount(id);
                    const unavailable = count === 0 && !features.includes(id);
                    return (
                      <label
                        key={id}
                        className={`flex min-h-10 items-center gap-3 text-sm ${unavailable ? "cursor-not-allowed opacity-40" : "cursor-pointer text-white"}`}
                      >
                        <input
                          type="checkbox"
                          checked={features.includes(id)}
                          disabled={unavailable}
                          aria-describedby={`rpc-def-${id}`}
                          onChange={() => toggleFeature(id)}
                          className={`size-4 shrink-0 accent-white ${focus}`}
                        />
                        <span className="min-w-0 flex-1">
                          {copy.featureLabels[id]}
                        </span>
                        <span className="font-brand-mono text-xs text-nd-mid-em-text">
                          {count}
                          <span className="sr-only">
                            {" "}
                            {count === 1 ? copy.resultOne : copy.resultMany}
                          </span>
                        </span>
                      </label>
                    );
                  },
                )}
              </fieldset>
            ))}
            <details className="group/defs mt-7 border-t border-nd-border-light pt-5">
              <summary
                className={`inline-flex cursor-pointer list-none items-center gap-2 text-sm text-white [&::-webkit-details-marker]:hidden ${focus}`}
              >
                <Plus
                  className="size-4 transition-transform group-open/defs:rotate-45"
                  aria-hidden="true"
                />
                {copy.definitionsToggle}
              </summary>
              <dl className="mt-4 space-y-4">
                {RPC_FEATURES.map(({ id }) => (
                  <div key={id}>
                    <dt className="text-sm font-medium text-white">
                      {copy.featureLabels[id]}
                    </dt>
                    <dd
                      id={`rpc-def-${id}`}
                      className="mt-1 text-xs leading-relaxed text-nd-mid-em-text"
                    >
                      {copy.featureDefinitions[id]}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
            <button
              type="button"
              onClick={() => {
                setFiltersOpen(false);
                window.requestAnimationFrame(() => {
                  const resultsBar = document.getElementById("rpc-results");
                  resultsBar?.focus({ preventScroll: true });
                  resultsBar?.scrollIntoView({
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "auto"
                      : "smooth",
                    block: "start",
                  });
                });
              }}
              className={`sticky bottom-4 z-10 mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-[0_0_0_6px_#000] lg:hidden ${focus}`}
            >
              {copy.showResults} · {results.length}
            </button>
          </aside>

          <div className="min-w-0 py-6 lg:py-8">
            <div
              id="rpc-results"
              tabIndex={-1}
              className="flex scroll-mt-24 flex-wrap items-center justify-between gap-4 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-white"
            >
              <p className={label}>
                <span className="text-white">{results.length}</span>{" "}
                {query || features.length
                  ? `${copy.resultsOf} ${RPC_PROVIDERS.length} `
                  : ""}
                {copy.resultMany}
              </p>
              {pins.length > 0 && (
                <a
                  href="#rpc-compare"
                  className={`inline-flex items-center gap-2 text-sm text-white underline underline-offset-4 ${focus}`}
                >
                  {copy.compareSelected} ({pins.length})
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              )}
              <span
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {resultAnnouncement} {announcement}
              </span>
            </div>

            {results.length === 0 ? (
              <div className="mt-5 border border-nd-border-light p-8">
                <p className={`${typeScale.headingXs}`}>
                  {features.length ? copy.emptyFiltered : copy.noResults}
                </p>
                {features.length > 0 && (
                  <>
                    <p
                      className={`${typeScale.bodyS} mt-3 max-w-xl text-nd-mid-em-text`}
                    >
                      {copy.emptyEvidence}
                    </p>
                    <ul
                      id="rpc-empty-filters"
                      className="mt-6 flex flex-wrap gap-2"
                    >
                      {features.map((id) => {
                        const count = filterRpcProviders(
                          RPC_PROVIDERS,
                          query,
                          features.filter((feature) => feature !== id),
                        ).length;
                        return (
                          <li key={id}>
                            <button
                              type="button"
                              onClick={() => removeEmptyStateFilter(id)}
                              className={`inline-flex items-center gap-2 rounded-full border border-nd-border-prominent px-4 py-2 text-sm hover:border-white ${focus}`}
                            >
                              {copy.removeFilter} {copy.featureLabels[id]}
                              <span className="font-brand-mono text-xs text-nd-mid-em-text">
                                {count} {copy.matchesWithout}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
                <button
                  type="button"
                  onClick={clearAll}
                  className={`mt-6 text-sm text-white underline underline-offset-4 ${focus}`}
                >
                  {copy.clearAll}
                </button>
              </div>
            ) : view === "table" ? (
              <div className="relative mt-5 overflow-x-auto border border-nd-border-light">
                <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                  <caption className="sr-only">{copy.tableCaption}</caption>
                  <thead>
                    <tr>
                      <td
                        rowSpan={2}
                        className="sticky left-0 z-10 border-b border-r border-nd-border-light bg-nd-bg p-4 align-bottom font-brand-mono text-xs text-nd-mid-em-text"
                      >
                        {copy.providerColumn}
                      </td>
                      {groups.map((group) => (
                        <th
                          key={group}
                          scope="colgroup"
                          colSpan={
                            RPC_FEATURES.filter((f) => f.group === group).length
                          }
                          className="border-b border-r border-nd-border-light px-3 py-2 font-brand-mono text-[11px] font-normal uppercase tracking-wide text-nd-mid-em-text last:border-r-0"
                        >
                          {copy.featureGroups[group]}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {RPC_FEATURES.map(({ id }) => (
                        <th
                          key={id}
                          scope="col"
                          className={`border-b border-r border-nd-border-light px-3 py-3 align-bottom text-xs font-medium last:border-r-0 ${features.includes(id) ? "text-nd-highlight-green" : "text-white"}`}
                        >
                          {copy.featureLabels[id]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((provider) => (
                      <tr key={provider.id} className="hover:bg-white/[0.03]">
                        <th
                          scope="row"
                          className="sticky left-0 z-10 min-w-[150px] border-b border-r border-nd-border-light bg-nd-bg p-3 font-medium md:min-w-[200px] md:p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <a
                              href={provider.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 text-white hover:underline ${focus}`}
                            >
                              {provider.name}
                              <ArrowUpRight
                                className="size-3.5 text-nd-mid-em-text"
                                aria-hidden="true"
                              />
                              <span className="sr-only">({copy.newTab})</span>
                            </a>
                            {pinButton(provider, true)}
                          </div>
                        </th>
                        {RPC_FEATURES.map(({ id }) => {
                          const evidence = provider.features[id];
                          return (
                            <td
                              key={id}
                              className="border-b border-r border-nd-border-light p-0 text-center last:border-r-0"
                            >
                              {evidence ? (
                                <a
                                  href={evidence.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={evidence.note}
                                  aria-label={`${copy.documented}: ${copy.sourceFor} ${copy.featureLabels[id]}, ${provider.name} (${copy.newTab})`}
                                  className={`flex min-h-14 items-center justify-center text-nd-highlight-green hover:bg-white/[0.06] ${focus}`}
                                >
                                  <Check
                                    className="size-5"
                                    aria-hidden="true"
                                  />
                                </a>
                              ) : (
                                <span className="flex min-h-14 items-center justify-center text-nd-mid-em-text/50">
                                  <Minus
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                  <span className="sr-only">
                                    {copy.notYetSourced}
                                  </span>
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ul className="mt-5 grid border-l border-t border-nd-border-light sm:grid-cols-2 xl:grid-cols-3">
                {results.map((provider) => {
                  const cited = RPC_FEATURES.filter(
                    ({ id }) => provider.features[id],
                  );
                  return (
                    <li
                      key={provider.id}
                      className="flex border-b border-r border-nd-border-light"
                    >
                      <article
                        aria-labelledby={`rpc-provider-${provider.id}`}
                        className="flex flex-1 flex-col p-5 hover:bg-white/[0.03] md:p-6"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            aria-hidden="true"
                            className="inline-flex size-10 items-center justify-center border border-nd-border-prominent bg-white/[0.04] font-brand-mono text-sm text-white"
                          >
                            {provider.name.slice(0, 1)}
                          </span>
                          <div className="flex items-center gap-1">
                            {pinButton(provider, true)}
                            <a
                              href={provider.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${copy.visit} ${provider.name} (${copy.newTab})`}
                              className={`inline-flex size-8 items-center justify-center text-nd-mid-em-text hover:text-white ${focus}`}
                            >
                              <ArrowUpRight
                                className="size-4"
                                aria-hidden="true"
                              />
                            </a>
                          </div>
                        </div>
                        <h3
                          id={`rpc-provider-${provider.id}`}
                          className={`${typeScale.headingXs} mt-4 md:mt-5`}
                        >
                          {provider.name}
                        </h3>
                        <p className="mt-1 truncate font-brand-mono text-[11px] uppercase tracking-wide text-nd-mid-em-text">
                          {rpcProviderHost(provider.url)}
                        </p>
                        <p className="mt-4 text-sm text-nd-mid-em-text">
                          <span className="text-white">{cited.length}</span>{" "}
                          {copy.featuresDocumented}
                        </p>
                        <p className="mt-auto pt-4 font-brand-mono text-[11px] uppercase leading-relaxed tracking-wide text-nd-mid-em-text">
                          {cited.length
                            ? cited.map(({ id }, index) => (
                                <Fragment key={id}>
                                  {index > 0 && " · "}
                                  <span
                                    className={
                                      features.includes(id)
                                        ? "text-nd-highlight-green"
                                        : undefined
                                    }
                                  >
                                    {copy.featureLabels[id]}
                                  </span>
                                </Fragment>
                              ))
                            : copy.noFeaturesSourced}
                        </p>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}

            {unsourced.length > 0 && (
              <div className="mt-8 border-t border-nd-border-light pt-6">
                <p className="text-sm text-nd-mid-em-text">
                  {unsourced.length}{" "}
                  {unsourced.length === 1
                    ? copy.unsourcedSummaryOne
                    : copy.unsourcedSummaryMany}
                </p>
                <button
                  type="button"
                  aria-expanded={showUnsourced}
                  aria-controls="rpc-unsourced"
                  onClick={() => setShowUnsourced((value) => !value)}
                  className={`mt-3 text-sm text-white underline underline-offset-4 ${focus}`}
                >
                  {showUnsourced ? copy.hideUnsourced : copy.showUnsourced}
                </button>
                <ul
                  id="rpc-unsourced"
                  hidden={!showUnsourced}
                  className={`${showUnsourced ? "grid" : "hidden"} mt-6 border-l border-t border-nd-border-light md:grid-cols-2 xl:grid-cols-3`}
                >
                  {unsourced.map((provider) => (
                    <li
                      key={provider.id}
                      className="flex items-start justify-between gap-4 border-b border-r border-nd-border-light p-5"
                    >
                      <div className="min-w-0">
                        <a
                          href={provider.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 text-base text-white ${focus}`}
                        >
                          {provider.name}
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                          <span className="sr-only">({copy.newTab})</span>
                        </a>
                        <p className="mt-2 text-xs text-nd-mid-em-text">
                          {copy.noSourceFor}:{" "}
                          {features
                            .filter(
                              (feature) =>
                                !provider.features[feature]?.sourceUrl,
                            )
                            .map((feature) => copy.featureLabels[feature])
                            .join(", ")}
                        </p>
                      </div>
                      {pinButton(provider, true)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {selected.length > 0 && (
          <div
            id="rpc-compare"
            className="mt-16 scroll-mt-20 border-t border-nd-border-light pt-10"
            aria-labelledby="rpc-compare-title"
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h3 id="rpc-compare-title" className={`${typeScale.headingM}`}>
                  {copy.compareSelected}
                </h3>
                <p
                  className={`${typeScale.bodyS} mt-3 max-w-2xl text-nd-mid-em-text`}
                >
                  {copy.compareNote}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                {selected.length > 1 && (
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={diffOnly}
                      onChange={(event) => setDiffOnly(event.target.checked)}
                      className={`size-4 accent-white ${focus}`}
                    />
                    {copy.diffOnly}
                  </label>
                )}
                <p className="font-brand-mono text-xs text-nd-mid-em-text">
                  {selected.length} / 3
                </p>
              </div>
            </div>
            {selected.length > 1 && (
              <p className="mt-6 text-sm text-nd-mid-em-text md:hidden">
                {copy.scrollCompare}
              </p>
            )}
            <div className="relative mt-5 overflow-x-auto border border-nd-border-light">
              <table
                className={`w-full border-collapse text-left ${selected.length > 1 ? "min-w-[680px]" : "min-w-0"}`}
              >
                <caption className="sr-only">{copy.compareCaption}</caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 z-10 w-[120px] border-b border-r border-nd-border-light bg-nd-bg p-4 font-brand-mono text-xs font-normal text-nd-mid-em-text md:w-[200px]"
                    >
                      {copy.featureColumn}
                    </th>
                    {selected.map((provider) => (
                      <th
                        key={provider.id}
                        scope="col"
                        className="min-w-[150px] border-b border-r border-nd-border-light p-4 align-top last:border-r-0 md:min-w-[220px]"
                      >
                        <span className="block text-lg font-medium">
                          {provider.name}
                        </span>
                        <span className="mt-1 block font-brand-mono text-xs font-normal text-nd-mid-em-text">
                          {documentedCount(provider)} {copy.featuresDocumented}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePin(provider)}
                          className={`mt-2 text-xs font-normal text-nd-mid-em-text underline underline-offset-4 hover:text-white ${focus}`}
                        >
                          {copy.remove}
                          <span className="sr-only"> {provider.name}</span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                {groups.map((group) => {
                  const rows = compareRows.filter(
                    (feature) => feature.group === group,
                  );
                  if (!rows.length) return null;
                  return (
                    <tbody key={group}>
                      <tr>
                        <th
                          scope="colgroup"
                          colSpan={selected.length + 1}
                          className="border-b border-nd-border-light bg-white/[0.03] px-4 py-2 font-brand-mono text-[11px] font-normal uppercase tracking-wide text-nd-mid-em-text"
                        >
                          {copy.featureGroups[group]}
                        </th>
                      </tr>
                      {rows.map(({ id }) => (
                        <tr key={id}>
                          <th
                            scope="row"
                            className="sticky left-0 z-10 border-b border-r border-nd-border-light bg-nd-bg p-4 text-sm font-medium"
                          >
                            {copy.featureLabels[id]}
                          </th>
                          {selected.map((provider) => {
                            const evidence = provider.features[id];
                            return (
                              <td
                                key={provider.id}
                                className="border-b border-r border-nd-border-light p-4 align-top text-sm last:border-r-0"
                              >
                                {evidence ? (
                                  <>
                                    <a
                                      href={evidence.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`inline-flex items-center gap-1.5 text-white underline underline-offset-4 ${focus}`}
                                    >
                                      <Check
                                        className="size-4 text-nd-highlight-green"
                                        aria-hidden="true"
                                      />
                                      {copy.documented}
                                      <ArrowUpRight
                                        className="size-3"
                                        aria-hidden="true"
                                      />
                                      <span className="sr-only">
                                        {" "}
                                        ({copy.newTab})
                                      </span>
                                    </a>
                                    <p className="mt-2 text-xs text-nd-mid-em-text">
                                      {evidence.note}
                                    </p>
                                    <span className="mt-2 block font-brand-mono text-[11px] text-nd-mid-em-text">
                                      {copy.checkedOn} {evidence.checkedOn}
                                    </span>
                                  </>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-nd-mid-em-text">
                                    <Minus
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                    {copy.notYetSourced}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  );
                })}
              </table>
              {compareRows.length === 0 && (
                <p className="p-5 text-sm text-nd-mid-em-text">
                  {copy.noDifferences}
                </p>
              )}
            </div>
          </div>
        )}
        <p className={`${typeScale.bodyS} mt-6 max-w-3xl text-nd-mid-em-text`}>
          {copy.sourceCaveat}
        </p>
      </div>
    </section>
  );
}
