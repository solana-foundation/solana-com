"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/* Locally generated placeholder address ("Ab3k…9fQz") for simulated flows —
   nothing on chain, just plausible base58. */
export function randomAddress() {
  const part = (n: number) =>
    Array.from(
      { length: n },
      () => BASE58[Math.floor(Math.random() * BASE58.length)],
    ).join("");
  return `${part(4)}…${part(4)}`;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* Count from 0 to `target` with an ease-out ramp; used to animate values
   that change together (e.g. a mint's supply and a token account's amount
   after one instruction writes both). Jumps straight to the target under
   prefers-reduced-motion. */
export function useCountUp(active: boolean, target: number, durationMs = 750) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);
  return value;
}

/* Clipboard write + the transient "Copied" label flip that every copy
   affordance in the family shares. */
export function useCopyFeedback(resetMs = 1200) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(
    (text: string) => {
      try {
        void navigator.clipboard.writeText(text.trim()).catch(() => {});
      } catch {
        // Clipboard unavailable (insecure context); still flip the label.
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetMs);
    },
    [resetMs],
  );

  return { copied, copy };
}
