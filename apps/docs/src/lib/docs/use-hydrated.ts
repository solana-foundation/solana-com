import { useSyncExternalStore } from "react";

const subscribeNever = () => () => undefined;

/**
 * False in the server render and while hydrating, then true. For what only
 * works in the browser, such as the docs layout's assistant
 * (components/docs/docs-assistant.client.tsx).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}
