"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  steps,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { SLAB_KERN } from "./slabKern";

/** The design's "land" curve: a slow start and a long, soft stop. */
export const EASE_LAND = [0.42, 0, 0.12, 1] as const;
/** One quarter turn, in seconds. */
export const TURN = 0.56;

const IN_VIEW = { once: true, amount: 0.25 } as const;

/* -------------------------------------------------------------------------
 * Headings that turn in, letter by letter, on tiles
 * ---------------------------------------------------------------------- */

function Letter({
  char,
  next,
  tile,
  delay,
  on,
  reduced,
}: {
  char: string;
  next: string;
  tile: string;
  delay: number;
  on: boolean;
  reduced: boolean;
}) {
  // The tile stands behind the letter while it turns and drops 80ms after it
  // lands.
  const [landed, setLanded] = useState(false);
  const kern = SLAB_KERN[(char + next).toUpperCase()];

  return (
    <motion.span
      className={`bldr-anim relative isolate inline-block ${
        landed || reduced
          ? ""
          : "after:absolute after:-inset-x-[0.02em] after:-bottom-[0.04em] after:-top-[0.06em] after:-z-10 after:bg-[var(--tile)] after:content-['']"
      }`}
      style={{
        ["--tile" as string]: tile,
        marginRight: kern ? `${kern}em` : undefined,
      }}
      initial={{ rotateY: -90 }}
      animate={on ? { rotateY: 0 } : undefined}
      transition={
        reduced ? { duration: 0 } : { duration: TURN, ease: EASE_LAND, delay }
      }
      onAnimationComplete={() => window.setTimeout(() => setLanded(true), 80)}
    >
      {char}
    </motion.span>
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
  const ref = useRef<HTMLHeadingElement>(null);
  const on = useInView(ref, IN_VIEW);
  const reduced = Boolean(useReducedMotion());
  let index = 0;

  return (
    <h2
      ref={ref}
      aria-label={label}
      className={`font-display uppercase leading-[0.7785] tracking-[-0.065em] [perspective:1200px] ${className ?? ""}`}
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
                    on={on}
                    reduced={reduced}
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

const buildTags = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  figure: motion.figure,
} as const;

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
  as?: keyof typeof buildTags;
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
  const Tag = buildTags[as] as typeof motion.div;
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, IN_VIEW);
  const reduced = Boolean(useReducedMotion());
  const t = (duration: number, extra: number, count: number) =>
    reduced
      ? { duration: 0 }
      : { duration, delay: delay + extra, ease: steps(count, "end") };
  const hasFill = fill !== undefined || fillContent !== undefined;

  return (
    <Tag ref={ref} className={`relative ${className ?? ""}`}>
      {outline !== "none" && (
        <motion.span
          aria-hidden
          className={`bldr-anim pointer-events-none absolute inset-0 ${
            outline === "solid"
              ? "border border-current opacity-35"
              : outline === "faint"
                ? "border border-current opacity-20"
                : ""
          }`}
          initial={{ clipPath: "inset(0% 100% 100% 0%)" }}
          animate={on ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={t(0.42, 0, 6)}
        >
          {typeof outline === "string" ? null : outline}
        </motion.span>
      )}
      {hasFill && (
        <motion.span
          aria-hidden={fillContent ? undefined : true}
          className={`bldr-anim absolute inset-0 ${fill ?? ""}`}
          initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
          animate={on ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={t(0.48, 0.38, 4)}
        >
          {fillContent}
        </motion.span>
      )}
      {children !== undefined && (
        <motion.div
          className={`bldr-anim relative flex flex-1 flex-col ${contentClassName ?? ""}`}
          initial={{ opacity: 0 }}
          animate={on ? { opacity: 1 } : undefined}
          transition={
            reduced ? { duration: 0 } : { duration: 0, delay: delay + 0.86 }
          }
        >
          {children}
        </motion.div>
      )}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
 * Header: a hairline appears under the bar once the page has scrolled
 * ---------------------------------------------------------------------- */

export function HeaderBar({ children }: { children: ReactNode }) {
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));
  useEffect(() => setSolid(window.scrollY > 24), []);

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
