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
} from "./directory-state";
import type { RpcCopy } from "./rpc";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const shell = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
const groups: RpcFeatureGroup[] = [
  "interfaces",
  "data",
  "infrastructure",
  "terms",
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
  const [announcement, setAnnouncement] = useState("");

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
    setUrl("f", next.join(","));
    setAnnouncement("");
  };
  const clearFilters = () => {
    setFeatures([]);
    setUrl("f", "");
    setAnnouncement("");
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
        <div className="grid items-end gap-8 xl:grid-cols-[5fr_7fr] xl:gap-10">
          <div>
            <h2 id="providers-heading" className="nd-heading-l">
              {copy.directoryTitle}
            </h2>
            <p className="nd-body-l mt-6 max-w-xl text-nd-mid-em-text">
              {copy.directoryBody}
            </p>
          </div>
          <div className="xl:justify-self-end">
            <label
              htmlFor="rpc-search"
              className="mb-2 block text-xs text-nd-mid-em-text"
            >
              {copy.searchLabel}
            </label>
            <div className="relative w-full xl:w-[400px]">
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
            <p
              className="mt-3 text-xs text-nd-mid-em-text"
              role="status"
              aria-live="polite"
            >
              {results.length}{" "}
              {results.length === 1 ? copy.resultOne : copy.resultMany}
              <span className="sr-only"> {announcement}</span>
            </p>
          </div>
        </div>

        <div className="mt-10 border-y border-nd-border-light py-6 md:mt-16 md:py-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="nd-heading-xs">{copy.filterTitle}</h3>
              <p className="nd-body-s mt-2 max-w-2xl text-nd-mid-em-text">
                {copy.filterRule}
              </p>
            </div>
            {features.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className={`hidden shrink-0 text-sm text-white underline underline-offset-4 md:block ${focus}`}
              >
                {copy.clearFilters}
              </button>
            )}
          </div>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="rpc-feature-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`mt-5 inline-flex w-full items-center justify-between rounded-full border border-nd-border-prominent px-5 py-3 text-sm md:hidden ${focus}`}
          >
            <span>
              {copy.filterToggle}
              {features.length > 0 ? ` · ${features.length}` : ""}
            </span>
            <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
          </button>
          <div
            id="rpc-feature-filters"
            className={`${filtersOpen ? "block" : "hidden"} mt-6 md:block`}
          >
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {groups.map((group) => (
                <fieldset key={group} className="min-w-0">
                  <legend className="float-none mb-4 font-brand-mono text-xs uppercase tracking-wide text-nd-mid-em-text">
                    {copy.featureGroups[group]}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {RPC_FEATURES.filter(
                      (feature) => feature.group === group,
                    ).map(({ id }) => {
                      const count = filterRpcProviders(
                        RPC_PROVIDERS,
                        query,
                        features.includes(id) ? features : [...features, id],
                      ).length;
                      return (
                        <label
                          key={id}
                          className="group relative cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={features.includes(id)}
                            onChange={() => toggleFeature(id)}
                            className="peer sr-only"
                          />
                          <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-nd-border-prominent px-4 py-2 text-sm text-white hover:border-white peer-checked:!bg-white peer-checked:text-black peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-white">
                            <span>{copy.featureLabels[id]}</span>
                            <span className="font-brand-mono text-xs opacity-60">
                              {count}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
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
          </div>
        </div>

        {(features.length > 0 || pins.length > 0) && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {features.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleFeature(id)}
                aria-label={`${copy.remove} ${copy.featureLabels[id]}`}
                className={`rounded-full border border-white px-3 py-1.5 text-sm text-white hover:!bg-white/10 ${focus}`}
              >
                {copy.featureLabels[id]} <span aria-hidden="true">×</span>
              </button>
            ))}
            {pins.length > 0 && (
              <a
                href="#rpc-compare"
                className={`ml-auto inline-flex items-center gap-2 text-sm text-white underline underline-offset-4 ${focus}`}
              >
                {copy.compareSelected} ({pins.length})
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
        )}

        {results.length > 0 ? (
          <div className="mt-10 grid border-l border-t border-nd-border-light md:grid-cols-2 xl:grid-cols-3">
            {results.map((provider) => {
              const cited = documentedFeatures(provider);
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
                              title={provider.features[id]?.note}
                              className={`inline-flex items-center gap-1 rounded-full border border-nd-border-light px-3 py-1.5 text-xs text-white hover:border-white ${focus}`}
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
                        {copy.notYetSourced}
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
