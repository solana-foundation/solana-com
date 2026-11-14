"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { SLAB_KERN } from "./slabKern";

/** The design's "land" curve: a slow start and a long, soft stop. */
export const EASE_LAND = [0.42, 0, 0.12, 1] as const;
/** One quarter turn, in seconds. */
export const TURN = 0.56;

/*
 * Motion here is CSS transitions switched on by one attribute, so the page
 * ships no animation library and a section costs nothing until it is seen.
 * Each piece reads its own start time from `--d` (seconds).
 */
const delayVar = (seconds: number) =>
  ({ "--d": `${+seconds.toFixed(3)}s` }) as CSSProperties;

/** True from the first time a quarter of the element is on screen. */
function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, seen] as const;
}

/* -------------------------------------------------------------------------
 * Headings that turn in, letter by letter, on tiles
 * ---------------------------------------------------------------------- */

function Letter({
  char,
  next,
  tile,
  delay,
}: {
  char: string;
  next: string;
  tile: string;
  delay: number;
}) {
  const kern = SLAB_KERN[(char + next).toUpperCase()];

  return (
    // pointer-events-none: before it turns, a letter is edge-on under the
    // heading's perspective, and browsers hit-test that plane far outside its
    // box, which blocked taps on the FAQ rows above "Come build."
    //
    // The tile (::after) stands behind the letter while it turns and drops
    // 80ms after it lands. The letter rests at `transform: none` so it does
    // not keep a compositor layer once it has turned.
    <span
      className="bldr-anim pointer-events-none relative isolate inline-block [transform:rotateY(-90deg)] [transition:transform_0.56s_cubic-bezier(0.42,0,0.12,1)_var(--d)] after:absolute after:-inset-x-[0.02em] after:-bottom-[0.04em] after:-top-[0.06em] after:-z-10 after:bg-[var(--tile)] after:content-[''] after:[transition:visibility_0s_linear_calc(var(--d)_+_0.64s)] group-data-[on]/turn:[transform:none] group-data-[on]/turn:after:invisible motion-reduce:[transition:none] motion-reduce:after:hidden"
      style={{
        ...delayVar(delay),
        ["--tile" as string]: tile,
        marginRight: kern ? `${kern}em` : undefined,
      }}
    >
      {char}
    </span>
  );
}

export type HeadingLine = {
  text: string;
  /** Tile colour behind each turning letter. Violet by default. */
  tile?: string;
  className?: string;
};

/**
 * A display heading. Each letter turns a quarter into place on a tile the
 * first time the heading scrolls into view. `label` is what assistive tech
 * reads; the letters themselves are hidden from it.
 */
export function TurnHeading({
  label,
  lines,
  className,
  stagger = 0.045,
}: {
  label: string;
  lines: HeadingLine[];
  className?: string;
  stagger?: number;
}) {
  const [ref, seen] = useSeen<HTMLHeadingElement>();
  let index = 0;

  return (
    <h2
      ref={ref}
      aria-label={label}
      data-on={seen ? "" : undefined}
      className={`group/turn font-display uppercase leading-[0.7785] tracking-[-0.065em] [perspective:1200px] ${className ?? ""}`}
    >
      {lines.map((line, l) => (
        <span key={l} aria-hidden className={`block ${line.className ?? ""}`}>
          {line.text.split(" ").map((word, w) => (
            <span key={w}>
              {w > 0 && " "}
              <span className="inline-block whitespace-nowrap">
                {[...word].map((char, c) => (
                  <Letter
                    key={c}
                    char={char}
                    next={word[c + 1] ?? ""}
                    tile={line.tile ?? "#7745FF"}
                    delay={index++ * stagger}
                  />
                ))}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}

/* -------------------------------------------------------------------------
 * Blocks: scaffold, then fill
 * ---------------------------------------------------------------------- */

type BuildTag = "div" | "li" | "article" | "figure";

/* The layers are the block's own children, so a block inside another block
   waits for its own turn. */
const BUILT = "[[data-on]>&]:[clip-path:inset(0%_0%_0%_0%)]";

/**
 * A block that is built rather than faded in: its outline is drawn first (six
 * steps), its fill comes in from the left in four quarter steps, and only then
 * does its content appear.
 *
 * The root must be positioned by the caller's `className`; content sits in its
 * own flex column so `contentClassName` controls how it is laid out.
 */
export function Build({
  as = "div",
  className,
  contentClassName,
  fill,
  fillContent,
  outline = "solid",
  delay = 0,
  children,
}: {
  as?: BuildTag;
  className?: string;
  contentClassName?: string;
  /** Classes for the fill layer, e.g. a background colour. Omit for none. */
  fill?: string;
  /** Something to place inside the fill layer, e.g. a photo. */
  fillContent?: ReactNode;
  /** "solid" draws a hairline; pass a node for a custom outline. */
  outline?: "solid" | "faint" | "none" | ReactNode;
  delay?: number;
  children?: ReactNode;
}) {
  // One element type for the ref; the tag only changes what is rendered.
  const Tag = as as "div";
  const [ref, seen] = useSeen<HTMLDivElement>();
  const hasFill = fill !== undefined || fillContent !== undefined;

  return (
    <Tag
      ref={ref}
      data-on={seen ? "" : undefined}
      className={`relative ${className ?? ""}`}
      style={delayVar(delay)}
    >
      {outline !== "none" && (
        <span
          aria-hidden
          className={`bldr-anim pointer-events-none absolute inset-0 [clip-path:inset(0%_100%_100%_0%)] [transition:clip-path_0.42s_steps(6,end)_var(--d)] motion-reduce:[transition:none] ${BUILT} ${
            outline === "solid"
              ? "border border-current opacity-35"
              : outline === "faint"
                ? "border border-current opacity-20"
                : ""
          }`}
        >
          {typeof outline === "string" ? null : outline}
        </span>
      )}
      {hasFill && (
        <span
          aria-hidden={fillContent ? undefined : true}
          className={`bldr-anim absolute inset-0 [clip-path:inset(0%_0%_0%_100%)] [transition:clip-path_0.48s_steps(4,end)_calc(var(--d)_+_0.38s)] motion-reduce:[transition:none] ${BUILT} ${fill ?? ""}`}
        >
          {fillContent}
        </span>
      )}
      {children !== undefined && (
        <div
          className={`bldr-anim relative flex flex-1 flex-col opacity-0 [transition:opacity_0s_linear_calc(var(--d)_+_0.86s)] motion-reduce:[transition:none] [[data-on]>&]:opacity-100 ${contentClassName ?? ""}`}
        >
          {children}
        </div>
      )}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
 * Header: a hairline appears under the bar once the page has scrolled
 * ---------------------------------------------------------------------- */

export function HeaderBar({ children }: { children: ReactNode }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`surface-a sticky top-0 z-30 transition-shadow duration-200 ease-linear ${
        solid ? "shadow-[0_1px_0_rgb(var(--bldr-fg)/0.22)]" : ""
      }`}
    >
      {children}
    </header>
  );
}
