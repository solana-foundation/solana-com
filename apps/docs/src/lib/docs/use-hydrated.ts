import { useSyncExternalStore } from "react";

const subscribeNever = () => () => undefined;

/**
 * False in the server render and while hydrating, then true. For what the
 * server can't know: a missing page is the prerendered 404
 * (app/global-not-found.tsx) under the URL that was asked for, which its
 * render doesn't see.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}
