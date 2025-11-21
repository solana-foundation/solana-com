import { useRef, RefObject, useCallback } from "react";

export interface UseSwipeDownOptions {
  onSwipe: () => void;
  threshold?: number; // Minimum distance in pixels to trigger swipe
  swipeAreaRef?: RefObject<HTMLElement>; // Optional ref for the swipeable area (menu content)
}

export const useSwipeDown = <T extends HTMLElement>(
  options: UseSwipeDownOptions,
): ((node: T | null) => void) => {
  const { onSwipe, threshold = 50, swipeAreaRef } = options;
  const ref = useRef<T | null>(null);
  const startYRef = useRef<number | null>(null);
  const currentYRef = useRef<number>(0);
  const isSwipingRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setupListeners = useCallback(
    (node: T) => {
      const swipeArea = swipeAreaRef?.current || node;

      if (!node || !swipeArea) return;

      const handleTouchStart = (e: TouchEvent) => {
        // Only start swipe from the top of the menu
        const touch = e.touches[0];
        if (touch.clientY < swipeArea.getBoundingClientRect().top + 50) {
          startYRef.current = touch.clientY;
          isSwipingRef.current = true;
          currentYRef.current = 0;
          node.style.transition = "none"; // Disable transition during swipe
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isSwipingRef.current || startYRef.current === null) return;

        const touch = e.touches[0];
        const deltaY = touch.clientY - startYRef.current;

        // Only allow downward swipes
        if (deltaY > 0) {
          currentYRef.current = deltaY;
          // Apply transform to move menu down
          node.style.transform = `translateY(${deltaY}px)`;
          // Add slight opacity reduction for visual feedback
          const opacity = Math.max(0.7, 1 - deltaY / 300);
          node.style.opacity = opacity.toString();
        }
      };

      const handleTouchEnd = () => {
        if (!isSwipingRef.current) return;

        const deltaY = currentYRef.current;
        isSwipingRef.current = false;
        startYRef.current = null;

        // Re-enable transition for smooth reset
        node.style.transition =
          "transform 0.2s ease-out, opacity 0.2s ease-out";

        if (deltaY >= threshold) {
          // Swipe threshold met, trigger callback
          onSwipe();
          // Reset transform after a brief delay to allow callback to process
          timeoutRef.current = setTimeout(() => {
            if (node) {
              node.style.transform = "";
              node.style.opacity = "";
            }
          }, 50);
        } else {
          // Swipe not far enough, reset position
          node.style.transform = "";
          node.style.opacity = "";
        }
      };

      const handleTouchCancel = () => {
        if (!isSwipingRef.current) return;

        isSwipingRef.current = false;
        startYRef.current = null;
        node.style.transition =
          "transform 0.2s ease-out, opacity 0.2s ease-out";
        node.style.transform = "";
        node.style.opacity = "";
      };

      swipeArea.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      swipeArea.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      swipeArea.addEventListener("touchend", handleTouchEnd, { passive: true });
      swipeArea.addEventListener("touchcancel", handleTouchCancel, {
        passive: true,
      });

      const cleanup = () => {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        swipeArea.removeEventListener("touchstart", handleTouchStart);
        swipeArea.removeEventListener("touchmove", handleTouchMove);
        swipeArea.removeEventListener("touchend", handleTouchEnd);
        swipeArea.removeEventListener("touchcancel", handleTouchCancel);
      };

      cleanupRef.current = cleanup;
      return cleanup;
    },
    [onSwipe, threshold, swipeAreaRef],
  );

  const setRef = useCallback(
    (node: T | null) => {
      // Cleanup previous listeners
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      ref.current = node;

      if (node) {
        // Setup listeners when node is available
        setupListeners(node);
      }
    },
    [setupListeners],
  );

  return setRef;
};
