import type { Metadata } from "next";
import docsConfig from "@@/content/docs.json";
import { frontmatter, markdownPath, type ResolvedDocsPage } from "./page-data";
import { languagePaths } from "./language-paths";
import { DOCS_LOCALES } from "./locales.mjs";

/**
 * Page metadata for docs pages, from the page frontmatter and the site SEO
 * settings in content/docs.json (`seo.metatags`), as the docs have
 * published them:
 * - <title>: frontmatter `og:title` as written, else "<title> - Solana
 *   Developer Docs";
 * - canonical https://solana.com/<path>; an untranslated page served at a
 *   locale URL shows English, so its canonical, og:url and og:locale are the
 *   English page's. hreflang alternates: x-default and English, plus the
 *   locales that have a translation of the page;
 * - <link rel="alternate" type="text/markdown">: the canonical page's
 *   Markdown twin (`.md`);
 * - og:/twitter: tags (site defaults, then frontmatter `og:*`, `twitter:*`);
 *   the image is our own /opengraph/developers/... route;
 * - robots: `noindex` from the frontmatter, else a `robots` metatag in
 *   docs.json (none today, so pages are indexed). Vercel previews also send
 *   X-Robots-Tag: noindex (next.config.ts); public/robots.txt allows all.
 */
const SITE_NAME = docsConfig.name; // "Solana Developer Docs"
const META = docsConfig.seo.metatags as Record<string, string>;
const ORIGIN = META.canonical ?? "https://solana.com";

export function ogImagePath(url: string): string {
  // /developers/docs/x -> /opengraph/developers/docs/x; /learn/x -> .../learn/x
  const stripped = url.replace(
    new RegExp(`^(/(?:${DOCS_LOCALES.join("|")}))?/developers(?=/)`),
    "$1",
  );
  return `/opengraph/developers${stripped}`;
}

/** The page's canonical path: an untranslated locale URL's is English. */
export function canonicalPath(resolved: ResolvedDocsPage): string {
  return resolved.contentLocale !== resolved.locale
    ? languagePaths(resolved).en!
    : resolved.page.url;
}

export function docsPageMetadata(resolved: ResolvedDocsPage): Metadata {
  const fm = frontmatter(resolved.page);
  const get = (key: string) =>
    typeof fm[key] === "string" ? (fm[key] as string) : undefined;
  const title = get("og:title") ?? `${fm.title} - ${SITE_NAME}`;
  const description = get("og:description") ?? fm.description;
  const paths = languagePaths(resolved);
  const canonical = `${ORIGIN}${canonicalPath(resolved)}`;
  const languages: Record<string, string> = {
    "x-default": `${ORIGIN}${paths.en}`,
  };
  for (const code of ["en", ...resolved.translations])
    languages[code] = `${ORIGIN}${paths[code]}`;
  const image = get("og:image") ?? ogImagePath(resolved.page.url);
  const robots = fm.noindex ? "noindex" : (get("robots") ?? META.robots);

  return {
    title: { absolute: title },
    description,
    keywords: fm.keywords,
    alternates: {
      canonical,
      languages,
      types: {
        "text/markdown": `${ORIGIN}${markdownPath(canonicalPath(resolved))}`,
      },
    },
    robots,
    openGraph: {
      type: "website",
      siteName: META["og:site_name"] ?? "Solana",
      title: get("og:title") ?? title,
      description,
      url: canonical,
      locale: resolved.contentLocale,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: (get("twitter:card") ??
        META["twitter:card"] ??
        "summary_large_image") as "summary_large_image" | "summary",
      site: META["twitter:site"],
      title: get("twitter:title") ?? get("og:title") ?? title,
      description: get("twitter:description") ?? description,
      images: [get("twitter:image") ?? image],
    },
  };
}
