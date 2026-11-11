"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { cubicBezier, motion, useReducedMotion } from "motion/react";
import { CtaLink } from "./CtaLink";
import {
  LOCKUP_PIECES,
  LOCKUP_TAB,
  LOCKUP_VIEWBOX,
  type LockupPiece,
} from "./heroLockup";
import { EASE_LAND } from "./motion";

/*
 * The cube intro, ported from the design studio's motion file.
 *
 * 1. The symbol stands as one big block, then shrinks onto the line.
 * 2. It turns face by face (R, D, L, B, then the symbol again); every turn
 *    pushes a letter block out of its right edge, like a ticker run backwards.
 * 3. The symbol pops up, the letters close up and their tiles drop, 60ms apart.
 * 4. The row moves to the lock-up's place (0.4s).
 * 5. EPOCH//0 comes in under one 45° slash (0.48s); //00 turns to //01.
 * 6. The copy comes in last. From then on a letter under the pointer turns to
 *    the next letter and back.
 *
 * Everything is laid out in the lock-up's own units (its 1342-wide viewBox);
 * `--u` is one unit, so the whole thing scales with the lock-up without script.
 */
const VB = LOCKUP_VIEWBOX;
const u = (n: number) => `calc(var(--u) * ${+n.toFixed(3)})`;

const piece = (id: string) => LOCKUP_PIECES.find((p) => p.id === id)!;
const LETTERS = ["b", "l", "d", "r"].map(piece);
const EPOCH = LOCKUP_PIECES.filter(
  (p) => p.kind === "epoch" && p.id !== "ep-1",
);
const ZERO = piece("ep-0");
const ONE = piece("ep-1");
/** The last digit's block: a full letter cell, where the 1 stands. */
const DIGIT = { x: ONE.x, y: ONE.y, w: ZERO.w, h: ZERO.h };
const TAB = { w: 215.5, h: 190.3 };

type GlyphKey = "b" | "l" | "d" | "r" | "0" | "1";
const origin = (p: { x: number; y: number }) => `translate(${-p.x} ${-p.y})`;
const GLYPHS: Record<GlyphKey, { d: string; transform: string }> = {
  b: { d: LETTERS[0]!.d, transform: origin(LETTERS[0]!) },
  l: { d: LETTERS[1]!.d, transform: origin(LETTERS[1]!) },
  d: { d: LETTERS[2]!.d, transform: origin(LETTERS[2]!) },
  r: { d: LETTERS[3]!.d, transform: origin(LETTERS[3]!) },
  "0": { d: ZERO.d, transform: origin(ZERO) },
  "1": { d: ONE.d, transform: origin(DIGIT) },
};
const LETTER_KEYS = ["b", "l", "d", "r"] as const;

/* The motion file's proportions, scaled so its letters are the lock-up's. */
const GLYPH_W = 215.3;
const TILE_W = GLYPH_W / 0.87;
const TILE_H = (TILE_W * 242.53) / 272.133;
const MARK_W = (TILE_W * 273.937) / 272.133;
const MARK_H = TILE_H;
const MARK_GAP = (TILE_W * 11.698) / 272.133;
const RAISE = (TILE_W * 54.531) / 272.133;
const SLOT_GAP = (11.21 * GLYPH_W) / 236.7;
const ROW_X = (VB.width - (MARK_W + MARK_GAP + 4 * TILE_W)) / 2;
const ROW_Y = (VB.height - (RAISE + TILE_H)) / 2 + RAISE;
const LETTERS_X = ROW_X + MARK_W + MARK_GAP;
const TIGHT_X = (VB.width - (MARK_W + 4 * (GLYPH_W + SLOT_GAP))) / 2;
/** A letter's place in its box in the row, and once the row has closed up. */
const boxed = (j: number) => ({
  x: LETTERS_X + j * TILE_W + (TILE_W - LETTERS[j]!.w) / 2,
  y: ROW_Y + (TILE_H - LETTERS[j]!.h) / 2,
});
const tight = (j: number) => ({
  x: TIGHT_X + MARK_W + SLOT_GAP + j * (GLYPH_W + SLOT_GAP),
  y: boxed(j).y,
});
const MARK_CENTRE = { x: ROW_X + MARK_W / 2, y: ROW_Y + MARK_H / 2 };

