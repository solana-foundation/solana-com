"use client";

import { useEffect, useRef } from "react";

/**
 * Hero illustration for /privacy, after the brochure cover: payment data
 * drifts through three wireframe boxes, scattered in the first and settled
 * into ordered, encrypted layers by the third. Decorative only.
 */

const BOX_CENTERS = [-1.05, 0, 1.05] as const;
const HALF = 0.36;
const SPAN_START = -1.85;
const SPAN_END = 1.75;
const PARTICLES = 720;
/** World units per second. */
const SPEED = 0.07;

const PALETTE = ["#4FD1C5", "#4B85E4", "#7F5AF6", "#9945FF"] as const;
const BANDS = [
  { y: -0.19, color: "#4FD1C5" },
  { y: 0, color: "#4B85E4" },
  { y: 0.19, color: "#9945FF" },
] as const;

type Particle = {
  x: number;
  y: number;
  z: number;
  band: number;
  jitter: number;
  color: string;
  size: number;
};

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function mixColor(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const c = (i: number) => Math.round(ca[i] + (cb[i] - ca[i]) * t);
  return `rgb(${c(0)}, ${c(1)}, ${c(2)})`;
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function spawn(x: number): Particle {
  return {
    x,
    y: (Math.random() * 2 - 1) * HALF * 0.92,
    z: (Math.random() * 2 - 1) * HALF * 0.92,
    band: Math.floor(Math.random() * BANDS.length),
    jitter: (Math.random() * 2 - 1) * 0.012,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    size: 1.1 + Math.random() * 0.9,
  };
}

/** Cube edges as pairs of corner indexes. */
const EDGES: ReadonlyArray<[number, number]> = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [4, 5],
  [5, 7],
  [7, 6],
  [6, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

export function PrivacyHeroArt({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    const particles = Array.from({ length: PARTICLES }, () =>
      spawn(SPAN_START + Math.random() * (SPAN_END - SPAN_START)),
    );

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();
    let elapsed = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Project a world point with a slow camera sway and gentle tilt. */
    const project = (x: number, y: number, z: number) => {
      const yaw = -0.42 + Math.sin(elapsed * 0.08) * 0.06;
      const pitch = 0.2;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const depth = 4.2 + z2;
      const scale = (Math.min(width, height * 1.9) * 1.18) / depth;
      return {
        sx: width / 2 + x1 * scale,
        sy: height / 2 + y2 * scale,
        depth,
      };
    };

    const drawBoxes = () => {
      ctx.lineWidth = 1;
      for (const [index, cx] of BOX_CENTERS.entries()) {
        const corners = [];
        for (let i = 0; i < 8; i++) {
          corners.push(
            project(
              cx + (i & 1 ? HALF : -HALF),
              i & 2 ? HALF : -HALF,
              i & 4 ? HALF : -HALF,
            ),
          );
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.16 + index * 0.05})`;
        ctx.beginPath();
        for (const [a, b] of EDGES) {
          ctx.moveTo(corners[a].sx, corners[a].sy);
          ctx.lineTo(corners[b].sx, corners[b].sy);
        }
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      drawBoxes();
      for (const p of particles) {
        // 0 in the first box, about half in the second, settled in the third.
        const order = smoothstep(-0.85, 0.9, p.x);
        const band = BANDS[p.band];
        const y = p.y + (band.y + p.jitter - p.y) * order;
        const z = p.z * (1 - order * 0.55);
        const { sx, sy, depth } = project(p.x, y, z);
        const fade =
          smoothstep(SPAN_START, SPAN_START + 0.45, p.x) *
          (1 - smoothstep(SPAN_END - 0.3, SPAN_END, p.x));
        if (fade <= 0) continue;
        const inside = BOX_CENTERS.some((c) => Math.abs(p.x - c) <= HALF);
        ctx.globalAlpha = fade * (inside ? 0.9 : 0.35) * (4.6 / depth);
        ctx.fillStyle = mixColor(p.color, band.color, order);
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      for (const p of particles) {
        p.x += SPEED * dt;
        if (p.x > SPAN_END) Object.assign(p, spawn(SPAN_START));
      }
      draw();
      if (visible && !reduceMotion) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion || !visible) draw();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      const nowVisible = entry?.isIntersecting ?? false;
      if (nowVisible === visible) return;
      visible = nowVisible;
      if (visible && !reduceMotion) start();
      else cancelAnimationFrame(frame);
    });
    intersectionObserver.observe(canvas);

    // Follow the visitor's motion preference while the page is open.
    const onMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      if (reduceMotion) {
        cancelAnimationFrame(frame);
        draw();
      } else if (visible) start();
    };
    motionQuery.addEventListener("change", onMotionChange);

    if (reduceMotion) draw();
    else start();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div aria-hidden="true" className={`relative ${className ?? ""}`}>
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden font-brand-mono text-[10px] leading-[14px] tracking-[0.4em] text-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]">
        {BINARY_ROWS.map((row, i) => (
          <div key={i} className="whitespace-nowrap">
            {row}
          </div>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        className="relative block aspect-[16/10] w-full"
      />
    </div>
  );
}

/** Static binary field behind the boxes, like the brochure cover. */
const BINARY_ROWS = Array.from({ length: 34 }, (_, row) =>
  Array.from({ length: 64 }, (_, col) =>
    (row * 31 + col * 17 + ((row * col) % 7)) % 3 === 0 ? "1" : "0",
  ).join(""),
);
