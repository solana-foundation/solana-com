import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";
import { rehypeToc } from "fumadocs-core/mdx-plugins";
import remarkIncludeCode from "@devrelkit/remark-include-code";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  docs: { schema, async: true },
});

export const docs = docsData.docs;
export const docsMeta = docsData.meta;

const cookbookData = defineDocs({
  dir: "content/cookbook",
  docs: { schema, async: true },
});

export const cookbook = cookbookData.docs;
export const cookbookMeta = cookbookData.meta;

const guidesData = defineDocs({
  dir: "content/guides",
  docs: { schema, async: true },
});

export const guides = guidesData.docs;
export const guidesMeta = guidesData.meta;

const learnData = defineDocs({
  dir: "content/learn",
  docs: { schema, async: true },
});

export const learn = learnData.docs;
export const learnMeta = learnData.meta;

const developersLearnData = defineDocs({
  dir: "content/developers-learn",
  docs: { schema, async: true },
});

export const developersLearn = developersLearnData.docs;
export const developersLearnMeta = developersLearnData.meta;

const chConfig = {
  components: { code: "Code", inlineCode: "InlineCode" },
};

// Resolves `file=` paths against the workspace root so MDX authors can write
// `file=packages/docs-examples/cookbook/...` regardless of which content
// directory the doc lives in. Uses process.cwd() because fumadocs bundles
// this file to .source/source.config.mjs at build time, breaking __dirname
// resolution. cwd reliably points at apps/docs when next/fumadocs runs.
const includeRoot = resolve(process.cwd(), "..", "..");

export default defineConfig({
  mdxOptions: {
    remarkImageOptions: false,
    recmaPlugins: [[recmaCodeHike, chConfig]],
    remarkPlugins: (v) => [
      [remarkIncludeCode, { rootDir: includeRoot, highlightStyle: "codehike" }],
      [remarkCodeHike, chConfig],
      ...v,
    ],
    rehypePlugins: [rehypeToc],
  },
});
