"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { FeaturedSolutionKey } from "@/data/solutions/privacy";

/**
 * Decorative motion for /privacy. Everything here is aria-hidden or purely
 * presentational and falls back to a still state for reduced motion.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export const SOLUTION_ACCENTS: Record<
  FeaturedSolutionKey,
  { hex: string; text: string; glow: string; border: string }
> = {
  confidentialBalances: {
    hex: "#CA9FF5",
    text: "text-nd-highlight-lavendar",
    glow: "rgba(153,69,255,0.18)",
    border: "hover:border-nd-highlight-green/50",
  },
  privateChannels: {
    hex: "#6693F7",
    text: "text-nd-highlight-blue",
    glow: "rgba(102,147,247,0.18)",
    border: "hover:border-nd-highlight-blue/50",
  },
  rings: {
    hex: "#CA9FF5",
    text: "text-nd-highlight-lavendar",
    glow: "rgba(153,69,255,0.2)",
    border: "hover:border-nd-highlight-lavendar/50",
  },
};

/** Fade and rise into view once. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Solution icons, after the brochure motifs ─────────────────────── */

function BalanceMask({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const fade = (visible: boolean) =>
    reduce
      ? { opacity: visible ? 0 : 1 }
      : { opacity: visible ? [1, 1, 0, 0, 1] : [0, 0, 1, 1, 0] };
  const transition = {
    duration: 4,
    repeat: Infinity,
    times: [0, 0.35, 0.45, 0.85, 0.95],
  };
  return (
    <svg viewBox="0 0 150 56" className="h-14 w-auto" aria-hidden="true">
      <rect
        x={1}
        y={10}
        width={148}
        height={36}
        rx={18}
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.28)"
      />
      <g transform="translate(16 18)">
        <rect x={0} y={8} width={16} height={12} rx={2.5} fill={color} />
        <path
          d="M3.5 8 V5.5 a4.5 4.5 0 0 1 9 0 V8"
          fill="none"
          stroke={color}
          strokeWidth={2}
        />
      </g>
      <motion.text
        x={44}
        y={33}
        fontSize={15}
        fill="white"
        className="font-brand-mono"
        animate={fade(true)}
        transition={transition}
      >
        $8,450.00
      </motion.text>
      <motion.text
        x={44}
        y={34}
        fontSize={18}
        letterSpacing="2"
        fill={color}
        className="font-brand-mono"
        animate={fade(false)}
        transition={transition}
      >
        ••••••
      </motion.text>
    </svg>
  );
}

function ChannelNetwork({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const nodes = [44, 84, 124];
  return (
    <svg viewBox="0 0 150 56" className="h-14 w-auto" aria-hidden="true">
      <rect
        x={1}
        y={10}
        width={148}
        height={36}
        rx={18}
        fill="rgba(102,147,247,0.08)"
        stroke={color}
        strokeDasharray="4 3"
      />
      <g transform="translate(16 20)">
        <rect x={0} y={0} width={16} height={16} rx={4} fill={color} />
        <path
          d="M4 8 h8 M9 5 l3 3 l-3 3"
          fill="none"
          stroke="#000"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <line
        x1={nodes[0]}
        y1={28}
        x2={nodes[2]}
        y2={28}
        stroke="rgba(255,255,255,0.3)"
      />
      {nodes.map((x) => (
        <circle
          key={x}
          cx={x}
          cy={28}
          r={5}
          fill="#000"
          stroke="rgba(255,255,255,0.7)"
        />
      ))}
      {reduce ? (
        <circle cx={nodes[1]} cy={28} r={3} fill={color} />
      ) : (
        <motion.circle
          cx={nodes[0]}
          cy={28}
          r={3}
          fill={color}
          animate={{ x: [0, 40, 80, 40, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

function RingStack() {
  const reduce = useReducedMotion();
  const rings = [
    { cx: 22, color: "#55E9AB", duration: 9, direction: 1 },
    { cx: 42, color: "#6693F7", duration: 12, direction: -1 },
    { cx: 62, color: "#9945FF", duration: 15, direction: 1 },
  ];
  return (
    <svg viewBox="0 0 84 56" className="h-14 w-auto" aria-hidden="true">
      {rings.map((ring) => (
        <motion.g
          key={ring.cx}
          style={{ transformOrigin: `${ring.cx}px 28px` }}
          animate={reduce ? undefined : { rotate: 360 * ring.direction }}
          transition={{
            duration: ring.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={(ring.cx + Math.cos(a) * 16).toFixed(2)}
                cy={(28 + Math.sin(a) * 16).toFixed(2)}
                r={1.7}
                fill={ring.color}
                opacity={0.45 + (i % 6) * 0.1}
              />
            );
          })}
        </motion.g>
      ))}
    </svg>
  );
}

export function SolutionIcon({ solution }: { solution: FeaturedSolutionKey }) {
  const { hex } = SOLUTION_ACCENTS[solution];
  if (solution === "confidentialBalances") return <BalanceMask color={hex} />;
  if (solution === "privateChannels") return <ChannelNetwork color={hex} />;
  return <RingStack />;
}

/* ── Encrypted value that keeps re-encrypting ─────────────────────── */

const GLYPHS = "0123456789abcdef";

function cipher(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

export function ScrambleValue({ label }: { label: string }) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState("••••••••");

  useEffect(() => {
    if (reduce) return;
    setValue(cipher(8));
    const id = window.setInterval(() => setValue(cipher(8)), 900);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <span role="img" aria-label={label} className="text-nd-mid-em-text">
      <span aria-hidden="true">{value}</span>
    </span>
  );
}

/* ── Private Channels settlement track ────────────────────────────── */

export function SettlementTrack({ color }: { color: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mb-4 hidden h-6 sm:block" aria-hidden="true">
      <div className="absolute inset-x-[16%] top-1/2 h-px bg-white/25" />
      {[16, 50, 84].map((left) => (
        <span
          key={left}
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-nd-bg"
          style={{ left: `${left}%` }}
        />
      ))}
      {!reduce && (
        <motion.span
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
          animate={{ left: ["16%", "84%"] }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            repeatDelay: 0.6,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}
