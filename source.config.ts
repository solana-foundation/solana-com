import { defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

const schema = z.custom<{
  title: string;
  h1?: string;
  seoTitle?: string;
  description?: string;
  hideTableOfContents?: boolean;
  full?: boolean;
}>();

const docsData = defineDocs({
  dir: "content/docs",
  docs: { schema },
});

export const docs = docsData.docs;
export const docsMeta = docsData.meta;

const cookbookData = defineDocs({
  dir: "content/cookbook",
  docs: { schema },
});

export const cookbook = cookbookData.docs;
export const cookbookMeta = cookbookData.meta;
