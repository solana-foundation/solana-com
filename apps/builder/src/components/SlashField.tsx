"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

/*
 * The slash field: the BLDR pattern, generated rather than drawn. Rows of
 * bars are cut at 45 degrees along seeded "lines"; scrolling scrubs the field
 * in cut by cut from the left, and a click deals a new field.
 *
 * Ported from the design studio's pattern engine; the constants are theirs.
 */
const GAP = 0.18;
const COL = 0.76;
const RND = 0.06;
const T = Math.tan((45 * Math.PI) / 180);
const S = { stacks: 6, lines: 55, span: 45, repeat: 35, slits: 35, square: 10 };

type Pt = [number, number];
type Piece = { path: Path2D; x: number };

function prng(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function barPts(
  x0: number,
  x1: number,
  yt: number,
  yb: number,
  left: string,
  right: string,
): Pt[] {
  const run = Math.min((yb - yt) / T, (x1 - x0) * 0.84);
  const v = run * T;
  const tl: Pt[] =
    left === "f"
      ? [
          [x0, yt + v],
          [x0 + run, yt],
        ]
      : [[x0, yt]];
  const br: Pt[] =
    right === "f"
      ? [
          [x1, yb - v],
          [x1 - run, yb],
        ]
      : [[x1, yb]];
  return [...tl, [x1, yt], ...br, [x0, yb]];
}

const fx = (v: number) => +v.toFixed(2);

/** Path data for a polygon with its corners rounded by `r`. */
function roundD(pts: Pt[], r: number) {
  const p: Pt[] = [];
  for (const q of pts) {
    const l = p[p.length - 1];
    if (!l || Math.abs(l[0] - q[0]) + Math.abs(l[1] - q[1]) > 0.01) p.push(q);
  }
  while (
    p.length > 2 &&
    Math.abs(p[0]![0] - p[p.length - 1]![0]) +
      Math.abs(p[0]![1] - p[p.length - 1]![1]) <=
      0.01
  )
    p.pop();
  const n = p.length;
  if (n < 3) return "";
  let d = "";
  for (let i = 0; i < n; i++) {
    const P = p[(i + n - 1) % n]!;
    const V = p[i]!;
    const N = p[(i + 1) % n]!;
    const ax = V[0] - P[0];
    const ay = V[1] - P[1];
    const bx = N[0] - V[0];
    const by = N[1] - V[1];
    const lp = Math.hypot(ax, ay);
    const ln = Math.hypot(bx, by);
    const cr = ax * by - ay * bx;
    const phi = Math.atan2(Math.abs(cr), ax * bx + ay * by);
    const tl = Math.min(r * Math.tan(phi / 2), lp / 2, ln / 2);
    const rr = phi > 1e-6 ? tl / Math.tan(phi / 2) : 0;
    const A: Pt = [V[0] - (ax / lp) * tl, V[1] - (ay / lp) * tl];
    const B: Pt = [V[0] + (bx / ln) * tl, V[1] + (by / ln) * tl];
    d += `${i === 0 ? "M" : "L"}${fx(A[0])} ${fx(A[1])}`;
    d +=
      rr > 0.01
        ? `A${fx(rr)} ${fx(rr)} 0 0 ${cr > 0 ? 1 : 0} ${fx(B[0])} ${fx(B[1])}`
        : `L${fx(B[0])} ${fx(B[1])}`;
  }
  return `${d}Z`;
}

function field(W: number, H: number, seed: number): Piece[] {
  const out: Piece[] = [];
  const rnd = prng(seed);
  const R = S.stacks * 3;
  const B = H / (R + (R - 1) * GAP);
  const g = B * GAP;
  const c = B * COL;
  const pitch = B + g;
  const run = B / T;
  const rad = RND * B;
  const NC = Math.ceil(W / c) + R + 6;
  const x0 = -c * (R + 3);
  const lines: {
    col: number;
    r0: number;
    r1: number;
    kind: string;
    slit: boolean;
  }[] = [];
  const n = Math.round(NC * S.stacks * (0.02 + (S.lines / 100) * 0.12));
  const mkLine = (col: number, st: number, len: number) => {
    const r0 = rnd();
    lines.push({
      col,
      r0: st * 3,
      r1: Math.min(R, (st + len) * 3),
      kind: r0 < S.square / 100 ? "q" : "f",
      slit: rnd() < S.slits / 100,
    });
  };
  for (let i = 0; i < n; i++) {
    const st = Math.floor(rnd() * S.stacks);
    const len =
      1 + Math.floor(Math.pow(rnd(), 1.5) * (1 + (S.span / 100) * S.stacks));
    const col = Math.floor(rnd() * NC);
    mkLine(col, st, len);
    if (rnd() < S.repeat / 100) {
      const step = 2 + Math.floor(rnd() * 4);
      const times = 1 + Math.floor(rnd() * 3);
      for (let j = 1; j <= times; j++) mkLine(col + j * step, st, len);
    }
  }
  const ink = (on: boolean, pts: Pt[]) => {
    if (!on) return;
    const d = roundD(pts, rad);
    if (d)
      out.push({ path: new Path2D(d), x: Math.min(...pts.map((q) => q[0])) });
  };
  for (let r = 0; r < R; r++) {
    const yt = r * pitch;
    const yb = yt + B;
    const cuts = lines
      .filter((L) => r >= L.r0 && r < L.r1)
      .map((L) => ({
        x: x0 + (L.kind === "q" ? L.col : L.col - (r - L.r0)) * c,
        kind: L.kind,
        slit: L.slit,
        end: false,
      }))
      .sort((a, b) => a.x - b.x);
    const kept: typeof cuts = [];
    const minW = run + c * 0.9;
    for (const q of cuts)
      if (!kept.length || q.x - kept[kept.length - 1]!.x >= minW) kept.push(q);
    let on = Math.floor(r / 3) % 2 === 0;
    let left = -c * 2;
    let lk = "q";
    let lslit = false;
    for (const q of [
      ...kept,
      { x: W + c * 2 + run, kind: "q", slit: false, end: true },
    ]) {
      const xa = lk === "f" ? left - run : left;
      const slitR = q.slit && !q.end;
      ink(
        on,
        barPts(
          xa + (lslit ? g / 2 : 0),
          q.x - (slitR ? g / 2 : 0),
          yt,
          yb,
          lk,
          q.end ? "q" : q.kind,
        ),
      );
      if (!slitR) on = !on;
      left = q.x;
      lk = q.end ? "q" : q.kind;
      lslit = slitR;
    }
  }
  return out;
}

export function SlashField({ label }: { label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = Boolean(useReducedMotion());
  const state = useRef({
    seed: 20261028,
    pieces: [] as Piece[],
    w: 0,
    h: 0,
    progress: -1,
  });
  const draw = useRef<(rebuild: boolean) => void>(() => {});

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const s = state.current;

    draw.current = (rebuild) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = cv.clientWidth;
      const H = cv.clientHeight;
      if (!W || !H) return;
      if (rebuild || W !== s.w || H !== s.h) {
        s.w = W;
        s.h = H;
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        s.pieces = field(W, H, s.seed);
        s.progress = -1;
      }
      const rect = cv.getBoundingClientRect();
      const vh = window.innerHeight;
      // Scroll scrubs the field in, in 40 steps, as the band rises up the screen.
      let p = reduced
        ? 1
        : Math.max(
            0,
            Math.min(1, (vh - rect.top) / (vh * 0.75 + rect.height * 0.25)),
          );
      p = Math.round(p * 40) / 40;
      if (p === s.progress) return;
      s.progress = p;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#7745FF";
      const limit = -W * 0.1 + p * W * 1.25;
      for (const q of s.pieces) if (q.x <= limit) ctx.fill(q.path);
    };

    draw.current(true);
    const ro = new ResizeObserver(() => draw.current(false));
    ro.observe(cv);
    return () => ro.disconnect();
  }, [reduced]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => draw.current(false));

  return (
    <div className="surface-black">
      <canvas
        ref={canvas}
        role="img"
        aria-label={label}
        onClick={() => {
          const s = state.current;
          s.seed = (s.seed * 48271 + 11) % 2147483647;
          draw.current(true);
        }}
        className="block h-[clamp(150px,24vw,340px)] w-full cursor-pointer"
      />
    </div>
  );
}
