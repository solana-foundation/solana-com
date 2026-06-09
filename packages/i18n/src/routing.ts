import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

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

function normalizeAlternatePath(path: string) {
  if (!path || path === "/") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function localizeAlternatePath(path: string, locale: string) {
  if (locale === defaultLocale) {
    return path;
  }

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function getAlternates(path: string, locale: string) {
  const normalizedPath = normalizeAlternatePath(path);
  const languages: Record<string, string> = {
    "x-default": normalizedPath,
  };
  locales.forEach((l) => {
    languages[l] = localizeAlternatePath(normalizedPath, l);
  });
  return {
    canonical: localizeAlternatePath(normalizedPath, locale),
    languages,
  };
}
