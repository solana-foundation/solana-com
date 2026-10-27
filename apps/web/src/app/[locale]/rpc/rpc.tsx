"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { RPC_PROVIDERS } from "./providers";
import type { RpcFeatureGroup, RpcFeatureId } from "./provider-features";
import { RpcRouteVisual } from "./RpcRouteVisual";
import { RpcProviderDirectory } from "./RpcProviderDirectory";
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
  noResults: string;
  clear: string;
  visit: string;
  newTab: string;
  descriptions: Record<string, string>;
  featureGroups: Record<RpcFeatureGroup, string>;
  featureLabels: Record<RpcFeatureId, string>;
  filterTitle: string;
  filterRule: string;
  filterToggle: string;
  clearFilters: string;
  documentedFeatures: string;
  notYetSourced: string;
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
};

const endpoints = [
  { id: "mainnet", url: "https://api.mainnet.solana.com" },
  { id: "devnet", url: "https://api.devnet.solana.com" },
  { id: "testnet", url: "https://api.testnet.solana.com" },
] as const;
type EndpointId = (typeof endpoints)[number]["id"];
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const shell = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
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
    <main className="bg-nd-bg font-brand text-nd-high-em-text">
      <section
        className="relative overflow-hidden border-b border-nd-border-light"
        aria-labelledby="rpc-title"
      >
        <div
          className={`${shell} relative flex min-h-[max(880px,calc(100svh-70px))] flex-col xl:justify-between`}
        >
          <div className="relative z-10 pt-16 md:pt-28 xl:pt-40">
            <div className="max-w-[710px] xl:max-w-[850px]">
              <h1 id="rpc-title" className="nd-heading-2xl max-w-[900px]">
                {copy.title}
                <br />
                <span className="font-light">{copy.titleLight}</span>
              </h1>
              <p className="nd-body-xl mt-6 max-w-[576px] text-nd-mid-em-text">
                {copy.intro}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5 xl:mt-16">
                <a href={selected.href} className={primary}>
                  <span className="-ml-2 inline-flex size-7 items-center justify-center rounded-full bg-black text-white">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                  {selected.action}
                </a>
                <a
                  href={localizeRpcHref("/docs/rpc/providers", locale)}
                  className={`nd-body-m inline-flex items-center gap-2 text-white underline-offset-4 hover:underline ${focus}`}
                >
                  {copy.guide}
                  <ArrowRight className="size-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="order-2 mt-10 xl:absolute xl:inset-y-0 xl:right-10 xl:order-none xl:mt-0 xl:flex xl:w-[47%] xl:-translate-y-14 xl:flex-col xl:justify-center xl:pt-14">
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
            <div className="flex justify-between border-t border-nd-border-light pt-3 font-brand-mono text-[10px] uppercase tracking-wide text-nd-mid-em-text md:hidden">
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
            <p
              className="mt-4 min-h-12 max-w-[570px] text-sm text-nd-mid-em-text md:text-base"
              aria-live="polite"
            >
              {copy.pathCaptions[path]}
            </p>
          </div>
          <div className="order-1 mt-10 xl:order-none xl:mt-auto">
            <p
              id="rpc-path-label"
              className="pb-3 font-brand-mono text-xs uppercase tracking-wide text-nd-mid-em-text"
            >
              {copy.pathsTitle}
            </p>
            <div
              role="tablist"
              aria-labelledby="rpc-path-label"
              className="-mx-5 grid grid-cols-3 border-t border-nd-border-light md:mx-0"
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
                  className={`relative min-w-0 cursor-pointer border-r border-nd-border-light px-3 py-3 text-left text-sm font-medium last:border-r-0 hover:!bg-white/[0.03] md:min-h-[132px] md:px-6 md:py-5 md:text-lg ${focus} ${path === item ? "text-white before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-nd-highlight-green" : "text-nd-mid-em-text hover:text-white"}`}
                >
                  <span className="block font-brand-mono text-xs text-nd-mid-em-text">
                    0{index + 1}
                  </span>
                  <span className="mt-2 block truncate">
                    {pathLabels[item]}
                  </span>
                  <span className="mt-2 hidden text-sm font-normal text-nd-mid-em-text md:block">
                    {item === "local"
                      ? copy.localTitle
                      : item === "public"
                        ? copy.publicTitle
                        : copy.productionTitle}
                  </span>
                </button>
              ))}
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
            <h2 className="nd-heading-m max-w-[700px]">{selected.title}</h2>
            <p className="nd-body-l mt-5 max-w-[640px] text-nd-mid-em-text">
              {selected.body}
            </p>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-nd-border-light py-5">
              {path === "local" ? (
                <>
                  <code className="font-brand-mono text-sm md:text-base">
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
                  <code className="break-all font-brand-mono text-sm md:text-base">
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
                <span className="nd-body-m">
                  {RPC_PROVIDERS.length} {copy.providerCountNote}
                </span>
              )}
            </div>
            <a
              href={selected.href}
              className={`mt-6 inline-flex items-center gap-2 text-base font-medium text-white underline underline-offset-4 hover:text-nd-highlight-green ${focus}`}
            >
              {selected.action}
              <ArrowRight className="size-5" aria-hidden="true" />
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
          className={`${shell} grid gap-10 py-16 md:py-28 xl:grid-cols-[5fr_7fr] xl:py-40`}
        >
          <div>
            <h2 id="endpoints-heading" className="nd-heading-l max-w-[760px]">
              {copy.endpointsTitle}
            </h2>
            <p className="nd-body-l mt-6 max-w-xl text-nd-mid-em-text">
              {copy.endpointsBody}
            </p>
          </div>
          <div className="border-t border-nd-border-prominent">
            {endpoints.map(({ id, url }) => (
              <div
                key={id}
                className="grid grid-cols-[1fr_auto] gap-2 border-b border-nd-border-light py-5 md:grid-cols-[96px_minmax(0,1fr)_auto] md:items-center md:gap-4"
              >
                <strong className="nd-body-m font-medium">{copy[id]}</strong>
                <code className="order-3 col-span-2 break-all font-brand-mono text-sm text-white md:order-none md:col-span-1 md:text-base">
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
              className={`mt-8 inline-flex items-center gap-2 font-medium text-white underline underline-offset-4 hover:text-nd-highlight-green ${focus}`}
            >
              {copy.clustersAction}
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <RpcProviderDirectory copy={copy} />

      <section
        className="border-b border-nd-border-light"
        aria-labelledby="evaluate-heading"
      >
        <div
          className={`${shell} grid gap-10 py-16 md:py-28 xl:grid-cols-[5fr_7fr] xl:py-40`}
        >
          <div>
            <h2 id="evaluate-heading" className="nd-heading-l max-w-[700px]">
              {copy.evaluateTitle}
            </h2>
            <p className="nd-body-l mt-6 max-w-xl text-nd-mid-em-text">
              {copy.evaluateBody}
            </p>
          </div>
          <div>
            <div className="grid border-l border-t border-nd-border-light md:grid-cols-2">
              {[
                copy.methods,
                copy.regions,
                copy.reliability,
                copy.credentials,
              ].map((item, index) => (
                <div
                  key={item}
                  className="min-h-40 border-b border-r border-nd-border-light p-6"
                >
                  <span className="font-brand-mono text-xs text-nd-mid-em-text">
                    0{index + 1}
                  </span>
                  <p className="nd-body-m mt-6">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              {[
                [copy.guide, "/docs/rpc/providers"],
                [copy.reference, "/docs/rpc"],
                [copy.readiness, "/docs/tools/production-readiness"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={localizeRpcHref(href, locale)}
                  className={`inline-flex items-center gap-2 text-base font-medium underline underline-offset-4 hover:text-nd-highlight-green ${focus}`}
                >
                  {label}
                  <ArrowRight className="size-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
