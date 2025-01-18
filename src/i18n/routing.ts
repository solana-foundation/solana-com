import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config.cjs";
import { useLocale } from "next-intl";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed", // default locale won't have a prefix
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

export { useLocale };

// locales to be used in getStaticPaths (for static generation)
export const staticLocales = ["en"];

export function withLocales() {
  return staticLocales.map((locale) => ({ params: { locale } }));
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

export function getAlternates(path: string, locale: string) {
  const languages = {
    "x-default": `/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = l === defaultLocale ? `/${path}` : `/${l}${path}`;
  });
  return {
    canonical: locale === defaultLocale ? `/${path}` : `/${locale}${path}`,
    languages,
  };
}
