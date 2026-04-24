"use client";

import React, { useEffect, useState } from "react";

const NOISE_POOL =
  "#∞@±∑!÷?^&∆*≠6≈%{/~|]!^÷∆*?∞±#≈1%}÷!∑∆^*?&±#≈%2|~][/#∞@±∑!÷?^&∆±∑!÷?^&∆*≠6≈%{/~|*≠6≈%{/~|]!^#∞@±∑!÷?^&∆*≠6≈%{/~|]!^";
const NOISE_LENGTH = 500;
const NOISE_REARRANGE_MS = 7_000;

const randomGlyph = () =>
  NOISE_POOL[Math.floor(Math.random() * NOISE_POOL.length)] ?? " ";

const hash = (value: number) => {
  let x = value | 0;
  x = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  return (x ^ (x >>> 16)) >>> 0;
};

function buildStaticNoise(glitchCycle: number) {
  const chars = Array.from(NOISE_POOL);

  for (let i = chars.length - 1; i > 0; i--) {
    const swapIndex = hash(glitchCycle * 4099 + i) % (i + 1);
    [chars[i], chars[swapIndex]] = [chars[swapIndex] ?? " ", chars[i] ?? " "];
  }

  return Array.from(
    { length: NOISE_LENGTH },
    (_, i) => chars[hash(glitchCycle * 7919 + i * 131 + 13) % chars.length],
  ).join("");
}

const HIGHLIGHTS = ["BP26", "LONDON", "BUILD", "DEPLOY", "SHIP MORE"];
const GAP_CHARS = 48;
const CYCLE_LENGTH = HIGHLIGHTS.reduce(
  (sum, h) => sum + h.length + GAP_CHARS,
  0,
);

const GLITCH_RATE = 0.16;
const TICK_MS = 250;
const CHARS_PER_STEP = 2;

type Segment = { text: string; highlight: boolean };

function computeSegments(
  step: number,
  glitch: boolean,
  glitchCycle: number,
): Segment[] {
  const staticNoise = buildStaticNoise(glitchCycle);
  const cells = Array.from({ length: NOISE_LENGTH }, (_, i) => ({
    char: staticNoise[i] ?? " ",
    highlight: false,
  }));

  const beltOffset = step * CHARS_PER_STEP;
  const normOffset =
    ((beltOffset % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;

  for (
    let startPos = normOffset - CYCLE_LENGTH;
    startPos < NOISE_LENGTH;
    startPos += CYCLE_LENGTH
  ) {
    let pos = startPos;
    for (const h of HIGHLIGHTS) {
      for (let i = 0; i < h.length; i++) {
        const idx = pos + i;
        if (idx < 0 || idx >= NOISE_LENGTH) continue;
        const glitched = glitch && Math.random() < GLITCH_RATE;
        cells[idx] = {
          char: (glitched ? randomGlyph() : h[i]) ?? " ",
          highlight: true,
        };
      }
      pos += h.length + GAP_CHARS;
    }
  }

  const segments: Segment[] = [];
  for (const cell of cells) {
    const last = segments[segments.length - 1];
    if (last && last.highlight === cell.highlight) last.text += cell.char;
    else segments.push({ text: cell.char, highlight: cell.highlight });
  }
  return segments;
}

export default function Marquee() {
  const [segments, setSegments] = useState<Segment[]>(() =>
    computeSegments(0, false, 0),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let step = 0;
    let glitchCycle = 0;
    let nextNoiseAt = Date.now() + NOISE_REARRANGE_MS;
    const id = setInterval(() => {
      step += 1;

      const now = Date.now();
      if (now >= nextNoiseAt) {
        glitchCycle += 1;
        nextNoiseAt += NOISE_REARRANGE_MS;
      }

      setSegments(computeSegments(step, true, glitchCycle));
    }, TICK_MS);
    return () => clearInterval(id);
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
