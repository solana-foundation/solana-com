"use client";

import { type ReactNode } from "react";
import { cx, vectorMonoRoot } from "./base";
import styles from "./vector.module.css";

/* On-chain account snapshot: tag + address header over label/value rows.
   Variants: "mint" (purple), "token" (green, the reader's account),
   "token-muted" (dimmed, someone else's). `write` replays the green glow
   when an instruction just wrote to the account. Inside a ModelDiagram the
   cards take the diagram's fixed placement; standalone they lay out like a
   normal block. */
export function AccountCard({
  variant,
  tag,
  address,
  write,
  className,
  children,
}: {
  variant: "mint" | "token" | "token-muted";
  tag: ReactNode;
  address: ReactNode;
  write?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const variantCls =
    variant === "mint"
      ? styles.mintCard
      : cx(
          styles.tokenCard,
          variant === "token" ? styles.tokenCardYou : styles.tokenCardOther,
        );
  return (
    <div
      className={vectorMonoRoot(
        styles.acctCard,
        variantCls,
        write && styles.cardWrite,
        className,
      )}
    >
      <div className={styles.acctHead}>
        <span className={styles.acctTag}>{tag}</span>
        <span className={styles.acctAddr}>{address}</span>
      </div>
      <div className={styles.acctRows}>{children}</div>
    </div>
  );
}

/* One label/value row. `pop` flashes the value when it just changed. */
export function AccountRow({
  label,
  tone = "white",
  strong,
  pop,
  children,
}: {
  label: ReactNode;
  tone?: "white" | "dim" | "green" | "mint";
  strong?: boolean;
  pop?: boolean;
  children: ReactNode;
}) {
  const toneCls = {
    white: styles.valWhite,
    dim: styles.valDim,
    green: styles.valGreen,
    mint: styles.valMint,
  }[tone];
  return (
    <div className={styles.acctRow}>
      <span className={styles.rowLabel}>{label}</span>
      <span
        className={cx(
          toneCls,
          strong && styles.valStrong,
          pop && styles.valPop,
        )}
      >
        {children}
      </span>
    </div>
  );
}
