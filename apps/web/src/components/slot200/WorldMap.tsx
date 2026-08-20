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

function viewBoxFor(zoom: number, mobile: boolean): string {
  const [bx, by, bw, bh] = mobile ? BASE_MOBILE : BASE_DESK;
  const f = Math.pow(1.45, zoom);
  const w = bw / f;
  const h = bh / f;
  const cx = zoom === 0 ? bx + bw / 2 : CENTROID[0];
  const cy = zoom === 0 ? by + bh / 2 : CENTROID[1];
  const x = Math.min(Math.max(cx - w / 2, bx), bx + bw - w);
  const y = Math.min(Math.max(cy - h / 2, by), by + bh - h);
  return `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
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
  const capRef = React.useRef<HTMLDivElement>(null);
  const nf = React.useMemo(() => new Intl.NumberFormat("en-US"), []);
  const [mobile, setMobile] = React.useState(false);
  const [zoom, setZoom] = React.useState(0);

  React.useEffect(() => {
    setMobile(window.matchMedia("(max-width: 700px)").matches);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return subscribe((ev) => {
      const leader = lookup(ev.slot);
      if (!leader) return;
      const cap = capRef.current;
      if (cap) {
        // structured DOM, not innerHTML: city and name are arbitrary strings
        cap.textContent = "";
        const b = document.createElement("b");
        b.textContent = `#${nf.format(ev.slot)}`;
        cap.append(t("capBlock") + " ", b);
        if (leader.city) {
          const c = document.createElement("b");
          c.textContent = leader.city;
          cap.append(`, ${t("capMadeIn")} `, c);
        }
        if (leader.name) {
          const n = document.createElement("b");
          n.textContent = leader.name;
          cap.append(` ${t("capBy")} `, n);
        }
      }
      const g = pulseGroup.current;
      if (!g || !leader.ll || reduced || document.hidden) return;
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
            onClick={() => setZoom((z) => Math.max(0, z - 1))}
          >
            −
          </button>
        </div>
        <svg
          viewBox={viewBoxFor(zoom, mobile)}
          preserveAspectRatio="xMidYMid meet"
          className="s2-map-svg"
          aria-label={t("ariaLabel")}
        >
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
          <g ref={pulseGroup} />
        </svg>
      </div>
      <div ref={capRef} className="s2-map-cap">
        {" "}
      </div>
      <p className="s2-note">{t("note")}</p>
    </Panel>
  );
});
