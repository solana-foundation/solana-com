import { defaultLocale, locales } from "./config";

function normalizeAlternatePath(path: string) {
  if (!path || path === "/") {
    return "/";
  }

  let formatted = path.startsWith("/") ? path : `/${path}`;

  // Strip leading supported locale prefix if path was already localized
  for (const loc of locales) {
    if (formatted === `/${loc}`) {
      return "/";
    }
    if (formatted.startsWith(`/${loc}/`)) {
      formatted = formatted.slice(loc.length + 1);
      break;
    }
  }

  return formatted;
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
