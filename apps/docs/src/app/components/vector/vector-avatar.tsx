"use client";

import { cx } from "./base";
import styles from "./vector.module.css";

/* Vector's chat-scale mark: a CSS clip-path glyph with blinking eyes — no
   SVG or images (vector-robot.html, Solana.com Design System). */
export function VectorAvatar({ className }: { className?: string }) {
  return (
    <span className={cx(styles.avatar, className)} aria-hidden="true">
      <span className={styles.avatarIn}>
        <span className={styles.avatarEye} />
        <span className={styles.avatarEye} />
      </span>
    </span>
  );
}
