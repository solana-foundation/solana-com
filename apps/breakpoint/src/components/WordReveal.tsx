"use client";

import React from "react";
import { useInView } from "@/hooks/useInView";

interface Props {
  text: string;
  stepMs?: number;
  startDelayMs?: number;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  html?: boolean;
}

// Appears word-by-word using a step curve. Each word flips opacity 0→1
// at its staggered delay — discrete, no easing.
export default function WordReveal({
  text,
  stepMs = 80,
  startDelayMs = 0,
  className,
  as: Tag = "span",
  html = false,
}: Props) {
  const [ref, inView] = useInView<HTMLElement>(0.15);

  if (html) {
    let wordIndex = 0;
    const wrapped = text
      .split(/(<[^>]+>)/g)
      .map((part) => {
        if (!part) return "";
        if (part.startsWith("<")) return part;
        return part.replace(/\S+/g, (word) => {
          const delay = startDelayMs + wordIndex * stepMs;
          wordIndex += 1;
          return `<span data-word aria-hidden="true" style="animation-delay: ${delay}ms">${word}</span>`;
        });
      })
      .join("");

    return (
      <Tag
        ref={ref as unknown as React.Ref<never>}
        className={`bp-word-reveal ${inView ? "is-revealed" : ""} ${className ?? ""}`}
        aria-label={text.replace(/<[^>]+>/g, "")}
        dangerouslySetInnerHTML={{ __html: wrapped }}
      />
    );
  }

  const tokens = text.split(/(\s+)/);
  let wordIndex = 0;

  return (
    <Tag
      ref={ref as unknown as React.Ref<never>}
      className={`bp-word-reveal ${inView ? "is-revealed" : ""} ${className ?? ""}`}
      aria-label={text}
    >
      {tokens.map((tok, i) => {
        if (!tok.trim()) return <React.Fragment key={i}>{tok}</React.Fragment>;
        const delay = startDelayMs + wordIndex * stepMs;
        wordIndex += 1;
        return (
          <span
            key={i}
            data-word
            aria-hidden="true"
            style={{ animationDelay: `${delay}ms` }}
          >
            {tok}
          </span>
        );
      })}
    </Tag>
  );
}
