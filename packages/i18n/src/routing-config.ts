import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

export const SHARED_LOCALE_COOKIE = "SOLANA_LOCALE";

const localeCookie = {
  name: SHARED_LOCALE_COOKIE,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
  sameSite: "lax" as const,
};

/**
 * Main-app routing. Browser and cookie detection are enabled so an explicit
 * locale choice can carry across the marketing site.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: true,
  localeCookie,
});

/**
 * Routing for apps served through cross-app rewrites. Unprefixed URLs always
 * use the default locale; only an explicit locale prefix changes the locale.
 */
export const routingWithoutDetection = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie,
});
