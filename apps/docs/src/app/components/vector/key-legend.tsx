"use client";

import { type ReactNode } from "react";
import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

/* KEY row explaining the symbols used in a flow/diagram. Compose with
   KeyItem children: `<KeyItem tone="mint" symbol="◆">mint address</KeyItem>`. */
export function KeyLegend({
  label = "KEY",
  className,
  children,
}: {
  label?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        styles.root,
        styles.keyRow,
        jetbrainsMono.className,
        className,
      )}
    >
      <span className={styles.keyLabel}>{label}</span>
      {children}
    </div>
  );
}

export function KeyItem({
  tone,
  symbol,
  children,
}: {
  tone: "mint" | "account";
  symbol: ReactNode;
  children: ReactNode;
}) {
  const toneCls = tone === "mint" ? styles.keyMint : styles.keyAccount;
  return (
    <span className={styles.keyItem}>
      <span className={toneCls}>{symbol}</span> ={" "}
      <span className={toneCls}>{children}</span>
    </span>
  );
}
