/**
 * Shared modal state for Ask Solana.
 *
 * Multiple entry points mount simultaneously (header search bar, inline
 * mobile button, fixed page button), so open/view state lives in a module
 * store and exactly one mounted host renders the dialog + global listeners.
 * Same approach as podcast-player-store.
 */
export type AskSolanaView = "chat" | "search";

type AskSolanaState = {
  isOpen: boolean;
  view: AskSolanaView;
  /** Query to prefill (e.g. from the ?search= deep link or entry buttons). */
  initialQuery: string;
};

let state: AskSolanaState = {
  isOpen: false,
  view: "search",
  initialQuery: "",
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeToAskSolana(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAskSolanaState(): AskSolanaState {
  return state;
}

export function openAskSolana(view: AskSolanaView, initialQuery = "") {
  state = { isOpen: true, view, initialQuery };
  emit();
}

/** Consume-once semantics for entry-point queries: after a view seeds
 * itself, clear the query so tab switches don't re-seed (and wipe) it. */
export function clearAskSolanaInitialQuery() {
  if (!state.initialQuery) return;
  state = { ...state, initialQuery: "" };
  emit();
}

export function setAskSolanaView(view: AskSolanaView) {
  if (state.view === view) return;
  state = { ...state, view };
  emit();
}

export function closeAskSolana() {
  if (!state.isOpen) return;
  state = { ...state, isOpen: false, initialQuery: "" };
  emit();
}

export function toggleAskSolana(view: AskSolanaView) {
  if (state.isOpen) {
    closeAskSolana();
  } else {
    openAskSolana(view);
  }
}

/**
 * Host ownership: every entry component renders an AskSolanaModalHost, but
 * only the first mounted one (the "owner") renders the dialog and registers
 * the Cmd/Ctrl-K + ?search= handlers, so we never stack duplicate modals.
 */
const hostIds = new Set<number>();
let nextHostId = 1;

export function allocateHostId(): number {
  return nextHostId++;
}

export function registerHost(id: number) {
  hostIds.add(id);
  emit();
}

export function unregisterHost(id: number) {
  hostIds.delete(id);
  emit();
}

export function isOwnerHost(id: number): boolean {
  let min = Infinity;
  hostIds.forEach((hostId) => {
    if (hostId < min) min = hostId;
  });
  return min === id;
}