/* Timings, in the motion file's seconds; it plays at 1.5x. */
const SPEED = 1.5;
const GROW_AT = 0.5;
const GROW = 0.75;
const TURN_EVERY = 0.36;
const TURN = 0.33;
const TURNS_AT = GROW_AT + GROW + 0.05;
const LAND = TURNS_AT + 4 * TURN_EVERY + TURN + 0.05;
const POP = 0.55;
const CLOSE_AT = 0.2;
const CLOSE = 0.5;
const SETTLE = CLOSE_AT + CLOSE;
/** Each turn brings this face to the front, showing this. */
const FACES = [
  { face: 3, show: "r" },
  { face: 2, show: "d" },
  { face: 1, show: "l" },
  { face: 0, show: "b" },
  { face: 3, show: "mark" },
] as const;

const E_MID = cubicBezier(0.5, 0, 0.4, 1);
const E_SPLIT = cubicBezier(0.6, 0, 0.22, 1);
const E_POP = cubicBezier(0.3, 1.28, 0.5, 1);
const E_TIGHT = cubicBezier(0.65, 0, 0.3, 1);
const E_LAND = cubicBezier(...EASE_LAND);
const CSS_FIRST = "cubic-bezier(.62,0,.38,1)";
const CSS_LAND = "cubic-bezier(.42,0,.12,1)";

/* The slash: a 45° cut sweeping from the top left (lock-up units). */
const SCALE = VB.width / 985.46;
const SLASH_FROM = 340 * SCALE;
const SLASH_TO = 1500 * SCALE;
const DIGIT_AT = DIGIT.x + DIGIT.y;

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

type Prism = {
  slot: HTMLElement;
  prism: HTMLElement;
  faces: [HTMLElement, HTMLElement];
  paths: [SVGPathElement, SVGPathElement];
  busy: boolean;
};

function setGlyph(path: SVGPathElement, key: GlyphKey) {
  path.setAttribute("d", GLYPHS[key].d);
  path.setAttribute("transform", GLYPHS[key].transform);
}

function readPrism(slot: HTMLElement): Prism {
  const faces = slot.querySelectorAll<HTMLElement>("[data-face]");
  const paths = slot.querySelectorAll<SVGPathElement>("[data-face] path");
  return {
    slot,
    prism: slot.querySelector<HTMLElement>("[data-prism]")!,
    faces: [faces[0]!, faces[1]!],
    paths: [paths[0]!, paths[1]!],
    busy: false,
  };
}

function restPrism(p: Prism, key: GlyphKey) {
  p.prism.getAnimations().forEach((a) => a.cancel());
  setGlyph(p.paths[0], key);
  p.faces[0].style.transform = "";
  p.faces[1].style.transform = "";
  p.faces[1].style.visibility = "hidden";
  p.busy = false;
}

/** One quarter turn: the next face waits on the side and turns to the front. */
async function turn(
  p: Prism,
  key: GlyphKey,
  dir: 1 | -1,
  duration: number,
  easing: string,
) {
  const half = p.slot.offsetWidth / 2;
  setGlyph(p.paths[1], key);
  p.faces[1].style.transform = `rotateY(${-dir * 90}deg) translateZ(${half}px)`;
  p.faces[1].style.visibility = "visible";
  p.faces[0].style.transform = `translateZ(${half}px)`;
  const animation = p.prism.animate(
    [
      { transform: `translateZ(${-half}px) rotateY(0deg)` },
      { transform: `translateZ(${-half}px) rotateY(${dir * 90}deg)` },
    ],
    { duration, easing, fill: "forwards" },
  );
  try {
    await animation.finished;
  } catch {
    return; // cancelled by a replay, which puts the faces back itself
  }
  restPrism(p, key);
}

