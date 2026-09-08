/**
 * Avatar core — the shared machinery every generative system draws on.
 *
 * An avatar is a pure function of a seed string. The same id always produces
 * the same face, on every machine, with no assets and no network. Systems draw
 * into a fixed 128x128 unit space; the renderer scales that space to whatever
 * pixel size the page asks for, so one drawing serves a 24px row badge and a
 * 512px export.
 *
 * Colour is specified in OKLCH and converted here. Perceptual lightness is the
 * whole reason: a system can say "same hue, 12% lighter" and get a facet, not a
 * mud puddle.
 */

export const S = 128; // the unit square every system draws into
export const TAU = Math.PI * 2;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a: number, b: number) =>
  v < a ? a : v > b ? b : v;
export const smooth = (t: number) => t * t * (3 - 2 * t);

/* ------------------------------------------------------------------ random */

export interface Rng {
  (): number;
  int(n: number): number; // 0..n-1
  between(a: number, b: number): number; // inclusive integers
  range(a: number, b: number): number;
  pick<T>(xs: readonly T[]): T;
  chance(p: number): boolean;
  sign(): number;
  gauss(): number;
  shuffle<T>(xs: T[]): T[];
  /** a fresh independent stream — lets one system branch without disturbing another */
  fork(tag: string): Rng;
}

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function sfc32(a: number, b: number, c: number, d: number) {
  return () => {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export function rng(seed: string): Rng {
  const h = xmur3(seed);
  const next = sfc32(h(), h(), h(), h());
  for (let i = 0; i < 12; i++) next(); // warm up, so near-identical seeds diverge
  const r = Object.assign(() => next(), {
    int: (n: number) => Math.floor(next() * n),
    between: (a: number, b: number) => a + Math.floor(next() * (b - a + 1)),
    range: (a: number, b: number) => a + next() * (b - a),
    pick: <T>(xs: readonly T[]): T => xs[Math.floor(next() * xs.length)],
    chance: (p: number) => next() < p,
    sign: () => (next() < 0.5 ? -1 : 1),
    gauss: () => {
      let u = 0,
        v = 0;
      while (u === 0) u = next();
      while (v === 0) v = next();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
    },
    shuffle: <T>(xs: T[]) => {
      for (let i = xs.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        const t = xs[i];
        xs[i] = xs[j];
        xs[j] = t;
      }
      return xs;
    },
    fork: (tag: string) => rng(`${seed}::${tag}::${Math.floor(next() * 1e9)}`),
  }) as Rng;
  return r;
}

/* ------------------------------------------------------------------ colour */

const gamma = (u: number) =>
  Math.round(
    clamp(
      u <= 0.0031308
        ? 12.92 * u
        : 1.055 * Math.pow(Math.max(u, 0), 1 / 2.4) - 0.055,
      0,
      1,
    ) * 255,
  );

/** OKLCH -> css colour. l 0..1, c 0..0.37, h degrees. */
export function oklch(l: number, c: number, h: number, alpha = 1): string {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ * l_ * l_,
    M = m_ * m_ * m_,
    N = s_ * s_ * s_;
  const R = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * N;
  const G = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * N;
  const B = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * N;
  return alpha >= 1
    ? `rgb(${gamma(R)},${gamma(G)},${gamma(B)})`
    : `rgba(${gamma(R)},${gamma(G)},${gamma(B)},${clamp(alpha, 0, 1).toFixed(3)})`;
}

export type Scheme =
  | "mono"
  | "analogue"
  | "complement"
  | "triad"
  | "split"
  | "clash";

export interface Palette {
  bg: string;
  fg: string;
  hues: number[];
  chroma: number;
  dark: boolean;
  scheme: Scheme;
  /** colour from hue slot i */
  at(i: number, l: number, c?: number, a?: number): string;
  /** colour from a position t in 0..1 sliding across the whole scheme */
  mix(t: number, l: number, c?: number, a?: number): string;
  /** near-neutral tinted with the base hue — for grounds, shadows, rules */
  ink(l: number, a?: number): string;
}

export function palette(r: Rng): Palette {
  const h0 = r() * 360;
  const scheme = r.pick<Scheme>([
    "mono",
    "analogue",
    "analogue",
    "complement",
    "triad",
    "split",
    "clash",
  ]);
  const hues =
    scheme === "mono"
      ? [h0, h0, h0]
      : scheme === "analogue"
        ? [h0, h0 + r.range(18, 40), h0 - r.range(18, 40)]
        : scheme === "complement"
          ? [h0, h0 + 180, h0 + r.range(150, 210)]
          : scheme === "triad"
            ? [h0, h0 + 120, h0 + 240]
            : scheme === "split"
              ? [h0, h0 + 150, h0 + 210]
              : [h0, h0 + r.range(60, 300), h0 + r.range(60, 300)];

  const chroma = r.chance(0.16) ? r.range(0.19, 0.28) : r.range(0.05, 0.16);
  const dark = r.chance(0.72);
  const bgL = dark ? r.range(0.11, 0.23) : r.range(0.88, 0.96);
  const bg = oklch(bgL, chroma * (dark ? 0.3 : 0.14), h0 + (r() - 0.5) * 20);
  const fg = dark
    ? oklch(r.range(0.88, 0.96), chroma * 0.35, h0)
    : oklch(r.range(0.14, 0.24), chroma * 0.5, h0);

  const at = (i: number, l: number, c = chroma, a = 1) =>
    oklch(l, c, hues[((i % 3) + 3) % 3], a);
  const mix = (t: number, l: number, c = chroma, a = 1) => {
    const u = clamp(t, 0, 1) * (hues.length - 1);
    const i = Math.min(Math.floor(u), hues.length - 2);
    return oklch(l, c, lerp(hues[i], hues[i + 1], u - i), a);
  };
  return {
    bg,
    fg,
    hues,
    chroma,
    dark,
    scheme,
    at,
    mix,
    ink: (l, a = 1) => oklch(l, 0.012, h0, a),
  };
}

/* ------------------------------------------------------------------- noise */

export type Noise = (x: number, y: number) => number;

/** classic gradient noise, permutation seeded from the avatar's own stream */
export function makeNoise(r: Rng): Noise {
  const perm = Array.from({ length: 256 }, (_, i) => i);
  r.shuffle(perm);
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const grad = (h: number, x: number, y: number) => {
    switch (h & 3) {
      case 0:
        return x + y;
      case 1:
        return -x + y;
      case 2:
        return x - y;
      default:
        return -x - y;
    }
  };
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x, y) => {
    const xi = Math.floor(x),
      yi = Math.floor(y);
    const X = xi & 255,
      Y = yi & 255;
    const xf = x - xi,
      yf = y - yi;
    const u = fade(xf),
      v = fade(yf);
    const aa = p[p[X] + Y],
      ab = p[p[X] + Y + 1],
      ba = p[p[X + 1] + Y],
      bb = p[p[X + 1] + Y + 1];
    return (
      lerp(
        lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
        v,
      ) * 0.72
    );
  };
}

export function fbm(n: Noise, x: number, y: number, oct = 4): number {
  let a = 0.5,
    f = 1,
    s = 0,
    norm = 0;
  for (let i = 0; i < oct; i++) {
    s += a * n(x * f, y * f);
    norm += a;
    a *= 0.5;
    f *= 2;
  }
  return s / norm;
}

/* ---------------------------------------------------------------- geometry */

export type Pt = [number, number];

export function poly(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

/** Sutherland–Hodgman against the bisector of a|b, keeping the a side. */
export function clipHalf(
  pts: Pt[],
  ax: number,
  ay: number,
  bx: number,
  by: number,
): Pt[] {
  const mx = (ax + bx) / 2,
    my = (ay + by) / 2,
    dx = bx - ax,
    dy = by - ay;
  const f = (p: Pt) => (p[0] - mx) * dx + (p[1] - my) * dy;
  const out: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i],
      B = pts[(i + 1) % pts.length];
    const fa = f(A),
      fb = f(B);
    if (fa <= 0) out.push(A);
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
      const t = fa / (fa - fb);
      out.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]);
    }
  }
  return out;
}

