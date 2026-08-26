"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import worldLand from "@/data/slot200/world-land.json";
import validatorGeo from "@/data/slot200/validator-geo.json";
import { Panel } from "./Panel";
import type { LeaderEntry } from "./useLeaderSchedule";
import type { SlotEvent } from "./useSlotFeed";

// [lat, lon, validatorCount, stakePct] — bundled city-level snapshot of where
// staked validators physically run (gossip IPs)
const LOCS = (validatorGeo as { locs: [number, number, number, number][] })
  .locs;

const SVG_NS = "http://www.w3.org/2000/svg";

function toXY(lat: number, lon: number): [number, number] {
  return [
    Math.round(((lon + 180) / 360) * 10000) / 10,
    Math.round(((90 - lat) / 180) * 5000) / 10,
  ];
}

interface WorldMapProps {
  subscribe: (_fn: (_ev: SlotEvent) => void) => () => void;
  lookup: (_slot: number) => LeaderEntry | null;
}

const BASE_DESK = [0, 50, 1000, 333] as const;
const BASE_MOBILE = [70, 65, 840, 290] as const;
const MAX_ZOOM = 5;

// stake-weighted centroid — zoom dives into the network's mass, not mid-ocean
const CENTROID = (() => {
  let sx = 0;
  let sy = 0;
  let sw = 0;
  for (const l of LOCS) {
    const [x, y] = toXY(l[0], l[1]);
    const w = l[3] || 0.01;
    sx += x * w;
    sy += y * w;
    sw += w;
  }
  return [sx / sw, sy / sw] as const;
})();

function viewRect(
  zoom: number,
  mobile: boolean,
  center: [number, number] | null,
): [number, number, number, number] {
  const [bx, by, bw, bh] = mobile ? BASE_MOBILE : BASE_DESK;
  const f = Math.pow(1.45, zoom);
  const w = bw / f;
  const h = bh / f;
  const [cx, cy] =
    center ?? (zoom === 0 ? [bx + bw / 2, by + bh / 2] : CENTROID);
  const x = Math.min(Math.max(cx - w / 2, bx), bx + bw - w);
  const y = Math.min(Math.max(cy - h / 2, by), by + bh - h);
  return [x, y, w, h];
}

/**
 * Every block, on the map: the staked constellation, with one pulse per
 * block fired from the producing validator's city (live leader schedule +
 * committed gossip-IP geo snapshot). Ported from the perp200 dashboard.
 */
