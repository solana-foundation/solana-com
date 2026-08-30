"use client";

import { useEffect, useRef } from "react";
import type { Viz, VizControls, VizPointer, VizQuality } from "./viz/types";

/** how many steps a poster is wound forward in. Enough for state to build up,
    few enough that thirty cards do not lock the main thread. */
const POSTER_STEPS = 48;

/* The rungs the adaptive ratio may stand on, highest first. Coarse on purpose:
   each change costs a reallocation of the canvas, the sheet mask and every
   level of the bloom chain, so there is no sense in a governor that can move
   by less than it can perceive. */
const DPR_LADDER = [2, 1.5, 1.25, 1, 0.8, 0.65];

/* What the governor watches, in milliseconds of frame interval.

   The interval rather than the time spent in `frame()`: the work that hurts on
   a weak machine is mostly the GPU's, and the draw call returns long before
   the GPU has finished with it. What the interval does capture is everything —
   shading, uploads, compositing — which is the only honest measure of whether
   the machine is keeping up.

   Asymmetric on purpose. Dropping below fifty frames a second is a fault worth
   acting on quickly; climbing back is a guess about spare capacity, so it asks
   for a much longer stretch of comfort and only then moves one rung. Without
   that gap a machine sitting exactly at the boundary oscillates, and a
   resolution that flickers is worse than either resolution. */
const SLOW_MS = 20;
const FAST_MS = 17.2;
const WINDOW = 60;
const CALM_ROUNDS = 5;
/* the first stretch after any resize is reallocation and cold shaders, and
   judging the machine on it would demote every page on load */
const SETTLE = 40;

/* Seconds at the end of the wind run at frame steps rather than strides.
   Comfortably longer than a mark takes to cross the frame, so everything that
   will be visible at the first paint was laid down at the pace it would have
   been laid down at while running. */
const LIVE_TAIL = 6;

/**
 * The one place a visualisation meets the browser.
 *
 * Every viz is a pure draw function, so all of the tedious parts — device
 * pixel ratio, resizing, the frame loop, not running when nobody is looking —
 * live here once instead of in each of them.
 *
 * Three behaviours are worth knowing about:
 *
 * Nothing draws until it is on screen. A gallery is mostly below the fold, and
 * a card that has never been seen has not cost a single frame.
 *
 * A card that is not being hovered draws a *poster* rather than animating.
 * Every viz opens on an empty stage, so a still at t=0 would be a black
 * rectangle — the clock is wound forward to `viz.poster` in a fixed number of
 * coarse steps, which is enough for the state to build up without replaying
 * every frame in between. That is the difference between a gallery that opens
 * instantly and one that hangs.
 *
 * When it does start animating it carries on from wherever the poster left the
 * clock, so hovering a card does not snap it back to the beginning.
 */
