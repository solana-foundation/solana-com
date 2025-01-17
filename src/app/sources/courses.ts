import { courses, coursesMeta } from "@@/.source/courses";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

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
