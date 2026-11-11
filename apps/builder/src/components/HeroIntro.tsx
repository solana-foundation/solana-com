"use client";

import { useId, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CtaLink } from "./CtaLink";
import {
  LOCKUP_PIECES,
  LOCKUP_TAB,
  LOCKUP_VIEWBOX,
  type LockupPiece,
} from "./heroLockup";
import { EASE_LAND } from "./motion";

/*
 * The lock-up intro. Each piece comes out of the line it stands on: the tab
 * rises, then B, L, D, R rise 70ms apart, then EPOCH//01 drops in piece by
 * piece, 55ms apart. The copy comes in last.
 */
const EASE_PIECE = [0.22, 0.8, 0.24, 1] as const;
const RISE = 0.26;
const DROP = 0.23;
const TAB_AT = 0.06;
const LETTERS_AT = TAB_AT + RISE + 0.2;
const EPOCH_AT = LETTERS_AT + 3 * 0.07 + RISE + 0.1;

const TAB_BOX = { x: 0, y: 0, w: 215.5, h: 190.3 };
const letters = LOCKUP_PIECES.filter((p) => p.kind === "letter");
const epoch = LOCKUP_PIECES.filter((p) => p.kind === "epoch");

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

export function HeroIntro({
  labels,
  registerHref,
}: {
  labels: Labels;
  registerHref: string | null;
}) {
  const uid = useId();
  const reduced = Boolean(useReducedMotion());
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);

  const clip = (id: string) => `${uid}-${id}`;
  const timing = (duration: number, delay: number) =>
    reduced ? { duration: 0 } : { duration, delay, ease: EASE_PIECE };

  const piece = (
    p: LockupPiece,
    from: number,
    duration: number,
    delay: number,
    last = false,
  ) => (
    <g key={p.id} clipPath={`url(#${clip(p.id)})`}>
      <motion.path
        d={p.d}
        fill={p.kind === "letter" ? "currentColor" : "#7745FF"}
        fillRule="evenodd"
        clipRule="evenodd"
        className="bldr-anim"
        initial={{ y: from }}
        animate={{ y: 0 }}
        transition={timing(duration, delay)}
        onAnimationComplete={last ? () => setReady(true) : undefined}
      />
    </g>
  );

  const lightCell = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const cell = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest("[data-cell]");
    if (cell) flash(cell, 90);
  };

  let dealt = 0;

  return (
    <>
      <div className="relative [container-type:inline-size]">
        <svg
          key={run}
          aria-hidden
          viewBox={`0 0 ${LOCKUP_VIEWBOX.width} ${LOCKUP_VIEWBOX.height}`}
          fill="none"
          className="block h-auto w-full"
        >
          <defs>
            {[{ id: "tab", ...TAB_BOX }, ...LOCKUP_PIECES].map((p) => (
              <clipPath key={p.id} id={clip(p.id)}>
                <rect
                  x={p.x - 1}
                  y={p.y - 0.5}
                  width={p.w + 2}
                  height={p.h + 2}
                />
              </clipPath>
            ))}
          </defs>
          <g clipPath={`url(#${clip("tab")})`}>
            <motion.g
              className="bldr-anim"
              initial={{ y: TAB_BOX.h + 2 }}
              animate={{ y: 0 }}
              transition={timing(RISE, TAB_AT)}
            >
              <path d={LOCKUP_TAB.plate} fill="#7745FF" />
              <path d={LOCKUP_TAB.s} fill="rgb(var(--bldr-bg))" />
            </motion.g>
          </g>
          {letters.map((p, i) =>
            piece(p, p.h + 2, RISE, LETTERS_AT + i * 0.07),
          )}
          {epoch.map((p, i) =>
            piece(
              p,
              -p.h - 2,
              DROP,
              EPOCH_AT + i * 0.055,
              i === epoch.length - 1,
            ),
          )}
        </svg>

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
            >
              {labels.register}
            </CtaLink>
            <button
              type="button"
              onClick={() => {
                setReady(false);
                setRun((n) => n + 1);
              }}
              className="inline-flex h-11 items-center border border-ink/25 px-[22px] text-[16px] leading-none tracking-[-0.03em] text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bldr-purple"
            >
              {labels.rebuild}
            </button>
          </div>
        </div>

        <div
          key={run}
          role="img"
          aria-label={labels.dates}
          onPointerMove={lightCell}
          className="mt-[5vh] grid touch-pan-y grid-cols-10 [container-type:inline-size] sm:grid-cols-12"
        >
          {DATE_LINES.flatMap((line, row) =>
            Array.from({ length: CELLS }, (_, i) => {
              const char = line[i] && line[i] !== " " ? line[i] : "";
              const delay = char ? dealt++ * 0.04 : 0;
              return (
                <div
                  key={`${row}-${i}`}
                  data-cell
                  className={`group relative aspect-square shadow-[inset_0_0_0_0.5px_rgb(var(--bldr-fg)/0.22)] [perspective:400px] ${
                    i >= 10 ? "max-sm:hidden" : ""
                  }`}
                >
                  <span className="pointer-events-none absolute inset-0 bg-bldr-purple opacity-0 transition-opacity duration-[600ms] ease-linear group-data-[lit]:opacity-100 group-data-[lit]:transition-none" />
                  {char && (
                    <motion.span
                      aria-hidden
                      className="bldr-anim absolute inset-0 flex items-center justify-center font-display text-[9.4cqw] leading-none tracking-normal sm:text-[7.83cqw]"
                      initial={{ rotateY: -90 }}
                      animate={ready ? { rotateY: 0 } : undefined}
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
