/**
 * Paths rendered by the docs routes of this app. Links between them are
 * client-side navigations (the chrome stays, only the page changes); links
 * anywhere else are plain anchors, so pages with their own layout (and their
 * own stylesheets) always load fresh.
 */
const DOCS_PATH =
  /^\/(?:[a-z]{2}\/)?(?:developers\/(?:docs|cookbook)(?:[/?#]|$)|learn\/[^?#])/;

export function isDocsHref(href: string | undefined): href is string {
  return !!href && DOCS_PATH.test(href) && !/\.(?:md|txt)(?:[?#]|$)/.test(href);
}
