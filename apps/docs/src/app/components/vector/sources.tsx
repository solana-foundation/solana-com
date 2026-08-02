"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { cx, vectorRoot } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

/* "Sources:" row of SourceLinks closing out an answer. */
export function SourcesRow({
  label = "Sources:",
  className,
  children,
}: {
  label?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={vectorRoot(styles.sources, className)}>
      <span className={cx(styles.sourcesLabel, jetbrainsMono.className)}>
        {label}
      </span>
      {children}
    </div>
  );
}

export function SourceLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a
        className={styles.sourceLink}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link className={styles.sourceLink} href={href}>
      {children}
    </Link>
  );
}
