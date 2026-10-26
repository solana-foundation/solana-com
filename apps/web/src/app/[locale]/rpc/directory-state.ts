export function parseRpcQuery(params: URLSearchParams): string {
  return (params.get("q") ?? "").trim().slice(0, 100);
}

/** Docs are served by another app, whose unprefixed routes use English. */
export function localizeRpcHref(href: string, locale: string): string {
  return href.startsWith("/docs/") && locale !== "en"
    ? `/${locale}${href}`
    : href;
}

export function searchRpcProviders<T extends { name: string }>(
  providers: readonly T[],
  query: string,
): T[] {
  const needle = query.trim().toLocaleLowerCase();
  return needle
    ? providers.filter((provider) =>
        provider.name.toLocaleLowerCase().includes(needle),
      )
    : [...providers];
}
