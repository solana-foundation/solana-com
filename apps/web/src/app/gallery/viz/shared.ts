/**
 * The vocabulary every visualisation draws from.
 *
 * The agent and endpoint names, and the shape of a record, are the same ones
 * the corridor uses — a payment here means what it means there. Colour is the
 * motif system's ramp flattened to hex: the real thing is `tone(look, t)` in
 * OKLCH from `@/lib/motif`, which these sketches approximate so they stay
 * dependency-free and cheap to run a dozen at a time.
 */

/* A fixed seed, so a card looks the same every reload. A gallery whose
   thumbnails reshuffle on every visit is impossible to navigate by memory. */
export function makeRandom(seed = 20260826) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function makeHash(rnd: () => number) {
  return (n: number) => {
    let out = "";
    for (let i = 0; i < n; i++) out += B58[(rnd() * 58) | 0];
    return out;
  };
}

export const AGENTS = [
  "FETCH-7F",
  "ROUTER-14C",
  "OPS-3A",
  "VISION-9D",
  "SCHED-2E",
  "INDEX-11B",
  "AUDIT-5C",
  "EDGE-8A",
  "CRAWL-6F",
  "PLAN-12D",
  "RELAY-1B",
  "SENSE-4E",
  "INFER-22A",
  "TALLY-9C",
];

export const ENDPOINTS = [
  "NOAA.API",
  "TILES.OSM",
  "INFER.Q4",
  "STORE.PX",
  "RPC.NODE",
  "OCR.BATCH",
  "VEC.SEARCH",
  "TTS.STREAM",
  "GEO.REV",
  "FEED.PX",
  "SIGN.HSM",
  "CACHE.W3",
  "EMBED.V2",
  "ROUTE.OPT",
];

/** the nine LOOKS, figure tones only — enough for marks on a black ground */
export const LOOKS = [
  "#D9C2F5",
  "#E8B8C8",
  "#B8DCE8",
  "#A8B8E8",
  "#C8E8B8",
  "#CFCFD8",
];

/** the one accent, spent on a small share of marks and nothing else */
export const HOT = "#FF9F45";
export const BONE = "#E9E4D8";

/**
 * The brand ramp, taken from the corridor's own `cellFillA` / `cellFillB` in
 * `src/lib/slab.ts` rather than invented here.
 *
 * These two are also what the aberrated pieces fringe with: a white core with
 * a purple copy to one side and a green copy to the other reads as chromatic
 * aberration *and* as the brand gradient at the same time, which is why those
 * pieces never need a third colour.
 */
export const SOL_PURPLE = "139,97,255";
export const SOL_GREEN = "10,255,104";
export const SOL_LILAC = "213,179,255";

export const MONO =
  '"Martian Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

/**
 * One radial-gradient sprite, scaled per mark.
 *
 * This is how every out-of-focus dot in the gallery is drawn. A canvas blur
 * filter would cost a full readback each frame and an `arc()` per dot costs a
 * path; one cached sprite drawn with `drawImage` costs neither, and composited
 * with `lighter` it accumulates where marks overlap, which is the whole reason
 * the dense pieces read as luminous rather than grey.
 */
let sprite: HTMLCanvasElement | null = null;
export function bokeh(): HTMLCanvasElement {
  if (sprite) return sprite;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, "rgba(255,255,255,0.95)");
  rg.addColorStop(0.45, "rgba(255,255,255,0.55)");
  rg.addColorStop(0.82, "rgba(255,255,255,0.12)");
  rg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = rg;
  g.fillRect(0, 0, 64, 64);
  sprite = c;
  return c;
}

/** depth of field, as one Gaussian. f is 1 at the focal plane, 0 far from it. */
export const focus = (z: number, focalZ: number, band: number) =>
  Math.exp(-Math.pow((z - focalZ) / band, 2));

export const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;