export default function VizCanvas({
  viz,
  quality,
  running,
  className,
  controls,
  maxDpr,
  adaptDpr,
}: {
  viz: Viz;
  quality: VizQuality;
  running: boolean;
  className?: string;
  controls?: VizControls;
  /** ceiling on the backing store's pixel ratio. Two is what a retina panel
      asks for and four times the pixels of one — every one of which is shaded
      twice by the bloom's full-size passes and uploaded to the GPU each frame.
      It is the cheapest thing in the whole renderer to trade. */
  maxDpr?: number;
  /** let a machine that cannot hold the frame rate lower its own resolution,
      never above `maxDpr`. Off by default: it has to be possible to measure
      the thing without it quietly moving underneath the measurement. */
  adaptDpr?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const clock = useRef(0);
  /* held in a ref rather than a dependency: a slider drag must retune the
     running picture, not tear it down and rebuild it */
  const ctl = useRef<VizControls>(controls ?? {});
  useEffect(() => {
    ctl.current = controls ?? {};
  }, [controls]);

  /* Same reasoning, one step further. A dependency here would rebuild the
     whole loop, and rebuilding calls `create()` again — which empties every
     row and starts the traffic from nothing. That is a poor way to compare
     two resolutions. The ratio is read through a ref and the canvas is
     re-measured in place instead, so the picture carries on across the
     change with only its buffers resized. */
  const dprCap = useRef(maxDpr ?? 2);
  const remeasure = useRef<(() => void) | null>(null);
  const adapting = useRef(adaptDpr ?? false);
  /* how far down the ladder the machine has been pushed. Kept out of the
     effect so a settled decision survives a re-render. */
  const dprStep = useRef(0);

  useEffect(() => {
    dprCap.current = maxDpr ?? 2;
    /* a new ceiling clears whatever the adaptation had settled on — the dial
       is an instruction, not a suggestion to be averaged with */
    dprStep.current = 0;
    remeasure.current?.();
  }, [maxDpr]);

  useEffect(() => {
    adapting.current = adaptDpr ?? false;
    if (!adaptDpr && dprStep.current !== 0) {
      dprStep.current = 0;
      remeasure.current?.();
    }
  }, [adaptDpr]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = running && !still;
    /* VizMount routes component pieces elsewhere, so this is always set */
    if (!viz.create) return;
    const frame = viz.create(quality);

    let w = 1;
    let h = 1;
    let raf = 0;
    let alive = true;
    let seen = false;
    /* per closure, like the state it fills — see `wake` */
    let wound = false;

    /* one object, mutated in place — a viz reads it during its frame and the
       click flag is cleared straight after, so a press is seen exactly once.
       Only wired at full size: on a card the click belongs to the card. */
    const pointer: VizPointer = { x: -1, y: -1, inside: false, clicked: false };
    const interactive = quality === "full";

    const at = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.inside = true;
    };
    /* A mouse only.

       A finger does not hover, so everything a touch could do here was a guess
       at what it meant. The first touch of a scroll is the same event as a
       press, so flicking the page down pinned cards; and a highlight tracking
       a finger reports a row as being considered when the page is only moving
       past it. Both were the picture answering gestures that were not aimed at
       it.

       The test is on the event, not the device: a touchscreen laptop with a
       mouse still gets the full behaviour through the mouse, and the same
       machine's screen stays inert. */
    const mouse = (e: PointerEvent) => e.pointerType === "mouse";
    const onMove = (e: PointerEvent) => {
      if (mouse(e)) at(e);
    };
    const onDown = (e: PointerEvent) => {
      if (!mouse(e)) return;
      at(e);
      pointer.clicked = true;
    };
    /* a press at the very edge can be followed by the leave before the frame
       that reads it, so a click waiting to be consumed holds the pointer where
       it was */
    const onLeave = () => {
      if (pointer.clicked) return;
      pointer.inside = false;
      pointer.x = -1;
      pointer.y = -1;
    };

    if (interactive) {
      cv.addEventListener("pointermove", onMove);
      cv.addEventListener("pointerdown", onDown);
      cv.addEventListener("pointerleave", onLeave);
    }

    const measure = () => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      /* The ceiling is the dial against what the display actually has — asking
         for 2 on a panel that reports 1 would be rendering four times the
         pixels to throw three of them away. Adaptation then walks down from
         there in fixed rungs rather than continuously, because every change
         reallocates the canvas, the mask and the bloom's whole chain, and a
         governor that nudges by hundredths would spend its life doing that.
         Below 1 is allowed: a machine that cannot hold the frame rate at its
         own resolution is better soft than stuttering. */
      const ceiling = Math.min(dprCap.current, window.devicePixelRatio || 1);
      const rung = DPR_LADDER.findIndex((v) => v <= ceiling + 1e-6);
      const d =
        rung < 0
          ? ceiling
          : DPR_LADDER[Math.min(DPR_LADDER.length - 1, rung + dprStep.current)];
      cv.width = Math.max(1, Math.round(r.width * d));
      cv.height = Math.max(1, Math.round(r.height * d));
      ctx.setTransform(d, 0, 0, d, 0, 0);
      w = r.width;
      h = r.height;
      return true;
    };
    /* handed out so a change of ratio can resize the canvas without this
       effect — and the picture's state with it — being torn down */
    remeasure.current = () => {
      measure();
    };

    /* these are stateful sketches — a still can only be reached by running
       them there, so wind the clock forward in coarse steps */
    const poster = () => {
      /* Two speeds, because the two halves of the wind are doing different
         jobs. The early part only has to get the endpoints into a plausible
         mood — how busy each is, where it sits in its slow swell — and coarse
         strides reach that as well as fine ones for a fraction of the work.

         The late part is what will actually be on screen: a mark lives about
         as long as it takes to cross the frame, so only the last few seconds
         survive to the first paint. Strode through coarsely, everything
         emitted in one stride lands in a clump and the stage opens visibly
         banded — ruled off into however many strides it took. At frame steps
         it arrives the way it would have if you had been watching. */
      const warmCtl = { ...ctl.current, __warm: true } as VizControls;
      const FINE = 1 / 60;
      let acc = 0;
      const wind = (until: number, step: number) => {
        while (acc < until - 1e-6) {
          const s = Math.min(step, until - acc);
          acc += s;
          frame(ctx, w, h, acc, s, pointer, warmCtl);
        }
      };
      wind(Math.max(0, viz.poster - LIVE_TAIL), viz.poster / POSTER_STEPS);
      wind(viz.poster, FINE);
      clock.current = viz.poster;
      wound = true;
      /* and one that is drawn, so there is a picture before the loop starts */
      frame(ctx, w, h, clock.current, FINE, pointer, ctl.current);
    };

    /* ── the governor ──
       Frame intervals gathered into a window, and every window's median put to
       one question: is this machine holding the rate at the resolution it has
       been given? The median rather than the mean, because a single long frame
       — a garbage collection, a tab waking up — should not be able to demote
       the picture on its own, and the mean lets it. */
    const marks: number[] = [];
    let settle = SETTLE;
    let calm = 0;
    const govern = (interval: number) => {
      if (!adapting.current) return;
      if (settle > 0) {
        settle--;
        return;
      }
      marks.push(interval);
      if (marks.length < WINDOW) return;
      marks.sort((a, b) => a - b);
      const median = marks[marks.length >> 1];
      marks.length = 0;

      if (median > SLOW_MS && dprStep.current < DPR_LADDER.length - 1) {
        dprStep.current++;
        calm = 0;
        settle = SETTLE;
        measure();
        return;
      }
      /* room to spare, and it has lasted. One rung back, then prove it again. */
      if (median < FAST_MS && dprStep.current > 0) {
        if (++calm >= CALM_ROUNDS) {
          dprStep.current--;
          calm = 0;
          settle = SETTLE;
          measure();
        }
        return;
      }
      calm = 0;
    };

    const start = () => {
      let prev = performance.now();
      const loop = (now: number) => {
        if (!alive) return;
        const interval = now - prev;
        const dt = Math.min(0.05, interval / 1000);
        prev = now;
        clock.current += dt;
        frame(ctx, w, h, clock.current, dt, pointer, ctl.current);
        pointer.clicked = false;
        /* after the frame, so a resize takes effect on the next one rather
           than resizing the canvas out from under a draw already in progress */
        govern(interval);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!measure()) return;
      if (animate) {
        /* give it a populated first frame so it does not fade up from black */
        /* Wound because *this* frame closure has not been, not because the
           clock is early.

           The clock outlives the closure and the state does not. Every run of
           this effect calls `viz.create` again and gets a picture with nothing
           in it, while `clock.current` still reads whatever the last run left
           — so a guard on the clock skips the wind for any instance after the
           first and opens that one on an empty stage. In development that is
           every load, because effects are mounted twice: the instance you end
           up looking at is the one that was never filled. It showed as a hero
           that starts bare and fills from the entry edge over the few seconds
           it takes a mark to cross. */
        if (!wound) poster();
        start();
      } else {
        poster();
      }
    };

    /* setting .width clears the canvas, so a resize blanks anything that is
       not in the frame loop. A poster has to redraw itself; a running loop
       repaints on its own next tick. */
    const ro = new ResizeObserver(() => {
      if (!seen) return;
      if (measure() && !animate) poster();
    });

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || seen) return;
        seen = true;
        wake();
      },
      { rootMargin: "300px" },
    );

    io.observe(cv);

    /* An observer answers on its own schedule, and its first answer is a frame
       or more away — which for a canvas that is already on screen is a frame
       or more of nothing, and on the hero that is the whole opening shot. So
       the question is also asked directly, and if the answer is obviously yes
       the wind starts now. The observer keeps its job for everything below the
       fold, where waiting is the entire point of having it. */
    const box = cv.getBoundingClientRect();
    if (!seen && box.bottom > -300 && box.top < window.innerHeight + 300) {
      seen = true;
      wake();
    }
    ro.observe(cv);

    return () => {
      alive = false;
      remeasure.current = null;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      if (interactive) {
        cv.removeEventListener("pointermove", onMove);
        cv.removeEventListener("pointerdown", onDown);
        cv.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [viz, quality, running]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
