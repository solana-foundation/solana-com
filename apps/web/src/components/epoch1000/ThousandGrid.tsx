"use client";

import { useMemo, useRef, useState } from "react";
import { approxDateOfEpoch, epochOfDate, MOMENTS } from "./moments";

const TOTAL = 1000;
const COLS = 50;
const ROWS = TOTAL / COLS;
/** Recent epochs blend purple → green so history flows into the live tip. */
const TINT_SPAN = 120;
/** Scrub within this many cells of a moment to reveal its label. */
const SNAP = 4;

function cellColor(
  i: number,
  currentEpoch: number,
  inSpan: boolean,
  accent: string | undefined,
  isMoment: boolean,
): string {
  if (inSpan && accent) return accent;
  if (i > currentEpoch) return "rgba(255,255,255,0.05)";
  if (isMoment) return "rgba(255,255,255,0.92)";
  const age = currentEpoch - i;
  if (age <= TINT_SPAN) {
    // purple (past) → green (now) as epochs approach the tip
    const t = 1 - age / TINT_SPAN;
    const r = Math.round(153 + (20 - 153) * t);
    const g = Math.round(69 + (241 - 69) * t);
    const b = Math.round(255 + (149 - 255) * t);
    return `rgba(${r},${g},${b},0.6)`;
  }
  // deeper history fades toward the void
  const depth = currentEpoch > 0 ? i / currentEpoch : 0;
  return `rgba(153,69,255,${(0.16 + 0.38 * depth).toFixed(3)})`;
}

interface Props {
  currentEpoch: number;
  /** Highlight the span from this epoch to now in `accent`. */
  firstEpoch?: number;
  accent?: string;
  /** Legend for the highlighted span, e.g. "VETERAN CLASS · EPOCH 412 → NOW". */
  accentLabel?: string;
  /** Enables the scrubbable timeline readout. */
  interactive?: boolean;
}

/**
 * The Thousand Grid: one cell per epoch, 0–999, filled to the current epoch.
 * The signature element of the campaign - scrub across it to travel through
 * six years of mainnet-beta; a wallet check paints your era onto it.
 */
export default function ThousandGrid({
  currentEpoch,
  firstEpoch,
  accent,
  accentLabel,
  interactive = false,
}: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // One anchor per mount keeps date interpolation stable while scrubbing
  const nowMs = useMemo(() => Date.now(), []);

  const momentByEpoch = useMemo(() => {
    const map = new Map<number, string>();
    for (const m of MOMENTS) {
      map.set(epochOfDate(m.dateMs, currentEpoch, nowMs), m.label);
    }
    return map;
  }, [currentEpoch, nowMs]);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }),
    [],
  );

  const cells = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, i) => {
        const isTip = i === currentEpoch;
        const inSpan =
          firstEpoch !== undefined &&
          accent !== undefined &&
          i >= firstEpoch &&
          i <= Math.min(currentEpoch, TOTAL - 1);
        return (
          <div
            key={i}
            className={`aspect-square rounded-[1px] ${isTip ? "ep-cell-live" : ""}`}
            style={{
              backgroundColor: isTip
                ? "#14f195"
                : cellColor(
                    i,
                    currentEpoch,
                    inSpan,
                    accent,
                    momentByEpoch.has(i),
                  ),
            }}
          />
        );
      }),
    [currentEpoch, firstEpoch, accent, momentByEpoch],
  );

  function locate(e: React.PointerEvent): number | null {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    const col = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
    const row = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
    return row * COLS + col;
  }

  const readout = useMemo(() => {
    if (hovered === null) {
      return {
        text: "EPOCH 0 → 999 · MAR 2020 → NOW",
        hint: "scrub to travel",
        moment: null as string | null,
      };
    }
    const date = monthFormatter
      .format(approxDateOfEpoch(hovered, currentEpoch, nowMs))
      .toUpperCase();
    let nearestMoment: string | null = null;
    for (let d = 0; d <= SNAP && !nearestMoment; d++) {
      nearestMoment =
        momentByEpoch.get(hovered - d) ??
        momentByEpoch.get(hovered + d) ??
        null;
    }
    const inSpan =
      firstEpoch !== undefined &&
      hovered >= firstEpoch &&
      hovered <= currentEpoch;
    const when =
      hovered === currentEpoch
        ? "BUILDING NOW"
        : hovered > currentEpoch
          ? `~${date}`
          : `~${date}`;
    return {
      text: `EPOCH ${hovered} · ${when}`,
      hint: inSpan ? "you were here" : null,
      moment: nearestMoment,
    };
  }, [hovered, currentEpoch, firstEpoch, momentByEpoch, monthFormatter, nowMs]);

  const ringStyle =
    hovered !== null
      ? {
          left: `${((hovered % COLS) / COLS) * 100}%`,
          top: `${(Math.floor(hovered / COLS) / ROWS) * 100}%`,
          width: `${100 / COLS}%`,
          height: `${100 / ROWS}%`,
        }
      : undefined;

  return (
    <div className="flex flex-col gap-3">
      {interactive && (
        <div className="flex items-baseline justify-between gap-4 font-brand-mono text-xs sm:text-sm min-h-[1.5rem]">
          <span className="text-ep-dim tabular-nums" aria-live="off">
            {readout.text}
            {readout.moment && (
              <span className="text-ep-ink"> - {readout.moment}</span>
            )}
            {readout.hint && !readout.moment && (
              <span className="text-ep-dust"> - {readout.hint}</span>
            )}
            {readout.hint && readout.moment && (
              <span style={accent ? { color: accent } : undefined}>
                {" "}
                · {readout.hint}
              </span>
            )}
          </span>
          {accentLabel && accent && (
            <span
              className="hidden sm:flex items-center gap-2 shrink-0 text-xs"
              style={{ color: accent }}
            >
              <span
                className="inline-block h-2 w-2 rounded-[1px]"
                style={{ backgroundColor: accent }}
              />
              {accentLabel}
            </span>
          )}
        </div>
      )}

      <div
        ref={gridRef}
        className="relative grid w-full gap-px sm:gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          touchAction: "pan-y",
        }}
        role="img"
        aria-label={`${Math.min(currentEpoch, TOTAL)} of 1000 epochs elapsed since March 2020`}
        onPointerMove={interactive ? (e) => setHovered(locate(e)) : undefined}
        onPointerLeave={interactive ? () => setHovered(null) : undefined}
      >
        {cells}
        {interactive && hovered !== null && (
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-[2px] ring-1 ring-white"
            style={ringStyle}
          />
        )}
      </div>
    </div>
  );
}
