"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "motion/react";

interface Props {
  text: string;
  stepMs?: number;
  startDelayMs?: number;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  html?: boolean;
}

type Segment =
  | { kind: "word"; text: string; classes?: string }
  | { kind: "space"; text: string };

// Parses plain or lightly-tagged HTML into a flat list of word / whitespace
// segments. Inline tags contribute their class to the words they wrap so the
// stagger stays linear instead of nesting motion children.
function parseSegments(input: string, html: boolean): Segment[] {
  const segments: Segment[] = [];
  const pushTokens = (chunk: string, classes?: string) => {
    for (const tok of chunk.split(/(\s+)/)) {
      if (!tok) continue;
      segments.push(
        tok.trim()
          ? { kind: "word", text: tok, classes }
          : { kind: "space", text: tok },
      );
    }
  };

  if (!html) {
    pushTokens(input);
    return segments;
  }

  const parts = input.split(/(<\/?[^>]+>)/g);
  let currentClass: string | undefined;
  for (const part of parts) {
    if (!part) continue;
    const tagMatch = part.match(/^<\s*(\/)?\s*[a-zA-Z0-9]+([^>]*)>$/);
    if (tagMatch) {
      if (tagMatch[1]) {
        currentClass = undefined;
      } else {
        const classMatch = (tagMatch[2] ?? "").match(/class\s*=\s*"([^"]*)"/);
        currentClass = classMatch?.[1];
      }
      continue;
    }
    pushTokens(part, currentClass);
  }
  return segments;
}

const wordVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

export default function WordReveal({
  text,
  stepMs = 80,
  startDelayMs = 0,
  className,
  as: Tag = "span",
  html = false,
}: Props) {
  const segments = useMemo(() => parseSegments(text, html), [text, html]);
  const ariaLabel = useMemo(() => text.replace(/<[^>]+>/g, ""), [text]);
  const MotionTag = motion[Tag] as typeof motion.span;

  const containerVariants: Variants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stepMs / 1000,
          delayChildren: startDelayMs / 1000,
        },
      },
    }),
    [stepMs, startDelayMs],
  );

  return (
    <MotionTag
      className={className}
      aria-label={ariaLabel}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      {segments.map((seg, i) => {
        if (seg.kind === "space") {
          return <React.Fragment key={i}>{seg.text}</React.Fragment>;
        }
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            variants={wordVariants}
            className={seg.classes}
          >
            {seg.text}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