/** The date as the slab sets it, one character to a square cell. */
const DATE_LINES = ["SF", "MAR 09-10", "2027"];
const CELLS = 12;

function flash(el: Element, ms: number) {
  el.setAttribute("data-lit", "");
  window.setTimeout(() => el.removeAttribute("data-lit"), ms);
}

type Labels = {
  edition: [string, string];
  where: string;
  when: string;
  tagline: string;
  dates: string;
  register: string;
  pending: string;
  rebuild: string;
};

/** A block with two faces: the one showing and the one that turns in. */
function PrismFaces({
  glyph,
  faceClassName,
  glyphClassName,
}: {
  glyph: GlyphKey;
  faceClassName: string;
  glyphClassName: string;
}) {
  return (
    <span
      data-prism
      className="absolute inset-0 block [transform-style:preserve-3d]"
    >
      {[0, 1].map((face) => (
        <span
          key={face}
          data-face
          className={`absolute inset-0 block [backface-visibility:hidden] ${faceClassName}`}
          style={face ? { visibility: "hidden" } : undefined}
        >
          <svg
            viewBox={`0 0 ${ZERO.w} ${ZERO.h}`}
            preserveAspectRatio="none"
            className={`block size-full overflow-visible ${glyphClassName}`}
          >
            <path
              d={GLYPHS[glyph].d}
              transform={GLYPHS[glyph].transform}
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
      ))}
    </span>
  );
}

function TabMark() {
  return (
    <>
      <path d={LOCKUP_TAB.plate} fill="#7745FF" />
      <path d={LOCKUP_TAB.s} fill="rgb(var(--bldr-bg))" />
    </>
  );
}

function boxOf(p: LockupPiece | typeof DIGIT) {
  return { left: u(p.x), top: u(p.y), width: u(p.w), height: u(p.h) };
}

