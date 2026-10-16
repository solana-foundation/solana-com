"use client";

import { type ReactNode } from "react";
import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

/* Address chip in the flow's key colors: purple for mints, green for token
   accounts. `wide` for the fixed-width returns row; `bounce` (+`bounceLate`
   to stagger a second pill) when it hops through a FlowConnector. */
export function AddressPill({
  tone,
  symbol,
  label,
  value,
  valueTone = "white",
  wide,
  bounce,
  bounceLate,
  className,
}: {
  tone: "mint" | "account";
  symbol?: ReactNode;
  label?: ReactNode;
  value: ReactNode;
  valueTone?: "white" | "green";
  wide?: boolean;
  bounce?: boolean;
  bounceLate?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        styles.pill,
        tone === "mint" ? styles.pillMint : styles.pillAta,
        wide && styles.pillWide,
        bounce && styles.pillBounce,
        bounceLate && styles.pillBounceLate,
        jetbrainsMono.className,
        className,
      )}
    >
      {symbol != null && <span>{symbol}</span>}
      {label}
      <span
        className={
          valueTone === "green" ? styles.pillValueGreen : styles.pillValue
        }
      >
        {value}
      </span>
    </span>
  );
}
