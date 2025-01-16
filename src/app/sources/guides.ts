import { guides, guidesMeta } from "../../../.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

export const guidesSource = loader({
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

export function getGuides() {
  return getGuidesFromFolder(guidesSource.pageTree);
}

function getGuidesFromFolder(folder: any) {
  return folder.children.flatMap((node: any) => {
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
