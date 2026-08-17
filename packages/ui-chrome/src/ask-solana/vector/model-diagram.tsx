"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

/* Fixed-height canvas that places AccountCards in the live-model layout
   (mint left, token accounts right); below the 700px container breakpoint
   it degrades to a simple stacked column. */
export function ModelDiagram({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx(styles.root, styles.modelDiagram, className)}>
      {children}
    </div>
  );
}

/* Dashed placeholder shown before a diagram has anything to draw. */
export function ModelEmptyState({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        styles.root,
        styles.modelEmpty,
        jetbrainsMono.className,
        className,
      )}
    >
      {children}
    </div>
  );
}

/* Curved reference arrows drawn under the diagram's cards. Coordinates are
   in `viewBox` units over the diagram's area. The arrowhead marker id is
   unique per instance by default (markers resolve document-wide, so a
   shared id would cross-wire colors between two diagrams on one page). */
export function ModelArrows({
  paths,
  color = "#9945FF",
  viewBox = "0 0 760 250",
  markerId,
  className,
}: {
  paths: string[];
  color?: string;
  viewBox?: string;
  markerId?: string;
  className?: string;
}) {
  const autoId = useId();
  const id = markerId ?? `vector-model-arrow-${autoId}`;
  return (
    <svg
      className={cx(styles.modelArrows, className)}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <marker
          id={id}
          orient="auto"
          markerWidth="7"
          markerHeight="7"
          refX="4.6"
          refY="3"
          overflow="visible"
        >
          <path
            d="M0 0 L5 3 L0 6"
            fill="none"
            stroke={color}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      {paths.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeOpacity={0.6}
          markerEnd={`url(#${id})`}
        />
      ))}
    </svg>
  );
}
