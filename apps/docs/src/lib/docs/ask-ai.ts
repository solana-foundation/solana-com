/**
 * Where Ask AI is: the docs, /developers/docs and below, in every locale
 * (Bri's rule, Ask Solana on /docs only, now that the docs live at
 * /developers/docs). The rest of this app (the /developers landing, the
 * cookbook) keeps Inkeep's chat and search (components/docs/
 * docs-assistant.client.tsx). Matches the path with or without a locale
 * prefix (`/ja/...`; the server render sees `/en/...`).
 */
export const ASK_AI_PATH = /^\/(?:[a-z]{2}\/)?developers\/docs(?:\/|$)/;

export function isAskAiPath(pathname: string | null | undefined): boolean {
  return !!pathname && ASK_AI_PATH.test(pathname);
}

/**
 * Event the Ask AI root (components/docs/ask/ask-ai.client.tsx) listens
 * for, with `detail: AskAiOpenOptions`. Sent by the code blocks' Ask
 * button, the page actions menu and the search hand-off. Off the docs,
 * Inkeep's chat takes it (components/docs/inkeep.client.tsx).
 */
export const DOCS_ASK_OPEN_EVENT = "docs-ask-ai:open";

/**
 * Elements with this attribute open Ask AI on click (delegated by the
 * root), like the docs header's narrow-screen button. Same pattern as
 * `data-docs-search-open`.
 */
export const DOCS_ASK_OPEN_ATTR = "data-docs-ask-open";

/**
 * Marks a page's article content: selecting text inside it offers "Ask AI
 * about this" (components/docs/ask/ask-selection.client.tsx).
 */
export const DOCS_ASK_SELECTION_ATTR = "data-docs-ask-selection";

export type AskAiOpenOptions = {
  /** Code to explain (sent at once, cut to 3,500 characters). */
  code?: string;
  /** The code's language, as its block names it ("ts", "rust"). */
  language?: string;
  /** A question to send at once. */
  question?: string;
  /** Attach this page to the composer and focus it; nothing is sent. */
  aboutPage?: boolean;
  /**
   * Text selected on this page: attached to the composer as a quote, which
   * takes focus; nothing is sent. `code` when it lies in one code block.
   */
  selection?: { text: string; code?: boolean; language?: string };
};

/**
 * Opens Ask AI on this page. A string is code to explain (the code-block
 * button's original signature).
 */
export function openAskAi(options?: string | AskAiOpenOptions) {
  const detail: AskAiOpenOptions =
    typeof options === "string" ? { code: options } : { ...options };
  window.dispatchEvent(
    new CustomEvent<AskAiOpenOptions>(DOCS_ASK_OPEN_EVENT, { detail }),
  );
}
