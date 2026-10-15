"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ScrambleValue } from "./privacy-motion";

export type LedgerView = "public" | "auditor";

export type LedgerEntry = {
  key: string;
  label: ReactNode;
  /** Formatted amount, e.g. "$8,450.00". */
  amount: string;
};

const VIEWS: readonly LedgerView[] = ["public", "auditor"];

export function ViewAsLedger({
  rows,
  labels,
}: {
  rows: LedgerEntry[];
  labels: {
    viewAs: string;
    views: Record<LedgerView, string>;
    notes: Record<LedgerView, string>;
    encrypted: string;
  };
}) {
  const reduce = useReducedMotion() ?? false;
  const [view, setView] = useState<LedgerView>("public");
  const isRevealed = view === "auditor";

  return (
    <div className="overflow-hidden rounded-2xl border border-nd-border-prominent bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-nd-border-light px-5 py-3">
        <span
          id="privacy-ledger-label"
          className="font-brand-mono text-[10px] uppercase tracking-[0.14em] text-nd-mid-em-text"
        >
          {labels.viewAs}
        </span>
        <div
          role="group"
          aria-labelledby="privacy-ledger-label"
          className="flex rounded-full border border-nd-border-light p-1"
        >
          {VIEWS.map((option) => {
            const selected = option === view;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => setView(option)}
                className={`rounded-full px-3 py-1 text-xs transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nd-highlight-green ${selected ? "!bg-solana-purple !text-white" : "!bg-transparent text-nd-mid-em-text hover:text-white"}`}
              >
                {labels.views[option]}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="m-0 list-none divide-y divide-nd-border-light p-0">
        {rows.map((row) => {
          const revealed = isRevealed;
          return (
            <li
              key={row.key}
              className={`flex min-h-[60px] items-center justify-between gap-4 px-5 py-3 text-sm transition-colors duration-500 ${revealed ? "bg-solana-purple/[0.06]" : ""}`}
            >
              <span className="flex items-center gap-2 text-white">
                {row.label}
              </span>
              <span className="relative font-brand-mono text-sm tabular-nums">
                <AnimatePresence mode="wait" initial={false}>
                  {revealed ? (
                    <motion.span
                      key="amount"
                      className="block text-nd-highlight-lavendar"
                      initial={
                        reduce ? false : { opacity: 0, filter: "blur(4px)" }
                      }
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={
                        reduce ? undefined : { opacity: 0, filter: "blur(4px)" }
                      }
                      transition={{ duration: 0.35 }}
                    >
                      {row.amount}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cipher"
                      className="block"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={reduce ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ScrambleValue label={labels.encrypted} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </li>
          );
        })}
      </ul>

      <p
        aria-live="polite"
        className="nd-body-xs border-t border-nd-border-light px-5 py-3 text-nd-mid-em-text"
      >
        {labels.notes[view]}
      </p>
    </div>
  );
}
