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

/* One item in the Vector timeline. Current steps expand into a bordered card;
   completed/upcoming steps collapse to compact rows while keeping the rail. */
export function FlowStep({
  num,
  title,
  sub,
  description,
  current = true,
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
  current?: boolean;
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
        current && styles.stepCurrent,
        done && styles.stepDone,
        className,
      )}
    >
      <div className={styles.stepRail} aria-hidden="true">
        <span className={cx(styles.stepNum, jetbrainsMono.className)}>
          {num}
        </span>
        <span className={styles.stepLine} />
      </div>
      <div className={styles.stepCard}>
        <div className={styles.stepTop}>
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
    </div>
  );
}