export const WorldMap: React.FC<WorldMapProps> = React.memo(function WorldMap({
  subscribe,
  lookup,
}) {
  const t = useTranslations("slot200.map");
  const pulseGroup = React.useRef<SVGGElement>(null);
  const capName = React.useRef<HTMLElement>(null);
  const capSub = React.useRef<HTMLSpanElement>(null);
  const capSlot = React.useRef<HTMLSpanElement>(null);
  const nextName = React.useRef<HTMLElement>(null);
  const nextSub = React.useRef<HTMLSpanElement>(null);
  const nextFill = React.useRef<HTMLDivElement>(null);
  const nextEta = React.useRef<HTMLSpanElement>(null);
  // rough per-slot pace for the next-leader ETA, smoothed locally
  const emaMs = React.useRef(400);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const nf = React.useMemo(() => new Intl.NumberFormat("en-US"), []);
  const [mobile, setMobile] = React.useState(false);
  const [zoom, setZoom] = React.useState(0);
  // pan target while zoomed; null = default framing (world / stake centroid)
  const [center, setCenter] = React.useState<[number, number] | null>(null);
  const [panning, setPanning] = React.useState(false);
  const drag = React.useRef<{
    px: number;
    py: number;
    cx: number;
    cy: number;
  } | null>(null);

  const [vx, vy, vw, vh] = viewRect(zoom, mobile, center);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (zoom === 0) return;
    svgRef.current?.setPointerCapture(e.pointerId);
    drag.current = {
      px: e.clientX,
      py: e.clientY,
      cx: vx + vw / 2,
      cy: vy + vh / 2,
    };
    setPanning(true);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    const svg = svgRef.current;
    if (!d || !svg) return;
    const scale = vw / svg.clientWidth;
    setCenter([
      d.cx - (e.clientX - d.px) * scale,
      d.cy - (e.clientY - d.py) * scale,
    ]);
  };
  const endPan = () => {
    drag.current = null;
    setPanning(false);
  };

  // land + constellation never change — keep them out of the per-move render
  const staticLayers = React.useMemo(
    () => (
      <>
        <path
          d={(worldLand as { d: string }).d}
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.13)"
          strokeWidth="0.6"
        />
        <g>
          {LOCS.map((l, i) => {
            const [x, y] = toXY(l[0], l[1]);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={Math.min(7, 1 + 1.6 * Math.sqrt(l[3] || 0)).toFixed(1)}
                fill="rgba(148,163,184,0.28)"
              />
            );
          })}
        </g>
      </>
    ),
    [],
  );

  React.useEffect(() => {
    setMobile(window.matchMedia("(max-width: 700px)").matches);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return subscribe((ev) => {
      if (ev.dt !== null) emaMs.current = emaMs.current * 0.8 + ev.dt * 0.2;
      if (document.hidden) return;
      const leader = lookup(ev.slot);
      if (!leader) return;
      // "now producing" caption — textContent only: names are arbitrary
      if (capName.current)
        capName.current.textContent = leader.name || leader.id;
      if (capSub.current)
        capSub.current.textContent = [
          leader.city || null,
          leader.stakePct > 0 ? t("capStake", { pct: leader.stakePct }) : null,
        ]
          .filter(Boolean)
          .join(" · ");
      if (capSlot.current)
        capSlot.current.textContent = `#${nf.format(ev.slot)}`;
      // next leader: first upcoming slot with a different producer
      let next: LeaderEntry | null = null;
      let toGo = 0;
      for (let s = ev.slot + 1; s <= ev.slot + 40; s++) {
        const e = lookup(s);
        if (!e) break;
        if (e.id !== leader.id) {
          next = e;
          toGo = s - ev.slot;
          break;
        }
      }
      if (next && toGo > 0) {
        let into = 1;
        while (into < 8) {
          const e = lookup(ev.slot - into);
          if (!e || e.id !== leader.id) break;
          into++;
        }
        if (nextName.current)
          nextName.current.textContent = next.name || next.id;
        if (nextSub.current) nextSub.current.textContent = next.city;
        if (nextFill.current)
          nextFill.current.style.width = `${Math.round((into / (into + toGo - 1)) * 100)}%`;
        if (nextEta.current)
          nextEta.current.textContent = t("nextIn", {
            n: toGo,
            s: ((toGo * emaMs.current) / 1000).toFixed(1),
          });
      }
      const g = pulseGroup.current;
      if (!g || !leader.ll || reduced) return;
      const [x, y] = toXY(leader.ll[0], leader.ll[1]);
      const p = document.createElementNS(SVG_NS, "circle");
      p.setAttribute("cx", String(x));
      p.setAttribute("cy", String(y));
      p.setAttribute("r", "2");
      p.setAttribute("class", "s2-ping");
      g.appendChild(p);
      setTimeout(() => p.parentNode?.removeChild(p), 1200);
      while (g.childNodes.length > 24) g.removeChild(g.firstChild!);
    });
  }, [subscribe, lookup, nf, t]);

  return (
    <Panel title={t("title")} live className="s2-map-panel">
      <div className="s2-map-stage">
        <div className="s2-map-zoom" role="group" aria-label={t("zoomLabel")}>
          <button
            type="button"
            aria-label={t("zoomIn")}
            disabled={zoom >= MAX_ZOOM}
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 1))}
          >
            +
          </button>
          <button
            type="button"
            aria-label={t("zoomOut")}
            disabled={zoom <= 0}
            onClick={() =>
              setZoom((z) => {
                const next = Math.max(0, z - 1);
                if (next === 0) setCenter(null);
                return next;
              })
            }
          >
            −
          </button>
        </div>
        <svg
          ref={svgRef}
          viewBox={`${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`}
          preserveAspectRatio="xMidYMid meet"
          className={`s2-map-svg ${zoom > 0 ? "is-pannable" : ""} ${panning ? "is-panning" : ""}`}
          aria-label={t("ariaLabel")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPan}
          onPointerCancel={endPan}
        >
          {staticLayers}
          <g ref={pulseGroup} />
        </svg>
      </div>
      <div className="s2-map-cap">
        <span className="s2-cap-tag is-now" aria-hidden>
          {t("capNow")}
        </span>
        <b className="s2-cap-name" ref={capName}>
          —
        </b>
        <span className="s2-cap-sub" ref={capSub} />
        <span className="s2-cap-slot" ref={capSlot} />
      </div>
      <div className="s2-map-next">
        <span className="s2-cap-tag" aria-hidden>
          {t("nextLabel")}
        </span>
        <b className="s2-cap-name" ref={nextName}>
          —
        </b>
        <span className="s2-cap-sub" ref={nextSub} />
        <div className="s2-next-bar" aria-hidden>
          <div className="s2-next-fill" ref={nextFill} />
        </div>
        <span className="s2-next-eta" ref={nextEta} />
      </div>
      <p className="s2-note">{t("note")}</p>
    </Panel>
  );
});
