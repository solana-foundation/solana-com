import { getLangDir } from "rtl-detect";

/**
 * `lang` and `dir` for a docs page whose content is not in its URL's locale
 * (an untranslated page served in English at /ar/...): the English text is
 * marked English and laid out left to right, instead of inheriting the
 * locale's `dir="rtl"` from <html>. Nothing when the page is in its locale.
 */
export function contentLanguageAttributes(
  locale: string,
  contentLocale: string,
): { lang?: string; dir?: "ltr" | "rtl" } {
  if (contentLocale === locale) return {};
  return { lang: contentLocale, dir: getLangDir(contentLocale) };
}
