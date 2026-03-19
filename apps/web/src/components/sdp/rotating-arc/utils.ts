"use client";

import * as React from "react";

const motionConflictingEventHandlerKeys = [
  "onAnimationStart",
  "onDrag",
  "onDragStart",
  "onDragEnd",
  "onDragOver",
  "onDragEnter",
  "onDragLeave",
  "onDrop",
] as const;

type MotionConflictingEventHandlerKey =
  (typeof motionConflictingEventHandlerKeys)[number];

export function omitMotionConflictingEventHandlers<T extends object>(
  props: T,
): Omit<T, MotionConflictingEventHandlerKey> {
  const filteredProps = { ...props } as Record<string, unknown>;

  for (const key of motionConflictingEventHandlerKeys) {
    delete filteredProps[key];
  }

  return filteredProps as Omit<T, MotionConflictingEventHandlerKey>;
}

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
