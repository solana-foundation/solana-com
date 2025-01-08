import {
  docs,
  docsMeta,
  cookbook,
  cookbookMeta,
  courses,
  coursesMeta,
  guides,
  guidesMeta,
} from "../../.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import authors from "@@/content/authors.json";
import resources from "@@/content/resources.json";

export { authors, resources };

export const docsSource = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs, docsMeta),
});

export const cookbookSource = loader({
  baseUrl: "/developers/cookbook",
  source: createMDXSource(cookbook, cookbookMeta),
});

export const coursesSource = loader({
  baseUrl: "/developers/courses",
  source: createMDXSource(courses, coursesMeta),
  pageTree: {
    attachFile(node: any, file: any) {
      // console.log("attachFile", node, file);
      node.author = file.data?.data?.author;
      node.description = file.data?.data?.description;
      node.slug = file.data?.slugs?.join("/");
      return node;
    },
  },
});

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
