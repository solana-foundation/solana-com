import { locales } from "./config";

export function getLocaleFromPathname(pathname: string) {
  const [path = ""] = pathname.split(/[?#]/);
  const [, firstSegment] = path.split("/");

  return firstSegment && locales.includes(firstSegment) ? firstSegment : null;
}

export function getPathnameWithoutLocale(pathname: string) {
  const [path = ""] = pathname.split(/[?#]/);
  const [, firstSegment, ...remainingSegments] = path.split("/");

  if (firstSegment && locales.includes(firstSegment)) {
    return `/${remainingSegments.join("/")}`;
  }

  return path;
}
