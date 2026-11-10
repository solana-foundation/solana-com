"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "@workspace/i18n/client";
import {
  leaderDetail,
  MapBase,
  STAKE_CENTROID,
  toXY,
} from "@/components/slot200/mapBase";
import { useLeaderSchedule } from "@/components/slot200/useLeaderSchedule";
import { useSlotFeed } from "@/components/slot200/useSlotFeed";
import type { RpcPath } from "./directory-state";

const SVG_NS = "http://www.w3.org/2000/svg";
const PULSE = "#55E9AB";
// Crops the poles; every staked city sits between 66°N and 42°S
const VIEW = { x: 60, y: 66, w: 890, h: 300 } as const;
const VIEW_BOX = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`;

export type RpcMapLabels = {
  app: string;
  provider: string;
  fallback: string;
  official: string;
  otherApps: string;
  machine: string;
  localValidator: string;
  localCluster: string;
  mainnet: string;
};
type LabelKey = keyof RpcMapLabels;
type Point = [number, number];

// Cluster routes land on the stake-weighted centre of the constellation
const CLUSTER: Point = [STAKE_CENTROID[0], STAKE_CENTROID[1]];

/** Solana palette, as on the earlier patch bay. */
const TONES = {
  request: "#14F195",
  cluster: "#9945FF",
  shared: "#00D4FF",
  standby: "#6570ED",
} as const;

// Callouts sit over open ocean so they never hide the constellation
const CALLOUTS: Record<
  RpcPath,
  {
    nodes: { key: LabelKey; at: Point }[];
    routes: { from: Point; to: Point; tone: keyof typeof TONES }[];
    cluster: LabelKey;
    frame?: { at: Point; w: number; h: number };
  }
> = {
  local: {
    frame: { at: [470, 230], w: 380, h: 120 },
    nodes: [
      { key: "machine", at: [330, 186] },
      { key: "app", at: [370, 240] },
      { key: "localValidator", at: [580, 240] },
    ],
    routes: [{ from: [370, 240], to: [580, 240], tone: "request" }],
    cluster: "localCluster",
  },
  public: {
    nodes: [
      { key: "otherApps", at: [150, 235] },
      { key: "app", at: [150, 300] },
      { key: "official", at: [390, 275] },
    ],
    routes: [
      { from: [150, 235], to: [390, 275], tone: "shared" },
      { from: [150, 300], to: [390, 275], tone: "request" },
      { from: [390, 275], to: CLUSTER, tone: "cluster" },
    ],
    cluster: "mainnet",
  },
  production: {
    nodes: [
      { key: "app", at: [150, 270] },
      { key: "provider", at: [390, 240] },
      { key: "fallback", at: [390, 325] },
    ],
    routes: [
      { from: [150, 270], to: [390, 240], tone: "request" },
      { from: [390, 240], to: CLUSTER, tone: "cluster" },
      { from: [150, 270], to: [390, 325], tone: "standby" },
      { from: [390, 325], to: CLUSTER, tone: "standby" },
    ],
    cluster: "mainnet",
  },
};

const pct = (value: number, start: number, size: number) =>
  `${(((value - start) / size) * 100).toFixed(2)}%`;

function curve([ax, ay]: Point, [bx, by]: Point) {
  const mx = (ax + bx) / 2;
  const my = Math.max(ay, by) + Math.abs(bx - ax) * 0.12;
  return `M${ax} ${ay}Q${mx} ${my} ${bx} ${by}`;
}

const callout =
  "font-brand-mono text-[10px] uppercase tracking-wide text-[#E7DFD0]/80 xl:text-xs";

/**
 * The /200ms block map in the RPC hero: staked validators by city, with one
 * pulse per mainnet block from the producer's city. A local validator is its
 * own cluster, so that path dims the map and stops the pulses.
 */
export const RpcNetworkMap = memo(function RpcNetworkMap({
  path,
  note,
  localNote,
  labels,
}: {
  path: RpcPath;
  note: string;
  localNote: string;
  labels: RpcMapLabels;
}) {
  const t = useTranslations("slot200.map");
  const { subscribe } = useSlotFeed();
  const { lookup } = useLeaderSchedule();
  const pulses = useRef<SVGGElement>(null);
  const capName = useRef<HTMLElement>(null);
  const capSub = useRef<HTMLSpanElement>(null);
  const capSlot = useRef<HTMLSpanElement>(null);
  const local = path === "local";
  const scene = CALLOUTS[path];
  const localRef = useRef(local);
  localRef.current = local;
  const nf = useMemo(() => new Intl.NumberFormat("en-US"), []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopPulses = () => {
      if (motion.matches) pulses.current?.replaceChildren();
    };
    motion.addEventListener("change", stopPulses);
    // Estimated beats from the degraded feed aren't real blocks, so skip them
    const unsubscribe = subscribe((ev) => {
      if (!ev.measured || document.hidden || localRef.current) return;
      const leader = lookup(ev.slot);
      if (!leader) return;
      // textContent only: validator names are arbitrary on-chain strings
      if (capName.current)
        capName.current.textContent = leader.name || leader.id;
      if (capSub.current)
        capSub.current.textContent = leaderDetail(leader, (pct) =>
          t("capStake", { pct }),
        );
      if (capSlot.current)
        capSlot.current.textContent = `#${nf.format(ev.slot)}`;
      const g = pulses.current;
      if (!g || !leader.ll || motion.matches) return;
      const [x, y] = toXY(leader.ll[0], leader.ll[1]);
      const ring = document.createElementNS(SVG_NS, "circle");
      ring.setAttribute("cx", String(x));
      ring.setAttribute("cy", String(y));
      ring.setAttribute("r", "3");
      ring.setAttribute("fill", PULSE);
      ring.setAttribute("stroke", PULSE);
      ring.setAttribute("stroke-width", "1.6");
      ring.setAttribute("vector-effect", "non-scaling-stroke");
      ring.style.transformBox = "fill-box";
      ring.style.transformOrigin = "center";
      g.appendChild(ring);
      ring
        .animate(
          [
            { transform: "scale(0.8)", fillOpacity: 0.6, strokeOpacity: 1 },
            {
              transform: "scale(2.2)",
              fillOpacity: 0.22,
              strokeOpacity: 1,
              offset: 0.18,
            },
            { transform: "scale(9)", fillOpacity: 0, strokeOpacity: 0 },
          ],
          { duration: 1250, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
        )
        .finished.catch(() => {})
        .finally(() => ring.remove());
      while (g.childNodes.length > 24) g.firstChild?.remove();
    });
    return () => {
      motion.removeEventListener("change", stopPulses);
      unsubscribe();
    };
  }, [subscribe, lookup, nf, t]);

  return (
    <figure>
      <div className="relative">
        <svg
          viewBox={VIEW_BOX}
          preserveAspectRatio="xMidYMid meet"
          className="block aspect-[89/30] w-full"
          role="img"
          aria-label={t("ariaLabel")}
        >
          <g
            className={`transition-opacity duration-500 motion-reduce:transition-none ${local ? "opacity-30" : "opacity-100"}`}
          >
            <MapBase />
            <g ref={pulses} />
          </g>
          <g fill="none" className="hidden md:inline">
            {scene.frame && (
              <rect
                x={scene.frame.at[0] - scene.frame.w / 2}
                y={scene.frame.at[1] - scene.frame.h / 2}
                width={scene.frame.w}
                height={scene.frame.h}
                stroke="rgba(231,223,208,0.35)"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {scene.routes.map((route) => (
              <path
                key={`${path}-${route.from}-${route.to}`}
                d={curve(route.from, route.to)}
                stroke={TONES[route.tone]}
                strokeWidth="1.5"
                strokeOpacity="0.85"
                strokeDasharray={route.tone === "standby" ? "5 5" : undefined}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {!local && (
              <circle
                cx={CLUSTER[0]}
                cy={CLUSTER[1]}
                r="9"
                stroke={TONES.cluster}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        </svg>
        <div className="absolute inset-0 hidden md:block" aria-hidden="true">
          {scene.nodes.map(({ key, at }) => (
            <span
              key={`${path}-${key}`}
              className={`${callout} absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${key === "machine" ? "" : "border border-[#E7DFD0]/30 bg-nd-bg px-2 py-1"}`}
              style={{
                left: pct(at[0], VIEW.x, VIEW.w),
                top: pct(at[1], VIEW.y, VIEW.h),
              }}
            >
              {labels[key]}
            </span>
          ))}
          <span
            className={`${callout} absolute -translate-x-1/2 whitespace-nowrap`}
            style={
              local
                ? {
                    left: pct(580, VIEW.x, VIEW.w),
                    top: pct(262, VIEW.y, VIEW.h),
                  }
                : {
                    left: pct(CLUSTER[0], VIEW.x, VIEW.w),
                    top: pct(CLUSTER[1] - 34, VIEW.y, VIEW.h),
                  }
            }
          >
            {labels[scene.cluster]}
          </span>
        </div>
      </div>
      <div
        className={`${callout} mt-3 flex justify-between md:hidden`}
        aria-hidden="true"
      >
        <span>{labels.app}</span>
        <span>
          {
            labels[
              local
                ? "localValidator"
                : path === "public"
                  ? "official"
                  : "provider"
            ]
          }
        </span>
        <span>{labels[scene.cluster]}</span>
      </div>
      <figcaption className="mt-5 grid gap-3 border-t border-nd-border-light pt-4 text-sm text-nd-mid-em-text md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
        <p aria-live="polite">{local ? localNote : note}</p>
        <p
          className={`flex min-w-0 items-center gap-2 md:justify-end ${local ? "invisible" : ""}`}
          aria-hidden={local}
        >
          <span
            className="size-2 shrink-0 rounded-full bg-nd-highlight-green"
            aria-hidden="true"
          />
          <span>{t("capNow")}</span>
          <b className="min-w-0 truncate font-medium text-white" ref={capName}>
            —
          </b>
          <span className="hidden min-w-0 truncate sm:inline" ref={capSub} />
          <span
            className="ml-auto shrink-0 tabular-nums md:ml-0"
            dir="ltr"
            ref={capSlot}
          />
        </p>
      </figcaption>
    </figure>
  );
});
