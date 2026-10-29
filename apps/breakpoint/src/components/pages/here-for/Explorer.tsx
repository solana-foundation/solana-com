"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import type { HereForHandle } from "@/lib/here-for/types";
import type { GraphCanvasHandle, GraphLabel } from "./GraphCanvas";
import {
  HERE_FOR_VIEWS,
  isMutual,
  neighbourhood,
  searchHandles,
  shortestPath,
  type HereForView,
} from "./graph-index";
import {
  EGG_COUPON_CODE,
  EGG_COUPON_HREF,
  HERE_FOR_PATH,
  handleSlug,
  useGraphIndex,
  useMe,
  usePrefersReducedMotion,
} from "./client";
import PersonPanel from "./PersonPanel";

const GraphCanvas = dynamic(() => import("./GraphCanvas"), { ssr: false });

const TRAIL_LIMIT = 6;
const MOST_ADDED_LABELS = 10;
const COMMUNITY_LABELS = 10;

type ExplorerProps = {
  locale: string;
  initialFocus?: string;
};

export default function Explorer({ locale, initialFocus }: ExplorerProps) {
  const t = useTranslations("breakpoint.hereFor");
  const [me] = useMe();
  const graph = useGraphIndex(me.status === "ready" ? me.data : null);
  const reducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<GraphCanvasHandle>(null);
  const initialFlight = useRef<number | null>(null);
  const receiveCanvas = useCallback((handle: GraphCanvasHandle | null) => {
    canvasRef.current = handle;
    if (handle && initialFlight.current !== null) {
      handle.flyTo(initialFlight.current);
      initialFlight.current = null;
    }
  }, []);

  const [focus, setFocus] = useState<number | null>(null);
  const [view, setView] = useState<HereForView>("all");
  const [trail, setTrail] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState(100);
  const [eggOpen, setEggOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const index = graph.status === "ready" ? graph.data : null;
  const youHandle = me.status === "ready" ? me.data.handle : null;
  const you = useMemo(
    () => (index && youHandle ? (index.byHandle.get(youHandle) ?? null) : null),
    [index, youHandle],
  );

  const syncUrl = useCallback(
    (node: number | null, nextView: HereForView) => {
      if (!index) return;
      const url = new URL(window.location.href);
      if (node === null) url.searchParams.delete("focus");
      else
        url.searchParams.set("focus", handleSlug(index.payload.handles[node]!));
      if (nextView === "all") url.searchParams.delete("view");
      else url.searchParams.set("view", nextView);
      window.history.replaceState(window.history.state, "", url);
    },
    [index],
  );

  const select = useCallback(
    (node: number) => {
      setFocus(node);
      setQuery("");
      setTrail((current) => {
        const at = current.indexOf(node);
        const next = at >= 0 ? current.slice(0, at + 1) : [...current, node];
        return next.slice(-TRAIL_LIMIT);
      });
      canvasRef.current?.flyTo(node);
      syncUrl(node, view);
    },
    [syncUrl, view],
  );

  // Initial selection: ?focus=, the route's handle, then you.
  const initialised = useRef(false);
  useEffect(() => {
    if (!index || initialised.current || me.status === "loading") return;
    initialised.current = true;
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view") as HereForView | null;
    if (requestedView && HERE_FOR_VIEWS.includes(requestedView)) {
      setView(requestedView);
    }
    const slug = params.get("focus") ?? initialFocus;
    const target = slug
      ? index.byHandle.get(`@${handleSlug(slug)}` as HereForHandle)
      : undefined;
    const start = target ?? you;
    if (start !== null && start !== undefined) {
      setFocus(start);
      setTrail(you !== null && start !== you ? [you, start] : [start]);
      if (canvasRef.current) canvasRef.current.flyTo(start);
      else initialFlight.current = start;
    }
  }, [index, me.status, you, initialFocus]);

  const changeView = (next: HereForView) => {
    setView(next);
    syncUrl(focus, next);
  };

  const path = useMemo(
    () =>
      index && you !== null && focus !== null && focus !== you
        ? shortestPath(index, you, focus)
        : [],
    [index, you, focus],
  );
  const near = useMemo(
    () =>
      index && you !== null && view === "network"
        ? neighbourhood(index, you, 2)
        : null,
    [index, you, view],
  );
  const results = useMemo(
    () => (index && query ? searchHandles(index, query) : []),
    [index, query],
  );

  const labels = useMemo<GraphLabel[]>(() => {
    if (!index) return [];
    const handles = index.payload.handles;
    const out = new Map<number, GraphLabel>();
    const add = (node: number, tone: GraphLabel["tone"], text?: string) => {
      if (!out.has(node))
        out.set(node, { node, tone, text: text ?? handles[node]! });
    };
    if (focus !== null) {
      add(focus, "focus");
      for (const n of [
        ...index.outs[focus]!,
        ...index.ins[focus]!.slice(0, 12),
      ]) {
        add(n, isMutual(index, focus, n) ? "mutual" : "plain");
      }
    }
    path.forEach((n) => add(n, "plain"));
    if (view === "most") {
      index.ranked.slice(0, MOST_ADDED_LABELS).forEach((n) => add(n, "plain"));
    }
    if (view === "communities") {
      index.payload.communities.slice(0, COMMUNITY_LABELS).forEach((c) => {
        const node = index.byHandle.get(c.label);
        if (node !== undefined) {
          add(node, "community", t("explorer.around", { handle: c.label }));
        }
      });
    }
    if (you !== null) {
      out.delete(you);
      out.set(you, { node: you, tone: "you", text: t("explorer.you") });
    }
    return [...out.values()];
  }, [index, focus, path, view, you, t]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(EGG_COUPON_CODE);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const stats = index
    ? [
        t("explorer.stats.people", {
          people: index.size.toLocaleString(locale),
        }),
        t("explorer.stats.adds", {
          adds: (index.payload.links.length / 2).toLocaleString(locale),
        }),
        t("explorer.stats.mutuals", {
          mutuals: index.mutualCount.toLocaleString(locale),
        }),
      ]
    : [];

  return (
    <section
      id="map"
      aria-labelledby="here-for-explorer-title"
      className="scroll-mt-20 bg-black pb-2xl pt-l md:pb-3xl md:pt-xl"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-s px-4 md:grid-cols-bp-desktop md:gap-x-s md:px-8">
        {/* Left rail: search, views, legend */}
        <div className="flex flex-col gap-m md:col-span-3">
          <div className="flex flex-col gap-3xs">
            <h2
              id="here-for-explorer-title"
              className="font-mono text-2xs uppercase tracking-[0.08em] text-core-purple"
            >
              {t("explorer.eyebrow")}
            </h2>
            <div className="flex min-h-[60px] flex-col font-mono text-2xs uppercase leading-5 tracking-[0.08em] text-text-secondary">
              {stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col gap-2xs">
            <label
              htmlFor="here-for-search"
              className="font-mono text-2xs uppercase tracking-[0.08em] text-text-secondary"
            >
              {t("explorer.searchLabel")}
            </label>
            <div className="flex h-11 items-center gap-3xs border border-stroke-primary bg-black px-2xs focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-core-purple">
              <span aria-hidden="true" className="font-mono text-neutral-500">
                @
              </span>
              <input
                id="here-for-search"
                type="search"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && results[0] !== undefined) {
                    select(results[0]);
                  }
                }}
                placeholder={t("explorer.searchPlaceholder")}
                className="h-full min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-neutral-500"
              />
            </div>
            {query && (
              <ul className="unstyled-list absolute inset-x-0 top-full z-20 border border-t-0 border-stroke-primary bg-black">
                {results.length === 0 ? (
                  <li className="px-2xs py-2xs text-2xs text-neutral-500">
                    {t("explorer.noResults")}
                  </li>
                ) : (
                  results.map((node) => (
                    <li key={node}>
                      <button
                        type="button"
                        onClick={() => select(node)}
                        className="flex h-10 w-full items-center justify-between border-b border-stroke-primary px-2xs text-left font-sans text-2xs normal-case tracking-normal hover:bg-neutral-800 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-core-purple"
                      >
                        <span>{index?.payload.handles[node]}</span>
                        <span className="font-mono text-3xs text-text-secondary">
                          {index?.payload.inDegree[node]}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <div>
            <p className="flex h-10 items-center justify-between border-y border-stroke-primary px-2xs font-mono text-2xs uppercase tracking-[0.08em] text-core-purple">
              {t("explorer.viewsLabel")}
            </p>
            <div role="group" aria-label={t("explorer.viewsLabel")}>
              {HERE_FOR_VIEWS.map((key, i) => {
                const selected = view === key;
                const disabled = key === "network" && you === null;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selected}
                    aria-disabled={disabled || undefined}
                    onClick={() => !disabled && changeView(key)}
                    className={`flex h-10 w-full items-center gap-s border-b border-stroke-primary px-2xs text-left font-mono text-button-small font-bold uppercase transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-core-purple aria-disabled:cursor-not-allowed aria-disabled:text-neutral-600 aria-disabled:hover:bg-transparent ${
                      selected
                        ? "bg-white text-black"
                        : "text-neutral-100 hover:bg-neutral-800"
                    }`}
                  >
                    <span className="w-m">0{i + 1}</span>
                    {t(`explorer.views.${key}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="unstyled-list hidden flex-col gap-2xs font-mono text-3xs uppercase tracking-[0.08em] text-text-secondary md:flex">
            <Legend swatch="h-[2px] bg-core-purple">
              {t("explorer.legend.out")}
            </Legend>
            <Legend swatch="h-px bg-white">{t("explorer.legend.in")}</Legend>
            <Legend swatch="h-[2px] bg-core-green">
              {t("explorer.legend.mutual")}
            </Legend>
            <Legend swatch="h-[2px] bg-core-yellow">
              {t("explorer.legend.path")}
            </Legend>
          </ul>

          <Button
            href={`${HERE_FOR_PATH}/find`}
            label={t("explorer.findMutuals")}
            variant="secondary"
            arrow
            className="hidden w-full whitespace-nowrap md:inline-flex"
          />
        </div>

        {/* Map */}
        <div className="flex flex-col gap-3xs md:col-span-9">
          <div
            role="region"
            aria-label={t("explorer.mapLabel")}
            className="relative h-[64vh] min-h-[420px] overflow-hidden border border-stroke-primary bg-black md:h-[756px]"
          >
            {index ? (
              <GraphCanvas
                onHandle={receiveCanvas}
                index={index}
                focus={focus}
                you={you}
                view={view}
                path={path}
                near={near}
                labels={labels}
                reducedMotion={reducedMotion}
                onSelect={select}
                onEgg={() => {
                  setCopied(false);
                  setEggOpen(true);
                }}
                onZoomChange={setZoom}
              />
            ) : (
              <p
                role="status"
                className="absolute inset-0 flex items-center justify-center px-m text-center font-mono text-2xs uppercase tracking-[0.08em] text-text-secondary"
              >
                {graph.status === "error"
                  ? t("explorer.error")
                  : t("explorer.loading")}
              </p>
            )}

            {index && (
              <div
                role="group"
                aria-label={t("explorer.zoomControls")}
                className="absolute right-2xs top-2xs z-10 flex flex-col border border-stroke-secondary bg-black md:right-xs md:top-xs"
              >
                <ZoomButton
                  label={t("explorer.zoomIn")}
                  onClick={() => canvasRef.current?.zoomIn()}
                >
                  +
                </ZoomButton>
                <span
                  aria-live="polite"
                  className="flex h-7 items-center justify-center border-b border-stroke-primary font-mono text-3xs text-text-secondary"
                >
                  {zoom}%
                </span>
                <ZoomButton
                  label={t("explorer.zoomOut")}
                  onClick={() => canvasRef.current?.zoomOut()}
                >
                  –
                </ZoomButton>
                <ZoomButton
                  label={t("explorer.fit")}
                  onClick={() => canvasRef.current?.fit()}
                >
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4" />
                  </svg>
                </ZoomButton>
                <ZoomButton
                  label={t("explorer.centreOnYou")}
                  disabled={you === null}
                  className="border-b-0 text-core-yellow"
                  onClick={() => you !== null && select(you)}
                >
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="5" y="5" width="6" height="6" />
                    <path d="M8 0v3M8 13v3M0 8h3M13 8h3" />
                  </svg>
                </ZoomButton>
              </div>
            )}

            {index && trail.length > 0 && (
              <nav
                aria-label={t("explorer.trail")}
                className="absolute bottom-2xs left-2xs right-14 z-10 flex flex-wrap items-center gap-3xs font-mono text-3xs uppercase tracking-[0.08em] md:bottom-xs md:left-xs"
              >
                <span className="text-neutral-500">{t("explorer.trail")}</span>
                {trail.map((node) => (
                  <button
                    key={node}
                    type="button"
                    onClick={() => select(node)}
                    aria-current={node === focus ? "location" : undefined}
                    className={`h-[26px] px-2 ${
                      node === focus
                        ? "bg-white text-black"
                        : "border border-stroke-secondary bg-black text-neutral-100 hover:border-white"
                    }`}
                  >
                    {node === you
                      ? t("explorer.you")
                      : index.payload.handles[node]}
                  </button>
                ))}
              </nav>
            )}
            {eggOpen && (
              <EggDialog
                copied={copied}
                onCopy={copyCode}
                onClose={() => setEggOpen(false)}
              />
            )}
          </div>
          {index && (
            <p className="hidden text-right font-mono text-3xs uppercase tracking-[0.08em] text-neutral-500 md:block">
              {t("explorer.hint")}
            </p>
          )}
        </div>

        {/* Panel */}
        <div className="md:col-span-4 md:h-[756px]">
          {index ? (
            <PersonPanel
              index={index}
              locale={locale}
              focus={focus}
              you={you}
              path={path}
              onSelect={select}
            />
          ) : (
            <div className="h-full min-h-[240px] border-t-[6px] border-core-purple bg-background-secondary" />
          )}
        </div>
      </div>
    </section>
  );
}

function Legend({
  swatch,
  children,
}: {
  swatch: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2xs">
      <span aria-hidden="true" className={`w-6 ${swatch}`} />
      {children}
    </li>
  );
}

function ZoomButton({
  label,
  onClick,
  disabled = false,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && onClick()}
      className={`flex size-11 items-center justify-center border-b border-stroke-primary font-mono text-xl font-bold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-core-purple aria-disabled:cursor-not-allowed aria-disabled:text-neutral-600 aria-disabled:hover:bg-transparent ${className}`}
    >
      {children}
    </button>
  );
}

function EggDialog({
  copied,
  onCopy,
  onClose,
}: {
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("breakpoint.hereFor");
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
  }, []);
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-s"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="here-for-egg-title"
        className="flex w-full max-w-[420px] flex-col gap-s border-t-[6px] border-core-pink bg-background-secondary p-m"
      >
        <p className="font-mono text-2xs uppercase tracking-[0.08em] text-core-pink">
          {t("egg.eyebrow")}
        </p>
        <h3 id="here-for-egg-title" className="type-h5">
          {t("egg.title")}
        </h3>
        <p className="text-paragraph text-text-secondary">
          {t("egg.description")}
        </p>
        <div className="flex h-14 items-center justify-between border border-core-pink pl-s">
          <span className="font-mono text-2xl font-bold tracking-[0.08em]">
            {EGG_COUPON_CODE}
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="h-full px-s font-mono text-button-small uppercase text-core-pink hover:bg-core-pink hover:text-black"
          >
            <span aria-live="polite">
              {copied ? t("egg.copied") : t("egg.copy")}
            </span>
          </button>
        </div>
        <div className="flex gap-2xs">
          <Button
            href={EGG_COUPON_HREF}
            label={t("egg.claim")}
            arrow
            target="_blank"
            className="flex-1"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="h-10 border border-white px-5 font-mono text-button uppercase hover:bg-neutral-700"
          >
            {t("egg.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
