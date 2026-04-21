"use client";

import React, { useEffect, useRef, useState } from "react";

const GLYPHS =
  "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

interface Props {
  text: string;
  durationMs?: number;
  className?: string;
  as?: "span" | "h1" | "h2";
}

export default function TextScramble({
  text,
  durationMs = 1200,
  className,
  as = "span",
}: Props) {
  const [output, setOutput] = useState(text);
  const frame = useRef(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setOutput(text);
      return;
    }

    let raf = 0;
    const loop = (ts: number) => {
      if (start.current === null) start.current = ts;
      const elapsed = ts - start.current;
      const progress = Math.min(1, elapsed / durationMs);

      const settled = Math.floor(progress * text.length);
      let next = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === "\n" || ch === " ") {
          next += ch;
        } else if (i < settled) {
          next += ch;
        } else {
          next += GLYPHS[(frame.current + i) % GLYPHS.length];
        }
      }
      setOutput(next);
      frame.current++;
      if (progress < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setOutput(text);
      }
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs]);

  const Tag = as;
  return (
    <Tag className={className} aria-label={text}>
      {output.split("\n").map((line, i, arr) => (
        <React.Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
}
