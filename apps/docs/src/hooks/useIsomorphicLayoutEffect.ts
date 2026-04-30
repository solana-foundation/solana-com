import { useEffect, useLayoutEffect } from "react";

/**
 * Only uses useLayoutEffect() on the frontend side and not during SSR.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
