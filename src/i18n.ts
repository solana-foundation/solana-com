import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = [
  "en",
  "ar",
  "de",
  "el",
  "es",
  "fi",
  "fr",
  "hi",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt",
  "ru",
  "tr",
  "uk",
  "vi",
  "zh",
];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed", // default locale won't have a prefix
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

// locales to be used in getStaticPaths (for static generation)
export const staticLocales = ["en"];

export function withLocales() {
  const paths = staticLocales.map((locale) => ({ params: { locale } }));
  return paths;
}

export function slugsWithLocales(slugs: string[]) {
  return (
    slugs &&
    slugs.flatMap((slug) => {
      return staticLocales.map((locale) => ({
        params: { locale, slug: [slug] },
      }));
    })
  );
}

export function slugWithLocales(slugs: string[]) {
  return (
    slugs &&
    slugs.flatMap((slug) => {
      return staticLocales.map((locale) => ({ params: { locale, slug } }));
    })
  );
}

export function pathsWithLocales<T>(paths: { params: T }[]) {
  return (
    paths &&
    paths.flatMap((path) => {
      return staticLocales.map((locale) => ({
        params: { ...path.params, locale },
      }));
    })
  );
}
