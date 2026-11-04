import { languages } from "@workspace/i18n/config";
import type { ResolvedDocsPage } from "./page-data";
import { DOCS_LOCALES } from "./locales.mjs";

/**
 * The current page in every language, for the header's language menu.
 * Untranslated pages are answered by English at their locale URL.
 */
export function languagePaths(
  resolved: ResolvedDocsPage,
): Record<string, string> {
  const base = resolved.page.url.replace(
    new RegExp(`^/(?:${DOCS_LOCALES.join("|")})(?=/)`),
    "",
  );
  const out: Record<string, string> = {};
  for (const code of Object.keys(languages)) {
    out[code] =
      code === "en" || !DOCS_LOCALES.includes(code) ? base : `/${code}${base}`;
  }
  return out;
}

/**
 * The docs' languages in their menu order and names: English, then the
 * translations by code (as the docs language menu has listed them).
 */
export const DOCS_LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ar: "العربية",
  de: "Deutsch",
  el: "Ελληνικά",
  es: "Español",
  fi: "Suomi",
  fr: "Français",
  id: "Bahasa Indonesia",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
  pl: "Polski",
  pt: "Português (BR)",
  ru: "Русский",
  tr: "Türkçe",
  uk: "Українська",
  vi: "Tiếng Việt",
  zh: "简体中文",
};
