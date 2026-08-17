"use client";

import { type ReactNode } from "react";
import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import { ConnectorArrowIcon } from "./icons";
import styles from "./vector.module.css";

/* Vertical data-flow connector between FlowSteps: bobbing arrows around a
   label plus the values being handed down (AddressPill children). */
export function FlowConnector({
  label = "input",
  className,
  children,
}: {
  label?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cx(styles.root, styles.connector, className)}>
      <ConnectorArrowIcon />
      <span className={cx(styles.connectorLabel, jetbrainsMono.className)}>
        {label} {children}
      </span>
      <ConnectorArrowIcon />
    </div>
  );
}
