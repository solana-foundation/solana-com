import { getPathnameWithoutLocale } from "@workspace/i18n/pathname";

function matchesRouteSegment(
  pathname: string | null | undefined,
  route: string,
) {
  if (!pathname) {
    return false;
  }

  const path = getPathnameWithoutLocale(pathname);
  return path === route || path.startsWith(`${route}/`);
}

export function shouldShowDevelopersNav(pathname: string | null | undefined) {
  return (
    matchesRouteSegment(pathname, "/developers") ||
    matchesRouteSegment(pathname, "/docs")
  );
}

export function shouldShowDocsSidebarToggle(
  pathname: string | null | undefined,
) {
  return (
    matchesRouteSegment(pathname, "/docs") ||
    matchesRouteSegment(pathname, "/developers/cookbook")
  );
}

/**
 * Landing pages that support light and dark mode on the exact path only, so
 * these deliberately do not use matchesRouteSegment. The /learn articles are
 * docs pages with their own theme toggle, served by apps/docs.
 */
const EXACT_THEME_ROUTES = new Set(["/learn"]);

function matchesExactRoute(pathname: string | null | undefined) {
  if (!pathname) {
    return false;
  }

  const path = getPathnameWithoutLocale(pathname).replace(/\/+$/, "") || "/";
  return EXACT_THEME_ROUTES.has(path);
}

export function isThemeRoute(pathname: string | null | undefined) {
  return (
    matchesExactRoute(pathname) ||
    matchesRouteSegment(pathname, "/docs") ||
    matchesRouteSegment(pathname, "/developers/cookbook") ||
    matchesRouteSegment(pathname, "/developers/bootcamp")
  );
}
