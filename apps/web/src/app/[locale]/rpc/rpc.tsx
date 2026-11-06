"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { RPC_PROVIDERS } from "./providers";
import type { RpcFeatureGroup, RpcFeatureId } from "./provider-features";
import { RpcRouteVisual } from "./RpcRouteVisual";
import { Jack } from "./Jack";
import { RpcProviderDirectory } from "./RpcProviderDirectory";
import { typeScale } from "./typography";
import {
  localizeRpcHref,
  parseRpcPath,
  RPC_PATHS,
  type RpcPath,
} from "./directory-state";

export type RpcCopy = {
  title: string;
  titleLight: string;
  intro: string;
  compare: string;
  guide: string;
  pathsTitle: string;
  copyCommand: string;
  localCommand: string;
  providerCountNote: string;
  clustersAction: string;
  pathLocal: string;
  pathPublic: string;
  pathProduction: string;
  pathCaptions: Record<RpcPath, string>;
  localTitle: string;
  localBody: string;
  localAction: string;
  publicTitle: string;
  publicBody: string;
  publicAction: string;
  productionTitle: string;
  productionBody: string;
  productionAction: string;
  endpointsTitle: string;
  endpointsBody: string;
  mainnet: string;
  devnet: string;
  testnet: string;
  copy: string;
  copied: string;
  copyFailed: string;
  copyManually: string;
  directoryTitle: string;
  directoryBody: string;
  searchLabel: string;
  searchPlaceholder: string;
  resultOne: string;
  resultMany: string;
  resultsOf: string;
  noResults: string;
  clear: string;
  visit: string;
  newTab: string;
  featureGroups: Record<RpcFeatureGroup, string>;
  featureLabels: Record<RpcFeatureId, string>;
  featureDefinitions: Record<RpcFeatureId, string>;
  definitionsToggle: string;
  filterTitle: string;
  filterRule: string;
  filterToggle: string;
  showResults: string;
  unsourcedSummaryOne: string;
  unsourcedSummaryMany: string;
  showUnsourced: string;
  hideUnsourced: string;
  noSourceFor: string;
  clearFilters: string;
  documentedFeatures: string;
  notYetSourced: string;
  noFeaturesSourced: string;
  sourceFor: string;
  shortlist: string;
  shortlisted: string;
  compareLimit: string;
  removedFromCompare: string;
  addedToCompare: string;
  selectedForCompare: string;
  compareSelected: string;
  compareNote: string;
  scrollCompare: string;
  compareCaption: string;
  featureColumn: string;
  remove: string;
  documented: string;
  checkedOn: string;
  sourceCaveat: string;
  emptyFiltered: string;
  emptyEvidence: string;
  clearAll: string;
  evaluateTitle: string;
  evaluateBody: string;
  methods: string;
  regions: string;
  reliability: string;
  credentials: string;
  readiness: string;
  reference: string;
  diagramApp: string;
  diagramEndpoint: string;
  diagramCluster: string;
  sceneApp: string;
  sceneLocalValidator: string;
  sceneOfficial: string;
  sceneProvider: string;
  sceneLocalCluster: string;
  sceneDevnet: string;
  sceneMainnet: string;
  sceneFallback: string;
  sceneMachine: string;
  sceneOtherApps: string;
  useFor: string;
  keepInMind: string;
  pathUse: Record<RpcPath, string[]>;
  pathWatch: Record<RpcPath, string[]>;
  purposes: Record<EndpointId, string>;
  limitsTitle: string;
  limits: Record<"requests" | "perMethod" | "connections" | "data", string>;
  limitsNote: string;
  tryTitle: string;
  tryBody: string;
  tryResponse: string;
  copyCode: string;
  copyCodeFailed: string;
  viewLabel: string;
  viewCards: string;
  viewTable: string;
  tableCaption: string;
  providerColumn: string;
  featuresDocumented: string;
  removeFilter: string;
  matchesWithout: string;
  diffOnly: string;
  noDifferences: string;
  listingLink: string;
  policyLabel: string;
  popularNeeds: string;
};

