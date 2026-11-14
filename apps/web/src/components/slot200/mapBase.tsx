import React from "react";
import worldLand from "@/data/slot200/world-land.json";
import validatorGeo from "@/data/slot200/validator-geo.json";
import type { LeaderEntry } from "./useLeaderSchedule";

// [lat, lon, validatorCount, stakePct] — bundled city-level snapshot of where
// staked validators physically run (gossip IPs)
export const VALIDATOR_LOCS = (
  validatorGeo as { locs: [number, number, number, number][] }
).locs;

/** Equirectangular projection onto a 1000 × 500 map. */
export function toXY(lat: number, lon: number): [number, number] {
  return [
    Math.round(((lon + 180) / 360) * 10000) / 10,
    Math.round(((90 - lat) / 180) * 5000) / 10,
  ];
}

// stake-weighted centroid — the network's mass, not mid-ocean
export const STAKE_CENTROID = (() => {
  let sx = 0;
  let sy = 0;
  let sw = 0;
  for (const l of VALIDATOR_LOCS) {
    const [x, y] = toXY(l[0], l[1]);
    const w = l[3] || 0.01;
    sx += x * w;
    sy += y * w;
    sw += w;
  }
  return [sx / sw, sy / sw] as const;
})();

/** Land outline plus the staked constellation, sized by stake. Never changes. */
export const MapBase = React.memo(function MapBase() {
  return (
    <>
      <path
        d={(worldLand as { d: string }).d}
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="0.6"
      />
      <g>
        {VALIDATOR_LOCS.map((l, i) => {
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
  );
});

/** "City · 1.2% stake" for the now-producing caption. */
export function leaderDetail(
  leader: LeaderEntry,
  stake: (_pct: number) => string,
): string {
  return [
    leader.city || null,
    leader.stakePct > 0 ? stake(leader.stakePct) : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
