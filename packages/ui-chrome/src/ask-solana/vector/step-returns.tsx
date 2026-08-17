"use client";

import { type ReactNode, type Ref } from "react";
import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import { ReturnsArrowIcon } from "./icons";
import styles from "./vector.module.css";

/* "returns →" (or "result →") group appended to a FlowStep's actions once
   it has run; children are usually an AddressPill or ResultBanner. */
export function StepReturns({
  word = "returns",
  tone = "mint",
  ref,
  className,
  children,
}: {
  word?: ReactNode;
  tone?: "mint" | "account";
  ref?: Ref<HTMLSpanElement>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      ref={ref}
      className={cx(styles.returns, jetbrainsMono.className, className)}
    >
      <span className={styles.returnsArrow}>
        <ReturnsArrowIcon stroke={tone === "mint" ? "#9945FF" : "#14F195"} />
        <span className={styles.returnsWord}>{word}</span>
      </span>
      {children}
    </span>
  );
}

/* Purple→green gradient banner for a flow's final outcome. */
export function ResultBanner({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <span className={cx(styles.resultBanner, className)}>{children}</span>;
}

export function ReplayButton({
  onClick,
  children = "↺ Replay",
  className,
}: {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cx(styles.replay, jetbrainsMono.className, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
