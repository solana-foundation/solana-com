"use client";

import { type ReactNode } from "react";
import { cx, vectorRoot } from "./base";
import { VectorAvatar } from "./vector-avatar";
import styles from "./vector.module.css";

/* The "Vector answered …" frame: header bar with live dot + quoted question,
   then the answer body with Vector's avatar in the left gutter. Children
   render in the content column (AnswerIntro, PanelStack, CodeDisclosure,
   SourcesRow, or any prose). */
export function VectorAnswerCard({
  question,
  headerLabel = "Vector answered",
  ariaLabel,
  className,
  children,
}: {
  question: ReactNode;
  headerLabel?: ReactNode;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={vectorRoot(styles.preview, className)}
      aria-label={ariaLabel}
    >
      <div className={styles.header}>
        <span className={styles.headerDot} aria-hidden="true" />
        <span className={styles.headerText}>
          {headerLabel}{" "}
          <span className={styles.headerQuestion}>
            &ldquo;{question}&rdquo;
          </span>
        </span>
      </div>

      <div className={styles.body}>
        <VectorAvatar />
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}

/* Lead-in prose sitting next to the avatar at the top of an answer. */
export function AnswerIntro({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cx(styles.intro, className)}>{children}</p>;
}
