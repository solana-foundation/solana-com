/**
 * The corridor — an independent copy of the hero renderer, choreographed.
 *
 * This is the same tunnel the slab route draws, forked so its timing can be
 * driven by hand without disturbing that route. Two parameters do the work:
 * `steady` locks the camera so the vanishing point sits exactly at the centre
 * of the screen, and `formZ` is the depth the tunnel has been built to, which
 * lets it be drilled from the front to its end.
 *
 * The 400ms Slab — hero renderer.
 *
 * A camera falls down a grid corridor of 400ms slots. Every payment is a plate
 * carrying a transaction hash; the hash decodes as the plate becomes legible.
 * The label box is derived from the type spec: 12px hash on a 12px line,
 * 4px vertical / 6px horizontal padding, 1px letterspacing.
 */

import { PLATE_RECIPES, LOOKS, recipeToCanvas, tone } from "@/lib/motif";

export type Facing = "camera" | "walls" | "floor";
export type CameraMode = "fall" | "section" | "hold";

export interface SlabParams {
  camera: CameraMode;
  /** the depth the corridor has been built to, in slots; SPAN is the whole run */
  formZ: number;
  /** how ragged the building front is: 0 sweeps flat, 1 knits together */
  formJitter: number;
  /** the depth the corridor stops at — the exit at the end of it */
  endZ: number;
  /** how softly the corridor meets that end, in slots; 0 cuts it square */
  exitFade: number;
  /** whether the walls travel with the camera, or stand still while traffic runs */
  wallsMove: boolean;
  /** lock the frame: no camera drift, so the vanishing point stays at centre */
  steady: boolean;
  /** the colour the corridor is painted on, and the trail fades toward */
  bg: string;
  /** the "400 ms · one slot" scale drawn along the floor when the corridor is
      seen side-on — wanted when the slot is the subject, in the way when it
      is not */
  ruler: boolean;
  /** ── faces as traffic ──
      The payments stop being plates and become the agents that make them: the
      same pool, the same positions, the same travel and recycling, drawn as a
      face instead of a labelled box. Nothing about the corridor changes —
      what is flying at you does. */
  faceMode: boolean;
  /** how large a face is, in corridor widths */
  faceSize: number;
  /** the name's type size as a share of the face — kept a ratio rather than a
      length so the label holds its proportions at every depth. Zero draws no
      name. At the drawn size the spec is 12px type in a chip with 4px of
      padding, which is this ratio against a 33px face. */
  faceName: number;

  /** ── the lens ──
      The camera's own settings, so a scene can be composed rather than only
      dressed: how long the lens is, where it sits off the corridor's axis, and
      the depth the tilt swings around. All four were fixed constants until a
      scene wanted a close-up. */
  lens: number;
  offX: number;
  offY: number;
  pivot: number;

  /** an explicit angle for the corridor, in radians, overriding whatever the
      camera mode would have chosen. `section` swings 68 degrees, which is far
      enough to see past the end of the box and out into nothing; this is how
      you ask for a different perspective without asking for that one. */
  tilt: number | null;
  timeScale: number;
  /** whether a payment can be opened at all. A scene whose traffic is faces,
      or outlines standing in for calls, has nothing worth opening — and a
      ring that follows the pointer over things that will not respond to it
      is a promise the page does not keep. */
  clickable: boolean;
  hoverSlow: boolean;
  hoverScale: number;
  facing: Facing;
  plateSize: number;
  dotCount: number;
  /** how much of the dust pool is present, 0..1 — the pool itself is fixed at
      seed time, so this can be moved without reseeding the corridor */
  dustShow: number;
  labelCount: number;
  dotSize: number;
  revealDist: number;
  /** rings scaled independently of the grid, so they can fade rather than cut */
  ringMix: number;
  /** how much of the plate pool is present, 0..1. A hard gate, unlike the
      dust's — a payment either is on the wall or is not, and stepping this
      brings them in one at a time */
  plateShow: number;
  /** the plates give way: they drop out of the corridor and go dark, each on
      its own delay, 0..1 */
  plateFall: number;
  /** how the cascade is shaped — the share of the fall the wave takes to cross
      the wall, and the share one plate takes to reach the floor */
  fallWave: number;
  fallEach: number;
  /** the pull, in world units per unit of fall squared — a plate accelerates
      under it until it is gone out of the bottom of the frame */
  fallPull: number;
  /** how red the plates are, apart from any falling — they turn where they
      stand, and only then do they start coming down */
  plateRed: number;
  hideDist: number;
  labelColor: string;
  /** 0 keeps a plate in its avatar's colourway, 1 takes it to `labelColor` —
      a crossfade rather than the `labelFromAvatar` switch, so the corridor can
      be drained of colour on the way into a scene */
  labelMix: number;
  /** the hash's own colour once a plate has been drained to `labelColor`.
      Empty picks whichever of near-black or near-white reads better against
      the plate, which is right for a plate that is being read and wrong for
      one that is meant to recede — a grey plate wants grey type, and maximum
      contrast is the one thing that cannot give it that. */
  labelInk: string;
  /** what a plate turns as it drops out of the corridor */
  labelDown: string;
  labelFilled: boolean;
  /** how far through the field the plates have gone from stroked to filled */
  fillMix: number;
  /** how much of the floor is cleared of dust, 0 none, 1 everything below centre */
  dustFloorClear: number;
  /** the share of the width down each side the clear does not reach */
  dustSidesKeep: number;
  labelFromAvatar: boolean;
  labelSwatch: boolean;
  links: boolean;
  linkHoverOnly: boolean;
  linkDist: number;
  linkMax: number;
  linkOpacity: number;
  linkColor: string;
  linkNodes: boolean;
  linkNodeSize: number;
  letterSpacing: number;
  cellW: number;
  cellH: number;
  cellD: number;
  rings: boolean;
  cellLink: boolean;
  cellSize: number;
  cellFill: boolean;
  cellSpacing: number;
  cellPerBand: number;
  cellGap: number;
  cellFillOpacity: number;
  cellFillA: string;
  cellFillB: string;
  cellGradient: boolean;
  cellGradDir: string;
  cellGradFade: boolean;
  cellGradEase: number;
  cellGradFadeCurve: number;
  cellWallBias: number;
  mark: boolean;
  markWidth: number;
  markSpacing: number;
  markOpacity: number;
  markColor: string;
  markSurfaces: string;
  gridColor: string;
  gridOpacity: number;
  particleA: string;
  particleB: string;
  particleAxis: string;
  grid: boolean;
  threads: boolean;
  parallax: boolean;
  revealStiffness: number;
  revealDamping: number;
  revealDelay: number;
  letterDelay: number;
  letterStagger: number;
  scramble: boolean;
}
export const DEFAULTS: SlabParams = {
  camera: "fall",
  ruler: true,
  tilt: null,
  lens: 0.44,
  offX: 0,
  offY: 0,
  pivot: 2.5,
  faceMode: false,
  faceSize: 0.34,
  faceName: 0.36,
  formZ: 7,
  formJitter: 0,
  endZ: 7,
  exitFade: 0.4,
  wallsMove: false,
  steady: false,
  bg: "#000000",
  timeScale: 1,
  clickable: true,
  hoverSlow: true,
  hoverScale: 0.05,
  facing: "camera",
  plateSize: 8,
  dotCount: 400,
  dustShow: 1,
  labelCount: 320,
  dotSize: 0.4,
  revealDist: 2.7,
  ringMix: 1,
  plateShow: 1,
  plateFall: 0,
  fallWave: 0.7,
  fallEach: 0.3,
  fallPull: 3.4,
  plateRed: 0,
  hideDist: 1.4,
  labelColor: "#FFFFFF",
  labelMix: 0,
  labelInk: "",
  labelDown: "#FF2D2D",
  labelFilled: false,
  fillMix: 0,
  dustFloorClear: 0,
  dustSidesKeep: 0.2,
  labelFromAvatar: true,
  labelSwatch: false,
  links: true,
  linkHoverOnly: true,
  linkDist: 2.5,
  linkMax: 2,
  linkOpacity: 0.2,
  linkColor: "#FFFFFF",
  linkNodes: true,
  linkNodeSize: 4,
  letterSpacing: 1,
  cellW: 11,
  cellH: 19,
  cellD: 45,
  rings: true,
  cellLink: true,
  cellSize: 23,
  cellFill: true,
  cellSpacing: 1.2,
  cellPerBand: 1,
  cellGap: 2,
  cellFillOpacity: 1,
  cellFillA: "#8B61FF",
  cellFillB: "#0AFF68",
  cellGradient: true,
  cellGradDir: "depth",
  cellGradFade: true,
  cellGradEase: 0.7,
  cellGradFadeCurve: 1.6,
  cellWallBias: 1,
  mark: false,
  markWidth: 0.62,
  markSpacing: 2,
  markOpacity: 0.85,
  markColor: "#FFFFFF",
  markSurfaces: "floor",
  gridColor: "#FFFFFF",
  gridOpacity: 50,
  particleA: "#FFFFFF",
  particleB: "#000000",
  particleAxis: "depth",
  grid: true,
  threads: false,
  parallax: false,
  revealStiffness: 240,
  revealDamping: 26,
  revealDelay: 180,
  letterDelay: 260,
  letterStagger: 32,
  scramble: true,
};

/** the projection constant the corridor is drawn with */
/** the lens the corridor was drawn at before it was one; DEFAULTS matches */
const FOV = 0.44;

