"use client";

import React, { useEffect, useRef } from "react";
import type { Snapshot } from "./useSlotClock";
import type { LeaderSchedule } from "./useLeaderSchedule";

export interface LaneCopy {
  label: string;
  sublabel: string;
}

interface SchedulePulseProps {
  /** Live clock snapshot (referentially stable between refetches). */
  snap: Snapshot | null;
  /** Live cohort schedule (referentially stable between refetches). */
  schedule: LeaderSchedule | null;
  /** Lane 0 = legacy (400 ms-era software), lane 1 = upgraded. */
  lanes: [LaneCopy, LaneCopy];
  className?: string;
}

const LANE_H = 120;
const LANE_H_SM = 96;
const HEAD_PAD = 26;
const COMPLEX_MS = 150;
const LANE_COLORS = ["#9E7BDD", "#14F195"] as const;

function hexA(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Stylized PQRST-ish complex; u = ms since the beat, returns -0.3..1. */
function ecgY(u: number): number {
  const s = u / COMPLEX_MS;
  if (s < 0 || s >= 1) return 0;
  if (s < 0.08) return -0.1 * (s / 0.08);
  if (s < 0.17) return -0.1 + 1.1 * ((s - 0.08) / 0.09);
  if (s < 0.26) return 1.0 - 1.3 * ((s - 0.17) / 0.09);
  if (s < 0.38) return -0.3 + 0.3 * ((s - 0.26) / 0.12);
  if (s >= 0.52 && s < 0.82)
    return 0.16 * Math.sin(((s - 0.52) / 0.3) * Math.PI);
  return 0;
}

interface InternalClock {
  slot0: number; // fractional slot at t0
  t0: number; // Date.now() ms
  msPerSlot: number; // may carry a gentle drift correction
}

/**
 * The hero monitor, driven by real mainnet data: every beat is one upcoming
 * block from the live leader schedule, landing on the lane of its producer's
 * cohort — validators already running the 200 ms-ready release vs validators
 * still on 400 ms-era software. Pace comes from the measured slot time.
 *
 * Rendering notes, learned the hard way:
 * - The mount effect runs ONCE; live data flows in through refs. Re-running
 *   the effect on data ticks tears down the rAF loop and reads as jerky.
 * - No per-frame shadowBlur: each lane's ECG complex is prerendered to a
 *   sprite (glow baked in as layered strokes) and blitted at subpixel
 *   positions — cheap enough to never miss a frame.
 * - The clock never jumps on refetch: it rebases continuously and absorbs
 *   drift by slewing the slot rate for a few seconds.
 */
export const SchedulePulse: React.FC<SchedulePulseProps> = ({
  snap,
  schedule,
  lanes,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<InternalClock | null>(null);
  const scheduleRef = useRef<LeaderSchedule | null>(null);

  // fold each new snapshot into the running clock without a visible jump
  useEffect(() => {
    if (!snap) return;
    const now = Date.now();
    const target =
      snap.data.absoluteSlot + (now - snap.fetchedAt) / snap.data.avgSlotMs;
    const prev = clockRef.current;
    if (!prev) {
      clockRef.current = {
        slot0: target,
        t0: now,
        msPerSlot: snap.data.avgSlotMs,
      };
      return;
    }
    const current = prev.slot0 + (now - prev.t0) / prev.msPerSlot;
    // absorb the error over ~20 s by adjusting the rate, not the position
    const err = target - current;
    const effRate = 1 / snap.data.avgSlotMs + err / 20_000;
    clockRef.current = {
      slot0: current,
      t0: now,
      msPerSlot: effRate > 0 ? 1 / effRate : snap.data.avgSlotMs,
    };
  }, [snap]);

  useEffect(() => {
    scheduleRef.current = schedule;
  }, [schedule]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let laneH = LANE_H;
    let pxPerMs = 0.4;
    const sprites: (HTMLCanvasElement | null)[] = [null, null];

    function buildSprite(lane: number): HTMLCanvasElement {
      const emphasis = lane === 1;
      const color = LANE_COLORS[lane];
      const amp = laneH * 0.4;
      const baseY = laneH * 0.66;
      const spriteW = Math.ceil(COMPLEX_MS * pxPerMs) + 12;
      const c = document.createElement("canvas");
      c.width = Math.ceil(spriteW * dpr);
      c.height = Math.ceil(laneH * dpr);
      const sctx = c.getContext("2d")!;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.lineJoin = "round";
      sctx.lineCap = "round";
      const passes: [number, number][] = emphasis
        ? [
            [8, 0.1],
            [4.5, 0.22],
            [2.2, 1],
          ]
        : [
            [5, 0.1],
            [1.9, 0.95],
          ];
      for (const [lw, alpha] of passes) {
        sctx.strokeStyle = hexA(color, alpha);
        sctx.lineWidth = lw;
        sctx.beginPath();
        for (let u = 0; u <= COMPLEX_MS; u += 1) {
          const x = 6 + u * pxPerMs;
          const y = baseY - ecgY(u) * amp;
          if (u === 0) sctx.moveTo(x, y);
          else sctx.lineTo(x, y);
        }
        sctx.stroke();
      }
      return c;
    }

    function resize() {
      if (!canvas || !wrap) return;
      const small = window.innerWidth < 768;
      laneH = small ? LANE_H_SM : LANE_H;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = wrap.clientWidth;
      h = 2 * laneH;
      const visibleMs = w > 900 ? 3000 : 2000;
      pxPerMs = (w - HEAD_PAD) / visibleMs;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
      wrap.style.setProperty("--s2-lane-h", `${laneH}px`);
      sprites[0] = buildSprite(0);
      sprites[1] = buildSprite(1);
    }

    /** "1" → lane 1 (upgraded), anything else → lane 0. Wraps past the end. */
    function laneOfSlot(slot: number, sched: LeaderSchedule): number {
      const len = sched.bits.length;
      if (len === 0) return 1;
      const idx = (((slot - sched.scheduleStart) % len) + len) % len;
      return sched.bits.charCodeAt(idx) === 49 ? 1 : 0;
    }

    function draw() {
      if (!ctx) return;
      const now = Date.now();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const headX = w - HEAD_PAD;
      const visibleMs = headX / pxPerMs;

      // timing grid: a faint hairline every 100 ms so the eye can count
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.lineWidth = 1;
      for (let ms = 0; ms <= visibleMs; ms += 100) {
        const x = headX - ms * pxPerMs;
        ctx.beginPath();
        ctx.moveTo(x, 6);
        ctx.lineTo(x, h - 6);
        ctx.stroke();
      }

      // baselines
      for (let lane = 0; lane < 2; lane++) {
        const baseY = lane * laneH + laneH * 0.66;
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.lineTo(w, baseY);
        ctx.stroke();
      }

      const clock = clockRef.current;
      const sched = scheduleRef.current;
      const lastBeatAt: [number, number] = [-Infinity, -Infinity];

      if (clock && sched) {
        const slotF = clock.slot0 + (now - clock.t0) / clock.msPerSlot;
        const slotTime = (s: number) =>
          clock.t0 + (s - clock.slot0) * clock.msPerSlot;
        const firstVisible = Math.floor(slotF - visibleMs / clock.msPerSlot);
        // beats: one sprite per slot boundary inside the window
        for (let s = firstVisible; s <= Math.floor(slotF); s++) {
          const t = slotTime(s);
          const x = headX - (now - t) * pxPerMs;
          if (x < -COMPLEX_MS * pxPerMs - 12) continue;
          const lane = laneOfSlot(s, sched);
          if (t > lastBeatAt[lane]) lastBeatAt[lane] = t;
          const sprite = sprites[lane];
          if (!sprite) continue;
          // older beats fade toward the past
          ctx.globalAlpha = Math.min(1, Math.max(0.12, x / (w * 0.35)));
          ctx.drawImage(
            sprite,
            x - 6,
            lane * laneH,
            sprite.width / dpr,
            sprite.height / dpr,
          );
        }
        ctx.globalAlpha = 1;
      }

      // write heads: a dot per lane riding its waveform, flashing on beats
      for (let lane = 0; lane < 2; lane++) {
        const baseY = lane * laneH + laneH * 0.66;
        const amp = laneH * 0.4;
        const sinceBeat = now - lastBeatAt[lane];
        const y =
          sinceBeat >= 0 && sinceBeat < COMPLEX_MS
            ? baseY - ecgY(sinceBeat) * amp
            : baseY;
        const color = LANE_COLORS[lane];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(headX, y, lane === 1 ? 4 : 3.2, 0, Math.PI * 2);
        ctx.fill();
        const glow = Math.max(0, 1 - sinceBeat / 220);
        if (glow > 0) {
          ctx.fillStyle = hexA(color, 0.35 * glow);
          ctx.beginPath();
          ctx.arc(headX, y, 4 + 14 * (1 - glow), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw();
    });
    ro.observe(wrap);

    if (reduceMotion) {
      // one static frame; re-drawn when data lands via a slow interval
      draw();
      const iv = setInterval(draw, 2000);
      return () => {
        clearInterval(iv);
        ro.disconnect();
      };
    }

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <div className="relative">
        {lanes.map((lane, i) => (
          <div
            key={i}
            className="pointer-events-none absolute left-0 z-10 flex items-center gap-2.5 font-brand-mono text-[11px] md:text-xs uppercase tracking-[0.16em]"
            style={{ top: `calc(${i} * var(--s2-lane-h, 120px) + 8px)` }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: LANE_COLORS[i] }}
            />
            <span style={{ color: LANE_COLORS[i] }}>{lane.label}</span>
            <span className="hidden sm:inline text-nd-mid-em-text-alpha normal-case tracking-normal">
              {lane.sublabel}
            </span>
          </div>
        ))}
        <canvas ref={canvasRef} className="block w-full" aria-hidden />
      </div>
    </div>
  );
};
