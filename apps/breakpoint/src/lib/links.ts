export function isRelativeHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}
