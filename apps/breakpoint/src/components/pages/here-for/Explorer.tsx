"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import { RefreshCw } from "@boxicons/react/RefreshCw";
import Button from "@/components/Button";
import { localizedRoutePath } from "@/config";
import type { HereForHandle } from "@/lib/here-for/types";
import type { GraphCanvasHandle, GraphLabel } from "./GraphCanvas";
import {
  HERE_FOR_VIEWS,
  isMutual,
  neighbourhood,
  type GraphIndex,
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
  useMediaQuery,
  usePrefersReducedMotion,
} from "./client";
import JoinCard from "./JoinCard";
import PersonPanel from "./PersonPanel";
import { hereForType } from "./typography";

const GraphCanvas = dynamic(() => import("./GraphCanvas"), { ssr: false });

const TRAIL_LIMIT = 6;
const MOST_ADDED_LABELS = 10;
const COMMUNITY_LABELS = 10;
// A map this small names its most-added people even with nothing selected.
const SMALL_MAP = 40;
const SMALL_MAP_LABELS = 12;
// Half the join card's width plus its margin, so the map centres in the open
// space beside it on wider screens.
const JOIN_CARD_SHIFT = 244;
const STAT_SLOT = "\u0000";

type ExplorerProps = {
  locale: string;
  initialFocus?: string;
};

