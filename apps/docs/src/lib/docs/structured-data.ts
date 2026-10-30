import docsConfig from "@@/content/docs.json";
import { DOCS_LOCALES } from "./locales.mjs";
import { canonicalPath, ogImagePath } from "./metadata";
import { frontmatter, type ResolvedDocsPage } from "./page-data";

/**
 * JSON-LD of the docs pages (DocsPageView): the page as a TechArticle, its
 * BreadcrumbList, the docs as a WebSite with their search, and the Solana
 * Foundation as publisher. The publisher carries only what the site already
 * shows (its name, from the footer, and the footer's social links): no
 * contact point or address.
 */
const SITE = "https://solana.com";
const ORGANIZATION_ID = `${SITE}/#organization`;
const DOCS_WEBSITE_ID = `${SITE}/developers/docs#website`;

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Solana Foundation",
  url: SITE,
  sameAs: Object.values(docsConfig.footer.socials),
};

/** The docs, with their search: any docs URL with `?q=` opens it. */
export const DOCS_WEBSITE = {
  "@type": "WebSite",
  "@id": DOCS_WEBSITE_ID,
  name: docsConfig.name,
  url: `${SITE}/developers/docs`,
  publisher: { "@id": ORGANIZATION_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE}/developers/docs?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const LOCALE_PREFIX = new RegExp(`^/(?:${DOCS_LOCALES.join("|")})(?=/)`);

/** Where a page's section starts: the docs or the cookbook. */
function sectionRoot(path: string): { name: string; path: string } {
  if (path.startsWith("/developers/cookbook"))
    return { name: "Cookbook", path: "/developers/cookbook" };
  return { name: docsConfig.name, path: "/developers/docs" };
}

/** Solana, the section, the page's tab (as the header shows it), the page. */
function breadcrumbItems(resolved: ResolvedDocsPage, path: string) {
  const prefix = LOCALE_PREFIX.exec(path)?.[0] ?? "";
  const root = sectionRoot(path.slice(prefix.length));
  const pageUrl = `${SITE}${path}`;
  const above = [
    { name: "Solana", url: SITE },
    { name: root.name, url: `${SITE}${prefix}${root.path}` },
  ];
  const tab = resolved.tab;
  if (tab && !tab.hidden && tab.url) {
    const tabPath = tab.url.replace(LOCALE_PREFIX, "");
    above.push({ name: tab.title, url: `${SITE}${prefix}${tabPath}` });
  }
  // A section's or tab's first page ends the trail where it appears.
  const end = above.findIndex((crumb) => crumb.url === pageUrl);
  const trail = (end === -1 ? above : above.slice(0, end)).filter(
    (crumb, i, all) => all.findIndex((c) => c.url === crumb.url) === i,
  );
  trail.push({ name: frontmatter(resolved.page).title, url: pageUrl });
  return trail.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: crumb.url,
  }));
}

export function docsPageJsonLd(resolved: ResolvedDocsPage) {
  const fm = frontmatter(resolved.page);
  const path = canonicalPath(resolved);
  const url = `${SITE}${path}`;
  const ogImage = typeof fm["og:image"] === "string" ? fm["og:image"] : null;
  const image = new URL(ogImage ?? ogImagePath(resolved.page.url), SITE);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: fm.title,
        description: fm.description,
        url,
        mainEntityOfPage: url,
        inLanguage: resolved.contentLocale,
        image: image.toString(),
        keywords: fm.keywords?.length ? fm.keywords.join(", ") : undefined,
        isPartOf: { "@id": DOCS_WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumbItems(resolved, path),
      },
      DOCS_WEBSITE,
      ORGANIZATION,
    ],
  };
}
