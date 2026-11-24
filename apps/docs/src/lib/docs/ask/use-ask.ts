/**
 * React binding for the Ask AI store (./store.ts). The server snapshot is a
 * closed, empty panel, so server and first client render agree; stored
 * state arrives right after hydration.
 */
import { useSyncExternalStore } from "react";
import { askStore, type AskState } from "./store";

/** The whole store state; re-renders on every change (streaming included). */
export function useAskState(): AskState {
  return useSyncExternalStore(
    askStore.subscribe,
    askStore.getState,
    askStore.getServerState,
  );
}

/**
 * One slice of the state; re-renders only when it changes (by `Object.is`).
 * Return primitives or values already in the state, not new objects.
 */
export function useAskSelector<T>(selector: (state: AskState) => T): T {
  return useSyncExternalStore(
    askStore.subscribe,
    () => selector(askStore.getState()),
    () => selector(askStore.getServerState()),
  );
}
