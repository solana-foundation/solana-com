"use client";

import React, { useEffect, useState } from "react";

const NOISE_POOL =
  "#∞@±∑!÷?^&∆*≠6≈%{/~|]!^÷∆*?∞±#≈1%}÷!∑∆^*?&±#≈%2|~][/#∞@±∑!÷?^&∆±∑!÷?^&∆*≠6≈%{/~|*≠6≈%{/~|]!^#∞@±∑!÷?^&∆*≠6≈%{/~|]!^";
const NOISE_LENGTH = 500;

const STATIC_NOISE = (() => {
  let s = "";
  for (let i = 0; i < NOISE_LENGTH; i++) {
    s += NOISE_POOL[(i * 7919 + 13) % NOISE_POOL.length];
  }
  return s;
})();

const HIGHLIGHTS = ["BP26", "LONDON", "BUILD", "DEPLOY", "SHIP MORE"];
const GAP_CHARS = 48;
const CYCLE_LENGTH = HIGHLIGHTS.reduce(
  (sum, h) => sum + h.length + GAP_CHARS,
  0,
);

const SCROLL_CHARS_PER_SEC = 6;
const GLITCH_RATE = 0.16;
const TICK_MS = 70;

type Segment = { text: string; highlight: boolean };

function computeSegments(elapsedSec: number, glitch: boolean): Segment[] {
  const cells: { char: string; highlight: boolean }[] = new Array(NOISE_LENGTH);
  for (let i = 0; i < NOISE_LENGTH; i++) {
    cells[i] = { char: STATIC_NOISE[i] ?? " ", highlight: false };
  }

  const beltOffset = elapsedSec * SCROLL_CHARS_PER_SEC;
  const normOffset =
    ((beltOffset % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;

  let startPos = normOffset - CYCLE_LENGTH;
  while (startPos < NOISE_LENGTH) {
    let pos = startPos;
    for (const h of HIGHLIGHTS) {
      for (let i = 0; i < h.length; i++) {
        const idx = Math.floor(pos + i);
        if (idx >= 0 && idx < NOISE_LENGTH) {
          const glitched = glitch && Math.random() < GLITCH_RATE;
          cells[idx] = {
            char:
              (glitched
                ? NOISE_POOL[Math.floor(Math.random() * NOISE_POOL.length)]
                : h[i]) ?? " ",
            highlight: true,
          };
        }
      }
      pos += h.length + GAP_CHARS;
    }
    startPos += CYCLE_LENGTH;
  }

  const segments: Segment[] = [];
  let buffer = "";
  let currentHighlight = cells[0]?.highlight ?? false;
  for (const cell of cells) {
    if (cell.highlight !== currentHighlight) {
      segments.push({ text: buffer, highlight: currentHighlight });
      buffer = "";
      currentHighlight = cell.highlight;
    }
    buffer += cell.char;
  }
  if (buffer) segments.push({ text: buffer, highlight: currentHighlight });
  return segments;
}

export default function Marquee() {
  const [segments, setSegments] = useState<Segment[]>(() =>
    computeSegments(0, false),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = performance.now();
    let lastTick = start;
    let rafId = 0;

    const loop = (now: number) => {
      if (now - lastTick >= TICK_MS) {
        lastTick = now;
        setSegments(computeSegments((now - start) / 1000, true));
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-black pt-[64px]">
      <span className="sr-only">{HIGHLIGHTS.join(" · ")}</span>
      <div
        aria-hidden="true"
        className="whitespace-nowrap font-mono text-[14px] uppercase leading-[1.3] tracking-[0.08em]"
      >
        {segments.map((segment, i) => (
          <span
            key={i}
            className={segment.highlight ? "text-purple" : "text-neutral-600"}
          >
            {segment.text}
          </span>
        ))}
      </div>
    </div>
  );
}
