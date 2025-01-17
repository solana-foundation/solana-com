import { docs, docsMeta } from "@@/.source/docs";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

export const docsSource = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs, docsMeta),
});
