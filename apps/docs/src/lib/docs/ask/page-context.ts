/**
 * The docs page a question is about ("Ask about this page"). Docs pages mark
 * their article as `#content[data-page-title][data-page-href]`
 * (components/docs/docs-page.tsx).
 */

export type AskPageContext = { title: string; url: string };

/**
 * Origin of the page URLs kept with a question, so a page has the same URL
 * on a preview or local host as on solana.com.
 */
const PUBLIC_ORIGIN = "https://solana.com";

export function isAskPageContext(value: unknown): value is AskPageContext {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as AskPageContext).title === "string" &&
    typeof (value as AskPageContext).url === "string" &&
    (value as AskPageContext).title.trim().length > 0 &&
    /^https?:\/\//.test((value as AskPageContext).url)
  );
}

/** The current docs page, or null off docs pages (e.g. /developers). */
export function readPageContext(): AskPageContext | null {
  if (typeof document === "undefined") return null;
  const article = document.querySelector<HTMLElement>(
    "#content[data-page-title][data-page-href]",
  );
  const title = article?.dataset.pageTitle?.trim();
  const href = article?.dataset.pageHref?.trim();
  if (!title || !href) return null;
  try {
    const url = new URL(href, PUBLIC_ORIGIN);
    return { title, url: `${PUBLIC_ORIGIN}${url.pathname}` };
  } catch {
    return null;
  }
}

/** Title used in the "Explain this code from {title}" prompt. */
export function currentPageTitle(): string {
  if (typeof document === "undefined") return "";
  return readPageContext()?.title ?? document.title.trim();
}

/** Reader's locale from <html lang>, e.g. "ja" (defaults to "en"). */
export function currentLocale(): string {
  if (typeof document === "undefined") return "en";
  const lang = document.documentElement.lang.trim().toLowerCase();
  return lang.split("-")[0] || "en";
}
