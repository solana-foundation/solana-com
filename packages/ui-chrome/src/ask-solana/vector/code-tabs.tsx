"use client";

import { type ReactNode } from "react";
import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

/* Controlled tab strip with the brand-gradient active underline. */
export function TabBar<T extends string>({
  tabs,
  active,
  onSelect,
  className,
}: {
  tabs: ReadonlyArray<{ id: T; label: ReactNode }>;
  active: T;
  onSelect: (_id: T) => void;
  className?: string;
}) {
  return (
    <div className={cx(styles.tabsRow, className)}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cx(
              styles.tab,
              active === tab.id && styles.tabActive,
              jetbrainsMono.className,
            )}
            aria-pressed={active === tab.id}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Fade-in body for the active tab. */
export function TabPanel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx(styles.tabPanel, className)}>{children}</div>;
}
