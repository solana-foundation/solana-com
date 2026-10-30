/**
 * Hand-off for opening the Vector side-panel widget from outside its launcher
 * (e.g. the docs hero ask bar, where the launcher robot is hidden). The
 * request survives client-side navigation: the next mounted AskSolanaButton
 * takes it exactly once, so stale requests never re-send on later mounts.
 */
export type AskSolanaWidgetSeed = { id: number; query: string };

let seed: AskSolanaWidgetSeed | null = null;
let nextId = 1;
const listeners = new Set<() => void>();

export function subscribeToAskSolanaWidget(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Returns the pending request (if any) and clears it. */
export function takeAskSolanaWidgetSeed(): AskSolanaWidgetSeed | null {
  const pending = seed;
  seed = null;
  return pending;
}

export function openAskSolanaWidget(query: string) {
  seed = { id: nextId++, query };
  listeners.forEach((listener) => listener());
}
