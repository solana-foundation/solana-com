import { guides, guidesMeta } from "@@/.source/index";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@workspace/i18n/config";
import { ReactNode } from "react";

type GuideNode = Omit<(typeof guidesSource.pageTree)[string], "children"> & {
  url?: string;
  href?: string;
  title?: ReactNode;
  description?: ReactNode;
  difficulty?: string;
  tags?: string[];
  featured?: boolean;
  children?: GuideNode[];
};

export const guidesSource = loader({
  i18n: {
    defaultLanguage: defaultLocale,
    languages: locales,
    hideLocale: "default-locale",
  },
  baseUrl: "/developers/guides",
  source: createMDXSource(guides, guidesMeta),
  pageTree: {
    attachFile(node, file) {
      node.description = file?.data?.description;
      // @ts-expect-error Adds an unspecified prop
      node.slug = file?.slugs?.join("/");
      // @ts-expect-error Adds an unspecified prop
      node.featured = file?.data?.featured;
      // @ts-expect-error Adds an unspecified prop
      node.tags = file?.data?.tags;
      // @ts-expect-error Adds an unspecified prop
      node.href = file?.data?.href;
      // @ts-expect-error Adds an unspecified prop
      node.difficulty = file?.data?.difficulty;
      return node;
    },
  },
});

export function getGuides(locale: string) {
  return getGuidesFromFolder(guidesSource.pageTree[locale] as GuideNode);
}

function getGuidesFromFolder(folder: GuideNode): {
  href?: string;
  title?: ReactNode;
  description?: ReactNode;
  difficulty?: string;
  tags?: string[];
  featured?: boolean;
}[] {
  if (!folder.children) return [];
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
