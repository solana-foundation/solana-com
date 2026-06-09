import { locales } from "@workspace/i18n/config";

function normalizePathname(pathname: string) {
  const path = pathname.split(/[?#]/)[0];
  const [, firstSegment, ...remainingSegments] = path.split("/");

  if (locales.includes(firstSegment)) {
    return `/${remainingSegments.join("/")}`;
  }

  return path;
}

function matchesRouteSegment(
  pathname: string | null | undefined,
  route: string,
) {
  if (!pathname) {
    return false;
  }

  const path = normalizePathname(pathname);
  return path === route || path.startsWith(`${route}/`);
}

export function shouldShowDevelopersNav(pathname: string | null | undefined) {
  return (
    matchesRouteSegment(pathname, "/developers") ||
    matchesRouteSegment(pathname, "/docs") ||
    matchesRouteSegment(pathname, "/data")
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
    matchesRouteSegment(pathname, "/developers/guides") ||
    matchesRouteSegment(pathname, "/developers/bootcamp") ||
    matchesRouteSegment(pathname, "/data")
  );
}
