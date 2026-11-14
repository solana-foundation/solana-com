"use client";

import { useEffect, useRef } from "react";
import { INTRO_DONE_EVENT } from "./HeroIntro";
import { useReducedMotion } from "./useReducedMotion";

/** How long the page rests at its bottom before Forge looks in. */
const SETTLE_MS = 400;
/** How close (px) to the end of the page counts as the bottom. */
const BOTTOM_PX = 8;
/** Longest he waits for the hero intro before he may come anyway. */
const INTRO_WAIT_MS = 6000;
/** One floss swing there and back: the page's quarter-turn time. */
const BEAT_MS = 560;
const SWINGS = 8;

/*
 * The show's cues, in ms from the start. Forge peeks, loses his nerve, peeks
 * again, lifts his visor, blinks, looks both ways, climbs up and flosses.
 */
const PEEK_AT = 0;
const SHY_AT = 1000;
const PEEK_AGAIN_AT = 1500;
const VISOR_AT = 2100;
const VISOR_MS = 320;
const BLINKS_AT = [2800, 3050, 3500, 4800];
const LOOK_LEFT_AT = 3900;
const LOOK_RIGHT_AT = 4300;
const CLIMB_AT = 5100;
const DANCE_AT = 5700;
const LEAVE_AT = DANCE_AT + BEAT_MS * SWINGS + 120;

/** How far down Forge hangs (of his own height) at each stage of the peek. */
const HIDDEN = "translateY(100%)";
const PEEKING = "translateY(63%)";
const SHY = "translateY(80%)";
const STANDING = "translateY(0%)";

/* Forge comes in one dress: white on black, violet head, cyan brow. */
const WHITE = "#F5F4FA";
const VIOLET = "#7745FF";
const CYAN = "#2EC6F5";
const BLACK = "#000";

/* Artwork box: the robot is 494.69 wide; the margins hold the sparks. */
const VIEW = { x: -50, y: 0, w: 595, h: 494 };

/* What sends him back down. Pointer moves and wheel turns do not: someone who
 * has just scrolled to the bottom is still doing both. */
const INPUT_EVENTS = ["pointerdown", "keydown", "scroll", "resize"] as const;

const painted = (colour: string) => {
  const [r, g, b, a = 1] = (colour.match(/[\d.]+/g) ?? []).map(Number);
  return b !== undefined && a > 0 ? ([r, g, b] as number[]) : null;
};

/** Whether an element draws something Forge should not stand in front of. */
function isDrawn(el: Element) {
  if (el instanceof SVGElement) return el instanceof SVGSVGElement;
  if (el.matches("img, canvas, video, a, button, input, textarea")) return true;
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) return true;
  }
  const style = getComputedStyle(el);
  return (
    style.backgroundImage !== "none" || painted(style.backgroundColor) !== null
  );
}

/**
 * Where Forge stands: on the bottom of the screen, in front of the footer's
 * black ground, wherever he covers nothing, at the largest size that fits.
 * Returns nothing when the screen has no such place (the footer is out of
 * view, or too full, as on phones); he waits for another view.
 */
function pickSpot(fullWidth: number) {
  // He comes smaller where the full figure does not fit.
  const sizes = [1, 0.85, 0.7, 0.6]
    .map((scale) => Math.round(fullWidth * scale))
    .filter((width, i) => i === 0 || width >= 110)
    .map((width) => ({
      width,
      height: Math.round((width * VIEW.h) / VIEW.w),
    }));
  const viewH = window.innerHeight;
  const viewW = document.documentElement.clientWidth;
  const footer = document.querySelector("footer");
  const ground = footer?.getBoundingClientRect();
  if (!footer || !ground) return null;
  const onScreen = (box: DOMRect) =>
    box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < viewH;

  // Everything drawn on screen, as boxes to keep clear of.
  const drawn: DOMRect[] = [];
  for (const el of footer.querySelectorAll("*")) {
    const box = el.getBoundingClientRect();
    if (onScreen(box) && isDrawn(el)) drawn.push(box);
  }

  // He rises from the bottom of the screen. Right of centre first on wide
  // screens.
  const places =
    viewW < 768 ? [0.5, 0.74, 0.26] : [0.68, 0.5, 0.32, 0.84, 0.16, 0.92, 0.08];

  const y = viewH;
  for (const place of places) {
    for (const { width, height } of sizes) {
      const left = Math.round(
        Math.min(viewW - width - 8, Math.max(8, viewW * place - width / 2)),
      );
      const top = y - height;
      const right = left + width;

      // All of him in front of the footer.
      if (ground.top > top || ground.bottom < y - 1) continue;
      if (
        drawn.some(
          (box) =>
            box.left < right &&
            box.right > left &&
            box.top < y &&
            box.bottom > top,
        )
      ) {
        continue;
      }
      // Anything laid over the page (the cookie notice, the menu button).
      const across = [0, 1, 2, 3, 4, 5].map((n) => n / 5);
      const covered = across.some((h) =>
        across.some(
          (v) =>
            !document
              .elementFromPoint(
                left + 2 + h * (width - 4),
                top + 2 + v * (height - 4),
              )
              ?.closest("footer"),
        ),
      );
      if (!covered) return { left, top, width, height };
    }
  }
  return null;
}

