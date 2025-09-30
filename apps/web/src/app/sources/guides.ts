import { guides, guidesMeta } from "@@/.source/index";
import { createMDXSource } from "fs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@workspace/i18n/config";

export const guidesSource = loader({
  i18n: {
    defaultLanguage: defaultLocale,
    languages: locales,
    hideLocale: "default-locale",
  },
  baseUrl: "/developers/guides",
  source: createMDXSource(guides, guidesMeta),
  pageTree: {
    attachFile(node: any, file: any) {
      node.description = file.data?.description;
      node.slug = file.slugs?.join("/");
      node.featured = file.data?.featured;
      node.tags = file.data?.tags;
      node.href = file.data?.href;
      node.difficulty = file.data?.difficulty;
      return node;
    },
  },
});

export function getGuides(locale: string) {
  return getGuidesFromFolder(guidesSource.pageTree[locale]);
}

function getGuidesFromFolder(folder: { children: any[] }) {
  return folder.children.flatMap((node) => {
    if (node.children) {
      return getGuidesFromFolder(node);
    } else {
      return [
        {
          href: node.href || node.url,
          title: node.name,
          description: node.description,
          difficulty: node.difficulty,
          tags: node.tags,
          featured: node.featured,
        },
      ];
    }
  });
}