const BX = 1.62;
const BY = 1.16;
const SPAN = 7;
const PIVOT = 2.5;
const RESOLVE = 0.9;
const BONE = "#E9E4D8";

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const AGENTS = [
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
const ENDPOINTS = [
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

interface Rec {
  h: string;
  ag: string;
  ep: string;
  amt: number;
  amtS: string;
  fee: string;
  ms: number;
  slot: number;
}

const RECS: Rec[] = (() => {
  let seed = 99;
  const r = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const out: Rec[] = [];
  for (let i = 0; i < 520; i++) {
    let h = "";
    for (let k = 0; k < 4; k++) h += B58.charAt((r() * B58.length) | 0);
    h += "…";
    for (let k = 0; k < 4; k++) h += B58.charAt((r() * B58.length) | 0);
    /* 0.1 – 1000 USDC, log-spread so small payments dominate the way they do
       in agent traffic while the occasional large one still shows up */
    const amt = 0.1 * Math.pow(10000, r());
    out.push({
      h,
      ag: AGENTS[(r() * AGENTS.length) | 0],
      ep: ENDPOINTS[(r() * ENDPOINTS.length) | 0],
      amt,
      amtS:
        amt >= 100
          ? Math.round(amt).toLocaleString("en-US")
          : amt.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
      fee: "$" + (0.0001 + r() * 0.0008).toFixed(4),
      ms: (318 + r() * 126) | 0,
      slot: 328441900 + ((r() * 90000) | 0),
    });
  }
  return out;
})();

interface Point {
  x: number;
  y: number;
  z: number;
  b: number;
  alt: number;
  r: number;
  big: boolean;
  lab: boolean;
  res: number;
  exit: number;
  /** how far through its fall this plate is, 0..1 — read again when it is
      drawn, so what is falling can also be going red */
  fall: number;
  /** and how far down that has taken it, in world units. Every projection of
      this point has to include it: a trail drawn from the standing position to
      the fallen one is a streak the length of the whole drop. */
  fy: number;
  px: number;
  py: number;
  vis: number;
}

interface Thread {
  n: { x: number; y: number; z: number }[];
  a: number;
}

const fmt = (n: number) => n.toLocaleString("en-US");

/** fee altitude — heavy sediment low, sparse priority high */
const feeY = () => 0.6 - Math.pow(Math.random(), 3.1) * 1.74;

function place(p: Point) {
  p.x = (Math.random() * 2 - 1) * BX * 0.92;
  p.y = feeY();
  const alt = (0.6 - p.y) / 1.74;
  p.alt = alt < 0 ? 0 : alt > 1 ? 1 : alt;
  p.b = 0.44 + alt * 0.52;
  p.r = (Math.random() * RECS.length) | 0;
  p.big = Math.random() < 0.01 + alt * 0.03;
  p.res = -1;
  p.exit = -1;
}

/** stable per-cell noise, keyed to the cell's absolute position in the chain */
function cellHash(f: number, d: number, k: number, a: number) {
  let h =
    (f * 374761393 + d * 668265263 + k * 2246822519 + a * 3266489917) >>> 0;
  h = ((h ^ (h >>> 15)) * 2246822519) >>> 0;
  h = ((h ^ (h >>> 13)) * 3266489917) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** two "r,g,b" strings, blended */
function mixRgb(a: string, b: string, k: number) {
  const x = a.split(",");
  const y = b.split(",");
  return (
    `${Math.round(+x[0] + (+y[0] - +x[0]) * k)},` +
    `${Math.round(+x[1] + (+y[1] - +x[1]) * k)},` +
    `${Math.round(+x[2] + (+y[2] - +x[2]) * k)}`
  );
}

function hexRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  if (!isFinite(n)) return [255, 255, 255];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Motion-compatible spring position (mass 1), 0 → 1. */
function springAt(t: number, stiffness: number, damping: number) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness);
  const z = damping / (2 * Math.sqrt(stiffness));
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return (
      1 -
      Math.exp(-z * w0 * t) *
        (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t))
    );
  }
  const rt = w0 * Math.sqrt(z * z - 1);
  const a = -z * w0 + rt,
    b = -z * w0 - rt;
  if (Math.abs(a - b) < 1e-6) return 1 - Math.exp(a * t) * (1 - a * t);
  return 1 - (b * Math.exp(a * t) - a * Math.exp(b * t)) / (b - a);
}

const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** advance widths at the 12px reference size, cached per glyph */
const GLYPH = new Map<string, number>();
if (typeof document !== "undefined" && document.fonts) {
  /* metrics measured before the face loads come from the fallback and are wrong */
  document.fonts
    .load('400 12px "ABC Schengen"')
    .then(() => GLYPH.clear())
    .catch(() => {});
  document.fonts.ready.then(() => GLYPH.clear()).catch(() => {});
}
function glyphW(ctx: CanvasRenderingContext2D, ch: string) {
  let w = GLYPH.get(ch);
  if (w == null) {
    ctx.font = '400 12px "ABC Schengen", monospace';
    w = ctx.measureText(ch).width;
    GLYPH.set(ch, w);
  }
  return w;
}

function scrChar(i: number, tick: number, salt: number) {
  const h =
    (((i + 1) * 2654435761) ^ (tick * 40503) ^ ((salt + 1) * 2246822519)) >>> 0;
  return B58.charAt(h % B58.length);
}

const MARK_ASPECT = 114 / 22;
/* wordmark only — the gradient mark glyph and its defs are dropped, and the
   viewBox is cropped to the lettering so it fills the frame */
