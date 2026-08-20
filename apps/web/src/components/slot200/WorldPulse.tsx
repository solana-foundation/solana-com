"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Container } from "@/component-library/container";
import worldLand from "@/data/slot200/world-land.json";
import validatorGeo from "@/data/slot200/validator-geo.json";
import type { SlotClock } from "./useSlotClock";

interface WorldPulseProps {
  live: SlotClock | null;
}

// [lat, lon, validatorCount, stakePct] — a bundled snapshot of where staked
// validators physically run (gossip IPs, city level).
const LOCS = (validatorGeo as { locs: [number, number, number, number][] })
  .locs;

function toXY(lat: number, lon: number): [number, number] {
  return [
    Math.round(((lon + 180) / 360) * 10000) / 10,
    Math.round(((90 - lat) / 180) * 5000) / 10,
  ];
}

/** Stake-weighted random pick, so pulses land where blocks actually come from. */
function pickWeighted(): [number, number, number, number] {
  const total = LOCS.reduce((a, l) => a + (l[3] || 0.01), 0);
  let r = Math.random() * total;
  for (const l of LOCS) {
    r -= l[3] || 0.01;
    if (r <= 0) return l;
  }
  return LOCS[0];
}

/**
 * Adapted from perp200's "Every block, on the map": the staked constellation
 * with one pulse per block. Pulses are paced to the measured slot time;
 * which city fires is stake-weighted for illustration.
 */
export const WorldPulse: React.FC<WorldPulseProps> = ({ live }) => {
  const t = useTranslations("slot200.map");
  const pulseGroup = useRef<SVGGElement>(null);
  const periodRef = useRef(400);
  periodRef.current = live?.avgSlotMs ?? 400;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const svgNS = "http://www.w3.org/2000/svg";
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;

    function fire() {
      if (!alive) return;
      const g = pulseGroup.current;
      if (g && !document.hidden) {
        const loc = pickWeighted();
        const [x, y] = toXY(loc[0], loc[1]);
        const p = document.createElementNS(svgNS, "circle");
        p.setAttribute("cx", String(x));
        p.setAttribute("cy", String(y));
        p.setAttribute("r", "2");
        p.setAttribute("class", "s2-ping");
        g.appendChild(p);
        setTimeout(() => p.parentNode?.removeChild(p), 1200);
        while (g.childNodes.length > 24) g.removeChild(g.firstChild!);
      }
      timer = setTimeout(fire, periodRef.current);
    }
    fire();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <section aria-labelledby="map-title">
      <Container className="py-14 md:py-20">
        <h2 id="map-title" className="nd-heading-l max-w-[760px]">
          {t.rich("title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
          })}
        </h2>
        <p className="nd-body-l text-nd-mid-em-text mt-4 max-w-[680px]">
          {t("subtitle")}
        </p>

        <div className="mt-10 md:mt-12">
          <svg
            viewBox="0 50 1000 333"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto block"
            aria-label={t("ariaLabel")}
          >
            <path
              d={(worldLand as { d: string }).d}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.14)"
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
                    fill="rgba(20,241,149,0.28)"
                  />
                );
              })}
            </g>
            <g ref={pulseGroup} />
          </svg>
        </div>

        <p className="nd-body-s text-nd-mid-em-text mt-6 max-w-[760px]">
          {t("footnote")}
        </p>
      </Container>
    </section>
  );
};
