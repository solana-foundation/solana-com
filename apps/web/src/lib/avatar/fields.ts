/**
 * Fields — avatars that are the visible state of a process: a flow integrated,
 * a plane subdivided, a signal quantised, two grids interfering, a chemistry
 * left to run. Nothing here is composed; it is all settled into.
 */

import { System } from "./system";
import {
  S,
  TAU,
  blit,
  buffer,
  clamp,
  fbm,
  lerp,
  makeNoise,
  palette,
  rgb,
} from "./core";

/* ------------------------------------------------------------ 11 · filament */

export const filament: System = {
  id: "filament",
  name: "Filament",
  blurb:
    "A thousand particles released into a noise field, each drawing the line it took.",
  family: "field",
  draw(ctx, r, out) {
    const p = palette(r);
    const n = makeNoise(r);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    const scale = r.range(0.008, 0.03);
    const turns = r.range(0.8, 3.2);
    const strands = r.between(420, 1000);
    const steps = r.between(9, 24);
    const len = r.range(0.9, 2.1);
    const disc = r.chance(0.45);
    const swirl = r.chance(0.4);
    out.push(
      `${strands} strands`,
      `${steps} steps`,
      disc ? "held in a disc" : "full bleed",
      swirl ? "with vortex" : "laminar",
    );

    ctx.save();
    if (disc) {
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S * 0.42, 0, TAU);
      ctx.clip();
    }
    if (p.dark) ctx.globalCompositeOperation = "lighter";

    ctx.lineCap = "round";
    for (let i = 0; i < strands; i++) {
      let x = r() * S,
        y = r() * S;
      const t0 = clamp(fbm(n, x * scale, y * scale, 2) * 0.5 + 0.5, 0, 1);
      ctx.strokeStyle = p.mix(
        t0,
        p.dark ? r.range(0.5, 0.85) : r.range(0.25, 0.6),
        p.chroma * r.range(0.7, 1.5),
        r.range(0.18, 0.6),
      );
      ctx.lineWidth = r.range(0.5, 1.7);
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < steps; s++) {
        let a = fbm(n, x * scale, y * scale, 3) * TAU * turns;
        if (swirl) a += Math.atan2(y - S / 2, x - S / 2) + Math.PI / 2;
        x += Math.cos(a) * len;
        y += Math.sin(a) * len;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();

    if (disc) {
      ctx.strokeStyle = p.ink(p.dark ? 0.8 : 0.3, 0.35);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S * 0.42, 0, TAU);
      ctx.stroke();
    }
  },
};

/* ------------------------------------------------------------- 12 · truchet */

