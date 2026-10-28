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

export function isThemeRoute(pathname: string | null | undefined) {
  return (
    matchesRouteSegment(pathname, "/docs") ||
    matchesRouteSegment(pathname, "/developers/cookbook") ||
    matchesRouteSegment(pathname, "/developers/bootcamp")
  );
}

/** Ask Solana (the docs agent) is scoped to /docs; the rest of the site keeps Inkeep. */
export function isAskSolanaRoute(pathname: string | null | undefined) {
  return matchesRouteSegment(pathname, "/docs");
}
