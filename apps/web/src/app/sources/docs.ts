import { docs, docsMeta } from "@@/.source/docs";
import { createMDXSource } from "fs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@@/src/i18n/config";

export const docsSource = loader({
  i18n: {
    defaultLanguage: defaultLocale,
    languages: locales,
    hideLocale: "default-locale",
  },
  baseUrl: "/docs",
  source: createMDXSource(docs, docsMeta),
});