export const truchet: System = {
  id: "truchet",
  name: "Multiscale Truchet",
  blurb:
    "The square subdivides where the seed says so; every leaf gets one tile, and the lines meet anyway.",
  family: "field",
  draw(ctx, r, out) {
    const p = palette(r);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    const root = r.pick([1, 2, 2, 4]);
    const maxD = r.between(2, 4);
    const split = r.range(0.45, 0.78);
    const style = r.pick(["arc", "arc", "arc", "diagonal", "nested"] as const);
    const solid = r.chance(0.25);
    out.push(`${style} tiles`, `depth ${maxD}`, solid ? "filled" : "stroked");

    const line = p.fg;
    ctx.lineCap = "butt";

    const tile = (x: number, y: number, s: number, d: number) => {
      const flip = r.chance(0.5);
      const w = s * (0.1 + (maxD - d) * 0.04);
      ctx.lineWidth = clamp(w, 0.8, 14);
      ctx.strokeStyle = p.mix(
        d / maxD,
        p.dark ? lerp(0.95, 0.55, d / maxD) : lerp(0.15, 0.45, d / maxD),
        p.chroma * (0.5 + d * 0.4),
      );

      if (solid) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        if (flip) {
          ctx.moveTo(x, y);
          ctx.arc(x, y, s / 2, 0, Math.PI / 2);
          ctx.lineTo(x, y);
          ctx.moveTo(x + s, y + s);
          ctx.arc(x + s, y + s, s / 2, Math.PI, Math.PI * 1.5);
        } else {
          ctx.moveTo(x + s, y);
          ctx.arc(x + s, y, s / 2, Math.PI / 2, Math.PI);
          ctx.moveTo(x, y + s);
          ctx.arc(x, y + s, s / 2, Math.PI * 1.5, TAU);
        }
        ctx.fill();
        return;
      }

      ctx.beginPath();
      if (style === "diagonal") {
        if (flip) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + s, y + s);
        } else {
          ctx.moveTo(x + s, y);
          ctx.lineTo(x, y + s);
        }
      } else if (style === "nested") {
        const cxs = flip ? x : x + s,
          cys = flip ? y : y + s;
        for (const k of [0.25, 0.5, 0.75]) ctx.arc(cxs, cys, s * k, 0, TAU);
      } else if (flip) {
        ctx.arc(x, y, s / 2, 0, Math.PI / 2);
        ctx.moveTo(x + s / 2, y + s);
        ctx.arc(x + s, y + s, s / 2, Math.PI, Math.PI * 1.5);
      } else {
        ctx.arc(x + s, y, s / 2, Math.PI / 2, Math.PI);
        ctx.moveTo(x, y + s / 2);
        ctx.arc(x, y + s, s / 2, Math.PI * 1.5, TAU);
      }
      ctx.stroke();
    };

    const cell = (x: number, y: number, s: number, d: number) => {
      if (d < maxD && r.chance(split - d * 0.06)) {
        const h = s / 2;
        cell(x, y, h, d + 1);
        cell(x + h, y, h, d + 1);
        cell(x, y + h, h, d + 1);
        cell(x + h, y + h, h, d + 1);
      } else tile(x, y, s, d);
    };

    ctx.save();
    if (style === "nested") {
      ctx.beginPath();
      ctx.rect(0, 0, S, S);
      ctx.clip();
    }
    const s0 = S / root;
    for (let gy = 0; gy < root; gy++)
      for (let gx = 0; gx < root; gx++) cell(gx * s0, gy * s0, s0, 0);
    ctx.restore();

    if (r.chance(0.4)) {
      ctx.strokeStyle = line;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, S - 1, S - 1);
      ctx.globalAlpha = 1;
    }
  },
};

/* -------------------------------------------------------------- 13 · dither */

function bayer(n: number): number[][] {
  if (n === 1) return [[0]];
  const h = bayer(n / 2),
    half = n / 2;
  const m: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let y = 0; y < half; y++)
    for (let x = 0; x < half; x++) {
      const v = h[y][x] * 4;
      m[y][x] = v;
      m[y][x + half] = v + 2;
      m[y + half][x] = v + 3;
      m[y + half][x + half] = v + 1;
    }
  return m;
}

export const dither: System = {
  id: "dither",
  name: "One Bit",
  blurb:
    "Metaballs and interference resolved through an ordered Bayer threshold — no greys, only the illusion of them.",
  family: "field",
  draw(ctx, r, out) {
    const p = palette(r);
    const N = r.pick([48, 56, 64, 80]);
    const M = r.pick([2, 4, 8, 8]);
    const bm = bayer(M);
    const levels = r.chance(0.35) ? 3 : 2;
    out.push(`${N}² cells`, `${M}×${M} bayer`, `${levels} tones`);

    const balls = Array.from({ length: r.between(3, 7) }, () => ({
      x: r.range(0.15, 0.85),
      y: r.range(0.15, 0.85),
      r: r.range(0.1, 0.34),
      s: r.chance(0.25) ? -1 : 1,
    }));
    const waveF = r.range(4, 22);
    const waveA = r.chance(0.6) ? r.range(0.08, 0.3) : 0;
    const waveAng = r() * TAU;
    if (waveA) out.push("standing wave");

    const cols = [
      rgb(p.bg),
      rgb(p.mix(0.5, p.dark ? 0.55 : 0.55, p.chroma * 1.2)),
      rgb(p.fg),
    ];
    const { cv, ctx: bctx, img } = buffer(N);
    const d = img.data;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const u = x / N,
          v = y / N;
        let f = 0;
        for (const b of balls) {
          const dx = u - b.x,
            dy = v - b.y;
          f += (b.s * b.r * b.r) / (dx * dx + dy * dy + 0.004);
        }
        f = clamp(f * 0.12, 0, 1.6);
        f +=
          waveA *
          Math.sin((u * Math.cos(waveAng) + v * Math.sin(waveAng)) * waveF);
        f -= Math.pow(Math.hypot(u - 0.5, v - 0.5) * 1.7, 3) * 0.5; // fade at the corners
        const th = (bm[y % M][x % M] + 0.5) / (M * M);
        const q = clamp(
          Math.floor(clamp(f, 0, 0.999) * (levels - 1) + th),
          0,
          levels - 1,
        );
        const c = levels === 2 ? (q ? cols[2] : cols[0]) : cols[q];
        const i = (y * N + x) * 4;
        d[i] = c[0];
        d[i + 1] = c[1];
        d[i + 2] = c[2];
        d[i + 3] = 255;
      }
    }
    bctx.putImageData(img, 0, 0);
    blit(ctx, cv, false);
  },
};