const endpoints = [
  { id: "mainnet", url: "https://api.mainnet.solana.com" },
  { id: "devnet", url: "https://api.devnet.solana.com" },
  { id: "testnet", url: "https://api.testnet.solana.com" },
] as const;
type EndpointId = (typeof endpoints)[number]["id"];
/** Source: docs/references/clusters (identical for Mainnet, Devnet, Testnet). */
const limits = [
  { id: "requests", value: "100" },
  { id: "perMethod", value: "40" },
  { id: "connections", value: "40" },
  { id: "data", value: "100 MB" },
] as const;
const snippets = [
  {
    id: "curl",
    label: "curl",
    code: `curl https://api.devnet.solana.com -s -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'`,
    response: `{"jsonrpc":"2.0","result":"ok","id":1}`,
  },
  {
    id: "kit",
    label: "@solana/kit",
    code: `import { createSolanaRpc } from "@solana/kit";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
console.log(await rpc.getHealth().send());`,
    response: `ok`,
  },
] as const;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const shell = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
const quickFeatures: RpcFeatureId[] = [
  "websocket",
  "grpc",
  "history",
  "free",
  "dedicated",
];
const primary = `inline-flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 font-medium text-black hover:bg-white/90 ${focus}`;

export function RpcPage({ copy, locale }: { copy: RpcCopy; locale: string }) {
  const [path, setPath] = useState<RpcPath>("production");
  const [copied, setCopied] = useState<EndpointId | null>(null);
  const [copyError, setCopyError] = useState<EndpointId | null>(null);
  const [copyAnnouncement, setCopyAnnouncement] = useState("");
  const [commandCopied, setCommandCopied] = useState(false);

  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setPath(parseRpcPath(params));
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const changePath = (next: RpcPath) => {
    setPath(next);
    const url = new URL(window.location.href);
    if (next === "production") url.searchParams.delete("path");
    else url.searchParams.set("path", next);
    window.history.pushState(window.history.state, "", url);
  };
  const copyEndpoint = async (id: EndpointId, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setCopyError(null);
      setCopyAnnouncement(`${copy.copied}: ${copy[id]}`);
    } catch {
      setCopied(null);
      setCopyError(id);
      setCopyAnnouncement(
        `${copy.copyFailed}: ${copy[id]}. ${copy.copyManually}`,
      );
    }
  };
  const openFiltered = (
    event: React.MouseEvent<HTMLAnchorElement>,
    feature: RpcFeatureId,
  ) => {
    // Let modified clicks open the filtered directory in a new tab or window.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set("f", feature);
    url.hash = "providers";
    window.history.pushState(window.history.state, "", url);
    // The directory re-reads its filters from the URL on popstate.
    window.dispatchEvent(new PopStateEvent("popstate"));
    document.getElementById("providers")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
  const pathDetails = {
    local: {
      title: copy.localTitle,
      body: copy.localBody,
      action: copy.localAction,
      href: localizeRpcHref("/docs/intro/installation/dependencies", locale),
    },
    public: {
      title: copy.publicTitle,
      body: copy.publicBody,
      action: copy.publicAction,
      href: "#public-endpoints",
    },
    production: {
      title: copy.productionTitle,
      body: copy.productionBody,
      action: copy.productionAction,
      href: "#providers",
    },
  } as const;
  const pathLabels = {
    local: copy.pathLocal,
    public: copy.pathPublic,
    production: copy.pathProduction,
  };
  const selected = pathDetails[path];

  const onPathKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      nextIndex = (index + 1) % RPC_PATHS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      nextIndex = (index + RPC_PATHS.length - 1) % RPC_PATHS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = RPC_PATHS.length - 1;
    else return;
    event.preventDefault();
    changePath(RPC_PATHS[nextIndex]);
    document.getElementById(`rpc-path-${RPC_PATHS[nextIndex]}`)?.focus();
  };

  return (
    <main className="bg-nd-bg font-brand text-nd-high-em-text [&_:where(h1,h2,h3,h4,p,ul,ol,dl,dd)]:mb-0 [&_:where(ul,ol)]:pl-0">
      <section
        className="relative overflow-hidden border-b border-nd-border-light"
        aria-labelledby="rpc-title"
      >
        <div
          className={`${shell} pb-12 pt-16 md:pb-16 md:pt-24 xl:pb-20 xl:pt-32`}
        >
          <h1 id="rpc-title" className={typeScale.heading2xl}>
            {copy.title}
            <br />
            <span className="font-light">{copy.titleLight}</span>
          </h1>
          <div className="mt-10 grid gap-y-8 md:mt-14 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:grid-rows-[auto_auto_1fr] xl:gap-x-16 xl:gap-y-12">
            <div className="xl:col-start-1 xl:row-start-1">
              <p
                className={`${typeScale.bodyXl} max-w-[520px] text-nd-mid-em-text`}
              >
                {copy.intro}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a href={selected.href} className={primary}>
                  <span className="-ml-2 inline-flex size-7 items-center justify-center rounded-full bg-black text-white">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                  {selected.action}
                </a>
                <a
                  href={localizeRpcHref("/docs/rpc/providers", locale)}
                  className={`${typeScale.bodyM} text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white ${focus}`}
                >
                  {copy.guide}
                </a>
              </div>
            </div>
            <div className="min-w-0 xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:self-center">
              <RpcRouteVisual
                path={path}
                labels={{
                  app: copy.sceneApp,
                  provider: copy.sceneProvider,
                  fallback: copy.sceneFallback,
                  official: copy.sceneOfficial,
                  otherApps: copy.sceneOtherApps,
                  machine: copy.sceneMachine,
                  localValidator: copy.sceneLocalValidator,
                  mainnet: copy.sceneMainnet,
                  devnet: copy.sceneDevnet,
                }}
              />
              <div className="flex justify-between pt-3 font-brand-mono text-[10px] uppercase tracking-wide text-[#E7DFD0]/70 md:hidden">
                <span>{copy.sceneApp}</span>
                <span>
                  {path === "local"
                    ? copy.sceneLocalValidator
                    : path === "public"
                      ? copy.sceneOfficial
                      : copy.sceneProvider}
                </span>
                <span>
                  {path === "local"
                    ? copy.sceneLocalCluster
                    : path === "public"
                      ? copy.sceneDevnet
                      : copy.sceneMainnet}
                </span>
              </div>
            </div>
            <div className="min-w-0 xl:col-start-1 xl:row-start-2">
              <p id="rpc-path-label" className="text-sm text-nd-mid-em-text">
                {copy.pathsTitle}
              </p>
              <div
                role="tablist"
                aria-labelledby="rpc-path-label"
                className="mt-3 grid grid-cols-3 border-y border-nd-border-light xl:grid-cols-1"
              >
                {RPC_PATHS.map((item, index) => (
                  <button
                    key={item}
                    id={`rpc-path-${item}`}
                    type="button"
                    role="tab"
                    aria-selected={path === item}
                    aria-controls="rpc-path-panel"
                    tabIndex={path === item ? 0 : -1}
                    onClick={() => changePath(item)}
                    onKeyDown={(event) => onPathKeyDown(event, index)}
                    className={`flex min-w-0 cursor-pointer flex-col items-start gap-2 border-r border-nd-border-light px-3 py-4 text-left last:border-r-0 hover:!bg-white/[0.03] md:flex-row md:gap-3 md:px-5 md:py-5 xl:border-b xl:border-r-0 xl:px-1 xl:last:border-b-0 ${focus} ${path === item ? "text-white" : "text-nd-mid-em-text hover:text-white"}`}
                  >
                    <Jack
                      plugged={path === item}
                      className="mt-0.5 md:mt-1.5"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium md:text-lg">
                        {pathLabels[item]}
                      </span>
                      <span className="mt-1 hidden text-sm text-nd-mid-em-text md:block">
                        {item === "local"
                          ? copy.localTitle
                          : item === "public"
                            ? copy.publicTitle
                            : copy.productionTitle}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <p
                className="mt-4 min-h-12 max-w-[620px] text-sm text-nd-mid-em-text md:text-base"
                aria-live="polite"
              >
                {copy.pathCaptions[path]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="rpc-path-panel"
        role="tabpanel"
        aria-labelledby={`rpc-path-${path}`}
        className="border-b border-nd-border-light"
      >
        <div className={`${shell} grid gap-10 py-16 xl:grid-cols-2 xl:py-24`}>
          <div>
            <h2 className={`${typeScale.headingM} max-w-[700px]`}>
              {selected.title}
            </h2>
            <p
              className={`${typeScale.bodyL} mt-5 max-w-[640px] text-nd-mid-em-text`}
            >
              {selected.body}
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {(
                [
                  [copy.useFor, copy.pathUse[path], "bg-nd-highlight-green"],
                  [copy.keepInMind, copy.pathWatch[path], "bg-nd-mid-em-text"],
                ] as const
              ).map(([label, items, marker]) => (
                <div key={label}>
                  <h3 className="text-sm font-medium text-white">{label}</h3>
                  <ul className="mt-4 space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex gap-3 text-base">
                        <span
                          className={`mt-2.5 size-1.5 shrink-0 rounded-full ${marker}`}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-nd-border-light py-5">
              {path === "local" ? (
                <>
                  <code
                    dir="ltr"
                    className="font-brand-mono text-sm md:text-base"
                  >
                    $ surfpool start
                  </code>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText("surfpool start");
                        setCommandCopied(true);
                        setCopyAnnouncement(copy.copied);
                      } catch {
                        setCopyAnnouncement(copy.copyFailed);
                      }
                    }}
                    className={`rounded-full border border-nd-border-prominent px-4 py-2 text-sm hover:border-white ${focus}`}
                  >
                    {commandCopied ? copy.copied : copy.copyCommand}
                  </button>
                </>
              ) : path === "public" ? (
                <>
                  <span className="font-medium">{copy.devnet}</span>
                  <code
                    dir="ltr"
                    className="break-all font-brand-mono text-sm md:text-base"
                  >
                    https://api.devnet.solana.com
                  </code>
                  <button
                    type="button"
                    onClick={() =>
                      copyEndpoint("devnet", "https://api.devnet.solana.com")
                    }
                    className={`rounded-full border border-nd-border-prominent px-4 py-2 text-sm hover:border-white ${focus}`}
                  >
                    {copied === "devnet" ? copy.copied : copy.copy}
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <p className={typeScale.bodyM}>
                    {RPC_PROVIDERS.length} {copy.providerCountNote}
                  </p>
                  <ul className="mt-4 border-t border-nd-border-light">
                    {quickFeatures.map((id) => {
                      const count = RPC_PROVIDERS.filter(
                        (provider) => provider.features[id],
                      ).length;
                      return (
                        <li key={id}>
                          <a
                            href={`?f=${id}#providers`}
                            onClick={(event) => openFiltered(event, id)}
                            className={`flex items-center gap-3 border-b border-nd-border-light py-3 text-sm text-nd-mid-em-text hover:text-white ${focus}`}
                          >
                            <Jack plugged={false} small />
                            <span className="flex-1 text-white">
                              {copy.featureLabels[id]}
                            </span>
                            <span className="font-brand-mono text-xs">
                              {count}{" "}
                              {count === 1 ? copy.resultOne : copy.resultMany}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <a
              href={selected.href}
              className={`mt-6 text-base font-medium text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white ${focus}`}
            >
              {selected.action}
            </a>
          </div>
        </div>
      </section>

      <section
        id="public-endpoints"
        className="border-b border-nd-border-light"
        aria-labelledby="endpoints-heading"
      >
        <div
          className={`${shell} grid grid-cols-[minmax(0,1fr)] gap-10 py-16 md:py-28 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:py-40`}
        >
          <div>
            <h2
              id="endpoints-heading"
              className={`${typeScale.headingL} max-w-[760px]`}
            >
              {copy.endpointsTitle}
            </h2>
            <p
              className={`${typeScale.bodyL} mt-6 max-w-xl text-nd-mid-em-text`}
            >
              {copy.endpointsBody}
            </p>
            <h3 className="mt-10 text-sm font-medium text-white">
              {copy.limitsTitle}
            </h3>
            <dl className="mt-4 grid max-w-xl grid-cols-2 border-l border-t border-nd-border-light">
              {limits.map(({ id, value }) => (
                <div
                  key={id}
                  className="flex flex-col-reverse justify-end border-b border-r border-nd-border-light p-4 md:p-5"
                >
                  <dt className="mt-1 text-sm text-nd-mid-em-text">
                    {copy.limits[id]}
                  </dt>
                  <dd className="text-2xl font-medium tracking-tight md:text-[28px]">
                    <span dir="ltr">{value}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 max-w-xl text-sm text-nd-mid-em-text">
              {copy.limitsNote}
            </p>
          </div>
          <div className="border-t border-nd-border-prominent">
            {endpoints.map(({ id, url }) => (
              <div
                key={id}
                className="grid grid-cols-[1fr_auto] gap-2 border-b border-nd-border-light py-5 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center md:gap-4"
              >
                <div>
                  <strong className={`${typeScale.bodyM} block font-medium`}>
                    {copy[id]}
                  </strong>
                  <span className="block text-sm leading-snug text-nd-mid-em-text">
                    {copy.purposes[id]}
                  </span>
                </div>
                <code
                  dir="ltr"
                  className="order-3 col-span-2 break-all font-brand-mono text-sm text-white md:order-none md:col-span-1 md:text-base"
                >
                  {url}
                </code>
                <button
                  type="button"
                  onClick={() => copyEndpoint(id, url)}
                  className={`w-fit rounded-full border border-nd-border-prominent px-4 py-2 text-sm hover:border-white ${focus}`}
                  aria-label={`${copied === id ? copy.copied : copy.copy} ${copy[id]}`}
                >
                  {copied === id ? copy.copied : copy.copy}
                </button>
              </div>
            ))}
            <p className="sr-only" role="status" aria-live="polite">
              {copyAnnouncement}
            </p>
            {copyError && (
              <p className="mt-4 text-sm text-nd-mid-em-text">
                {copy.copyFailed}: {copy[copyError]}. {copy.copyManually}
              </p>
            )}
            <a
              href={localizeRpcHref("/docs/references/clusters", locale)}
              className={`mt-8 font-medium text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white ${focus}`}
            >
              {copy.clustersAction}
            </a>
            <TryIt copy={copy} />
          </div>
        </div>
      </section>

      <RpcProviderDirectory copy={copy} />

      <section
        className="border-b border-nd-border-light"
        aria-labelledby="evaluate-heading"
      >
        <div
          className={`${shell} grid grid-cols-[minmax(0,1fr)] gap-10 py-16 md:py-28 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:py-40`}
        >
          <div>
            <h2
              id="evaluate-heading"
              className={`${typeScale.headingL} max-w-[700px]`}
            >
              {copy.evaluateTitle}
            </h2>
            <p
              className={`${typeScale.bodyL} mt-6 max-w-xl text-nd-mid-em-text`}
            >
              {copy.evaluateBody}
            </p>
          </div>
          <div>
            <ul className="grid border-l border-t border-nd-border-light md:grid-cols-2">
              {[
                copy.methods,
                copy.regions,
                copy.reliability,
                copy.credentials,
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-4 border-b border-r border-nd-border-light p-6 md:min-h-36"
                >
                  <Jack plugged={false} className="mt-1" />
                  <p className={typeScale.bodyM}>{item}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              {[
                [copy.guide, "/docs/rpc/providers"],
                [copy.reference, "/docs/rpc"],
                [copy.readiness, "/docs/tools/production-readiness"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={localizeRpcHref(href, locale)}
                  className={`text-base font-medium text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white ${focus}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TryIt({ copy }: { copy: RpcCopy }) {
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const snippet = snippets[active];
  const select = (index: number) => {
    setActive(index);
    setStatus("idle");
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = (active + 1) % snippets.length;
    select(next);
    document.getElementById(`rpc-try-${snippets[next].id}`)?.focus();
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="mt-14 border border-nd-border-light">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-nd-border-light px-5 py-4">
        <div>
          <h3 className="text-base font-medium">{copy.tryTitle}</h3>
          <p className="mt-1 text-sm text-nd-mid-em-text">{copy.tryBody}</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            role="tablist"
            aria-label={copy.tryTitle}
            className="flex rounded-full border border-nd-border-prominent p-1"
          >
            {snippets.map((item, index) => (
              <button
                key={item.id}
                id={`rpc-try-${item.id}`}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls="rpc-try-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={onKeyDown}
                className={`rounded-full px-3 py-1 font-brand-mono text-xs ${active === index ? "!bg-white text-black" : "text-nd-mid-em-text hover:text-white"} ${focus}`}
              >
                <bdi dir="ltr">{item.label}</bdi>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={copyCode}
            className={`rounded-full border border-nd-border-prominent px-3 py-1.5 text-xs hover:border-white ${focus}`}
          >
            {status === "copied"
              ? copy.copied
              : status === "failed"
                ? copy.copyCodeFailed
                : copy.copyCode}
          </button>
        </div>
      </div>
      <div
        id="rpc-try-panel"
        role="tabpanel"
        aria-labelledby={`rpc-try-${snippet.id}`}
      >
        <pre
          dir="ltr"
          className="overflow-x-auto p-5 text-left font-brand-mono text-[13px] leading-relaxed text-white"
        >
          <code>{snippet.code}</code>
        </pre>
        <div className="border-t border-nd-border-light px-5 py-4">
          <p className="text-xs text-nd-mid-em-text">{copy.tryResponse}</p>
          <pre
            dir="ltr"
            className="text-left mt-2 overflow-x-auto font-brand-mono text-[13px] text-nd-highlight-green"
          >
            <code>{snippet.response}</code>
          </pre>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {status === "copied"
          ? copy.copied
          : status === "failed"
            ? copy.copyCodeFailed
            : ""}
      </p>
    </div>
  );
}
