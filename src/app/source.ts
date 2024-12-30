import { docs, docsMeta, cookbook, cookbookMeta } from "../../.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

export const docsSource = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs, docsMeta),
});

export const cookbookSource = loader({
  baseUrl: "/developers/cookbook",
  source: createMDXSource(cookbook, cookbookMeta),
});
