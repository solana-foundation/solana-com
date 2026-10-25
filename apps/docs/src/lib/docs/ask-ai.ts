/**
 * Event a code block's Ask button (docs-components.client) sends, with its
 * code in `detail.code`. Inkeep's chat answers it (components/docs/
 * inkeep.client.tsx).
 */
export const DOCS_ASK_CODE_EVENT = "docs-ask-ai:code";

/** Opens Ask AI on this page, optionally asking about `code`. */
export function openAskAi(code?: string) {
  window.dispatchEvent(
    new CustomEvent(DOCS_ASK_CODE_EVENT, { detail: { code } }),
  );
}
