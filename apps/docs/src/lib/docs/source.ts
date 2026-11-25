import { loader, type InferPageType } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { docs, learn } from "@@/.source/server";
import { translations } from "./translations";
import { defaultLocale } from "@workspace/i18n/config";
import { DOCS_LOCALES } from "./locales.mjs";

/**
 * One Fumadocs loader for every docs page, English and translated (the
 * collections in source.config.ts; translations compile on first
 * request). Content files are mapped to virtual paths
 * `<locale>/<public path>` so the loader's `dir` i18n parser reads them; the
 * default locale is hidden in URLs:
 * - docs/<locale>/x.mdx -> <locale>/developers/docs/x
 * - cookbook/x.mdx -> en/developers/cookbook/x (English only)
 *
 * Page URLs equal the public paths: /developers/docs/...,
 * /developers/cookbook/..., each optionally under /<locale>. `index` files
 * are their folder's URL.
 */
const source = {
  files: [
    ...toFumadocsSource(docs, []).files,
    ...toFumadocsSource(translations, []).files,
  ],
};

function virtualPath(file: string): string {
  const [collection, ...rest] = file.split("/");
  if (collection === "cookbook")
    return `${defaultLocale}/developers/cookbook/${rest.join("/")}`;
  const [locale, ...page] = rest;
  return `${locale}/developers/docs/${page.join("/")}`;
}

for (const file of source.files) file.path = virtualPath(file.path);

export const docsSource = loader({
  baseUrl: "/",
  source,
  i18n: {
    defaultLanguage: defaultLocale,
    languages: [defaultLocale, ...DOCS_LOCALES],
    hideLocale: "default-locale",
    parser: "dir",
    // Missing translations are answered by the English page.
    fallbackLanguage: defaultLocale,
  },
});

export type DocsPage = InferPageType<typeof docsSource>;

/**
 * The English /learn articles (apps/web/content/learn/en), at /learn/<slug>.
 * apps/web renders them; this app lists them in its agent indexes only
 * (lib/docs/llms.ts), so they are not docs pages.
 */
export const learnSource = loader({
  baseUrl: "/learn",
  source: toFumadocsSource(learn, []),
});
