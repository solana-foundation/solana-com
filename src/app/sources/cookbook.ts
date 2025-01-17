import { cookbook, cookbookMeta } from "@@/.source/cookbook";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

export const cookbookSource = loader({
  baseUrl: "/developers/cookbook",
  source: createMDXSource(cookbook, cookbookMeta),
});
