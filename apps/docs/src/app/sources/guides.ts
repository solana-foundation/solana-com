import { guides, guidesMeta } from "@@/.source/index";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import { locales, defaultLocale } from "@workspace/i18n/config";
import { ReactNode } from "react";

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
      const newNode: typeof node & {
        slug?: string;
        featured?: boolean;
        tags?: string[];
        href?: string;
        difficulty?: string;
      } = node;
      newNode.description = file.data?.description;
      newNode.slug = file.slugs?.join("/");
      newNode.featured =
        "featured" in file.data ? (file.data?.featured as boolean) : undefined;
      newNode.tags = file.data?.tags;
      newNode.href =
        "href" in file.data ? (file.data?.href as string) : undefined;
      newNode.difficulty = file.data?.difficulty;
      return newNode;
    },
  },
});

export function getGuides(locale: string) {
  return getGuidesFromFolder(guidesSource.pageTree[locale]);
}

function getGuidesFromFolder(folder: (typeof guidesSource.pageTree)[string]): {
  href?: string;
  title?: ReactNode;
  description?: ReactNode;
  difficulty?: string;
  tags?: string[];
  featured?: boolean;
}[] {
  return folder.children.flatMap((node) => {
    if ("children" in node) {
      return getGuidesFromFolder(node);
    } else {
      return [
        {
          href:
            "href" in node
              ? (node.href as string)
              : "url" in node
                ? node.url
                : undefined,
          title: node.name,
          description: "description" in node ? node.description : undefined,
          difficulty:
            "difficulty" in node ? (node.difficulty as string) : undefined,
          tags: "tags" in node ? (node.tags as string[]) : undefined,
          featured: "featured" in node ? (node.featured as boolean) : undefined,
        },
      ];
    }
  });
}
