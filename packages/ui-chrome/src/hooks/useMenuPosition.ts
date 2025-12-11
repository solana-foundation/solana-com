import { useState, useEffect, useRef } from "react";

export interface UseMenuPositionOptions {
  threshold?: number;
  throttleMs?: number; // Throttle delay in milliseconds
}

/**
 * Hook to detect if element scroll position is at the top (=== 0).
 * Uses throttling and passive listeners to prevent scroll freeze and excessive handlers.
 */
export const useMenuPosition = (
  options: UseMenuPositionOptions = {},
): boolean => {
  const { threshold = 0, throttleMs = 100 } = options;
  const [isAtTop, setIsAtTop] = useState(true);
  const rafRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef<number>(-1);
  const lastCallTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = document.body?.parentNode as HTMLElement | null;

    if (!element) return;

    const getScrollTop = (): number => {
      return element.scrollTop;
    };

    const checkScrollPosition = () => {
      const scrollTop = getScrollTop();

      // Only update state if scroll position actually changed
      if (scrollTop !== lastScrollTopRef.current) {
        lastScrollTopRef.current = scrollTop;
        setIsAtTop(scrollTop <= threshold);
      }

      rafRef.current = null;
      lastCallTimeRef.current = Date.now();
    };

    const handleScroll = () => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      // Clear any pending timeout
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // If enough time has passed, execute immediately
      if (timeSinceLastCall >= throttleMs) {
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(checkScrollPosition);
        }
      } else {
        // Otherwise, schedule for later
        const delay = throttleMs - timeSinceLastCall;
        timeoutRef.current = setTimeout(() => {
          if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(checkScrollPosition);
          }
        }, delay);
      }
    };

    // Initial check
    checkScrollPosition();

    // Use passive listener to prevent scroll freeze
    document.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      document.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [threshold, throttleMs]);

  return isAtTop;
};
