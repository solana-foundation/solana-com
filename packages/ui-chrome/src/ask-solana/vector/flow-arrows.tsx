"use client";

import { useEffect, useId, useState, type RefObject } from "react";
import { cx } from "./base";
import styles from "./vector.module.css";

type FlowArrow = { kind: string; d: string };

/* Provenance arrows: measure each `data-flow-source` chip (UseChip) and the
   command token carrying the matching `data-flow-target` (Tok), then draw a
   curve between them. Re-measured when `signal` changes, on container
   resize, and once fonts settle, since all three shift the target's
   position. */
export function useFlowArrows(
  containerRef: RefObject<HTMLElement | null>,
  signal?: unknown,
) {
  const [arrows, setArrows] = useState<FlowArrow[]>([]);

  useEffect(() => {
    void signal; // the caller's flow state — a new step means new endpoints
    const container = containerRef.current;
    if (!container) {
      setArrows([]);
      return;
    }
    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const next: FlowArrow[] = [];
      container
        .querySelectorAll<HTMLElement>("[data-flow-source]")
        .forEach((src) => {
          const kind = src.dataset.flowSource;
          const tgt = container.querySelector<HTMLElement>(
            `[data-flow-target="${kind}"]`,
          );
          if (!kind || !tgt) return;
          const s = src.getBoundingClientRect();
          const t = tgt.getBoundingClientRect();
          const cmdBox = tgt.closest("code")?.getBoundingClientRect();
          // Skip when the argument is ellipsized out of view.
          if (cmdBox && t.left + t.width / 2 > cmdBox.right - 6) return;
          const sx = s.left + s.width / 2 - containerRect.left;
          const sy = s.bottom - containerRect.top;
          const tx = t.left + t.width / 2 - containerRect.left;
          const ty = t.top - containerRect.top;
          if (ty - sy < 8) return;
          // Lean the final control point toward the travel direction so the
          // auto-oriented arrowhead continues the curve instead of snapping
          // to vertical.
          const lean = Math.max(-12, Math.min(12, (tx - sx) * 0.25));
          next.push({
            kind,
            d: `M ${sx} ${sy + 1} C ${sx} ${sy + 10}, ${tx - lean} ${ty - 12}, ${tx} ${ty - 3}`,
          });
        });
      setArrows(next);
    };
    measure();
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    ro?.observe(container);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro?.disconnect();
  }, [containerRef, signal]);

  return arrows;
}

/* SVG overlay rendering the measured curves over the FlowStep that owns
   `containerRef` (the step card is the positioned ancestor). Marker ids are
   unique per instance — markers resolve document-wide, so a shared id would
   cross-wire colors between two flows on one page. */
export function FlowArrows({
  containerRef,
  signal,
  className,
}: {
  containerRef: RefObject<HTMLElement | null>;
  signal?: unknown;
  className?: string;
}) {
  const arrows = useFlowArrows(containerRef, signal);
  const id = useId();
  if (arrows.length === 0) return null;
  return (
    <svg className={cx(styles.flowArrows, className)} aria-hidden="true">
      <defs>
        {(["mint", "account"] as const).map((kind) => (
          <marker
            key={kind}
            id={`${id}-${kind}`}
            viewBox="0 0 8 8"
            refX="6.5"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path
              d="M0 0L8 4L0 8Z"
              className={
                kind === "mint" ? styles.arrowHeadMint : styles.arrowHeadAccount
              }
            />
          </marker>
        ))}
      </defs>
      {arrows.map((a) => (
        <path
          key={a.kind}
          d={a.d}
          className={a.kind === "mint" ? styles.arrowMint : styles.arrowAccount}
          markerEnd={`url(#${id}-${a.kind === "mint" ? "mint" : "account"})`}
        />
      ))}
    </svg>
  );
}
