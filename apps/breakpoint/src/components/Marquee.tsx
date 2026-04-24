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
const SHUFFLE_FRAME_MS = 25;
const SHUFFLE_MIN_MS = 200;
const SHUFFLE_MAX_MS = 900;
const SHUFFLE_START_JITTER_MS = 250;
const FLIP_INTERVAL_MIN_MS = 30;
const FLIP_INTERVAL_MAX_MS = 150;

type Segment = { text: string; highlight: boolean };

type Flip = {
  startPool: number;
  startAt: number;
  endAt: number;
  flipIntervalMs: number;
};

function computeSegments(
  step: number,
  glitch: boolean,
  noiseChars: string,
): Segment[] {
  const cells = Array.from({ length: NOISE_LENGTH }, (_, i) => ({
    char: noiseChars[i] ?? " ",
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
    computeSegments(0, false, buildStaticNoise(0)),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let step = 0;
    let glitchCycle = 0;
    let nextNoiseAt = Date.now() + NOISE_REARRANGE_MS;
    let currentNoise = buildStaticNoise(0);
    let targetNoise = currentNoise;
    let flips: Flip[] | null = null;
    let shuffleFrameId: ReturnType<typeof setInterval> | null = null;

    const stopShuffle = () => {
      if (shuffleFrameId) {
        clearInterval(shuffleFrameId);
        shuffleFrameId = null;
      }
      flips = null;
    };

    const renderShuffleFrame = () => {
      if (!flips) return;
      const now = Date.now();
      const chars = new Array<string>(NOISE_LENGTH);
      let stillFlipping = false;
      for (let i = 0; i < NOISE_LENGTH; i++) {
        const flip = flips[i];
        if (!flip || now >= flip.endAt) {
          chars[i] = targetNoise[i] ?? " ";
        } else if (now < flip.startAt) {
          stillFlipping = true;
          chars[i] = currentNoise[i] ?? " ";
        } else {
          stillFlipping = true;
          const flaps = Math.floor((now - flip.startAt) / flip.flipIntervalMs);
          chars[i] =
            NOISE_POOL[(flip.startPool + flaps) % NOISE_POOL.length] ?? " ";
        }
      }
      currentNoise = chars.join("");
      setSegments(computeSegments(step, true, currentNoise));
      if (!stillFlipping) stopShuffle();
    };

    const startShuffle = () => {
      stopShuffle();
      const now = Date.now();
      flips = Array.from({ length: NOISE_LENGTH }, () => {
        const startAt = now + Math.random() * SHUFFLE_START_JITTER_MS;
        const duration =
          SHUFFLE_MIN_MS + Math.random() * (SHUFFLE_MAX_MS - SHUFFLE_MIN_MS);
        return {
          startPool: Math.floor(Math.random() * NOISE_POOL.length),
          startAt,
          endAt: startAt + duration,
          flipIntervalMs:
            FLIP_INTERVAL_MIN_MS +
            Math.random() * (FLIP_INTERVAL_MAX_MS - FLIP_INTERVAL_MIN_MS),
        };
      });
      shuffleFrameId = setInterval(renderShuffleFrame, SHUFFLE_FRAME_MS);
    };

    const id = setInterval(() => {
      step += 1;

      const now = Date.now();
      if (now >= nextNoiseAt) {
        glitchCycle += 1;
        nextNoiseAt += NOISE_REARRANGE_MS;
        targetNoise = buildStaticNoise(glitchCycle);
        startShuffle();
        return;
      }

      if (flips) return;
      setSegments(computeSegments(step, true, currentNoise));
    }, TICK_MS);

    return () => {
      clearInterval(id);
      stopShuffle();
    };
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
