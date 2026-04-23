"use client";

import React, { useEffect, useRef, useState } from "react";

const GLYPHS =
  "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const COLORS = ["#ffffff", "#ab66fd", "#e7d2f9"];
const BLOCK_WIDTHS = ["0.4em", "0.7em", "1em"];

type Cell =
  | { kind: "char"; char: string; color: string | null }
  | { kind: "block"; width: string }
  | { kind: "break" };

interface Props {
  text: string;
  durationMs?: number;
  className?: string;
  as?: "span" | "h1" | "h2";
}

function buildCells(
  text: string,
  settled: number,
  frame: number,
  done: boolean,
): Cell[] {
  if (done) {
    return Array.from(text, (ch) =>
      ch === "\n"
        ? { kind: "break" as const }
        : { kind: "char" as const, char: ch, color: null },
    );
  }
  return Array.from(text, (ch, i) => {
    if (ch === "\n") return { kind: "break" as const };
    if (i < settled) return { kind: "char" as const, char: ch, color: null };
    if (ch === " ")
      return {
        kind: "block" as const,
        width: BLOCK_WIDTHS[(frame + i) % BLOCK_WIDTHS.length]!,
      };
    return {
      kind: "char" as const,
      char: GLYPHS[(frame + i) % GLYPHS.length]!,
      color: COLORS[(frame + i * 3) % COLORS.length]!,
    };
  });
}

export default function TextScramble({
  text,
  durationMs = 1000,
  className,
  as = "span",
}: Props) {
  const [cells, setCells] = useState<Cell[]>(() =>
    buildCells(text, 0, 0, true),
  );
  const frame = useRef(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCells(buildCells(text, text.length, 0, true));
      return;
    }

    let raf = 0;
    const loop = (ts: number) => {
      if (start.current === null) start.current = ts;
      const progress = Math.min(1, (ts - start.current) / durationMs);
      const settled = Math.floor(progress * text.length);
      setCells(buildCells(text, settled, frame.current, false));
      frame.current += 1;
      if (progress < 1) raf = requestAnimationFrame(loop);
      else setCells(buildCells(text, text.length, 0, true));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs]);

  const Tag = as;
  return (
    <Tag className={className} aria-label={text}>
      {cells.map((c, i) => {
        if (c.kind === "break") return <br key={i} />;
        if (c.kind === "block")
          return (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: c.width,
                height: "0.72em",
                background: "#ffffff",
                verticalAlign: "middle",
                margin: "0 0.08em",
              }}
            />
          );
        return (
          <span key={i} style={c.color ? { color: c.color } : undefined}>
            {c.char}
          </span>
        );
      })}
    </Tag>
  );
}
