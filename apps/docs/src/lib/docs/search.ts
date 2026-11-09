import { createI18nSearchAPI } from "fumadocs-core/search/server";
import { defaultLocale } from "@workspace/i18n/config";
import { docsSource } from "./source";
import { breadcrumbs, resolveDocsPage } from "./page-data";
import { DOCS_LOCALES } from "./locales.mjs";

/**
 * Docs search: Fumadocs' built-in
 * search over every page's title, description and section, per locale.
 * Bodies are not indexed, so answering a query loads no page module. Used by
 * /api/docs-search (the docs not-found page).
 */
export const docsSearchServer = createI18nSearchAPI("simple", {
  i18n: {
    defaultLanguage: defaultLocale,
    languages: [defaultLocale, ...DOCS_LOCALES],
  },
  indexes: () =>
    docsSource.getPages().map((page) => {
      const locale = page.locale ?? defaultLocale;
      const resolved = resolveDocsPage(locale, page.slugs);
      const data = page.data as { title: string; description?: string };
      return {
        title: data.title,
        description: data.description,
        content: data.description ?? "",
        breadcrumbs: resolved ? breadcrumbs(resolved) : [],
        url: page.url,
        locale,
      };
    }),
});
