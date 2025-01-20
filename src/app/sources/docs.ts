import { docs, docsMeta } from "@@/.source/docs";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@/i18n/config.cjs";

export const docsSource = loader({
  i18n: {
    defaultLanguage: defaultLocale,
    languages: locales,
    hideLocale: "default-locale",
  },
  baseUrl: "/docs",
  source: createMDXSource(docs, docsMeta),
});