/* --------------------------------------------------------------- 14 · moire */

export const moire: System = {
  id: "moire",
  name: "Interference",
  blurb:
    "Two or three rulings laid over each other at an angle; the pattern you see is in neither of them.",
  family: "field",
  draw(ctx, r, out) {
    const p = palette(r);
    ctx.fillStyle = p.dark
      ? p.at(0, 0.13, p.chroma * 0.3)
      : p.at(0, 0.95, p.chroma * 0.12);
    ctx.fillRect(0, 0, S, S);

    const layers = r.between(2, 3);
    const kinds: string[] = [];
    for (let L = 0; L < layers; L++) {
      const kind = r.pick(["lines", "rings", "radial", "grid"] as const);
      kinds.push(kind);
      const gap = r.range(2.2, 5.6) * (L ? r.range(0.92, 1.12) : 1);
      const ang = L === 0 ? r.range(0, TAU) : r.range(0.02, 0.22) * r.sign();
      const ox = L ? r.range(-6, 6) : 0,
        oy = L ? r.range(-6, 6) : 0;

      ctx.save();
      if (L > 0) ctx.globalCompositeOperation = "difference";
      ctx.strokeStyle =
        L === 0
          ? p.at(0, p.dark ? 0.85 : 0.2, p.chroma * 0.5)
          : p.at(L, p.dark ? 0.9 : 0.25, p.chroma * 1.2);
      ctx.lineWidth = r.range(0.8, 1.8);
      ctx.translate(S / 2 + ox, S / 2 + oy);
      ctx.rotate(ang);
      ctx.beginPath();
      if (kind === "lines" || kind === "grid") {
        for (let y = -S; y <= S; y += gap) {
          ctx.moveTo(-S, y);
          ctx.lineTo(S, y);
        }
        if (kind === "grid")
          for (let x = -S; x <= S; x += gap) {
            ctx.moveTo(x, -S);
            ctx.lineTo(x, S);
          }
      } else if (kind === "rings") {
        for (let rad = gap; rad < S; rad += gap) {
          ctx.moveTo(rad, 0);
          ctx.arc(0, 0, rad, 0, TAU);
        }
      } else {
        const spokes = r.between(40, 160);
        for (let i = 0; i < spokes; i++) {
          const a = (i / spokes) * TAU;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * S, Math.sin(a) * S);
        }
      }
      ctx.stroke();
      ctx.restore();
    }
    out.push(kinds.join(" × "));

    // a soft tint so the interference has a temperature
    ctx.save();
    ctx.globalCompositeOperation = p.dark ? "lighter" : "multiply";
    ctx.globalAlpha = 0.35;
    const g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, p.at(1, 0.5, p.chroma * 1.4));
    g.addColorStop(1, p.at(2, 0.42, p.chroma * 1.4));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.restore();
  },
};

/* ------------------------------------------------------------ 15 · reaction */

