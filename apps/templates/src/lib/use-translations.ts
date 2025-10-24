/**
 * Translation wrapper hook for templates package
 * This allows the templates package to access translations from the parent app
 */

import { useTranslations as useNextIntlTranslations } from "next-intl";

export function useTemplatesTranslations() {
  try {
    const t = useNextIntlTranslations("templates");
    return t;
  } catch {
    // Fallback for standalone usage without translations
    console.warn("Translations not available, using fallback");
    return (key: string) => key;
  }
}
