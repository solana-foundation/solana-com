/**
 * The public paths of every docs page, so src/middleware.ts can answer a
 * missing page with a real 404 before rendering (a page that calls
 * notFound() reaches readers as an empty error shell until its JavaScript
 * runs).
 *
 * next.config.ts lists the content files when the app builds and inlines
 * the paths as `process.env.DOCS_PAGE_PATHS`; `assertDocsPagePaths`
 * (lib/docs/page-data.ts) fails the build if a page of the Fumadocs source
 * is missing from them. Without the list (`next dev`, tests) every path
 * counts as known and missing pages render the not-found page as before.
 *
 * The mapping follows lib/docs/source.ts and Fumadocs' slugs:
 * docs/<locale>/x.mdx -> /developers/docs/x, cookbook/x.mdx ->
 * /developers/cookbook/x; `index` files are their folder's path. English
 * paths are unprefixed; a translation only adds `/<locale>/...` when no
 * English page has its path (a locale URL of an English page shows the
 * English page).
 */

/** "docs/ja/core/index.mdx" -> { locale: "ja", path: "/developers/docs/core" } */
export function pagePathOf(
  file: string,
): { locale: string; path: string } | null {
  if (!file.endsWith(".mdx")) return null;
  const parts = file.slice(0, -".mdx".length).split("/");
  let locale: string;
  let base: string;
  let rest: string[];
  if (parts[0] === "cookbook") {
    locale = "en";
    base = "/developers/cookbook";
    rest = parts.slice(1);
  } else if (parts[0] === "docs") {
    if (!parts[1]) return null;
    locale = parts[1];
    base = "/developers/docs";
    rest = parts.slice(2);
  } else {
    return null;
  }
  // Fumadocs leaves `(group)` folders out of slugs.
  const slugs = rest.filter((s) => !/^\(.+\)$/.test(s));
  if (slugs.at(-1) === "index") slugs.pop();
  return { locale, path: slugs.length ? `${base}/${slugs.join("/")}` : base };
}

/** Sorted public paths of the content files (relative to apps/docs/content). */
export function docsPagePaths(files: string[]): string[] {
  const english = new Set<string>();
  const translated: string[] = [];
  for (const file of files) {
    const entry = pagePathOf(file.split("\\").join("/"));
    if (!entry) continue;
    if (entry.locale === "en") english.add(entry.path);
    else translated.push(`/${entry.locale}${entry.path}`);
  }
  const all = new Set(english);
  for (const path of translated) {
    if (!english.has(path.replace(/^\/[^/]+/, ""))) all.add(path);
  }
  return [...all].sort();
}

/** Paths answered by the docs page routes (not /developers). */
export function isDocsPagePath(path: string): boolean {
  return (
    path === "/developers/docs" ||
    path.startsWith("/developers/docs/") ||
    path === "/developers/cookbook" ||
    path.startsWith("/developers/cookbook/")
  );
}

let cache: { raw: string; paths: ReadonlySet<string> } | undefined;

/** The build's page paths, or null when they were not listed (dev, tests). */
export function knownDocsPagePaths(
  raw: string | undefined = process.env.DOCS_PAGE_PATHS,
): ReadonlySet<string> | null {
  if (!raw) return null;
  if (cache?.raw !== raw) {
    cache = { raw, paths: new Set(JSON.parse(raw) as string[]) };
  }
  return cache.paths;
}

/**
 * Whether `path` (no locale prefix, no trailing `/index`) is a page, at
 * `locale`'s URL when given. True when the paths are unknown.
 */
export function isKnownDocsPage(
  path: string,
  locale?: string,
  known: ReadonlySet<string> | null = knownDocsPagePaths(),
): boolean {
  if (!known) return true;
  return known.has(path) || (!!locale && known.has(`/${locale}${path}`));
}