function markSvg(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="570" height="110" fill="none" viewBox="35 0 114 22"><path fill="${color}" d="M48.653 9.365H38.288V5.95h13.06V2.538H38.252a3.407 3.407 0 0 0-3.425 3.388v3.46a3.406 3.406 0 0 0 3.425 3.392h10.38v3.414H35.075v3.413h13.578a3.41 3.41 0 0 0 3.425-3.388v-3.46a3.406 3.406 0 0 0-3.425-3.392m20.08-6.827H58.33a3.407 3.407 0 0 0-3.434 3.388v10.291a3.405 3.405 0 0 0 3.434 3.389h10.405a3.407 3.407 0 0 0 3.425-3.389V5.926a3.4 3.4 0 0 0-2.12-3.136 3.4 3.4 0 0 0-1.305-.252Zm-.025 13.654H58.354V5.952h10.35zm36.468-13.654H95.028a3.407 3.407 0 0 0-3.425 3.388v13.68h3.46v-5.607h10.102v5.607h3.46V5.926a3.41 3.41 0 0 0-2.136-3.143 3.4 3.4 0 0 0-1.313-.246Zm-.025 8.047H95.049V5.951h10.102zm40.424-8.047h-10.149a3.406 3.406 0 0 0-3.425 3.388v13.68h3.46v-5.607h10.079v5.607H149V5.926a3.42 3.42 0 0 0-1.011-2.403 3.4 3.4 0 0 0-2.414-.985m-.035 8.047h-10.102V5.951h10.102zm-20.066 5.607h-1.384l-4.948-12.224a2.27 2.27 0 0 0-2.113-1.43h-3.07a2.27 2.27 0 0 0-2.283 2.26v14.808h3.46V5.95h1.384l4.945 12.225a2.285 2.285 0 0 0 2.122 1.42h3.07a2.27 2.27 0 0 0 2.283-2.26V2.538h-3.466zm-46.8-13.654h-3.46v13.68a3.405 3.405 0 0 0 3.438 3.388H89.03v-3.414H78.675z"/></svg>`;
}

/* One face per payment, drawn from the curated motif set behind /avatars:
   12 recipes x 14 colourways x each recipe's own variants. Recipe, colourway
   and variant are all derived from the record's hash, so a payment keeps the
   same face for as long as it is on screen. */
const AVATARS = new Map<string, HTMLCanvasElement>();
/** a plate's fixed place in the order the field fills, 0..1 */
function fillThreshold(recIdx: number) {
  let h = Math.imul(recIdx ^ 0x27d4eb2f, 0x9e3779b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  return ((h ^ (h >>> 13)) >>> 0) / 4294967296;
}

function hashStr(str: string, salt: number) {
  let h = (2166136261 ^ salt) >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
/* The look a payment's avatar was drawn in, so its plate can carry the same
   colourway. oklch() is resolved to rgb through a 1x1 canvas rather than
   converted by hand — the browser already knows the maths. */
const LOOK_RGB = new Map<
  number,
  { fig: string; grd: string; ink: string; line: string }
>();
let probeCtx: CanvasRenderingContext2D | null = null;
function resolveRgb(css: string) {
  if (!probeCtx) {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    probeCtx = c.getContext("2d", { willReadFrequently: true });
  }
  if (!probeCtx) return "255,255,255";
  probeCtx.clearRect(0, 0, 1, 1);
  probeCtx.fillStyle = css;
  probeCtx.fillRect(0, 0, 1, 1);
  const d = probeCtx.getImageData(0, 0, 1, 1).data;
  return `${d[0]},${d[1]},${d[2]}`;
}
/* Lighten a colour toward white without leaving its hue — the reveal glow and
   the large-payment highlight used to swap in a fixed cream, which threw away
   the plate's colourway for most of its life on screen. */
function mixWhite(rgb: string, t: number) {
  if (t <= 0) return rgb;
  const p = rgb.split(",");
  const r = +p[0],
    g = +p[1],
    b = +p[2];
  const u = t > 1 ? 1 : t;
  return `${Math.round(r + (255 - r) * u)},${Math.round(g + (255 - g) * u)},${Math.round(b + (255 - b) * u)}`;
}

/* WCAG relative luminance, so ink and outline are chosen by measured contrast
   rather than by role. Coral is light on light (0.70/0.94) and lime inverts
   (ground 0.90, figure 0.68), so the figure/ground pairing alone does not
   guarantee readable text. */
function lum(rgb: string) {
  const p = rgb.split(",");
  const f = (v: string) => {
    const x = +v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]);
}
function contrast(a: string, b: string) {
  const la = lum(a),
    lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* used for the contrast search that keeps plate outlines legible; the scene is
   dark on every route, so one reference value is enough */
const SCENE_BG = "0,0,0";
function lookRgbFor(recIdx: number) {
  const hit = LOOK_RGB.get(recIdx);
  if (hit) return hit;
  const look = LOOKS[hashStr(RECS[recIdx].h, 2) % LOOKS.length];
  const fig = resolveRgb(tone(look, 1));
  const grd = resolveRgb(tone(look, 0));

  /* filled plates: keep the colourway's own ground as ink when it is legible,
     otherwise fall back to whichever end of the range actually reads */
  const INK_DARK = "12,12,14",
    INK_LIGHT = "245,245,245";
  const ink =
    contrast(fig, grd) >= 4.5
      ? grd
      : contrast(fig, INK_DARK) >= contrast(fig, INK_LIGHT)
        ? INK_DARK
        : INK_LIGHT;

  /* stroke plates: lift the outline until it clears the scene background */
  let line = fig;
  for (let i = 0; i < 12 && contrast(line, SCENE_BG) < 4.5; i++) {
    line = mixWhite(fig, (i + 1) / 12);
  }

  const out = { fig, grd, ink, line };
  if (LOOK_RGB.size > 400) LOOK_RGB.clear();
  LOOK_RGB.set(recIdx, out);
  return out;
}

/**
 * The same avatar a plate carries, for anything outside the corridor that
 * needs to show one. Recipe and colourway both come off the seed, so a face
 * drawn here is the face that payment wears on the wall.
 */
const FACES = new Map<string, HTMLCanvasElement>();

/** the same, cached, for anything drawing a face every frame */
function faceCanvas(seed: string, px: number) {
  const key = `${seed}:${px}`;
  const hit = FACES.get(key);
  if (hit) return hit;
  const cv = avatarCanvas(seed, px);
  if (FACES.size > 48) FACES.clear();
  FACES.set(key, cv);
  return cv;
}

export function avatarCanvas(seed: string, px: number) {
  const recipe = PLATE_RECIPES[hashStr(seed, 1) % PLATE_RECIPES.length];
  const look = LOOKS[hashStr(seed, 2) % LOOKS.length];
  return recipeToCanvas(recipe, look, px);
}

function avatarFor(recIdx: number, px: number) {
  const key = `${recIdx}:${px}`;
  const hit = AVATARS.get(key);
  if (hit) return hit;
  const seed = RECS[recIdx].h;
  const recipe = PLATE_RECIPES[hashStr(seed, 1) % PLATE_RECIPES.length];
  const look = LOOKS[hashStr(seed, 2) % LOOKS.length];
  let cv: HTMLCanvasElement;
  try {
    cv = recipeToCanvas(recipe, look, px);
  } catch {
    cv = document.createElement("canvas");
    cv.width = px;
    cv.height = px;
  }
  if (AVATARS.size > 120) AVATARS.clear();
  AVATARS.set(key, cv);
  return cv;
}

/**
 * The depth at which the corridor's cross-section is `w` of the viewport wide.
 *
 * The exit is easier to hold as a size than as a depth — it is the thing being
 * looked at, and it has to be wide enough to frame whatever sits in it — so the
 * sequence asks for a width and gets back the depth that produces it.
 */
export const depthForExit = (w: number) => (2 * BX * FOV) / Math.max(0.02, w);

export function createCorridor(canvas: HTMLCanvasElement, initial: SlabParams) {
  const params: SlabParams = { ...initial };
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ctx = canvas.getContext("2d")!;
  let W = 0,
    H = 0,
    raf = 0,
    t0 = 0,
    running = false;

  let P: Point[] = [];
  /** where the labels end and the dust begins in that pool */
  let nLab = 0;
  let nDust = 0;
  let TH: Thread[] = [];
  let cam = 0,
    th = 0,
    thT = 0,
    spd = 1,
    spdT = 1;
  let last = 0,
    pxn = 0,
    pyn = 0;
  let mx = -1,
    my = -1,
    hov = -1,
    pin = -1,
    settled = 0;
  let hovering = false,
    tsCur = initial.timeScale,
    hoverAmt = 0;

  /* Per-frame pools, allocated once. A frame that allocates a few dozen
     arrays and sets every sixteen milliseconds pays for them all at once,
     later, in a collection pause — which is a stutter with no line of code
     at the scene of it. */
  const GSTEPS = 7;
  const BK: number[][] = [];
  for (let g = 0; g < GSTEPS * 4; g++) BK.push([]);
  const plates: {
    i: number;
    p: Point;
    rz: number;
    a: number;
    X: number;
    Y: number;
  }[] = [];
  const faceList: { p: Point; rz: number; a: number; fy: number }[] = [];
  const linkSeen = new Set<number>();
  const linkDone = new Set<number>();
  const linkCand: { j: number; d: number }[] = [];
  /* the dust's colour ramp and the vignette only change when what they are
     built from does, which is a scene crossfade — not a frame */
  let rampKey = "";
  const RAMP: string[] = [];
  let vig: CanvasGradient | null = null;
  let vigKey = "";

  /* the wordmark is rasterised once per colour and reused */
  let markImg: HTMLImageElement | null = null;
  let markKey = "";
  let markReady = false;
  function ensureMark(color: string) {
    if (markKey === color && markImg) return;
    markKey = color;
    markReady = false;
    const img = new Image();
    img.onload = () => {
      if (markKey === color) markReady = true;
    };
    img.src =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markSvg(color));
    markImg = img;
  }

  function seed() {
    P = [];
    nLab = Math.max(0, Math.round(params.labelCount));
    nDust = Math.max(0, Math.round(params.dotCount));
    const total = nLab + nDust;
    for (let i = 0; i < total; i++) {
      const p: Point = {
        x: 0,
        y: 0,
        z: 0.25 + Math.random() * (SPAN - 0.3),
        b: 0,
        alt: 0,
        r: 0,
        big: false,
        lab: false,
        res: -1,
        exit: -1,
        px: -1,
        py: -1,
        vis: 0,
        fall: 0,
        fy: 0,
      };
      const z = p.z;
      place(p);
      p.z = z;
      /* label vs dot is fixed at seed time and preserved through recycling,
         so the counts stay exactly what the controls say */
      p.lab = i < nLab;
      P.push(p);
    }
    TH = [];
    for (let q = 0; q < 90; q++) {
      const bx = (Math.random() * 2 - 1) * BX * 0.85;
      const by = feeY();
      const z0 = Math.random() * SPAN;
      const n = [];
      for (let m = 0; m < 5; m++) {
        n.push({
          x: bx + (Math.random() - 0.5) * 0.3,
          y: by + (Math.random() - 0.5) * 0.14,
          z: z0 + m * 0.98,
        });
      }
      TH.push({ n, a: 0.1 + Math.random() * 0.22 });
    }
  }

  function size() {
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(8, Math.round(r.width * DPR));
    canvas.height = Math.max(8, Math.round(r.height * DPR));
    W = canvas.width;
    H = canvas.height;
    ctx = canvas.getContext("2d")!;
  }

  function applyCamera() {
    thT =
      params.tilt != null
        ? params.tilt
        : params.camera === "section"
          ? 1.18
          : params.camera === "hold"
            ? 0.24
            : 0;
    spdT =
      params.camera === "section" ? 0.34 : params.camera === "hold" ? 0.03 : 1;
  }

  function draw(t: number) {
    const dt = Math.min(0.05, Math.max(0, t - last));
    last = t;
    th += (thT - th) * Math.min(1, dt * 3);
    spd += (spdT - spd) * Math.min(1, dt * 2.4);
    /* hovering eases the clock down so the hashes can actually be read, and so
       does holding a payment open — the corridor keeps moving around it */
    const tsTarget =
      params.hoverSlow && hovering
        ? params.hoverScale
        : pin >= 0
          ? params.timeScale * 0.3
          : params.timeScale;
    tsCur += (tsTarget - tsCur) * Math.min(1, dt * 3);
    hoverAmt += ((hovering ? 1 : 0) - hoverAmt) * Math.min(1, dt * 4);
    const step = 2.5 * spd * tsCur * dt;
    cam += step;
    const frac = cam % 1;
    const cW = params.cellLink ? params.cellSize : params.cellW;
    const cH = params.cellLink ? params.cellSize : params.cellH;
    const cD = params.cellLink ? params.cellSize : params.cellD;

    /* plate height in world units, from the design box height in css px */
    const PH = (params.plateSize / 20) * 0.06;

    ctx.globalAlpha = 1;
    const BGC = hexRgb(params.bg).join(",");
    ctx.fillStyle = `rgba(${BGC},${(0.66 + 0.28 * Math.min(1, step * 14)).toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);

    const tgx = params.parallax && mx >= 0 ? (mx / W) * 2 - 1 : 0;
    const tgy = params.parallax && my >= 0 ? (my / H) * 2 - 1 : 0;
    pxn += (tgx - pxn) * Math.min(1, dt * 3.4);
    pyn += (tgy - pyn) * Math.min(1, dt * 3);

    /* the camera moves inside the corridor; it never rotates and the
       vanishing point stays locked to the centre of frame, so the grid
       always reads as a straight, centred rectangle */
    const camX =
      (params.steady
        ? 0
        : Math.sin(t * 0.29) * 0.02 +
          Math.sin(t * 0.113 + 1.3) * 0.012 +
          pxn * 0.26) + params.offX;
    const camY =
      (params.steady
        ? 0
        : Math.sin(t * 0.211 + 0.7) * 0.024 +
          Math.sin(t * 0.089) * 0.013 +
          pyn * 0.19) + params.offY;

    const f = W * params.lens;
    const cx = W / 2,
      cy = H / 2;
    const ct = Math.cos(th),
      st = Math.sin(th);

    const P3 = (
      x: number,
      y: number,
      zr: number,
    ): [number, number, number, number] | null => {
      const wx = x - camX;
      const a0 = zr - params.pivot;
      const rx = wx * ct + a0 * st;
      const rz = -wx * st + a0 * ct + params.pivot;
      if (rz < 0.12) return null;
      const sc = f / rz;
      return [cx + rx * sc, cy + (y - camY) * sc, rz, sc];
    };

    /* ── grid corridor ──
       cell sizes are given as a percentage of the corridor cross-section
       (and of one slot, for depth), so the squares can be sized directly. */
    if (params.grid) {
      /* the architecture does not have to travel with the camera: held still,
         nothing ever crosses the exit plane and the room simply stands there
         while the payments fly through it */
      const camG = params.wallsMove ? cam : 0;
      const fracG = params.wallsMove ? frac : 0;
      const [gr, gg, gb] = hexRgb(params.gridColor);
      const gOp = params.gridOpacity / 100;
      const gRGB = `${gr},${gg},${gb}`;
      const GNX = Math.max(1, Math.round(100 / cW));
      const GNY = Math.max(1, Math.round(100 / cH));
      const ringsPerSlot = Math.max(1, Math.round(100 / cD));
      const dz = 1 / ringsPerSlot;

      /* How far the tunnel has been built, and how strongly a given depth is
         drawn: the leading edge fades in over the last stretch so a piece
         arrives instead of appearing.
         The front is not necessarily a plane. Each piece carries a fixed offset
         of its own, so with jitter up the corridor knits itself together — some
         runs shooting ahead down the wall, some rings landing late behind the
         ones in front of them — while staying perfectly repeatable, because the
         offset is hashed from the piece's index rather than rolled. */
      const front = params.formZ;
      const jit = Math.max(0, params.formJitter);
      const offset = (k: number) => {
        let h = Math.imul(k ^ 0x9e3779b9, 0x85ebca6b);
        h ^= h >>> 13;
        h = Math.imul(h, 0xc2b2ae35);
        return (((h ^ (h >>> 16)) >>> 0) / 4294967296 - 0.5) * 2.4 * jit;
      };
      /* The corridor ends at the exit. Cutting it dead square looks right while
         the walls stand still, but the moment they travel, a ring crossing that
         plane pops into existence at the edge of the opening and the tunnel
         reads as being built over and over. A short fade at the end hides the
         arrival without softening the opening enough to notice. */
      const fadeEnd = Math.max(0, params.exitFade);
      const cut = (z: number) => {
        if (z > params.endZ) return 0;
        if (fadeEnd <= 0) return 1;
        const e = (params.endZ - z) / fadeEnd;
        return e >= 1 ? 1 : e * e * (3 - 2 * e);
      };
      const built = (z: number, k = 0) => {
        const end = cut(z);
        if (end <= 0) return 0;
        const zz = jit > 0 ? z + offset(k) : z;
        if (zz > front) return 0;
        const e = (front - zz) / 0.5;
        return (e >= 1 ? 1 : e * e * (3 - 2 * e)) * end;
      };

      const gx: number[] = [],
        gy: number[] = [];
      for (let i = 0; i <= GNX; i++) gx.push(-BX + i * ((2 * BX) / GNX));
      for (let i = 0; i <= GNY; i++) gy.push(-BY + i * ((2 * BY) / GNY));

      const seg = (
        x1: number,
        y1: number,
        z1: number,
        x2: number,
        y2: number,
        z2: number,
      ) => {
        const a = P3(x1, y1, z1),
          b = P3(x2, y2, z2);
        if (a && b) {
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
        }
      };

      /* Lit cells sit on a WORLD-space lattice along the corridor and are then
         snapped to whichever grid cell contains them. Count therefore depends
         on spacing, not on how finely the grid is subdivided, and the lattice
         guarantees they are never adjacent in depth. */
      if (params.cellFill) {
        const [faR, faG, faB] = hexRgb(params.cellFillA);
        const [fbR, fbG, fbB] = hexRgb(params.cellFillB);
        const fOp = params.cellFillOpacity;
        const bias = params.cellWallBias;
        const ease = Math.max(0, Math.min(1, params.cellGradEase));
        const fadeCurve = Math.max(0.2, params.cellGradFadeCurve);
        const spacing = Math.max(0.15, params.cellSpacing);
        const perBand = Math.max(0, Math.round(params.cellPerBand));
        const gap = Math.max(0, Math.round(params.cellGap));
        const firstBand = Math.floor(camG / spacing) - 1;
        const bandCount = Math.ceil(SPAN / spacing) + 2;
        const taken: { f: number; a: number }[] = [];

        for (let n = firstBand; n < firstBand + bandCount; n++) {
          const zc = n * spacing - camG;
          if (zc < 0.16 || zc > SPAN) continue;
          /* the grid cell containing this band */
          const gr = Math.floor((zc + camG) / dz);
          const z0 = gr * dz - camG,
            z1 = (gr + 1) * dz - camG;
          if (z1 < 0.16) continue;
          const zc0 = Math.max(0.16, z0);
          taken.length = 0;

          for (let j = 0; j < perBand; j++) {
            const hFace = cellHash(1, n, j, 0);
            const hSide = cellHash(2, n, j, 0);
            const hAcross = cellHash(3, n, j, 0);
            const f =
              hFace < bias ? (hSide < 0.5 ? 0 : 1) : hSide < 0.5 ? 2 : 3;
            const across = f < 2 ? GNY : GNX;
            let a = Math.floor(hAcross * across);
            if (a >= across) a = across - 1;

            /* keep picks in the same band apart from one another */
            let clash = false;
            for (const t of taken) {
              if (t.f === f && Math.abs(t.a - a) <= gap) {
                clash = true;
                break;
              }
            }
            if (clash) continue;
            taken.push({ f, a });

            const gArr = f < 2 ? gy : gx;
            const wallC =
              f === 0
                ? -BX * 0.998
                : f === 1
                  ? BX * 0.998
                  : f === 2
                    ? BY * 0.998
                    : -BY * 0.998;
            const onWall = f < 2;
            const pt = (acrossV: number, zV: number) =>
              onWall ? P3(wallC, acrossV, zV) : P3(acrossV, wallC, zV);

            const p1 = pt(gArr[a], zc0);
            const p2 = pt(gArr[a + 1], zc0);
            const p3 = pt(gArr[a + 1], z1);
            const p4 = pt(gArr[a], z1);
            if (!p1 || !p2 || !p3 || !p4) continue;
            const fade =
              Math.min(1, (SPAN - z0) / (SPAN * 0.7)) *
              Math.min(1, (z0 + 0.4) / 0.8) *
              built(z0, n * 5171);
            const al = fade * fOp;
            if (al <= 0.012) continue;

            if (params.cellGradient) {
              const flip = cellHash(7, n, j, a);
              let alongAcross = params.cellGradDir === "across";
              if (params.cellGradDir === "random") alongAcross = flip < 0.5;
              const swap = params.cellGradDir === "random" && flip > 0.75;

              /* axis perpendicular to the averaged edge direction, so the bands
                 run parallel to the panel's own edges on a trapezoid */
              let ex: number,
                ey: number,
                s0x: number,
                s0y: number,
                s1x: number,
                s1y: number;
              if (alongAcross) {
                ex = p4[0] - p1[0] + (p3[0] - p2[0]);
                ey = p4[1] - p1[1] + (p3[1] - p2[1]);
                s0x = (p1[0] + p4[0]) / 2;
                s0y = (p1[1] + p4[1]) / 2;
                s1x = (p2[0] + p3[0]) / 2;
                s1y = (p2[1] + p3[1]) / 2;
              } else {
                ex = p2[0] - p1[0] + (p3[0] - p4[0]);
                ey = p2[1] - p1[1] + (p3[1] - p4[1]);
                s0x = (p1[0] + p2[0]) / 2;
                s0y = (p1[1] + p2[1]) / 2;
                s1x = (p4[0] + p3[0]) / 2;
                s1y = (p4[1] + p3[1]) / 2;
              }
              const el = Math.hypot(ex, ey) || 1;
              ex /= el;
              ey /= el;
              const nx = -ey,
                ny = ex;
              const proj = (s1x - s0x) * nx + (s1y - s0y) * ny;
              const gd = ctx.createLinearGradient(
                s0x,
                s0y,
                s0x + nx * proj,
                s0y + ny * proj,
              );
              const STOPS = 12;
              for (let q = 0; q <= STOPS; q++) {
                let u = q / STOPS;
                if (swap) u = 1 - u;
                const sm = u * u * (3 - 2 * u);
                const ue = u + (sm - u) * ease;
                const cr = Math.round(faR + (fbR - faR) * ue);
                const cg = Math.round(faG + (fbG - faG) * ue);
                const cb = Math.round(faB + (fbB - faB) * ue);
                const ca = params.cellGradFade
                  ? al * Math.pow(1 - ue, fadeCurve)
                  : al;
                gd.addColorStop(
                  q / STOPS,
                  `rgba(${cr},${cg},${cb},${ca.toFixed(4)})`,
                );
              }
              ctx.fillStyle = gd;
            } else {
              const useA = cellHash(7, n, j, a) < 0.5;
              ctx.fillStyle = useA
                ? `rgba(${faR},${faG},${faB},${al.toFixed(3)})`
                : `rgba(${fbR},${fbG},${fbB},${al.toFixed(3)})`;
            }
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.lineTo(p3[0], p3[1]);
            ctx.lineTo(p4[0], p4[1]);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      /* the wordmark laid into the horizontal surfaces, sliced along depth so
         the affine draws add up to a convincing perspective */
      if (params.mark) {
        ensureMark(params.markColor);
        if (markReady && markImg) {
          const mw = params.markWidth * 2 * BX;
          const md = mw / MARK_ASPECT;
          const spacing = Math.max(0.5, params.markSpacing);
          const SL = 20;
          const srcW = markImg.naturalWidth,
            srcH = markImg.naturalHeight;
          const faces: number[] =
            params.markSurfaces === "floor"
              ? [2]
              : params.markSurfaces === "ceiling"
                ? [3]
                : [2, 3];
          const first = Math.floor(cam / spacing) - 1;

          for (const f of faces) {
            const wy = (f === 2 ? BY : -BY) * 0.997;
            /* nothing is back-facing here — the quad is projected and the image
               drawn into it, so both surfaces use the same mapping */
            for (
              let n = first;
              n < first + Math.ceil(SPAN / spacing) + 2;
              n++
            ) {
              const zFar = n * spacing - cam + md;
              if (zFar < 0.2 || zFar - md > SPAN) continue;
              const fade =
                Math.min(1, (SPAN - (zFar - md)) / (SPAN * 0.75)) *
                Math.min(1, (zFar - md + 0.3) / 0.9);
              const al = fade * params.markOpacity;
              if (al <= 0.02) continue;
              ctx.globalAlpha = al;
              for (let i = 0; i < SL; i++) {
                const za = zFar - (i / SL) * md;
                const zb = zFar - ((i + 1) / SL) * md;
                if (zb < 0.16) continue;
                const xL = -mw / 2;
                const xR = mw / 2;
                const o = P3(xL, wy, za);
                const ux = P3(xR, wy, za);
                const vx = P3(xL, wy, zb);
                if (!o || !ux || !vx) continue;
                ctx.save();
                ctx.transform(
                  ux[0] - o[0],
                  ux[1] - o[1],
                  vx[0] - o[0],
                  vx[1] - o[1],
                  o[0],
                  o[1],
                );
                ctx.drawImage(
                  markImg,
                  0,
                  (i / SL) * srcH,
                  srcW,
                  srcH / SL,
                  0,
                  0,
                  1,
                  1.02,
                );
                ctx.restore();
              }
              ctx.globalAlpha = 1;
            }
          }
        }
      }

      /* longitudinal wall lines, segmented per slot so depth falloff reads */
      ctx.lineWidth = Math.max(1, DPR * 0.7);
      for (let m = 0; m <= SPAN; m++) {
        const za = Math.max(0.16, m - fracG),
          zc = Math.max(0.18, m + 1 - fracG);
        if (za > SPAN) break;
        const depthFade = Math.min(1, (SPAN - zc) / (SPAN * 0.62));
        if (depthFade <= 0.02) continue;
        const near = Math.max(0, 1 - za / 1.6);
        const base = depthFade * (0.15 + 0.22 * near) * gOp;

        if (jit <= 0) {
          /* a flat front takes every run at once, in one path */
          ctx.strokeStyle = `rgba(${gRGB},${base.toFixed(3)})`;
          ctx.beginPath();
          for (let j = 0; j <= GNY; j++) {
            seg(-BX, gy[j], za, -BX, gy[j], zc);
            seg(BX, gy[j], za, BX, gy[j], zc);
          }
          for (let j = 0; j <= GNX; j++) {
            seg(gx[j], -BY, za, gx[j], -BY, zc);
            seg(gx[j], BY, za, gx[j], BY, zc);
          }
          ctx.stroke();
        } else {
          /* a ragged one has to be drawn a run at a time, since each carries
             its own arrival — the segment index is folded in so a single run
             does not land all the way down the corridor at once */
          const run = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            k: number,
          ) => {
            const a = base * built(zc, k);
            if (a <= 0.02) return;
            ctx.strokeStyle = `rgba(${gRGB},${a.toFixed(3)})`;
            ctx.beginPath();
            seg(x1, y1, za, x2, y2, zc);
            ctx.stroke();
          };
          for (let j = 0; j <= GNY; j++) {
            run(-BX, gy[j], -BX, gy[j], j * 131 + m * 17 + 1);
            run(BX, gy[j], BX, gy[j], j * 131 + m * 17 + 2);
          }
          for (let j = 0; j <= GNX; j++) {
            run(gx[j], -BY, gx[j], -BY, j * 197 + m * 17 + 3);
            run(gx[j], BY, gx[j], BY, j * 197 + m * 17 + 4);
          }
        }
      }

      /* rings: every cell boundary in depth, with slot boundaries emphasised */
      const corners: [number, number][] = [
        [-BX, -BY],
        [BX, -BY],
        [BX, BY],
        [-BX, BY],
      ];
      for (
        let m = 0;
        params.rings && params.ringMix > 0.004 && m <= SPAN;
        m++
      ) {
        for (let k = 0; k < ringsPerSlot; k++) {
          const zb = m + k * dz - fracG;
          if (zb < 0.14 || zb > SPAN) continue;
          const isSlot = k === 0;
          const cs: [number, number, number, number][] = [];
          let ok = true;
          for (const c of corners) {
            const pc = P3(c[0], c[1], zb);
            if (!pc) {
              ok = false;
              break;
            }
            cs.push(pc);
          }
          if (!ok) continue;
          /* depth falloff only — no approach flash, so a boundary never reads
             as a plane rushing the camera. It is just the grid's other axis. */
          const fade =
            Math.min(1, (SPAN - zb) / (SPAN * 0.55)) *
            built(zb, (m * ringsPerSlot + k) * 7919);
          const aa = fade * (isSlot ? 0.3 : 0.2) * params.ringMix;
          if (aa <= 0.012) continue;
          ctx.lineWidth = Math.max(1, DPR * (isSlot ? 0.75 : 0.6));
          ctx.strokeStyle = `rgba(${gRGB},${(aa * gOp).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(cs[0][0], cs[0][1]);
          for (let c = 1; c < 4; c++) ctx.lineTo(cs[c][0], cs[c][1]);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }

    /* ── inclusions ── */
    const [lcR, lcG, lcB] = hexRgb(params.labelColor);
    const LC = `${lcR},${lcG},${lcB}`;
    const [ldR, ldG, ldB] = hexRgb(params.labelDown);
    const LD = `${ldR},${ldG},${ldB}`;
    const rampWant = params.particleA + "|" + params.particleB;
    if (rampWant !== rampKey) {
      rampKey = rampWant;
      const [pAr, pAg, pAb] = hexRgb(params.particleA);
      const [pBr, pBg, pBb] = hexRgb(params.particleB);
      RAMP.length = 0;
      for (let g = 0; g < GSTEPS; g++) {
        const u = g / (GSTEPS - 1);
        RAMP.push(
          `${Math.round(pBr + (pAr - pBr) * u)},` +
            `${Math.round(pBg + (pAg - pBg) * u)},` +
            `${Math.round(pBb + (pAb - pBb) * u)}`,
        );
      }
    }
    /* The dust is weighted toward the floor, because it is placed by fee and
       the cheap payments are the many. Clearing the lower band leaves it
       running along the ceiling and down the walls, where it reads as depth
       rather than as sediment — the sides are spared so the corridor keeps its
       edges. */
    const dustCut = BY - params.dustFloorClear * 2 * BY;
    const dustEdge = BX * (1 - params.dustSidesKeep);

    for (let g = 0; g < BK.length; g++) BK[g].length = 0;
    plates.length = 0;
    faceList.length = 0;
    let bestD = 1e9,
      bestI = -1;
    const hitR = 15 * DPR;

    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      p.z -= step;
      if (p.z < 0.14) {
        if (i === pin) {
          pin = -1;
          settled = t;
        }
        const z = p.z + SPAN;
        place(p);
        p.z = z;
      }

      /* A plate that is not present is not drawn at all — not as a plate and
         not as a mote either, or turning the traffic down would only swap one
         kind of speck for another. It keeps travelling, so the corridor stays
         coherent underneath, and it keeps its place in the pool, so the count
         can be moved without reseeding. */
      if (p.lab && params.plateShow < 1) {
        if (nLab > 0 && i / nLab >= params.plateShow) {
          p.vis = 0;
          p.res = -1;
          p.exit = -1;
          continue;
        }
      }

      /* And when they give way they fall — properly, one at a time, and onto
         something. The delay is taken from the plate's place in the pool
         rather than from a hash, so the order is a sequence and not a scatter:
         each payment lets go, drops, and only then does the next.

         The drop is an acceleration, not a slide, and it ends at the floor of
         the corridor. Which means a payment high on the wall has further to
         go and takes longer getting there, while one already near the bottom
         is down almost at once — the thing gravity actually does, and the
         reason a wall of them coming down does not look like a wipe. */
      let fy = 0;
      let dim = 1;
      p.fall = 0;
      p.fy = 0;
      if (p.lab && params.plateFall > 0) {
        const standing = Math.max(1, params.plateShow * nLab);
        const turn = Math.min(1, i / standing) * params.fallWave;
        const q = clamp01(
          (params.plateFall - turn) / Math.max(0.02, params.fallEach),
        );
        /* It keeps accelerating and it does not stop at the corridor floor.
           Stopping there was the obvious thing and it was wrong: payments are
           placed by fee, which piles most of them along the bottom already, so
           a fall that ended at the floor gave the majority of them nowhere to
           go and the whole wall barely moved. They fall out of the world
           instead, and the bottom of the frame is what takes them. */
        fy = q * q * params.fallPull;
        dim = 1 - 0.45 * q;
        p.fall = q;
        p.fy = fy;
      }

      const pr = P3(p.x, p.y + fy, p.z);
      if (!pr) {
        p.vis = 0;
        continue;
      }
      const [X, Y, rz, sc] = pr;
      p.px = X;
      p.py = Y;
      if (X < -90 || X > W + 90 || Y < -90 || Y > H + 90) {
        p.vis = 0;
        continue;
      }
      const depth =
        Math.min(1, (SPAN - rz) / (SPAN * 0.72)) *
        Math.min(1, (rz - 0.14) / 0.55);
      const a = depth * p.b * dim;
      p.vis = a;
      if (a <= 0.028) continue;
      if (mx >= 0 && params.clickable) {
        const dx = X - mx,
          dy = Y - my,
          d2 = dx * dx + dy * dy;
        if (d2 < bestD && d2 < hitR * hitR) {
          bestD = d2;
          bestI = i;
        }
      }
      const u =
        params.particleAxis === "depth"
          ? 1 - Math.min(1, rz / SPAN)
          : params.particleAxis === "width"
            ? (p.x / BX + 1) / 2
            : p.alt;
      const gi = Math.min(GSTEPS - 1, Math.max(0, (u * GSTEPS) | 0));

      let boxed = false;
      /* A payment travelling as its agent: same point, same depth, same
         recycling — only what gets drawn at it changes. Collected here and
         drawn back to front further down, because the pool is not in depth
         order and a near face has to cover a far one. */
      if (params.faceMode && p.lab) {
        faceList.push({ p, rz, a, fy });
        boxed = true;
      } else if (p.lab && (p.res >= 0 || rz <= params.revealDist)) {
        if (p.res < 0) p.res = t;
        const hideAt = Math.min(params.hideDist, params.revealDist - 0.1);
        if (p.exit < 0 && rz <= hideAt) p.exit = t;
        if (p.exit < 0 || t - p.exit < 1.2) {
          plates.push({ i, p, rz, a, X, Y });
          boxed = true;
        }
      }
      if (!boxed) {
        if (p.y > dustCut && Math.abs(p.x) < dustEdge) continue;
        /* The pool is fixed at seed time — changing it would reseed the whole
           corridor and jump the plates with it. So the dust is not counted in
           and out, it is faded in and out: each mote holds a place in the
           pool, and the ones past the mark are simply not there yet. They are
           scattered through the pool rather than grouped, so the corridor
           thickens evenly instead of filling from one end. */
        let a2 = a;
        if (params.dustShow < 1) {
          const u = nDust > 0 ? (i - nLab) / nDust : 0;
          const gate = clamp01((params.dustShow - u) / 0.22);
          if (gate <= 0.02) continue;
          a2 = a * gate;
        }
        const pr0 = P3(p.x, p.y + fy, p.z + step * 0.42);
        const X0 = pr0 ? pr0[0] : X,
          Y0 = pr0 ? pr0[1] : Y;
        const ab = a2 > 0.6 ? 3 : a2 > 0.38 ? 2 : a2 > 0.18 ? 1 : 0;
        BK[gi * 4 + ab].push(X0, Y0, X, Y);
      }
    }
    hov = bestI;

    const ALPHA = [0.16, 0.32, 0.55, 0.88];
    const WID = [0.9, 1.2, 1.6, 2.1];
    ctx.lineCap = "round";
    for (let g = 0; g < GSTEPS; g++) {
      for (let b = 0; b < 4; b++) {
        const arr = BK[g * 4 + b];
        if (!arr.length) continue;
        ctx.strokeStyle = `rgba(${RAMP[g]},${ALPHA[b]})`;
        ctx.lineWidth = WID[b] * DPR * params.dotSize;
        ctx.beginPath();
        for (let j = 0; j < arr.length; j += 4) {
          ctx.moveTo(arr[j], arr[j + 1]);
          ctx.lineTo(arr[j + 2], arr[j + 3]);
        }
        ctx.stroke();
      }
    }
    ctx.lineCap = "butt";

    /* ── threads ── */
    if (params.threads) {
      ctx.lineWidth = Math.max(1, DPR * 0.75);
      for (const thr of TH) {
        const nodes = thr.n;
        nodes[0].z -= step;
        for (let n = 1; n < nodes.length; n++)
          nodes[n].z = nodes[0].z + n * 0.98;
        if (nodes[nodes.length - 1].z < 0.2) {
          const bx = (Math.random() * 2 - 1) * BX * 0.85,
            by = feeY();
          nodes[0].z += SPAN;
          for (let n = 0; n < nodes.length; n++) {
            nodes[n].x = bx + (Math.random() - 0.5) * 0.3;
            nodes[n].y = by + (Math.random() - 0.5) * 0.14;
            nodes[n].z = nodes[0].z + n * 0.98;
          }
        }
        let drawn = 0;
        ctx.beginPath();
        for (const nd of nodes) {
          const pn = P3(nd.x, nd.y, nd.z);
          if (!pn) continue;
          if (drawn === 0) ctx.moveTo(pn[0], pn[1]);
          else ctx.lineTo(pn[0], pn[1]);
          drawn++;
        }
        if (drawn > 1) {
          const fz = Math.max(0, 1 - nodes[0].z / SPAN);
          ctx.strokeStyle = `rgba(${LC},${(thr.a * fz * 0.8).toFixed(3)})`;
          ctx.stroke();
        }
      }
    }

    /* ── plates ── */
    plates.sort((u, v) => v.rz - u.rz);
    const shown =
      plates.length > 70 ? plates.slice(plates.length - 70) : plates;

    const ls = params.letterSpacing;
    const tick = (t * 13) | 0;

    /* the whole plate is a target, not just its anchor point */
    let hitPlate = -1,
      hitPlateZ = Infinity;
    const inQuad = (
      px: number,
      py: number,
      q1: number[],
      q2: number[],
      q3: number[],
      q4: number[],
    ) => {
      let sign = 0;
      const q = [q1, q2, q3, q4];
      for (let e = 0; e < 4; e++) {
        const a1 = q[e],
          b1 = q[(e + 1) & 3];
        const cross =
          (b1[0] - a1[0]) * (py - a1[1]) - (b1[1] - a1[1]) * (px - a1[0]);
        if (cross === 0) continue;
        const sg = cross > 0 ? 1 : -1;
        if (sign === 0) sign = sg;
        else if (sg !== sign) return false;
      }
      return true;
    };

    /* ── links: the network between live labels, revealed on hover ── */
    const linkAmt = params.linkHoverOnly ? hoverAmt : 1;
    if (params.links && linkAmt > 0.01 && shown.length > 1) {
      const [lkR, lkG, lkB] = hexRgb(params.linkColor);
      const maxD = params.linkDist;
      const maxPer = Math.max(1, Math.round(params.linkMax));
      linkSeen.clear();
      linkDone.clear();
      ctx.lineWidth = Math.max(1, DPR * 0.6);
      for (let i = 0; i < shown.length; i++) {
        const a = shown[i];
        linkCand.length = 0;
        for (let j = 0; j < shown.length; j++) {
          if (i === j) continue;
          const b = shown[j];
          const dx = a.p.x - b.p.x,
            dy = a.p.y - b.p.y,
            dz = a.p.z - b.p.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < maxD) linkCand.push({ j, d });
        }
        linkCand.sort((u, v) => u.d - v.d);
        const lim = Math.min(maxPer, linkCand.length);
        for (let k = 0; k < lim; k++) {
          const j = linkCand[k].j;
          const key = i < j ? i * 4096 + j : j * 4096 + i;
          if (linkSeen.has(key)) continue;
          linkSeen.add(key);
          const b = shown[j];
          const taper = 0.45 + 0.55 * (1 - linkCand[k].d / maxD);
          const depth = Math.min(1, Math.min(a.a, b.a) * 1.7);
          const al = depth * taper * params.linkOpacity * linkAmt;
          if (al <= 0.012) continue;
          ctx.strokeStyle = `rgba(${lkR},${lkG},${lkB},${al.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.X, a.Y);
          ctx.lineTo(b.X, b.Y);
          ctx.stroke();
          linkDone.add(i);
          linkDone.add(j);
        }
      }
      /* square connectors where lines meet a label */
      if (params.linkNodes && linkDone.size) {
        const ns = Math.max(1, params.linkNodeSize) * DPR;
        for (const idx of linkDone) {
          const nd = shown[idx];
          const na =
            Math.min(1, nd.a * 1.7) * params.linkOpacity * linkAmt * 2.2;
          if (na <= 0.02) continue;
          ctx.fillStyle = `rgba(${lkR},${lkG},${lkB},${Math.min(0.95, na).toFixed(3)})`;
          ctx.fillRect(nd.X - ns / 2, nd.Y - ns / 2, ns, ns);
        }
      }
    }

    /* Reveal, ported from the label pills in frontier-traders:
       the box springs open to its full width first, then the letters
       stagger in left to right — the letters never drag the box. */
    const S_STIFF = params.revealStiffness;
    const S_DAMP = params.revealDamping;
    const S_DELAY = params.revealDelay / 1000;
    const L_DELAY = params.letterDelay / 1000;
    const L_STAG = params.letterStagger / 1000;
    const L_DUR = 0.2;

    for (const pl of shown) {
      const p = pl.p,
        rec = RECS[p.r];
      const hh = PH / 2;
      const chars = rec.h.split("");
      const n = chars.length;

      /* metrics at the 12px reference, so the box is the type */
      let tw = 0;
      const adv: number[] = [];
      for (let i = 0; i < n; i++) {
        adv.push(tw);
        tw += glyphW(ctx, chars[i]) + (i < n - 1 ? ls : 0);
      }

      const age = p.res < 0 ? 0 : t - p.res;
      const enter = clamp01(age / 0.14);
      const wS = springAt(age - S_DELAY, S_STIFF, S_DAMP);

      /* exit is the reveal reversed: letters peel off right to left, then the
         box retracts into the dot */
      const exitAge = p.exit < 0 ? -1 : t - p.exit;
      const letterOut = (n - 1) * L_STAG + 0.12;
      const wExit =
        exitAge < 0 ? 0 : easeOut(clamp01((exitAge - letterOut) / 0.26));
      if (wExit >= 1) continue;

      const uw = PH / 20; /* world units per design px */
      const boxH = PH;
      /* a colour chip sits before the text: 10 square + 4 gap, in design px */
      const chip = params.labelSwatch ? 14 : 0;
      const boxW = (tw + 12 + chip) * uw * wS * (1 - wExit);
      if (boxW < uw) continue;
      /* v runs down the box, u runs along its length */
      let ux = 0,
        uz = 0,
        vx = 0,
        vy = 0;
      /* the plate is built flat in the corridor's frame, so these two stay put */
      const uy = 0,
        vz = 0;
      let ox = 0,
        oy = 0,
        oz = 0;
      if (params.facing === "walls") {
        uz = boxW;
        vy = boxH;
        ox = p.x;
        oy = p.y - boxH / 2;
        oz = p.z;
      } else if (params.facing === "floor") {
        uz = boxW;
        vx = boxH;
        ox = p.x - boxH / 2;
        oy = p.y;
        oz = p.z;
      } else {
        ux = boxW;
        vy = boxH;
        ox = p.x;
        oy = p.y - boxH / 2;
        oz = p.z;
      }
      const k1 = P3(ox, oy, oz);
      const k2 = P3(ox + ux, oy + uy, oz + uz);
      const k4 = P3(ox + vx, oy + vy, oz + vz);
      if (!k1 || !k2 || !k4) continue;
      const lwp = Math.hypot(k2[0] - k1[0], k2[1] - k1[1]);
      const lhp = Math.hypot(k4[0] - k1[0], k4[1] - k1[1]);
      if (lwp < 3 || lhp < 1) continue;
      const al = Math.min(0.95, pl.a * 1.15) * enter;
      /* always resolved — the plate may take its colour from the avatar, or
         carry it only as a chip while the plate itself is a chosen colour */
      const look = lookRgbFor(p.r);
      /* Stroked or filled is decided per plate against a threshold hashed from
         its record, so a rising mix converts the field one plate at a time and
         in a fixed order rather than flipping the whole corridor at once. */
      const isFilled =
        params.labelFilled || fillThreshold(p.r) < params.fillMix;
      /* The outline/text colour is contrast-corrected; the fill keeps the raw
         figure tone so the plate still reads as its avatar's colourway. On top
         of that, two crossfades: the whole field can be drained toward
         `labelColor`, and a plate that is dropping goes red as it goes. */
      const flat = params.labelFromAvatar ? clamp01(params.labelMix) : 1;
      const plain = params.labelInk
        ? hexRgb(params.labelInk).join(",")
        : contrast(LC, "12,12,14") >= contrast(LC, "245,245,245")
          ? "12,12,14"
          : "245,245,245";
      /* red where they stand, redder still on the way down */
      const drop = Math.max(clamp01(params.plateRed), p.fall);
      const tone = (avatar: string, flatTone: string, red: string) => {
        let out =
          flat <= 0
            ? avatar
            : flat >= 1
              ? flatTone
              : mixRgb(avatar, flatTone, flat);
        if (drop > 0.002) out = mixRgb(out, red, drop);
        return out;
      };
      const PC = tone(look.line, LC, LD);
      const PCfill = tone(look.fig, LC, LD);
      /* the text on a falling plate keeps to the light side, so a hash stays
         legible all the way down */
      const PCink = tone(look.ink, plain, "255,240,240");

      const pv = P3(p.x, p.y + p.fy, p.z + step);
      const mv = pv ? Math.hypot(pv[0] - pl.X, pv[1] - pl.Y) : 0;
      const reps = Math.max(
        1,
        Math.min(3, Math.round(mv / Math.max(2, lhp * 0.9))),
      );
      let lastQ: [number, number, number, number][] | null = null;
      let lastA = al;

      for (let rp = 0; rp < reps; rp++) {
        const dz = reps > 1 ? step * (rp / reps) : 0;
        const g1 = P3(ox, oy, oz + dz);
        const g2 = P3(ox + ux, oy + uy, oz + uz + dz);
        const g3 = P3(ox + ux + vx, oy + uy + vy, oz + uz + vz + dz);
        const g4 = P3(ox + vx, oy + vy, oz + vz + dz);
        if (!g1 || !g2 || !g3 || !g4) continue;
        const aRep = al / (reps === 1 ? 1 : reps * 0.72);
        ctx.beginPath();
        ctx.moveTo(g1[0], g1[1]);
        ctx.lineTo(g2[0], g2[1]);
        ctx.lineTo(g3[0], g3[1]);
        ctx.lineTo(g4[0], g4[1]);
        ctx.closePath();
        const glow = wS < 1 ? Math.max(0, 1 - wS) : 0;
        const hot = Math.min(1, glow * 0.75 + (p.big ? 0.4 : 0));
        if (isFilled) {
          ctx.fillStyle = `rgba(${mixWhite(PCfill, hot)},${Math.min(0.98, aRep * (1 + glow * 0.5)).toFixed(3)})`;
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(8,11,16,${(0.82 * Math.min(1, aRep * 2.2)).toFixed(3)})`;
          ctx.fill();
          ctx.lineWidth = Math.max(1, DPR * (0.75 + glow * 0.8));
          ctx.strokeStyle = `rgba(${mixWhite(PC, hot)},${Math.min(0.95, aRep * (1 + glow * 0.6)).toFixed(3)})`;
          ctx.stroke();
        }
        if (rp === reps - 1) {
          lastQ = [g1, g2, g3, g4];
          lastA = aRep;
        }
      }
      if (
        lastQ &&
        mx >= 0 &&
        params.clickable &&
        pl.rz < hitPlateZ &&
        inQuad(mx, my, lastQ[0], lastQ[1], lastQ[2], lastQ[3])
      ) {
        hitPlate = pl.i;
        hitPlateZ = pl.rz;
      }
      if (!lastQ) continue;
      /* letters always draw with the box — skipping them on fast plates
         was what produced a wide, empty box mid-reveal */
      if (lhp < 6 * DPR) continue;
      if (p.res < 0) continue;

      const o1 = lastQ[0];
      const UX = lastQ[1][0] - o1[0],
        UY = lastQ[1][1] - o1[1];
      const VX = lastQ[3][0] - o1[0],
        VY = lastQ[3][1] - o1[1];
      const lw = Math.hypot(UX, UY),
        lh = Math.hypot(VX, VY);
      if (lw < 10 || lh < 4) continue;

      /* local space: 100 units = box height, isotropic across both axes */
      const asp = lw / lh;
      ctx.save();
      ctx.transform(
        UX / (100 * asp),
        UY / (100 * asp),
        VX / 100,
        VY / 100,
        o1[0],
        o1[1],
      );
      ctx.font = '400 60px "ABC Schengen", monospace';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      /* knocked out of the fill, or set in the accent when the box is a stroke */
      const filled = isFilled;
      const baseCol = filled ? PCink : mixWhite(PC, p.big ? 0.4 : 0);
      if (chip) {
        /* the avatar's colourway, carried as a square when the plate itself
           is a flat chosen colour */
        const ce = clamp01((age - L_DELAY) / L_DUR);
        if (ce > 0.02) {
          ctx.fillStyle = `rgba(${look.fig},${(lastA * ce).toFixed(3)})`;
          ctx.fillRect(30, 25, 50, 50);
        }
      }
      const textBoost = filled ? Math.min(1, lastA * 2.4) : lastA;
      for (let i = 0; i < n; i++) {
        const lp = clamp01((age - L_DELAY - i * L_STAG) / L_DUR);
        if (lp <= 0) continue;
        const out =
          exitAge < 0 ? 0 : clamp01((exitAge - (n - 1 - i) * L_STAG) / 0.12);
        if (out >= 1) continue;
        const e = easeOut(lp);
        const a = textBoost * e * (1 - out);
        if (a < 0.02) continue;
        const ch =
          params.scramble && lp < 0.6 ? scrChar(i, tick, p.r) : chars[i];
        ctx.fillStyle = `rgba(${baseCol},${a.toFixed(3)})`;
        ctx.fillText(ch, 30 + chip * 5 + adv[i] * 5, 50 + 20 * (1 - e));
      }
      ctx.restore();
    }
    ctx.textAlign = "left";

    if (hitPlate >= 0) hov = hitPlate;

    /* ── faces as traffic ──
       Drawn back to front, each through the plane it stands in, so a face
       foreshortens with the walls exactly as everything else in the room does.
       The name rides the same transform, at a hundred local units to the world
       unit — canvas renders text through the matrix rather than scaling a
       bitmap, so nothing is lost to being skewed. */
    if (params.faceMode && faceList.length) {
      faceList.sort((m, n) => n.rz - m.rz);
      const U = 100;
      for (const f of faceList) {
        const { p } = f;
        const zc = p.z;
        const o = P3(p.x, p.y + f.fy, zc);
        const ex = P3(p.x + 1, p.y + f.fy, zc);
        const ey = P3(p.x, p.y + f.fy + 1, zc);
        if (!o || !ex || !ey) continue;
        const ax = (ex[0] - o[0]) / U;
        const ay = (ex[1] - o[1]) / U;
        const bx = (ey[0] - o[0]) / U;
        const by = (ey[1] - o[1]) / U;
        const half = params.faceSize / 2;
        const wpx = Math.hypot(ax, ay) * half * 2 * U;
        if (wpx < 2 || wpx > 5000) continue;
        const step = wpx <= 32 ? 32 : wpx <= 64 ? 64 : wpx <= 128 ? 128 : 256;
        ctx.save();
        ctx.transform(ax, ay, bx, by, o[0], o[1]);
        ctx.globalAlpha = f.a;
        try {
          ctx.drawImage(
            avatarFor(p.r, step),
            -half * U,
            -half * U,
            half * 2 * U,
            half * 2 * U,
          );
        } catch {
          /* a face that will not draw is skipped */
        }
        /* the name, in a chip hung off the bottom-right corner of the face and
           touching it — its top on the face's bottom edge, its left on the
           face's right. Padding is a third of the type size, which is the 4px
           against 12px the label is specified at. */
        if (params.faceName > 0.002 && wpx > 26) {
          const txt = params.faceSize * params.faceName * U;
          const pad = txt / 3;
          ctx.globalAlpha = f.a;
          ctx.font = `${txt}px "ABC Diatype Mono", ui-monospace, monospace`;
          ctx.letterSpacing = `${(txt * 0.09).toFixed(2)}px`;
          const name = RECS[p.r].ag;
          const box = ctx.measureText(name).width + pad * 2;
          const tall = txt + pad * 2;
          ctx.fillStyle = "#383838";
          ctx.fillRect(half * U, half * U, box, tall);
          ctx.fillStyle = "#fff";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(name, half * U + pad, half * U + tall / 2);
          ctx.letterSpacing = "0px";
          ctx.textBaseline = "alphabetic";
        }
        ctx.restore();
        ctx.globalAlpha = 1;
      }
    }

    /* ── section ruler ── */
    if (params.ruler && th > 0.55) {
      const sa = Math.min(1, (th - 0.55) / 0.4);
      const r1 = P3(0, 0, 2 - frac),
        r2 = P3(0, 0, 3 - frac);
      if (r1 && r2 && Math.abs(r2[0] - r1[0]) > 26 * DPR) {
        const by = H * 0.86;
        const xa = Math.min(r1[0], r2[0]),
          xb = Math.max(r1[0], r2[0]);
        ctx.globalAlpha = sa;
        ctx.strokeStyle = "rgba(233,228,216,0.7)";
        ctx.lineWidth = Math.max(1, DPR);
        ctx.beginPath();
        ctx.moveTo(xa, by);
        ctx.lineTo(xb, by);
        ctx.moveTo(xa, by - 8 * DPR);
        ctx.lineTo(xa, by + 8 * DPR);
        ctx.moveTo(xb, by - 8 * DPR);
        ctx.lineTo(xb, by + 8 * DPR);
        ctx.stroke();
        ctx.font = `400 ${(12.5 * DPR).toFixed(1)}px "ABC Schengen", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = BONE;
        ctx.fillText("400 MS · ONE SLOT", (xa + xb) / 2, by - 13 * DPR);
        ctx.globalAlpha = 1;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
      }
    }

    /* ── hover + pin ── */
    if (hov >= 0 && pin < 0) {
      const hp = P[hov];
      ctx.strokeStyle = "rgba(233,228,216,0.7)";
      ctx.lineWidth = Math.max(1, DPR);
      ctx.beginPath();
      ctx.arc(hp.px, hp.py, 9 * DPR, 0, 6.2832);
      ctx.stroke();
    }
    if (pin >= 0 && !params.clickable) pin = -1;
    if (pin >= 0) {
      const pp = P[pin];
      if (pp.vis > 0) {
        const rec = RECS[pp.r];
        /* Figma 10910:8474 — 80px face, agent / amount, rule, fee.
           All measurements are design px scaled by DPR. */
        const k = DPR;
        const AV = 80 * k,
          PADL = 4 * k,
          PADR = 12 * k,
          PADY = 4 * k;
        const GAP = 12 * k,
          COL = 100 * k;
        const cw = PADL + AV + GAP + COL + PADR;
        const chh = AV + PADY * 2;
        /* column content: 20+20 text, 9 gap, 0 rule, 9 gap, 12 fee = 70 */
        const COLH = 70 * k;
        const m = 14 * k;
        const cx0 = Math.min(W - cw - m, Math.max(m, pp.px + 56 * k));
        const cy0 = Math.min(H - chh - m, Math.max(m, pp.py - chh / 2));

        /* leader from the pinned inclusion to the card */
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = Math.max(1, DPR * 0.7);
        ctx.beginPath();
        ctx.arc(pp.px, pp.py, 8 * DPR, 0, 6.2832);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pp.px + 8 * DPR, pp.py);
        ctx.lineTo(
          cx0,
          Math.min(cy0 + chh - 6 * k, Math.max(cy0 + 6 * k, pp.py)),
        );
        ctx.stroke();

        ctx.fillStyle = "#2A2A2A";
        ctx.fillRect(cx0, cy0, cw, chh);

        const face = avatarFor(pp.r, Math.round(AV));
        ctx.drawImage(face, cx0 + PADL, cy0 + PADY, AV, AV);

        const tx = cx0 + PADL + AV + GAP;
        const colTop = cy0 + (chh - COLH) / 2;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = `${k}px`;

        ctx.font = `350 ${(14 * k).toFixed(1)}px "ABC Schengen", monospace`;
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillText(rec.ag, tx, colTop + 10 * k);

        ctx.font = `400 ${(14 * k).toFixed(1)}px "ABC Schengen", monospace`;
        ctx.fillStyle = "rgba(255,255,255,0.58)";
        ctx.fillText(`${rec.amtS} USDC`, tx, colTop + 30 * k);

        /* the rule is w-full of the 100px column, and hairline */
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.fillRect(
          tx,
          colTop + 49 * k,
          COL,
          Math.max(1, Math.round(k * 0.5)),
        );

        /* the fee row is justify-center inside the column's 16px right inset,
           so it sits centred rather than flush left like the two lines above */
        ctx.font = `400 ${(12 * k).toFixed(1)}px "ABC Schengen", monospace`;
        ctx.fillStyle = "rgba(255,255,255,0.58)";
        ctx.textAlign = "center";
        ctx.fillText(
          `${rec.fee} FEE`,
          tx + (COL - 16 * k) / 2,
          colTop + 64 * k,
        );
        ctx.textAlign = "left";

        ctx.letterSpacing = "0px";
        ctx.textBaseline = "middle";
      }
    }
    if (settled > 0 && t - settled < 1.1) {
      const fa = 1 - (t - settled) / 1.1;
      ctx.font = `400 ${(12 * DPR).toFixed(1)}px "ABC Schengen", monospace`;
      ctx.fillStyle = `rgba(233,228,216,${fa.toFixed(3)})`;
      ctx.textAlign = "center";
      ctx.fillText("SETTLED · PASSED THE CAMERA PLANE", W / 2, H * 0.93);
      ctx.textAlign = "left";
    }

    const vigWant = `${W}|${H}|${BGC}`;
    if (!vig || vigKey !== vigWant) {
      vigKey = vigWant;
      vig = ctx.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.34,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.74,
      );
      vig.addColorStop(0, `rgba(${BGC},0)`);
      vig.addColorStop(1, `rgba(${BGC},0.62)`);
    }
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  function frame(now: number) {
    if (!running) return;
    draw((now - t0) / 1000);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    t0 = performance.now() - last * 1000;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left) * (canvas.width / r.width);
    my = (e.clientY - r.top) * (canvas.height / r.height);
    hovering = true;
  };
  const onEnter = () => {
    hovering = true;
  };
  const onLeave = () => {
    mx = -1;
    my = -1;
    hovering = false;
  };
  const onDown = (e: PointerEvent) => {
    if (!params.clickable) return;
    onMove(e);
    pin = hov >= 0 ? hov : -1;
  };
  const onResize = () => {
    size();
  };

  canvas.addEventListener("pointerenter", onEnter);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("resize", onResize);

  size();
  seed();
  applyCamera();
  if (reduced) draw(2.4);
  else start();

  return {
    /** stop drawing entirely — for a corridor that has scrolled off screen */
    pause() {
      stop();
    },
    /** and pick the clock back up where it left off */
    resume() {
      if (!reduced) start();
    },
    /** put the corridor back to its first frame, so a sequence can replay */
    restart() {
      cam = 0;
      pin = -1;
      hov = -1;
      settled = 0;
      seed();
    },
    /**
     * Open a payment where it is.
     *
     * Pins a plate that has resolved but is still far enough out to stay on
     * screen for a few seconds, so its card opens against the plate itself.
     * Does nothing if one is already open — a click always outranks this.
     */
    hold(on: boolean) {
      if (!on) {
        pin = -1;
        return false;
      }
      /* an open payment is left alone until its plate leaves the frame —
         a plate can drift out sideways long before it reaches the camera, and
         holding on to it would mean no card at all until it settled */
      if (pin >= 0) {
        if (P[pin] && P[pin].vis > 0) return false;
        pin = -1;
      }
      let open: number[] = [];
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        if (p.lab && p.res >= 0 && p.exit < 0 && p.vis > 0 && p.z > 1.5)
          open.push(i);
      }
      if (!open.length) return false;
      /* the card opens to the right of its plate, so a plate is wanted in the
         right-hand band: far enough in that the card is not clamped to the
         frame edge, far enough out that it does not land on the copy, and away
         from the top and bottom so it does not read as a corner label */
      const band = open.filter(
        (i) =>
          P[i].px > W * 0.48 &&
          P[i].px < W * 0.72 &&
          P[i].py > H * 0.24 &&
          P[i].py < H * 0.68,
      );
      if (band.length) open = band;
      /* and take one of the furthest few — a plate picked close to the camera
         settles within a second and the card barely gets to open */
      open.sort((a, b) => P[b].z - P[a].z);
      pin = open[(Math.random() * Math.min(3, open.length)) | 0];
      return true;
    },
    update(next: Partial<SlabParams>) {
      const densityChanged =
        (next.dotCount != null &&
          Math.round(next.dotCount) !== Math.round(params.dotCount)) ||
        (next.labelCount != null &&
          Math.round(next.labelCount) !== Math.round(params.labelCount));
      Object.assign(params, next);
      applyCamera();
      if (densityChanged) seed();
    },
    destroy() {
      stop();
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    },
  };
}
