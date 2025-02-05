import { guides, guidesMeta } from "@@/.source/guides";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@/i18n/config.cjs";

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
      // console.log("attachFile", node, file);
      node.description = file.data?.data?.description;
      node.slug = file.data?.slugs?.join("/");
      node.featured = file.data?.data?.featured;
      node.tags = file.data?.data?.tags;
      node.href = file.data?.data?.href;
      node.difficulty = file.data?.data?.difficulty;
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
