import { courses, coursesMeta } from "@@/.source/index";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@workspace/i18n/config";

export const coursesSource = loader({
  i18n: {
    defaultLanguage: defaultLocale,
    languages: locales,
    hideLocale: "default-locale",
  },
  baseUrl: "/developers/courses",
  source: createMDXSource(courses, coursesMeta),
  pageTree: {
    attachFile(node: any, file: any) {
      node.author = file.data?.author;
      node.description = file.data?.description;
      node.slug = file.slugs?.join("/");
      return node;
    },
  },
});
