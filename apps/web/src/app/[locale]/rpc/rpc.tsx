"use client";

import { useEffect, useState } from "react";
import { Link } from "@solana-com/ui-chrome/link";
import { RPC_PROVIDERS } from "./providers";
import { parseRpcQuery, searchRpcProviders } from "./directory-state";

export type RpcCopy = {
  eyebrow: string;
  diagramLabel: string;
  diagramApp: string;
  diagramEndpoint: string;
  diagramCluster: string;
  title: string;
  intro: string;
  compare: string;
  guide: string;
  pathsTitle: string;
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
  evaluateTitle: string;
  evaluateBody: string;
  methods: string;
  regions: string;
  reliability: string;
  credentials: string;
  readiness: string;
  reference: string;
  serverTitle: string;
  serverBody: string;
  serverAction: string;
};

const endpoints = [
  { id: "mainnet", url: "https://api.mainnet.solana.com" },
  { id: "devnet", url: "https://api.devnet.solana.com" },
  { id: "testnet", url: "https://api.testnet.solana.com" },
] as const;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14F195]";

export function RpcPage({ copy }: { copy: RpcCopy }) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const sync = () =>
      setQuery(parseRpcQuery(new URLSearchParams(window.location.search)));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const results = searchRpcProviders(RPC_PROVIDERS, query);
  const updateQuery = (value: string) => {
    setQuery(value);
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("q", value.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(window.history.state, "", url);
  };
  const copyEndpoint = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
    } catch {
      setCopied(null);
    }
  };

  return (
    <main className="bg-[#09090F] text-white">
      <section className="relative overflow-hidden border-b border-white/15 px-5 pb-20 pt-24 sm:px-8 lg:pb-28 lg:pt-32">
        <div
          className="pointer-events-none absolute -right-28 top-0 h-80 w-80 rounded-full bg-[#9945FF]/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#14F195]">
            {copy.eyebrow}
          </p>
          <h1 className="max-w-5xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70">
            {copy.intro}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#providers"
              className={`rounded-full bg-[#14F195] px-6 py-3 font-semibold text-[#09090F] ${focus}`}
            >
              {copy.compare}
            </a>
            <Link
              href="/docs/rpc/providers"
              className={`rounded-full border border-white/40 px-6 py-3 font-semibold text-white hover:border-white ${focus}`}
            >
              {copy.guide} ↗
            </Link>
          </div>
          <div
            className="mt-16 flex max-w-3xl flex-wrap items-center gap-3 font-mono text-xs text-white/65"
            aria-label={copy.diagramLabel}
          >
            <span className="rounded-lg border border-white/30 px-4 py-3">
              {copy.diagramApp}
            </span>
            <span aria-hidden="true">→</span>
            <span className="rounded-lg border border-[#14F195]/70 bg-[#14F195]/10 px-4 py-3 text-[#14F195]">
              {copy.diagramEndpoint}
            </span>
            <span aria-hidden="true">→</span>
            <span className="rounded-lg border border-white/30 px-4 py-3">
              {copy.diagramCluster}
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8" aria-labelledby="paths-heading">
        <div className="mx-auto max-w-7xl">
          <h2
            id="paths-heading"
            className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {copy.pathsTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: copy.localTitle,
                body: copy.localBody,
                action: copy.localAction,
                href: "/docs/intro/installation/dependencies",
              },
              {
                title: copy.publicTitle,
                body: copy.publicBody,
                action: copy.publicAction,
                href: "#public-endpoints",
              },
              {
                title: copy.productionTitle,
                body: copy.productionBody,
                action: copy.productionAction,
                href: "#providers",
              },
            ].map((path) => (
              <article
                key={path.title}
                className="flex min-h-64 flex-col rounded-2xl border border-white/15 bg-white/[0.04] p-7"
              >
                <h3 className="text-2xl font-semibold">{path.title}</h3>
                <p className="mt-4 leading-relaxed text-white/65">
                  {path.body}
                </p>
                <a
                  href={path.href}
                  className={`mt-auto pt-8 font-semibold text-[#14F195] hover:underline ${focus}`}
                >
                  {path.action} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="public-endpoints"
        className="border-y border-white/15 bg-[#11111D] px-5 py-20 sm:px-8"
        aria-labelledby="endpoints-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="endpoints-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {copy.endpointsTitle}
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-white/65">
            {copy.endpointsBody}
          </p>
          <div className="mt-9 grid gap-3">
            {endpoints.map(({ id, url }) => (
              <div
                key={id}
                className="flex flex-col items-start gap-3 rounded-xl border border-white/15 bg-[#09090F] p-4 sm:flex-row sm:items-center sm:p-5"
              >
                <strong className="w-24">{copy[id]}</strong>
                <code className="w-full break-all text-sm text-white/70 sm:min-w-0 sm:flex-1">
                  {url}
                </code>
                <button
                  type="button"
                  onClick={() => copyEndpoint(id, url)}
                  className={`rounded-full border border-white/30 px-4 py-2 text-sm hover:border-[#14F195] ${focus}`}
                  aria-label={`${copy.copy} ${copy[id]}`}
                >
                  {copied === id ? copy.copied : copy.copy}
                </button>
              </div>
            ))}
          </div>
          <Link
            href="/docs/references/clusters"
            className={`mt-6 inline-block text-[#14F195] hover:underline ${focus}`}
          >
            {copy.publicAction} →
          </Link>
        </div>
      </section>

      <section
        id="providers"
        className="px-5 py-20 sm:px-8"
        aria-labelledby="providers-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="providers-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {copy.directoryTitle}
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-white/65">
            {copy.directoryBody}
          </p>
          <div className="mt-10 flex flex-wrap items-end gap-4">
            <div className="min-w-0 flex-1 sm:max-w-md">
              <label
                htmlFor="rpc-search"
                className="mb-2 block text-sm font-medium"
              >
                {copy.searchLabel}
              </label>
              <input
                id="rpc-search"
                type="search"
                maxLength={100}
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className={`w-full rounded-xl border border-white/30 bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/45 ${focus}`}
              />
            </div>
            {query && (
              <button
                type="button"
                onClick={() => updateQuery("")}
                className={`rounded-full border border-white/30 px-5 py-3 hover:border-white ${focus}`}
              >
                {copy.clear}
              </button>
            )}
          </div>
          <p
            className="mt-5 text-sm text-white/60"
            role="status"
            aria-live="polite"
          >
            {results.length}{" "}
            {results.length === 1 ? copy.resultOne : copy.resultMany}
          </p>
          {results.length ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((provider) => (
                <article
                  key={provider.id}
                  className="flex min-h-36 flex-col justify-between rounded-xl border border-white/15 bg-white/[0.04] p-6 transition-colors hover:border-[#14F195]/60"
                >
                  <h3 className="text-xl font-semibold">{provider.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                    {copy.descriptions[provider.id]}
                  </p>
                  <a
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-5 self-start font-medium text-[#14F195] hover:underline ${focus}`}
                    aria-label={`${copy.visit} ${provider.name} (${copy.newTab})`}
                  >
                    {copy.visit} ↗
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-white/15 p-8">
              <p>{copy.noResults}</p>
              <button
                type="button"
                onClick={() => updateQuery("")}
                className={`mt-4 text-[#14F195] underline ${focus}`}
              >
                {copy.clear}
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        className="border-t border-white/15 bg-[#11111D] px-5 py-20 sm:px-8"
        aria-labelledby="evaluate-heading"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2
              id="evaluate-heading"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {copy.evaluateTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-white/65">
              {copy.evaluateBody}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              copy.methods,
              copy.regions,
              copy.reliability,
              copy.credentials,
            ].map((item) => (
              <p
                key={item}
                className="rounded-xl border border-white/15 p-5 leading-relaxed"
              >
                {item}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 lg:col-start-2">
            <Link
              href="/docs/rpc/providers"
              className={`text-[#14F195] hover:underline ${focus}`}
            >
              {copy.guide} →
            </Link>
            <Link
              href="/docs/rpc"
              className={`text-[#14F195] hover:underline ${focus}`}
            >
              {copy.reference} →
            </Link>
            <Link
              href="/docs/tools/production-readiness"
              className={`text-[#14F195] hover:underline ${focus}`}
            >
              {copy.readiness} →
            </Link>
          </div>
        </div>
      </section>
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/15 p-7 sm:p-10">
          <h2 className="text-2xl font-semibold">{copy.serverTitle}</h2>
          <p className="mt-3 max-w-3xl text-white/65">{copy.serverBody}</p>
          <a
            href="https://solana.org/delegation-program"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-5 inline-block text-[#14F195] hover:underline ${focus}`}
          >
            {copy.serverAction} ↗
          </a>
        </div>
      </section>
    </main>
  );
}