export const reaction: System = {
  id: "reaction",
  name: "Reaction",
  blurb:
    "Gray–Scott run for six hundred ticks; the feed and kill rates decide whether it grows spots, worms or a maze.",
  family: "field",
  draw(ctx, r, out) {
    const p = palette(r);
    const species = r.pick([
      { n: "spots", f: 0.03, k: 0.062 },
      { n: "worms", f: 0.058, k: 0.065 },
      { n: "maze", f: 0.029, k: 0.057 },
      { n: "coral", f: 0.0545, k: 0.062 },
      { n: "holes", f: 0.039, k: 0.058 },
      { n: "solitons", f: 0.03, k: 0.06 },
    ]);
    const N = 44;
    const iters = 620;
    out.push(species.n, `${N}² lattice`, `${iters} ticks`);

    const A = new Float32Array(N * N).fill(1);
    const B = new Float32Array(N * N);
    const A2 = new Float32Array(N * N);
    const B2 = new Float32Array(N * N);
    for (let s = 0; s < r.between(3, 7); s++) {
      const cx = r.int(N),
        cy = r.int(N),
        rad = r.between(2, 5);
      for (let y = -rad; y <= rad; y++)
        for (let x = -rad; x <= rad; x++) {
          if (x * x + y * y > rad * rad) continue;
          B[((cy + y + N) % N) * N + ((cx + x + N) % N)] = 1;
        }
    }

    const dA = 1,
      dB = 0.5,
      f = species.f,
      k = species.k;
    for (let it = 0; it < iters; it++) {
      for (let y = 0; y < N; y++) {
        const up = ((y - 1 + N) % N) * N,
          dn = ((y + 1) % N) * N,
          cn = y * N;
        for (let x = 0; x < N; x++) {
          const l = (x - 1 + N) % N,
            rgt = (x + 1) % N;
          const i = cn + x;
          const la =
            A[cn + l] +
            A[cn + rgt] +
            A[up + x] +
            A[dn + x] +
            0.25 * (A[up + l] + A[up + rgt] + A[dn + l] + A[dn + rgt]) -
            5 * A[i];
          const lb =
            B[cn + l] +
            B[cn + rgt] +
            B[up + x] +
            B[dn + x] +
            0.25 * (B[up + l] + B[up + rgt] + B[dn + l] + B[dn + rgt]) -
            5 * B[i];
          const ab2 = A[i] * B[i] * B[i];
          A2[i] = A[i] + (dA * la * 0.2 - ab2 + f * (1 - A[i]));
          B2[i] = B[i] + (dB * lb * 0.2 + ab2 - (k + f) * B[i]);
        }
      }
      A.set(A2);
      B.set(B2);
    }

    const stops = [
      rgb(p.bg),
      rgb(p.mix(0.4, p.dark ? 0.45 : 0.6, p.chroma * 1.3)),
      rgb(p.mix(1, p.dark ? 0.9 : 0.2, p.chroma * 0.9)),
    ];
    const { cv, ctx: bctx, img } = buffer(N);
    const d = img.data;
    for (let i = 0; i < N * N; i++) {
      const t = clamp((B[i] - 0.05) * 3.4, 0, 1);
      const seg = t < 0.5 ? 0 : 1;
      const u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
      const c0 = stops[seg],
        c1 = stops[seg + 1];
      const o = i * 4;
      d[o] = lerp(c0[0], c1[0], u);
      d[o + 1] = lerp(c0[1], c1[1], u);
      d[o + 2] = lerp(c0[2], c1[2], u);
      d[o + 3] = 255;
    }
    bctx.putImageData(img, 0, 0);
    blit(ctx, cv, true);

    // a crisp contour pulled back out of the smoothed field
    if (r.chance(0.6)) {
      out.push("contoured");
      ctx.strokeStyle = p.ink(p.dark ? 0.05 : 0.98, 0.5);
      ctx.lineWidth = 0.8;
      const q = S / N;
      ctx.beginPath();
      for (let y = 1; y < N; y++)
        for (let x = 1; x < N; x++) {
          const a = B[y * N + x] > 0.22,
            b = B[y * N + x - 1] > 0.22,
            c = B[(y - 1) * N + x] > 0.22;
          if (a !== b) {
            ctx.moveTo(x * q, y * q);
            ctx.lineTo(x * q, (y + 1) * q);
          }
          if (a !== c) {
            ctx.moveTo(x * q, y * q);
            ctx.lineTo((x + 1) * q, y * q);
          }
        }
      ctx.stroke();
    }
  },
};

export const fields = [filament, truchet, dither, moire, reaction];
