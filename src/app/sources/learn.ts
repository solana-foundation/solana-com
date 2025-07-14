import { learn, learnMeta } from "@@/.source/learn";
import { createMDXSource } from "fs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@/i18n/config";

export const learnSource = loader({
  i18n: {
    defaultLanguage: defaultLocale,
    languages: locales,
    hideLocale: "default-locale",
  },
  baseUrl: "/learn",
  source: createMDXSource(learn, learnMeta),
});
