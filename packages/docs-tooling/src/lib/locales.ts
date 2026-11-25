import { defaultLocale, locales } from "@workspace/i18n/config";

export const DEFAULT_LOCALE: string = defaultLocale;

/** Locales with translated docs content (every site locale except English). */
export const DOCS_LOCALES: readonly string[] = locales.filter(
  (l) => l !== defaultLocale,
);
