/**
 * Locales that can have translated docs pages (apps/docs/content/
 * {docs,learn}/<locale>/...): every solana.com locale except English, the
 * unprefixed default. Plain JS so .mjs helpers can import it.
 */
import { defaultLocale, locales } from "@workspace/i18n/config";

export const DOCS_LOCALES = locales.filter((l) => l !== defaultLocale);
