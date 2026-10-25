import { loader, type InferPageType } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { docs } from "@@/.source/server";
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
 * - learn/<locale>/x.mdx -> <locale>/learn/x
 * - cookbook/x.mdx -> en/developers/cookbook/x (English only)
 *
 * Page URLs equal the public paths: /developers/docs/..., /learn/...,
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
  const base = collection === "learn" ? "learn" : "developers/docs";
  return `${locale}/${base}/${page.join("/")}`;
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
