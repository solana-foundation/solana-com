import { defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

const docsData = defineDocs({
  dir: "content/docs",
  docs: {
    schema: z.custom<{
      title: string;
      description?: string;
      hideTableOfContents?: boolean;
      full?: boolean;
    }>(),
  },
});

export const docs = docsData.docs;
export const docsMeta = docsData.meta;

const cookbookData = defineDocs({
  dir: "content/cookbook",
});

export const cookbook = cookbookData.docs;
export const cookbookMeta = cookbookData.meta;
