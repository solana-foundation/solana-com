"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Check } from "@boxicons/react/Check";
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

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const shell = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
const listingUrl =
  "https://github.com/solana-foundation/solana-com/blob/main/apps/web/CONTRIBUTING.md#rpc-providers";
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

  return (
    <section
      id="providers"
      className="border-b border-nd-border-light"
      aria-labelledby="providers-heading"
    >
      <div className={`${shell} py-16 md:py-28 xl:py-40`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h2 id="providers-heading" className="nd-heading-l">
              {copy.directoryTitle}
            </h2>
            <p className="nd-body-l !mt-6 max-w-xl text-nd-mid-em-text">
              {copy.directoryBody}
            </p>
          </div>
          <a
            href={listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-sm text-white underline underline-offset-4 hover:text-nd-highlight-green ${focus}`}
          >
            {copy.listingLink}
            <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only">({copy.newTab})</span>
          </a>
        </div>

        <div className="mt-10 border-y border-nd-border-light py-7 md:mt-14 md:py-9">
          <div className="w-full md:max-w-[420px]">
            <label htmlFor="rpc-search" className="sr-only">
              {copy.searchLabel}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-5 top-3.5 size-5 text-nd-mid-em-text"
                aria-hidden="true"
              />
              <input
                id="rpc-search"
                type="search"
                maxLength={100}
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className={`h-12 w-full rounded-full border border-nd-border-prominent bg-transparent pl-12 pr-24 text-base text-white placeholder:text-nd-mid-em-text focus:border-white focus:outline-none ${focus}`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => updateQuery("")}
                  className={`absolute right-5 top-3 text-sm text-nd-mid-em-text hover:text-white ${focus}`}
                >
                  {copy.clear}
                </button>
              )}
            </div>
          </div>
          <button
            id="rpc-filter-toggle"
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="rpc-feature-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`mt-5 inline-flex w-full items-center justify-between rounded-full border border-nd-border-prominent px-5 py-3 text-sm md:hidden ${focus}`}
          >
            <span className="flex items-center gap-2">
              {copy.filterToggle}
              {features.length > 0 && (
                <span className="rounded-full bg-white px-2 py-0.5 font-brand-mono text-xs text-black">
                  {features.length}
                </span>
              )}
            </span>
            <span aria-hidden="true">{filtersOpen ? "↑" : "↓"}</span>
          </button>
          <div
            id="rpc-feature-filters"
            className={`${filtersOpen ? "block" : "hidden"} mt-7 md:block`}
          >
            <div className="mb-6 hidden items-start justify-between gap-6 md:flex">
              <div>
                <h3 className="text-sm font-medium text-white">
                  {copy.filterTitle}
                </h3>
                <p className="mt-1 text-xs text-nd-mid-em-text">
                  {copy.filterRule}
                </p>
              </div>
              {features.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`shrink-0 text-sm text-white underline underline-offset-4 ${focus}`}
                >
                  {copy.clearFilters}
                </button>
              )}
            </div>
            <p className="mb-6 text-xs leading-relaxed text-nd-mid-em-text md:hidden">
              {copy.filterRule}
            </p>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[auto_auto_auto_auto] xl:justify-between xl:gap-5">
              {groups.map((group) => (
                <fieldset key={group} className="min-w-0">
                  <legend className="float-none mb-3 font-brand-mono text-xs uppercase tracking-wide text-nd-mid-em-text">
                    {copy.featureGroups[group]}
                  </legend>
                  <div className="flex flex-wrap gap-2 md:gap-1.5 xl:flex-nowrap">
                    {RPC_FEATURES.filter(
                      (feature) => feature.group === group,
                    ).map(({ id }) => {
                      const count = filterRpcProviders(
                        RPC_PROVIDERS,
                        query,
                        features.includes(id) ? features : [...features, id],
                      ).length;
                      const unavailable = count === 0 && !features.includes(id);
                      return (
                        <label
                          key={id}
                          className={`group relative ${unavailable ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                        >
                          <input
                            type="checkbox"
                            checked={features.includes(id)}
                            disabled={unavailable}
                            aria-describedby={`rpc-def-${id}`}
                            onChange={() => toggleFeature(id)}
                            className="peer sr-only"
                          />
                          <span className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-nd-border-prominent px-4 py-2 text-sm text-white hover:border-white md:min-h-9 md:px-3 md:text-[13px] peer-checked:!bg-white peer-checked:text-black peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-white">
                            <span>{copy.featureLabels[id]}</span>
                            <span className="font-brand-mono text-xs text-current">
                              {count}
                              <span className="sr-only">
                                {" "}
                                {count === 1 ? copy.resultOne : copy.resultMany}
                              </span>
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
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
              <dl className="!mb-0 !pl-0 mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
                {RPC_FEATURES.map(({ id }) => (
                  <div key={id}>
                    <dt className="text-sm font-medium text-white">
                      {copy.featureLabels[id]}
                    </dt>
                    <dd
                      id={`rpc-def-${id}`}
                      className="!mb-0 mt-1 text-sm text-nd-mid-em-text"
                    >
                      {copy.featureDefinitions[id]}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
            {features.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className={`mt-6 text-sm text-white underline underline-offset-4 md:hidden ${focus}`}
              >
                {copy.clearFilters}
              </button>
            )}
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
              className={`sticky bottom-4 z-10 mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-[0_0_0_6px_#000] md:hidden ${focus}`}
            >
              {copy.showResults} · {results.length}
            </button>
          </div>
        </div>

        {features.length > 0 && (
          <div
            id="rpc-active-filters"
            className={`mt-5 flex-wrap items-center gap-2 ${filtersOpen ? "hidden" : "flex"}`}
          >
            {features.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => removeFeatureChip(id)}
                aria-label={`${copy.remove} ${copy.featureLabels[id]}`}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white py-1.5 pl-3 pr-2 text-sm text-white hover:!bg-white/10 ${focus}`}
              >
                {copy.featureLabels[id]}
                <X className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        <div
          id="rpc-results"
          tabIndex={-1}
          className="mt-8 flex scroll-mt-24 flex-wrap items-center justify-between gap-4 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-white"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="font-brand-mono text-xs text-nd-mid-em-text">
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
          </div>
          <span
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {resultAnnouncement} {announcement}
          </span>
          <div
            role="group"
            aria-label={copy.viewLabel}
            className="flex rounded-full border border-nd-border-prominent p-1"
          >
            {(
              [
                ["cards", copy.viewCards, Grid],
                ["table", copy.viewTable, Table],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => changeView(id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${view === id ? "!bg-white text-black" : "text-nd-mid-em-text hover:text-white"} ${focus}`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-10 border border-nd-border-light p-8">
            <p className="nd-heading-xs">
              {features.length ? copy.emptyFiltered : copy.noResults}
            </p>
            {features.length > 0 && (
              <>
                <p className="nd-body-s !mt-3 max-w-xl text-nd-mid-em-text">
                  {copy.emptyEvidence}
                </p>
                <ul className="!mb-0 !pl-0 mt-6 flex flex-wrap gap-2">
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
                          onClick={() => toggleFeature(id)}
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
          <div className="relative mt-10 overflow-x-auto border border-nd-border-light">
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
                              <Check className="size-5" aria-hidden="true" />
                            </a>
                          ) : (
                            <span className="flex min-h-14 items-center justify-center text-nd-mid-em-text/50">
                              <Minus className="size-4" aria-hidden="true" />
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
          <ul className="!mb-0 !pl-0 mt-10 grid border-l border-t border-nd-border-light md:grid-cols-2 xl:grid-cols-3">
            {results.map((provider) => {
              const total = documentedCount(provider);
              return (
                <li
                  key={provider.id}
                  className="flex flex-col border-b border-r border-nd-border-light p-5 hover:bg-white/[0.03] md:p-6 xl:p-7"
                >
                  <article
                    aria-labelledby={`rpc-provider-${provider.id}`}
                    className="flex flex-1 flex-col"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3
                          id={`rpc-provider-${provider.id}`}
                          className="nd-heading-xs"
                        >
                          {provider.name}
                        </h3>
                        <p className="mt-1 truncate font-brand-mono text-xs text-nd-mid-em-text">
                          {rpcProviderHost(provider.url)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <a
                          href={provider.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${copy.visit} ${provider.name} (${copy.newTab})`}
                          className={`inline-flex size-8 items-center justify-center rounded-full border border-nd-border-prominent text-white hover:border-white md:hidden ${focus}`}
                        >
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                        {pinButton(provider, true)}
                      </div>
                    </div>
                    <p className="mt-4 font-brand-mono text-xs text-nd-mid-em-text md:mt-6">
                      <span className="text-white">{total}</span>{" "}
                      {copy.featuresDocumented}
                    </p>
                    {total > 0 && (
                      <p className="mt-2 text-sm leading-snug text-white md:hidden">
                        {RPC_FEATURES.filter(({ id }) => provider.features[id])
                          .map(({ id }) => copy.featureLabels[id])
                          .join(" · ")}
                      </p>
                    )}
                    <ul className="!mb-0 !pl-0 mt-3 hidden flex-1 grid-cols-2 content-start gap-x-4 gap-y-2 md:grid">
                      {RPC_FEATURES.map(({ id }) => {
                        const documented = Boolean(provider.features[id]);
                        const active = features.includes(id);
                        return (
                          <li
                            key={id}
                            className={`flex min-w-0 items-start gap-2 text-[13px] ${documented ? (active ? "text-nd-highlight-green" : "text-white") : "text-nd-mid-em-text/60"}`}
                          >
                            {documented ? (
                              <Check
                                className="mt-px size-4 shrink-0 text-nd-highlight-green"
                                aria-hidden="true"
                              />
                            ) : (
                              <Minus
                                className="mt-px size-4 shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            <span className="min-w-0 leading-snug">
                              {copy.featureLabels[id]}
                            </span>
                            {!documented && (
                              <span className="sr-only">
                                : {copy.notYetSourced}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 hidden items-center justify-between gap-2 border-t border-nd-border-light pt-4 text-sm font-medium md:inline-flex text-white hover:text-nd-highlight-green ${focus}`}
                      aria-label={`${copy.visit} ${provider.name} (${copy.newTab})`}
                    >
                      {copy.visit}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
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
              className={`!mb-0 !pl-0 ${showUnsourced ? "grid" : "hidden"} mt-6 border-l border-t border-nd-border-light md:grid-cols-2 xl:grid-cols-3`}
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
                          (feature) => !provider.features[feature]?.sourceUrl,
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

        {selected.length > 0 && (
          <div
            id="rpc-compare"
            className="mt-16 scroll-mt-20 border-t border-nd-border-light pt-10"
            aria-labelledby="rpc-compare-title"
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h3 id="rpc-compare-title" className="nd-heading-m">
                  {copy.compareSelected}
                </h3>
                <p className="nd-body-s !mt-3 max-w-2xl text-nd-mid-em-text">
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
        <p className="nd-body-s !mt-6 max-w-3xl text-nd-mid-em-text">
          {copy.sourceCaveat}
        </p>
      </div>
    </section>
  );
}
