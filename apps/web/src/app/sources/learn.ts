import { learn, learnMeta } from "@@/.source/index";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@workspace/i18n/config";

export const learnSource = loader({
  i18n: {
    defaultLanguage: defaultLocale,
    languages: locales,
    hideLocale: "default-locale",
    parser: "dir",
  },
  baseUrl: "/learn",
  source: createMDXSource(learn, learnMeta),
});
