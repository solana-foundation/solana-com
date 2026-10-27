"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Search } from "@boxicons/react/Search";
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
  searchRpcProviders,
} from "./directory-state";
import type { RpcCopy } from "./rpc";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const shell = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
const groups: RpcFeatureGroup[] = [
  "streaming",
  "data",
  "access",
  "reliability",
];

function documentedFeatures(provider: RpcProvider) {
  return RPC_FEATURES.filter(
    (feature) => provider.features[feature.id]?.sourceUrl,
  );
}

export function RpcProviderDirectory({ copy }: { copy: RpcCopy }) {
  const [query, setQuery] = useState("");
  const [features, setFeatures] = useState<RpcFeatureId[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showUnsourced, setShowUnsourced] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [resultAnnouncement, setResultAnnouncement] = useState("");

  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(parseRpcQuery(params));
      setFeatures(parseRpcFeatures(params));
      setPins(parseRpcPins(params, RPC_PROVIDERS));
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
  const setUrl = (name: "q" | "f" | "pin", value: string, replace = false) => {
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
        document.getElementById("rpc-filter-toggle")
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

  return (
    <section
      id="providers"
      className="border-b border-nd-border-light"
      aria-labelledby="providers-heading"
    >
      <div className={`${shell} py-16 md:py-28 xl:py-40`}>
        <div className="max-w-3xl">
          <h2 id="providers-heading" className="nd-heading-l">
            {copy.directoryTitle}
          </h2>
          <p className="nd-body-l mt-6 max-w-xl text-nd-mid-em-text">
            {copy.directoryBody}
          </p>
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
                            aria-describedby={
                              id === "enhanced"
                                ? "rpc-extended-hint"
                                : undefined
                            }
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
                  {group === "data" && (
                    <p id="rpc-extended-hint" className="sr-only">
                      {copy.extendedHint}
                    </p>
                  )}
                </fieldset>
              ))}
            </div>
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
                  document.getElementById("rpc-results")?.scrollIntoView({
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

        {features.length > 0 && !filtersOpen && (
          <div
            id="rpc-active-filters"
            className="mt-5 flex flex-wrap items-center gap-2 md:hidden"
          >
            {features.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => removeFeatureChip(id)}
                aria-label={`${copy.remove} ${copy.featureLabels[id]}`}
                className={`rounded-full border border-white px-3 py-1.5 text-sm text-white hover:!bg-white/10 ${focus}`}
              >
                {copy.featureLabels[id]} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}

        <div
          id="rpc-results"
          className="mt-8 flex scroll-mt-24 flex-wrap items-center justify-between gap-4"
        >
          <p className="font-brand-mono text-xs text-nd-mid-em-text">
            <span className="text-white">{results.length}</span>{" "}
            {query || features.length
              ? `${copy.resultsOf} ${RPC_PROVIDERS.length} `
              : ""}
            {copy.resultMany}
          </p>
          <span
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {resultAnnouncement} {announcement}
          </span>
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

        {results.length > 0 ? (
          <div className="mt-10 grid border-l border-t border-nd-border-light md:grid-cols-2 xl:grid-cols-3">
            {results.map((provider) => {
              const cited = documentedFeatures(provider).sort(
                (a, b) =>
                  Number(features.includes(b.id)) -
                  Number(features.includes(a.id)),
              );
              const pinned = pins.includes(provider.id);
              return (
                <article
                  key={provider.id}
                  className="flex min-h-[280px] flex-col border-b border-r border-nd-border-light p-6 hover:bg-white/[0.03] xl:p-8"
                >
                  <div>
                    <h3 className="nd-heading-xs">{provider.name}</h3>
                    <p className="nd-body-s mt-3 text-nd-mid-em-text">
                      {copy.descriptions[provider.id]}
                    </p>
                  </div>
                  <div className="mt-7 flex-1">
                    <p className="font-brand-mono text-xs uppercase tracking-wide text-nd-mid-em-text">
                      {copy.documentedFeatures}
                    </p>
                    {cited.length ? (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {cited.map(({ id }) => (
                          <li key={id}>
                            <a
                              href={provider.features[id]?.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${copy.sourceFor} ${copy.featureLabels[id]}, ${provider.name} (${copy.newTab})`}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs text-white hover:border-white ${features.includes(id) ? "border-white" : "border-nd-border-light"} ${focus}`}
                            >
                              {copy.featureLabels[id]}
                              <ArrowUpRight
                                className="size-3"
                                aria-hidden="true"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="nd-body-s mt-3 text-nd-mid-em-text">
                        {copy.noFeaturesSourced}
                      </p>
                    )}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-nd-border-light pt-5">
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-sm font-medium text-white ${focus}`}
                      aria-label={`${copy.visit} ${provider.name} (${copy.newTab})`}
                    >
                      {copy.visit}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      aria-pressed={pinned}
                      onClick={() => togglePin(provider)}
                      className={`rounded-full border px-4 py-2 text-sm ${pinned ? "border-white !bg-white text-black" : "border-nd-border-prominent text-white hover:border-white"} ${focus}`}
                    >
                      {pinned ? copy.shortlisted : copy.shortlist}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 border border-nd-border-light p-8">
            <p className="nd-heading-xs">
              {features.length ? copy.emptyFiltered : copy.noResults}
            </p>
            {features.length > 0 && (
              <p className="nd-body-s mt-3 max-w-xl text-nd-mid-em-text">
                {copy.emptyEvidence}
              </p>
            )}
            <button
              type="button"
              onClick={clearAll}
              className={`mt-5 text-sm text-white underline underline-offset-4 ${focus}`}
            >
              {copy.clearAll}
            </button>
          </div>
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
                  className="border-b border-r border-nd-border-light p-5"
                >
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
                  <button
                    type="button"
                    aria-pressed={pins.includes(provider.id)}
                    onClick={() => togglePin(provider)}
                    className={`mt-5 rounded-full border px-4 py-2 text-xs ${pins.includes(provider.id) ? "border-white !bg-white text-black" : "border-nd-border-prominent text-white hover:border-white"} ${focus}`}
                  >
                    {pins.includes(provider.id)
                      ? copy.shortlisted
                      : copy.shortlist}
                  </button>
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
                <p className="nd-body-s mt-3 max-w-2xl text-nd-mid-em-text">
                  {copy.compareNote}
                </p>
              </div>
              <p className="font-brand-mono text-xs text-nd-mid-em-text">
                {selected.length} / 3
              </p>
            </div>
            {selected.length > 1 && (
              <p className="mt-6 text-sm text-nd-mid-em-text md:hidden">
                {copy.scrollCompare}
              </p>
            )}
            <div className="mt-5 overflow-x-auto border border-nd-border-light">
              <table
                className={`w-full border-collapse text-left ${selected.length > 1 ? "min-w-[680px]" : "min-w-0"}`}
              >
                <caption className="sr-only">{copy.compareCaption}</caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="w-[92px] border-b border-r border-nd-border-light p-4 font-brand-mono text-xs text-nd-mid-em-text md:w-[170px]"
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
                        <button
                          type="button"
                          onClick={() => togglePin(provider)}
                          className={`mt-2 text-xs font-normal text-nd-mid-em-text underline underline-offset-4 hover:text-white ${focus}`}
                        >
                          {copy.remove}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RPC_FEATURES.map(({ id }) => (
                    <tr key={id}>
                      <th
                        scope="row"
                        className="border-b border-r border-nd-border-light p-4 text-sm font-medium"
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
                                  className={`inline-flex items-center gap-1 text-white underline underline-offset-4 ${focus}`}
                                >
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
                              <span className="text-nd-mid-em-text">
                                {copy.notYetSourced}
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
          </div>
        )}
        <p className="nd-body-s mt-6 max-w-3xl text-nd-mid-em-text">
          {copy.sourceCaveat}
        </p>
      </div>
    </section>
  );
}
