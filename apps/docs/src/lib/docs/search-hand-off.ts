/**
 * Event Inkeep's docs search (components/docs/inkeep.client.tsx) listens
 * for, sent by the docs header's search field.
 */
export const DOCS_SEARCH_OPEN_EVENT = "docs-search:open";

/** Opens the docs search on this page, optionally with a query. */
export function openDocsSearch(query = "") {
  window.dispatchEvent(
    new CustomEvent(DOCS_SEARCH_OPEN_EVENT, { detail: { query } }),
  );
}

/**
 * The docs header's no-JS search form submits to `?q=<text>`. Returns the
 * text to open the search with (null without `?q=`) and removes it from the
 * URL.
 */
export function takeSearchHandOff(): string | null {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  if (query === null) return null;
  params.delete("q");
  const rest = params.toString();
  history.replaceState(
    history.state,
    "",
    location.pathname + (rest ? `?${rest}` : "") + location.hash,
  );
  return query.slice(0, 200);
}
