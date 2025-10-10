import { useLayoutEffect, useRef, useCallback } from "react";

export interface UseViewportVisibilityOptions {
  topOffset?: number;
  bottomOffset?: number;
}

export const useViewportVisibility = <T extends HTMLElement>(
  handler?: (_node: T | null) => void | ((_node: T | null) => void),
  options: UseViewportVisibilityOptions = {},
): { ref: React.RefObject<T> } => {
  const { topOffset = 0, bottomOffset = 0 } = options;
  const targetRef = useRef<T | null>(null);
  const isVisibleRef = useRef(false);
  const exitHandlerRef = useRef<((_node: T | null) => void) | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const isCurrentlyVisible = entry.isIntersecting;

      // If node just became visible and wasn't visible before
      if (isCurrentlyVisible && !isVisibleRef.current) {
        isVisibleRef.current = true;
        if (handler) {
          const exitHandler = handler(targetRef.current);
          exitHandlerRef.current = exitHandler || null;
        }
      }
      // If node is no longer visible and was visible before
      else if (!isCurrentlyVisible && isVisibleRef.current) {
        isVisibleRef.current = false;
        if (exitHandlerRef.current) {
          exitHandlerRef.current(targetRef.current);
          exitHandlerRef.current = null;
        }
      }
    },
    [handler],
  );

  useLayoutEffect(() => {
    const node = targetRef.current;

    // If node is not found, do nothing
    if (!node) return;

    // Create root margin based on offsets
    const rootMargin = `${topOffset}px 0px ${bottomOffset}px 0px`;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold: 0, // Trigger as soon as any part is visible
    });

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      // Clean up any pending exit handler
      if (exitHandlerRef.current) {
        exitHandlerRef.current(node);
        exitHandlerRef.current = null;
      }
    };
  }, [handleIntersection, topOffset, bottomOffset]);

  return { ref: targetRef };
};
