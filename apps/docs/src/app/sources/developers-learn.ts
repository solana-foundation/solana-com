import { developersLearn, developersLearnMeta } from "@@/.source/index";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@workspace/i18n/config";

export const developersLearnSource = loader({
  i18n: {
    defaultLanguage: defaultLocale,
    languages: locales,
    hideLocale: "default-locale",
    parser: "dir",
  },
  baseUrl: "/developers/learn",
  source: createMDXSource(developersLearn, developersLearnMeta),
});
