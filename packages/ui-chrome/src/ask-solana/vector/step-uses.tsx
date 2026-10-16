"use client";

import { type ReactNode } from "react";
import { cx, vectorMonoRoot } from "./base";
import styles from "./vector.module.css";

/* "needs step 01's result" row inside a FlowStep: a muted label plus a
   UseChip per address the step consumes. */
export function StepUses({
  label,
  className,
  children,
}: {
  label?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={vectorMonoRoot(styles.stepUses, className)}>
      {label != null && <span className={styles.usesLabel}>{label}</span>}
      {children}
    </div>
  );
}

/* One consumed address, colored by kind. `source` names the chip for
   FlowArrows, pairing it with the Tok in the command that carries the same
   `flowTarget` — the arrow is drawn between the two. */
export function UseChip({
  tone,
  source,
  children,
}: {
  tone: "mint" | "account";
  source?: string;
  children: ReactNode;
}) {
  return (
    <span
      data-flow-source={source}
      className={cx(
        styles.useChip,
        tone === "mint" ? styles.useChipMint : styles.useChipAccount,
      )}
    >
      {children}
    </span>
  );
}
