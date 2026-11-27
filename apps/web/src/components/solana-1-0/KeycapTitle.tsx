"use client";

import { useEffect, useState } from "react";

const KEYS = "mainnet-beta".split("");
/** "-beta": the keys the film deletes. */
const RETIRED = 5;
const HOLD_MS = 1100;
const KEY_MS = 150;

/**
 * The film's opening shot as type: `mainnet-beta` on keycaps, then five
 * backspaces. Server-renders the old name so the deletion is the first thing
 * that moves; with reduced motion it lands on `mainnet` at once.
 */
export function KeycapTitle({ label }: { label: string }) {
  const [gone, setGone] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(RETIRED);
      return;
    }
    const timers = Array.from({ length: RETIRED }, (_, i) =>
      setTimeout(() => setGone(i + 1), HOLD_MS + i * KEY_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const done = gone >= RETIRED;
  return (
    <p className="m-0 flex justify-center" role="img" aria-label={label}>
      {KEYS.map((key, i) => {
        const deleted = i >= KEYS.length - gone;
        const tone = deleted
          ? "mx-0 w-0 scale-75 border-transparent opacity-0"
          : done
            ? "mx-[0.125rem] w-6 border-[#14f195]/60 bg-[#14f195]/15 text-[#14f195] shadow-[0_0_18px_rgb(20_241_149/0.35)] md:w-8"
            : "mx-[0.125rem] w-6 border-[#9945ff]/70 bg-[#9945ff]/25 text-[#ece7df] shadow-[0_0_18px_rgb(153_69_255/0.4)] md:w-8";
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`flex h-7 items-center justify-center overflow-hidden rounded-md border border-solid font-brand-mono text-[0.75rem] leading-none transition-all duration-300 motion-reduce:transition-none md:h-9 md:text-[0.9375rem] ${tone}`}
          >
            {key}
          </span>
        );
      })}
    </p>
  );
}
