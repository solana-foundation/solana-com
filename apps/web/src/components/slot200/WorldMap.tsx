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
      <svg
        viewBox={mobile ? "70 65 840 290" : "0 50 1000 333"}
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
      <div ref={capRef} className="s2-map-cap">
        {" "}
      </div>
      <p className="s2-note">{t("note")}</p>
    </Panel>
  );
});