export function centroid(pts: Pt[]): Pt {
  let x = 0,
    y = 0;
  for (const p of pts) {
    x += p[0];
    y += p[1];
  }
  return [x / pts.length, y / pts.length];
}

/** best-candidate sampling — points that look scattered rather than clumped */
export function scatter(r: Rng, n: number, pad = 0, tries = 8): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    let best: Pt = [0, 0],
      bestD = -1;
    for (let t = 0; t < tries; t++) {
      const c: Pt = [r.range(pad, S - pad), r.range(pad, S - pad)];
      let d = Infinity;
      for (const p of pts)
        d = Math.min(d, (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2);
      if (d > bestD) {
        bestD = d;
        best = c;
      }
    }
    pts.push(best);
  }
  return pts;
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rad: number,
) {
  const k = Math.min(rad, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.arcTo(x + w, y, x + w, y + h, k);
  ctx.arcTo(x + w, y + h, x, y + h, k);
  ctx.arcTo(x, y + h, x, y, k);
  ctx.arcTo(x, y, x + w, y, k);
  ctx.closePath();
}

/* --------------------------------------------------------------- rendering */

/** a low-res pixel buffer, for systems that think in cells rather than paths */
export function buffer(n: number) {
  const cv = document.createElement("canvas");
  cv.width = n;
  cv.height = n;
  const c = cv.getContext("2d")!;
  return { cv, ctx: c, img: c.createImageData(n, n) };
}

/** paint a buffer over the unit square without letting the GPU soften it */
export function blit(
  ctx: CanvasRenderingContext2D,
  cv: HTMLCanvasElement,
  smoothing = false,
) {
  ctx.save();
  ctx.imageSmoothingEnabled = smoothing;
  ctx.drawImage(cv, 0, 0, S, S);
  ctx.restore();
}

/** parse the `rgb(r,g,b)` this module emits, for buffer writes */
export function rgb(css: string): [number, number, number] {
  const m = css.match(/-?\d+/g)!;
  return [+m[0], +m[1], +m[2]];
}

/**
 * The common finish. Every system gets the same grain and the same falloff at
 * the edge, which is most of what makes twenty unrelated ideas read as one set.
 */
export function finish(ctx: CanvasRenderingContext2D, r: Rng, amount = 1) {
  ctx.save();
  const g = ctx.createRadialGradient(
    S / 2,
    S * 0.44,
    S * 0.24,
    S / 2,
    S / 2,
    S * 0.78,
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${0.34 * amount})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);

  ctx.globalAlpha = 0.05 * amount;
  for (let i = 0; i < 620; i++) {
    ctx.fillStyle = r.chance(0.5) ? "#fff" : "#000";
    ctx.fillRect(r() * S, r() * S, 1, 1);
  }
  ctx.restore();
}
