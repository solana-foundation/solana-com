import { defineConfig, defineDocs } from "fs-mdx/config";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";

import { z } from "zod";

const schema = z.custom<{
  title: string;
  h1?: string;
  seoTitle?: string;
  description?: string;
  hideTableOfContents?: boolean;
  full?: boolean;
  author?: string;
  tags?: string[];
  date?: string;
  difficulty?: string;
  index?: boolean;
}>();

const docsData = defineDocs({
  dir: "content/docs",
  localized: true,
  docs: { schema, async: true },
  output: "docs",
});

export const docs = docsData.docs;
export const docsMeta = docsData.meta;

const cookbookData = defineDocs({
  dir: "content/cookbook",
  docs: { schema, async: true },
  output: "cookbook",
});

export const cookbook = cookbookData.docs;
export const cookbookMeta = cookbookData.meta;

const coursesData = defineDocs({
  dir: "content/courses",
  docs: { schema, async: true },
  output: "courses",
});

export const courses = coursesData.docs;
export const coursesMeta = coursesData.meta;

const guidesData = defineDocs({
  dir: "content/guides",
  docs: { schema, async: true },
  output: "guides",
});

export const guides = guidesData.docs;
export const guidesMeta = guidesData.meta;

const learnData = defineDocs({
  dir: "content/learn",
  localized: true,
  docs: { schema, async: true },
  output: "learn",
});

export const learn = learnData.docs;
export const learnMeta = learnData.meta;

const chConfig = {
  components: { code: "Code", inlineCode: "InlineCode" },
};
export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    recmaPlugins: [[recmaCodeHike, chConfig]],
    remarkPlugins: (v) => [[remarkCodeHike, chConfig], ...v],
    // remove fumadocs rehype plugins
    rehypePlugins: () => [],
  },
});