/**
 * Forge, the easter egg at the end of the page. Scroll to the bottom and he
 * peeks up from the bottom of the screen, lifts his visor, blinks, then climbs
 * up and flosses.
 * Any input sends him back down. He dances once per page load.
 *
 * He is always white on black with a violet head, so he only stands in front
 * of the footer's black ground.
 * Motion is the Web Animations API in hard steps, as elsewhere on the page.
 */
export function Forge() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || !("animate" in root)) return;

    const svg = root.querySelector("svg")!;
    const part = (name: string) =>
      root.querySelector<SVGElement>(`[data-p="${name}"]`)!;

    let idleTimer = 0;
    let leaveTimer = 0;
    // `?peek=true` is for testing: he comes every time the page reaches its
    // bottom, instead of dancing once.
    const testing =
      new URLSearchParams(window.location.search).get("peek") === "true";
    // He waits for the hero intro to play.
    let ready = !document.querySelector("[data-bldr-intro]");
    let danced = false;
    let startedAt = 0;
    let leaving = false;
    let running: Animation[] = [];

    /** A move in hard steps that keeps its end state. */
    const step = (
      el: Element,
      from: Keyframe,
      to: Keyframe,
      at: number,
      duration: number,
      steps: number,
    ) =>
      running.push(
        el.animate([from, to], {
          delay: at,
          duration,
          easing: `steps(${steps}, end)`,
          fill: "forwards",
        }),
      );

    /** A pose held for a moment, then dropped. */
    const hold = (el: Element, pose: Keyframe, at: number, duration: number) =>
      running.push(el.animate([pose, pose], { delay: at, duration }));

    /** One side to the other and back, two steps each way, for the dance. */
    const swing = (el: Element, a: Keyframe, b: Keyframe) =>
      running.push(
        el.animate(
          [
            { ...a, easing: "steps(2, end)" },
            { ...b, easing: "steps(2, end)" },
            a,
          ],
          { delay: DANCE_AT, duration: BEAT_MS, iterations: SWINGS },
        ),
      );

    const shift = (px: number) => ({ transform: `translateX(${px}px)` });

    const hide = () => {
      window.clearTimeout(leaveTimer);
      for (const animation of running) animation.cancel();
      running = [];
      root.style.display = "";
      startedAt = 0;
      leaving = false;
    };

    /** Drop out of sight from wherever he is, then clear up. */
    const leave = () => {
      if (!startedAt || leaving) return;
      leaving = true;
      if (performance.now() - startedAt >= DANCE_AT) danced = !testing;
      window.clearTimeout(leaveTimer);

      const now = new DOMMatrixReadOnly(getComputedStyle(svg).transform).m42;
      const drop = svg.animate(
        [{ transform: `translateY(${now}px)` }, { transform: HIDDEN }],
        { duration: 220, easing: "steps(3, end)", fill: "forwards" },
      );
      running.push(drop);
      drop.onfinish = hide;
    };

    const start = () => {
      if (danced || startedAt || document.hidden) return;

      const spot = pickSpot(
        Math.round(Math.min(220, Math.max(136, window.innerWidth * 0.14))),
      );
      if (!spot) return;

      root.style.left = `${spot.left}px`;
      root.style.top = `${spot.top}px`;
      root.style.width = `${spot.width}px`;
      root.style.height = `${spot.height}px`;
      root.style.display = "block";
      startedAt = performance.now();

      const at = (transform: string) => ({ transform });
      const eyes = part("eyes");
      const visor = part("visor");

      // Peek, think better of it, peek again.
      step(svg, at(HIDDEN), at(PEEKING), PEEK_AT, 360, 4);
      step(svg, at(PEEKING), at(SHY), SHY_AT, 120, 2);
      step(svg, at(SHY), at(PEEKING), PEEK_AGAIN_AT, 180, 3);

      // The visor rides up onto the brow, which takes its colour.
      step(
        visor,
        at("translateY(0)"),
        at("translateY(-90px)"),
        VISOR_AT,
        VISOR_MS,
        4,
      );
      const visorUp = VISOR_AT + VISOR_MS;
      step(visor, { opacity: 0 }, { opacity: 0 }, visorUp, 1, 1);
      step(part("cap"), { fill: CYAN }, { fill: CYAN }, visorUp, 1, 1);

      for (const blink of BLINKS_AT) hold(eyes, at("scaleY(0.08)"), blink, 90);
      hold(eyes, shift(-24), LOOK_LEFT_AT, 340);
      hold(eyes, shift(24), LOOK_RIGHT_AT, 340);

      step(svg, at(PEEKING), at(STANDING), CLIMB_AT, 400, 5);

      // The floss: arms one way, hips the other.
      swing(part("arms"), shift(-46), shift(46));
      swing(part("hips"), shift(26), shift(-26));
      swing(part("legs"), shift(8), shift(-8));
      swing(part("shoulders"), shift(12), shift(-12));
      swing(
        part("head"),
        at("translateX(-8px) rotate(-4deg)"),
        at("translateX(8px) rotate(4deg)"),
      );
      const flash = (el: Element, first: number) =>
        running.push(
          el.animate(
            [
              { opacity: first, easing: "steps(1, end)" },
              { opacity: 1 - first, easing: "steps(1, end)" },
              { opacity: first },
            ],
            { delay: DANCE_AT, duration: BEAT_MS, iterations: SWINGS },
          ),
        );
      flash(part("sparks-left"), 1);
      flash(part("sparks-right"), 0);

      leaveTimer = window.setTimeout(leave, LEAVE_AT);
    };

    const atBottom = () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - BOTTOM_PX;

    /** He comes once the page has come to rest at its bottom. */
    function arm() {
      window.clearTimeout(idleTimer);
      if (!ready || danced || startedAt || document.hidden) return;
      if (atBottom()) idleTimer = window.setTimeout(start, SETTLE_MS);
    }

    const onInput = (event: Event) => {
      if (startedAt) leave();
      else if (event.type === "scroll" || event.type === "resize") arm();
    };

    const onVisibility = () => {
      if (!document.hidden) return;
      window.clearTimeout(idleTimer);
      if (startedAt) {
        if (performance.now() - startedAt >= DANCE_AT) danced = !testing;
        hide();
      }
    };

    const options = { passive: true, capture: true } as const;
    for (const name of INPUT_EVENTS) {
      window.addEventListener(name, onInput, options);
    }
    document.addEventListener("visibilitychange", onVisibility);
    const begin = () => {
      ready = true;
      if (!startedAt) arm();
    };
    const introTimer = window.setTimeout(begin, INTRO_WAIT_MS);
    window.addEventListener(INTRO_DONE_EVENT, begin, { once: true });
    arm();

    return () => {
      danced = true;
      window.clearTimeout(idleTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(introTimer);
      window.removeEventListener(INTRO_DONE_EVENT, begin);
      for (const animation of running) animation.cancel();
      root.style.display = "";
      for (const name of INPUT_EVENTS) {
        window.removeEventListener(name, onInput, options);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  const boxed = "[transform-box:fill-box]";
  const spark = (
    <>
      <path d="M527.6 298 513.9 287.7 500.2 298 513.9 308.3Z" />
      <path d="M500.1 381.9 486.4 371.6 472.7 381.9 486.4 392.2Z" />
      <path d="M544.4 352.7 522.3 336 500.2 352.7 522.3 369.4Z" />
    </>
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-bldr-forge
      className="pointer-events-none fixed z-20 hidden overflow-hidden"
    >
      <svg
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        className="block h-full w-full translate-y-full"
      >
        <g data-p="legs" fill={WHITE}>
          <rect x="109.93" y="425.29" width="109.93" height="68.7" />
          <rect x="274.83" y="425.29" width="109.93" height="68.7" />
        </g>
        <rect
          data-p="hips"
          fill={WHITE}
          x="117.49"
          y="341.47"
          width="259.71"
          height="68.7"
        />
        <g data-p="arms" fill={WHITE}>
          <rect x="54.97" y="341.47" width="47.4" height="68.7" />
          <rect x="392.31" y="341.47" width="47.41" height="68.7" />
        </g>
        <g data-p="shoulders">
          <path fill={WHITE} d="M403.14 257.64H91.55L0 326.35H494.69Z" />
          <g fill={BLACK}>
            <path d="M232.6 270.7H271.1L261.9 281.25H223.5Z" />
            <path d="M223.5 286.71H261.9L271.1 297.28H232.6Z" />
            <path d="M232.6 302.73H271.1L261.9 313.3H223.5Z" />
          </g>
        </g>
        <g data-p="head" className={`${boxed} origin-bottom`}>
          <g fill={VIOLET}>
            <path d="M439.72 173.81H54.97L146.52 242.53H348.17Z" />
            <rect x="54.97" y="90" width="47.4" height="68.7" />
            <rect x="392.31" y="90" width="47.41" height="68.7" />
          </g>
          <g data-p="eyes" className={`${boxed} origin-center`} fill={WHITE}>
            <rect x="175.91" y="105.96" width="47.41" height="52.46" />
            <rect x="270.55" y="105.96" width="47.4" height="52.46" />
          </g>
          <path
            data-p="visor"
            fill={CYAN}
            d="M377.5 124.35 331.6 90H163.6L117.7 124.35 163.6 158.7H331.6Z"
          />
          <path
            data-p="cap"
            fill={VIOLET}
            d="M146.07 0H347.72L439.28 68.7H54.52Z"
          />
        </g>
        <g data-p="sparks-right" className="fill-[#FF6A2B] opacity-0">
          {spark}
        </g>
        <g data-p="sparks-left" className="fill-[#FF6A2B] opacity-0">
          <g transform="translate(494.69 0) scale(-1 1)">{spark}</g>
        </g>
      </svg>
    </div>
  );
}
