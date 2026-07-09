"use client";

import { useEffect, useRef, useState } from "react";
import { nextWheelTargets, normalizeTargets, STRIP_LEN } from "./odometer-math";
import "./odometer.css";

interface OdometerProps {
  /** Epoch to display; null shows idle dim wheels while syncing. */
  value: number | null;
  /** Celebration state: every wheel lights up in the brand gradient. */
  arrived?: boolean;
  wheels?: number;
  label: string;
  className?: string;
}

/**
 * The campaign signature: a mechanical odometer of digit wheels driven by
 * live mainnet data. The thousands wheel has read 0 since March 2020 — it
 * turns for the first time at epoch 1000.
 */
export default function Odometer({
  value,
  arrived = false,
  wheels = 4,
  label,
  className = "",
}: OdometerProps) {
  const [targets, setTargets] = useState<number[]>(() => Array(wheels).fill(0));
  const [snapping, setSnapping] = useState(false);
  const settled = useRef<number[] | null>(null);

  useEffect(() => {
    if (value == null) return;
    const next = nextWheelTargets(settled.current, value, wheels);

    // A wheel ran off the strip: fold back a revolution without animating,
    // then roll to the real target on the following frame.
    if (next.some((t) => t >= STRIP_LEN)) {
      const folded = normalizeTargets(settled.current ?? next);
      setSnapping(true);
      setTargets(folded);
      settled.current = folded;
      const raf = requestAnimationFrame(() => {
        const rolled = nextWheelTargets(folded, value, wheels);
        setSnapping(false);
        setTargets(rolled);
        settled.current = rolled;
      });
      return () => cancelAnimationFrame(raf);
    }

    const raf = requestAnimationFrame(() => {
      setTargets(next);
      settled.current = next;
    });
    return () => cancelAnimationFrame(raf);
  }, [value, wheels]);

  return (
    <span
      className={`ep-odo ${arrived ? "ep-odo--arrived" : ""} ${snapping ? "ep-odo--snap" : ""} ${className}`}
      role="img"
      aria-label={label}
      aria-busy={value == null}
    >
      {targets.map((t, w) => {
        const leadingZero =
          value != null && !arrived && value < 10 ** (wheels - 1 - w);
        return (
          <span
            key={w}
            className={`ep-odo-wheel ${leadingZero || value == null ? "is-dim" : ""}`}
            aria-hidden
          >
            <span
              className="ep-odo-strip"
              style={{
                transform: `translateY(${-t}em)`,
                transitionDuration: snapping ? "0s" : `${1.4 + w * 0.45}s`,
              }}
            >
              {Array.from({ length: STRIP_LEN }, (_, i) => (
                <span key={i}>{i % 10}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
