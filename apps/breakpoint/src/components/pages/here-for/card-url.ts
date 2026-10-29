import { defaultLocale } from "@workspace/i18n/config";
import { config } from "@/config";

export type HereForCardParams =
  | { type: "your3"; handle: string }
  | { type: "mutual"; handle: string; with: string }
  | { type: "mutuals"; handle: string };

/** Absolute URL of a generated 1200×630 share card, for Open Graph tags. */
export function hereForCardUrl(params: HereForCardParams, locale: string) {
  const search = new URLSearchParams(params as Record<string, string>);
  if (locale !== defaultLocale) search.set("locale", locale);
  return `${config.siteOrigin}/breakpoint/api/here-for/card?${search}`;
}
