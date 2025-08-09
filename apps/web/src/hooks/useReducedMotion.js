import { useMemo } from "react";

/**
 * Hook to easily grab reduced motion media query.
 *
 * @returns {[unknown, unknown]}
 */
const useReducedMotion = () => {
  // Grab the prefers reduced media query and memoize it.
  const reducedMotionMatch = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    [],
  );
  const prefersReducedMotion = useMemo(
    () => !!reducedMotionMatch && reducedMotionMatch.matches,
    [reducedMotionMatch],
  );
  return [prefersReducedMotion, reducedMotionMatch];
};

export default useReducedMotion;
