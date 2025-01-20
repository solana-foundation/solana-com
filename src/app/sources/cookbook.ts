import { cookbook, cookbookMeta } from "@@/.source/cookbook";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@/i18n/config.cjs";

export const cookbookSource = loader({
  i18n: {
    defaultLanguage: defaultLocale,
    languages: locales,
    hideLocale: "default-locale",
  },
  baseUrl: "/developers/cookbook",
  source: createMDXSource(cookbook, cookbookMeta),
});