export default function Explorer({ locale, initialFocus }: ExplorerProps) {
  const t = useTranslations("breakpoint.hereFor");
  const [me] = useMe();
  const { graph, refreshing, refresh } = useGraphIndex(
    me.status === "ready" ? me.data : null,
  );
  const reducedMotion = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const canvasRef = useRef<GraphCanvasHandle>(null);
  const initialFlight = useRef<number | null>(null);
  const receiveCanvas = useCallback((handle: GraphCanvasHandle | null) => {
    canvasRef.current = handle;
    if (handle && initialFlight.current !== null) {
      handle.flyTo(initialFlight.current);
      initialFlight.current = null;
    }
  }, []);

  const [selectedNode, setFocus] = useState<number | null>(null);
  const [view, setView] = useState<HereForView>("all");
  const [selectedTrail, setTrail] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState(100);
  const [eggOpen, setEggOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const index = graph.status === "ready" ? graph.data : null;
  // Node ids are positions in the payload, so a refreshed graph can renumber
  // everyone. Carry the selection over by handle before anything renders it.
  const [selectionIndex, setSelectionIndex] = useState<GraphIndex | null>(null);
  const [reselect, setReselect] = useState(false);
  const carry = (node: number) => {
    const handle = selectionIndex?.payload.handles[node];
    return handle ? index?.byHandle.get(handle) : undefined;
  };
  const changed = index !== selectionIndex;
  const focus = changed
    ? selectedNode === null
      ? null
      : (carry(selectedNode) ?? null)
    : selectedNode;
  const trail = changed
    ? selectedTrail.map(carry).filter((node) => node !== undefined)
    : selectedTrail;
  if (index !== selectionIndex) {
    setSelectionIndex(index);
    setFocus(focus);
    setTrail(trail);
    setReselect(Boolean(selectionIndex && index));
  }

  const meData = me.status === "ready" ? me.data : null;
  // The full explorer is for people with a 3 on the map (or once adds close).
  // Everyone else gets the map and one next step over it.
  const member = Boolean(
    meData && (meData.adds.length > 0 || meData.status === "closed"),
  );
  const youHandle = meData?.handle ?? null;
  const you = useMemo(
    () => (index && youHandle ? (index.byHandle.get(youHandle) ?? null) : null),
    [index, youHandle],
  );
  // The canvas rebuilds its scene for a new graph; point it back at the focus.
  useEffect(() => {
    if (!reselect) return;
    setReselect(false);
    if (focus !== null) canvasRef.current?.flyTo(focus);
  }, [reselect, focus]);

  const syncUrl = useCallback(
    (node: number | null, nextView: HereForView) => {
      if (!index) return;
      const url = new URL(window.location.href);
      url.pathname = localizedRoutePath(locale, HERE_FOR_PATH);
      url.searchParams.delete("with");
      url.searchParams.delete("card");
      if (node === null) url.searchParams.delete("focus");
      else
        url.searchParams.set("focus", handleSlug(index.payload.handles[node]!));
      if (nextView === "all") url.searchParams.delete("view");
      else url.searchParams.set("view", nextView);
      window.history.replaceState(window.history.state, "", url);
    },
    [index, locale],
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
    if (index.size <= SMALL_MAP) {
      index.ranked.slice(0, SMALL_MAP_LABELS).forEach((n) => add(n, "plain"));
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
    ? ([
        ["people", index.size],
        ["adds", index.payload.links.length / 2],
        ["mutuals", index.mutualCount],
      ] as const)
    : [];

  return (
    <section
      id="map"
      aria-labelledby="here-for-explorer-title"
      className="scroll-mt-20 bg-black pb-2xl pt-[96px] md:pb-3xl md:pt-[112px]"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-s px-4 md:grid-cols-bp-desktop md:gap-x-s md:px-8">
        {member && <h1 className="sr-only">{t("join.title")}</h1>}
        {/* Left rail: search, views, legend */}
        <div
          className={member ? "flex flex-col gap-m md:col-span-3" : "hidden"}
        >
          <div className="flex flex-col gap-3xs">
            <h2
              id="here-for-explorer-title"
              className={`${hereForType.eyebrow} text-core-purple`}
            >
              {t("explorer.eyebrow")}
            </h2>
            <ul
              className={`unstyled-list mt-2xs flex min-h-[96px] flex-col gap-3xs ${hereForType.caption} text-text-secondary`}
            >
              {stats.map(([key, value]) => {
                // Split the message around the number so it can be styled
                // apart from its unit, wherever the locale puts it.
                const [before, after] = t(`explorer.stats.${key}`, {
                  [key]: STAT_SLOT,
                }).split(STAT_SLOT);
                return (
                  <li key={key} className="flex items-baseline gap-3xs">
                    {before}
                    <span className={`${hereForType.stat} text-white`}>
                      {value.toLocaleString(locale)}
                    </span>
                    {after}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative flex flex-col gap-2xs">
            <label
              htmlFor="here-for-search"
              className={`${hereForType.label} text-text-secondary`}
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
                className={`h-full w-0 min-w-0 flex-1 bg-transparent ${hereForType.input} text-white outline-none placeholder:text-neutral-500`}
              />
            </div>
            {query && (
              <ul className="unstyled-list absolute inset-x-0 top-full z-20 border border-t-0 border-stroke-primary bg-black">
                {results.length === 0 ? (
                  <li
                    className={`px-2xs py-2xs ${hereForType.small} text-text-secondary`}
                  >
                    {t("explorer.noResults")}
                  </li>
                ) : (
                  results.map((node) => (
                    <li key={node}>
                      <button
                        type="button"
                        onClick={() => select(node)}
                        className={`flex h-10 w-full items-center justify-between border-b border-stroke-primary px-2xs text-left ${hereForType.nameCompact} hover:bg-neutral-800 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-core-purple`}
                      >
                        <span>{index?.payload.handles[node]}</span>
                        <span
                          className={`${hereForType.caption} text-text-secondary`}
                        >
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
            <p
              className={`flex h-10 items-center justify-between border-y border-stroke-primary px-2xs ${hereForType.label} text-text-secondary`}
            >
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
                    className={`flex h-10 w-full items-center gap-s border-b border-stroke-primary px-2xs text-left ${hereForType.control} transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-core-purple aria-disabled:cursor-not-allowed aria-disabled:text-neutral-600 aria-disabled:hover:bg-transparent ${
                      selected
                        ? "bg-white text-black"
                        : "text-white hover:bg-neutral-800"
                    }`}
                  >
                    <span className="w-m">0{i + 1}</span>
                    {t(`explorer.views.${key}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <ul
            className={`unstyled-list hidden flex-col gap-2xs ${hereForType.caption} text-text-secondary md:flex`}
          >
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
        <div
          className={`relative flex flex-col gap-3xs ${member ? "md:col-span-9" : "md:col-span-16"}`}
        >
          <div
            role="region"
            aria-label={t("explorer.mapLabel")}
            className={`relative overflow-hidden border border-stroke-primary bg-black ${
              member
                ? "h-[64vh] min-h-[420px] md:h-[756px]"
                : "h-[52svh] min-h-[360px] md:h-[calc(100svh-136px)] md:min-h-[600px] md:max-h-[880px]"
            }`}
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
                shiftX={!member && wide ? JOIN_CARD_SHIFT : 0}
              />
            ) : (
              <p
                role="status"
                className={`absolute inset-0 flex items-center justify-center px-m text-center ${hereForType.label} text-text-secondary`}
              >
                {graph.status === "error"
                  ? t("explorer.error")
                  : t("explorer.loading")}
              </p>
            )}

            {index && member && (
              <div className="absolute left-2xs top-2xs z-10 flex border border-stroke-secondary bg-black md:left-xs md:top-xs">
                <button
                  type="button"
                  aria-label={t("explorer.refresh")}
                  title={t("explorer.refresh")}
                  aria-busy={refreshing || undefined}
                  aria-disabled={refreshing || undefined}
                  onClick={() => !refreshing && refresh()}
                  className="flex size-5 items-center justify-center text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-core-purple aria-disabled:cursor-wait"
                >
                  <RefreshCw
                    aria-hidden="true"
                    pack="basic"
                    className={`size-3 ${refreshing ? "animate-spin motion-reduce:animate-none" : ""}`}
                  />
                </button>
              </div>
            )}

            {index && member && (
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
                  className={`flex h-7 items-center justify-center border-b border-stroke-primary ${hereForType.caption} text-text-secondary`}
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

            {index && member && trail.length > 0 && (
              <nav
                aria-label={t("explorer.trail")}
                className={`absolute bottom-2xs left-2xs right-14 z-10 flex flex-wrap items-center gap-3xs ${hereForType.caption} md:bottom-xs md:left-xs`}
              >
                <span className="text-text-secondary">
                  {t("explorer.trail")}
                </span>
                {trail.map((node) => (
                  <button
                    key={node}
                    type="button"
                    onClick={() => select(node)}
                    aria-current={node === focus ? "location" : undefined}
                    className={`h-[26px] px-2 ${hereForType.nameCompact} ${
                      node === focus
                        ? "bg-white text-black"
                        : "border border-stroke-secondary bg-black text-white hover:border-white"
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
          {/* Phones stack the card under the map; wider screens float it over. */}
          {!member && me.status !== "loading" && (
            <div className="relative z-20 -mt-m mx-2xs md:absolute md:bottom-s md:left-s md:mx-0 md:mt-0 md:w-[460px]">
              <JoinCard
                locale={locale}
                me={meData}
                index={index}
                focus={focus}
              />
            </div>
          )}
          {index && member && (
            <p
              className={`hidden text-right ${hereForType.caption} text-text-secondary md:block`}
            >
              {t("explorer.hint")}
            </p>
          )}
        </div>

        {/* Panel */}
        <div className={member ? "md:col-span-4 md:h-[756px]" : "hidden"}>
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
        <p className={`${hereForType.label} text-core-pink`}>
          {t("egg.eyebrow")}
        </p>
        <h3 id="here-for-egg-title" className="type-h5">
          {t("egg.title")}
        </h3>
        <p className={`${hereForType.body} text-text-secondary`}>
          {t("egg.description")}
        </p>
        <div className="flex h-14 items-center justify-between border border-core-pink pl-s">
          <span className={`${hereForType.code}`}>{EGG_COUPON_CODE}</span>
          <button
            type="button"
            onClick={onCopy}
            className={`h-full px-s ${hereForType.control} text-core-pink hover:bg-core-pink hover:text-black`}
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
            className="type-button h-10 border border-white px-5 hover:bg-neutral-700"
          >
            {t("egg.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