export function HeroIntro({
  labels,
  registerHref,
}: {
  labels: Labels;
  registerHref: string | null;
}) {
  const wipeId = `${useId()}-wipe`;
  const reduced = Boolean(useReducedMotion());
  const stage = useRef<HTMLDivElement>(null);
  const cells = useRef<HTMLDivElement>(null);
  // The current run of the intro; a replay or an unmount moves it on, which
  // stops whatever was still playing.
  const [runs] = useState(() => ({ id: 0 }));
  const prisms = useRef<Prism[]>([]);
  const hot = useRef(false);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const [dealt, setDealt] = useState(false);

  const play = useCallback(async () => {
    const root = stage.current;
    if (!root) return;
    const id = ++runs.id;
    const alive = () => runs.id === id;
    const q = <T extends Element>(selector: string) =>
      root.querySelector<T>(selector)!;

    const letters = [
      ...root.querySelectorAll<HTMLElement>("[data-letter]"),
    ].map(readPrism);
    const digit = readPrism(q<HTMLElement>("[data-digit]"));
    const lettersWrap = q<HTMLElement>("[data-letters]");
    const tab = q<SVGGElement>("[data-tab]");
    const epoch = q<SVGGElement>("[data-epoch]");
    const wipe = q<SVGPolygonElement>("[data-wipe]");
    const mark = q<HTMLElement>("[data-mark]");
    const markPrism = q<HTMLElement>("[data-mark-prism]");
    const markFaces = [
      ...mark.querySelectorAll<HTMLElement>("[data-mark-face]"),
    ];
    prisms.current = letters;

    const showFace = (index: number, show: string | null) => {
      const face = markFaces[index]!;
      face.style.visibility = show ? "visible" : "hidden";
      face.querySelectorAll<HTMLElement>("[data-show]").forEach((layer) => {
        layer.style.display = layer.dataset.show === show ? "" : "none";
      });
    };
    const setHot = (on: boolean) => {
      hot.current = on;
      root.toggleAttribute("data-hot", on);
    };
    const finish = () => {
      letters.forEach((p, j) => {
        restPrism(p, LETTER_KEYS[j]!);
        p.slot.style.transform = "";
        p.slot.style.visibility = "";
        p.slot.removeAttribute("data-tile");
        p.slot.setAttribute("data-dropped", "");
      });
      restPrism(digit, "1");
      digit.slot.style.visibility = "";
      digit.slot.style.clipPath = "";
      lettersWrap.style.clipPath = "";
      epoch.removeAttribute("clip-path");
      tab.style.visibility = "";
      mark.style.visibility = "hidden";
      root.style.opacity = "1";
    };

    setHot(false);
    if (reduced) {
      finish();
      setReady(true);
      setDealt(true);
      return;
    }

    /* Start: the big symbol block; the letters wait inside it. */
    setReady(false);
    setDealt(false);
    letters.forEach((p, j) => {
      restPrism(p, LETTER_KEYS[j]!);
      p.slot.removeAttribute("data-dropped");
      p.slot.setAttribute("data-tile", "");
    });
    restPrism(digit, "0");
    digit.slot.style.visibility = "hidden";
    digit.slot.style.clipPath = "";
    wipe.setAttribute("points", "0,0 0,0 0,0");
    epoch.setAttribute("clip-path", `url(#${wipeId})`);
    tab.style.visibility = "hidden";
    mark.style.visibility = "visible";
    showFace(0, "mark");
    [1, 2, 3].forEach((i) => showFace(i, null));
    lettersWrap.style.clipPath = `polygon(${u(LETTERS_X)} -100%, 300% -100%, 300% 300%, ${u(LETTERS_X)} 300%)`;

    const placeLetter = (j: number, x: number, y: number) => {
      const p = LETTERS[j]!;
      letters[j]!.slot.style.transform =
        `translate(${u(x - p.x)}, ${u(y - p.y)})`;
    };
    const placeMark = (x: number, y: number, sx: number, sy: number) => {
      mark.style.transform = `translate(${u(x)}, ${u(y)}) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
    };

    let turned = -1;
    let landed = false;
    const frame = (t: number, hold: number) => {
      /* the symbol block: big, then down to its place, then turning */
      let angle = 0;
      for (let k = 0; k < FACES.length; k++) {
        const at = TURNS_AT + k * TURN_EVERY;
        if (t < at) break;
        if (k > turned) {
          turned = k;
          showFace(FACES[k]!.face, FACES[k]!.show);
        }
        angle = 90 * (k + E_MID(clamp((t - at) / TURN)));
      }
      markPrism.style.transform = `translateZ(${u(-MARK_W / 2)}) rotateY(${angle.toFixed(3)}deg)`;

      if (t < LAND) {
        const grow = 1 - E_SPLIT(clamp((t - GROW_AT) / GROW));
        placeMark(
          (VB.width / 2 - MARK_CENTRE.x) * grow,
          (VB.height / 2 - MARK_CENTRE.y) * grow,
          1 + ((2 * TILE_W) / MARK_W - 1) * grow,
          1 + ((2 * TILE_H) / MARK_H - 1) * grow,
        );
        /* each turn after the first pushes the row one block to the right */
        let shift = 4;
        for (let k = 0; k < 4; k++)
          shift -= E_MID(clamp((t - (TURNS_AT + (k + 1) * TURN_EVERY)) / TURN));
        letters.forEach((p, j) => {
          // still inside the symbol block: not there yet
          p.slot.style.visibility = shift >= j + 1 ? "hidden" : "";
          placeLetter(j, boxed(j).x - TILE_W * shift, boxed(j).y);
        });
        return;
      }

      if (!landed) {
        landed = true;
        lettersWrap.style.clipPath = "";
        /* the tiles go, one after another: a hard cut */
        letters.forEach((p, j) =>
          window.setTimeout(() => {
            if (!alive()) return;
            p.slot.removeAttribute("data-tile");
            p.slot.setAttribute("data-dropped", "");
          }, j * 60),
        );
      }
      const pop = E_POP(Math.min(1, hold / POP));
      const close = E_TIGHT(clamp((hold - CLOSE_AT) / CLOSE));
      placeMark((TIGHT_X - ROW_X) * close, -RAISE * pop, 1, 1);
      letters.forEach((_, j) =>
        placeLetter(
          j,
          boxed(j).x + (tight(j).x - boxed(j).x) * close,
          boxed(j).y,
        ),
      );
    };

    frame(0, 0);
    root.style.opacity = "1";

    await new Promise<void>((resolve) => {
      let t = 0;
      let hold = 0;
      let last = performance.now();
      const step = (now: number) => {
        if (!alive()) return resolve();
        const dt = Math.min(0.05, (now - last) / 1000) * SPEED;
        last = now;
        if (t < LAND) t = Math.min(LAND, t + dt);
        else hold += dt;
        frame(t, hold);
        if (hold >= SETTLE) resolve();
        else requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    if (!alive()) return;

    const tween = (
      ms: number,
      ease: (v: number) => number,
      draw: (e: number) => void,
    ) =>
      new Promise<void>((resolve) => {
        const t0 = performance.now();
        const step = (now: number) => {
          if (!alive()) return resolve();
          const k = Math.min(1, (now - t0) / ms);
          draw(ease(k));
          if (k < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

    /* The row moves to the lock-up's place; the symbol settles to its size. */
    const markFrom = { x: TIGHT_X - ROW_X, y: -RAISE };
    const markTo = {
      x: TAB.w / 2 - MARK_CENTRE.x,
      y: TAB.h / 2 - MARK_CENTRE.y,
      sx: TAB.w / MARK_W,
      sy: TAB.h / MARK_H,
    };
    await tween(400, E_TIGHT, (e) => {
      placeMark(
        markFrom.x + (markTo.x - markFrom.x) * e,
        markFrom.y + (markTo.y - markFrom.y) * e,
        1 + (markTo.sx - 1) * e,
        1 + (markTo.sy - 1) * e,
      );
      letters.forEach((_, j) => {
        const from = tight(j);
        const to = LETTERS[j]!;
        placeLetter(
          j,
          from.x + (to.x - from.x) * e,
          from.y + (to.y - from.y) * e,
        );
      });
    });
    if (!alive()) return;
    letters.forEach((p) => (p.slot.style.transform = ""));
    tab.style.visibility = "";
    mark.style.visibility = "hidden";

    /* EPOCH//0 comes in under one 45° slash. */
    await wait(80);
    if (!alive()) return;
    await tween(480, E_LAND, (e) => {
      const c = SLASH_FROM + (SLASH_TO - SLASH_FROM) * e;
      wipe.setAttribute("points", `0,0 ${c.toFixed(1)},0 0,${c.toFixed(1)}`);
      const k = c - DIGIT_AT;
      digit.slot.style.visibility = k > 0 ? "" : "hidden";
      if (k > 0)
        digit.slot.style.clipPath = `polygon(0 0, ${u(k)} 0, 0 ${u(k)})`;
    });
    if (!alive()) return;
    epoch.removeAttribute("clip-path");
    digit.slot.style.clipPath = "";

    /* //00 turns to //01, then the copy comes in. */
    await wait(170);
    if (!alive()) return;
    await turn(digit, "1", -1, 487, CSS_LAND);
    if (!alive()) return;
    setReady(true);
    await wait(150);
    if (!alive()) return;
    setHot(true);
    setDealt(true);
  }, [reduced, runs, wipeId]);

  useEffect(() => {
    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!cancelled) void play();
    });
    return () => {
      cancelled = true;
      runs.id++;
    };
  }, [play, runs]);

  /* The date row is dealt cell by cell; each lights as it lands. */
  useEffect(() => {
    if (!dealt || reduced) return;
    const timers = [
      ...(cells.current?.querySelectorAll("[data-char]") ?? []),
    ].map((cell, i) => window.setTimeout(() => flash(cell, 60), i * 40));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [dealt, reduced, run]);

  /* Pointer on a letter: one turn to the next letter, one turn home. */
  const turnLetter = async (j: number) => {
    const p = prisms.current[j];
    if (!p || !hot.current || p.busy) return;
    const id = runs.id;
    const dir = Math.random() < 0.5 ? 1 : -1;
    p.busy = true;
    p.slot.removeAttribute("data-dropped");
    await turn(p, LETTER_KEYS[(j + 1) % 4]!, dir, 300, CSS_FIRST);
    if (runs.id !== id) return;
    p.busy = true;
    await turn(p, LETTER_KEYS[j]!, dir === 1 ? -1 : 1, 460, CSS_LAND);
    if (runs.id !== id) return;
    p.slot.setAttribute("data-dropped", "");
  };

  const lightCell = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const cell = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest("[data-cell]");
    if (cell) flash(cell, 90);
  };

  let dealIndex = 0;

  return (
    <>
      <div className="relative [container-type:inline-size]">
        {/* Hidden until the intro starts; shown as the finished lock-up
            without script or with reduced motion. */}
        <div
          ref={stage}
          aria-hidden
          className="bldr-anim group/lock relative select-none [--u:calc(100cqw/1342)]"
          style={{ opacity: 0 }}
        >
          <svg
            viewBox={`0 0 ${VB.width} ${VB.height}`}
            fill="none"
            className="block h-auto w-full overflow-visible"
          >
            <defs>
              <clipPath id={wipeId}>
                <polygon data-wipe points="0,0 0,0 0,0" />
              </clipPath>
            </defs>
            <g data-tab>
              <TabMark />
            </g>
            <g data-epoch>
              {EPOCH.map((p) => (
                <path
                  key={p.id}
                  d={p.d}
                  fill="#7745FF"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              ))}
            </g>
          </svg>

          {/* B L D R: each a block that can turn. In the intro it carries its
              tile and rides out of the symbol's edge. */}
          <div data-letters className="absolute inset-0">
            {LETTERS.map((p, j) => (
              <span
                key={p.id}
                data-letter
                data-dropped=""
                onPointerEnter={() => void turnLetter(j)}
                className="group/slot absolute block group-data-[hot]/lock:cursor-crosshair"
                style={boxOf(p)}
              >
                <span
                  className="absolute hidden bg-ink group-data-[tile]/slot:block"
                  style={{
                    left: u(-(TILE_W - p.w) / 2),
                    top: u(-(TILE_H - p.h) / 2),
                    width: u(TILE_W + (j < 3 ? 1 : 0)),
                    height: u(TILE_H),
                  }}
                />
                <PrismFaces
                  glyph={LETTER_KEYS[j]!}
                  faceClassName="bg-ink group-data-[dropped]/slot:bg-transparent"
                  glyphClassName="fill-surface group-data-[dropped]/slot:fill-ink"
                />
              </span>
            ))}
          </div>

          {/* The epoch's last digit, on a block with no tile. */}
          <span data-digit className="absolute block" style={boxOf(DIGIT)}>
            <PrismFaces
              glyph="1"
              faceClassName=""
              glyphClassName="fill-bldr-purple"
            />
          </span>

          {/* The symbol block of the intro; the drawn tab takes over from it. */}
          <span
            data-mark
            className="absolute z-10 block"
            style={{
              left: u(ROW_X),
              top: u(ROW_Y),
              width: u(MARK_W),
              height: u(MARK_H),
              perspective: u(TILE_W * 3.6),
              visibility: "hidden",
            }}
          >
            <span
              data-mark-prism
              className="absolute inset-0 block [transform-style:preserve-3d]"
            >
              {[0, 1, 2, 3].map((face) => (
                <span
                  key={face}
                  data-mark-face
                  className="absolute inset-0 block [backface-visibility:hidden]"
                  style={{
                    transform: `rotateY(${face * 90}deg) translateZ(${u(MARK_W / 2)})`,
                  }}
                >
                  {(face === 0 || face === 3) && (
                    <svg
                      data-show="mark"
                      viewBox={`0 0 ${TAB.w} ${TAB.h}`}
                      preserveAspectRatio="none"
                      className="absolute inset-0 size-full"
                    >
                      <TabMark />
                    </svg>
                  )}
                  {LETTERS.map(
                    (p, j) =>
                      FACES[3 - j]!.face === face && (
                        <span
                          key={p.id}
                          data-show={LETTER_KEYS[j]}
                          className="absolute inset-0 flex items-center justify-center bg-ink"
                        >
                          <svg
                            viewBox={`${p.x} ${p.y} ${p.w} ${p.h}`}
                            className="block fill-surface"
                            style={{ width: u(p.w), height: u(p.h) }}
                          >
                            <path
                              d={p.d}
                              fillRule="evenodd"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      ),
                  )}
                </span>
              ))}
            </span>
          </span>
        </div>

        {/* The caption sits in the lock-up's lower-right notch from md up and
            scales with it (container units). */}
        <div
          className={`bldr-anim mt-8 flex flex-wrap gap-x-10 gap-y-4 text-[20px] leading-none tracking-[-0.03em] transition-opacity duration-[400ms] ease-linear md:absolute md:bottom-0 md:left-[66.9%] md:mt-0 md:block md:translate-y-[0.19cqw] md:whitespace-nowrap md:text-[2.385cqw] md:leading-[0.875] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <p>
            {labels.edition[0]}
            <br />
            {labels.edition[1]}
          </p>
          <p className="md:mt-[0.67cqw]">
            {labels.where}
            <br />
            {labels.when}
          </p>
        </div>
      </div>

      {/* Phones: the line, the buttons and the date row. From md up the
          lock-up and its caption are the whole first screen. */}
      <div className="md:hidden">
        <div
          className={`bldr-anim transition-opacity duration-[400ms] ease-linear ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="mt-5 max-w-[34ch] text-[16px] leading-none tracking-[-0.03em] text-ink/65">
            {labels.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-[10px]">
            <CtaLink
              href={registerHref}
              pendingLabel={labels.pending}
              className="h-11 bg-bldr-purple px-[22px] text-[16px] leading-none tracking-[-0.03em] text-surface"
              hoverClassName="hover:bg-[rgb(var(--bldr-btn-hover))]"
            >
              {labels.register}
            </CtaLink>
            <button
              type="button"
              onClick={() => {
                setRun((n) => n + 1);
                void play();
              }}
              className="btn-cut btn-ghost inline-flex h-11 items-center px-[22px] text-[16px] leading-none tracking-[-0.03em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bldr-purple"
            >
              {labels.rebuild}
            </button>
          </div>
        </div>

        <div
          key={run}
          ref={cells}
          role="img"
          aria-label={labels.dates}
          onPointerMove={lightCell}
          className="mt-[5vh] grid touch-pan-y grid-cols-10 [container-type:inline-size] sm:grid-cols-12"
        >
          {DATE_LINES.flatMap((line, row) =>
            Array.from({ length: CELLS }, (_, i) => {
              const char = line[i] && line[i] !== " " ? line[i] : "";
              const delay = char ? dealIndex++ * 0.04 : 0;
              return (
                <div
                  key={`${row}-${i}`}
                  data-cell
                  data-char={char ? "" : undefined}
                  className={`group relative aspect-square shadow-[inset_0_0_0_0.5px_rgb(var(--bldr-fg)/0.22)] [perspective:400px] ${
                    i >= 10 ? "max-sm:hidden" : ""
                  }`}
                >
                  <span className="pointer-events-none absolute inset-0 bg-bldr-purple opacity-0 transition-opacity duration-[600ms] ease-linear group-data-[lit]:opacity-100 group-data-[lit]:transition-none" />
                  {char && (
                    <motion.span
                      aria-hidden
                      className="bldr-anim absolute inset-0 flex items-center justify-center font-display text-[9.4cqw] leading-none tracking-normal group-data-[lit]:text-black sm:text-[7.83cqw]"
                      initial={{ rotateY: -90 }}
                      animate={dealt ? { rotateY: 0 } : undefined}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { duration: 0.32, ease: EASE_LAND, delay }
                      }
                    >
                      <span className="translate-y-[0.05em]">{char}</span>
                    </motion.span>
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </>
  );
}
