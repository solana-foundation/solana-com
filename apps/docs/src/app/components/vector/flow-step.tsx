"use client";

import { type ReactNode, type Ref } from "react";
import { cx, vectorRoot } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

export function FlowSteps({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={vectorRoot(styles.steps, className)}>{children}</div>;
}

/* One numbered card in an interactive flow. While a step is current it can
   show a longer `description`; children fill the actions row (CommandChip,
   ExecuteButton, StepReturns…). `reveal` delays the entrance animation so a
   preceding FlowConnector plays first; `done` relaxes the accent border. */
export function FlowStep({
  num,
  title,
  sub,
  description,
  done,
  reveal,
  actionsColumn,
  ref,
  className,
  children,
}: {
  num: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  description?: ReactNode;
  done?: boolean;
  reveal?: boolean;
  actionsColumn?: boolean;
  ref?: Ref<HTMLDivElement>;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      ref={ref}
      className={vectorRoot(
        styles.step,
        reveal && styles.stepReveal,
        done && styles.stepDone,
        className,
      )}
    >
      <div className={styles.stepTop}>
        <span className={cx(styles.stepNum, jetbrainsMono.className)}>
          {num}
        </span>
        <span className={styles.stepTitle}>
          {title}{" "}
          {sub != null && <span className={styles.stepSub}>- {sub}</span>}
        </span>
      </div>
      {description != null && (
        <div className={styles.stepDesc}>{description}</div>
      )}
      <div
        className={cx(
          styles.stepActions,
          actionsColumn && styles.stepActionsCol,
        )}
      >
        {children}
      </div>
    </div>
  );
}
