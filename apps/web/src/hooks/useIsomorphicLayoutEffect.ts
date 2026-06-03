import { useEffect, useLayoutEffect } from "react";

/**
 * Only uses useLayoutEffect() on the frontend side and not during SSR.
 *
 * @type {{(effect: React.EffectCallback, deps?: React.DependencyList): void, (effect: React.EffectCallback, deps?: React.DependencyList): void}}
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
