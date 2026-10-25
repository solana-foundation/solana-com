/**
 * Fumadocs MDX collections for the developer docs, over apps/docs/content:
 * - docs/<locale>/**: /developers/docs (English under `en`, translations
 *   under their locale);
 * - learn/<locale>/**: /learn/<article>;
 * - cookbook/**: /developers/cookbook (English only).
 * English and the cookbook (`docs`) compile with the app. Translations
 * (`translations`) compile on their first request, with the same MDX
 * options, so the build does not grow with the number of locales.
 * src/lib/docs/source.ts maps these files to their URLs. Snippets
 * (content/snippets) are not a collection: remark-docs-compat inlines every
 * `import X from "/snippets/..."` into the page that uses it, so they
 * compile with the page and appear in its Markdown.
 *
 * Pages are `async` (frontmatter eagerly, bodies on demand), so a route
 * only loads the page it renders.
 */
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { pageSchema } from "fumadocs-core/source/schema";
import { z } from "zod";
import {
  docsSlug,
  remarkDocsCompat,
} from "./src/lib/docs/remark-docs-compat.mjs";
import { rehypeDocsCompat } from "./src/lib/docs/rehype-docs-compat.mjs";
import { codeBlockOptions } from "./src/lib/docs/code-options.mjs";

/** Frontmatter used by the docs (kept as written). */
const schema = pageSchema
  .extend({
    sidebarTitle: z.string().optional(),
    mode: z.string().optional(),
    hideFooterPagination: z.boolean().optional(),
    noindex: z.boolean().optional(),
    keywords: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    url: z.string().optional(),
  })
  // og:*, twitter:*, type, related, prerequisites, date, ... pass through.
  .loose();

const postprocess = { includeProcessedMarkdown: { headingIds: false } };

export const docs = defineCollections({
  type: "doc",
  dir: "content",
  files: ["docs/en/**/*.mdx", "learn/en/**/*.mdx", "cookbook/**/*.mdx"],
  schema,
  async: true,
  postprocess,
});

export const translations = defineCollections({
  type: "doc",
  dir: "content",
  files: ["docs/!(en)/**/*.mdx", "learn/!(en)/**/*.mdx"],
  schema,
  dynamic: true,
  postprocess,
});

export default defineConfig({
  mdxOptions: {
    // Our plugin first, so inlined snippets get headings, TOC and structure.
    remarkPlugins: (v) => [remarkDocsCompat, ...v],
    // Ours before rehype-code (Shiki), so it sees the plain fences.
    rehypePlugins: (v) => [rehypeDocsCompat, ...v],
    remarkHeadingOptions: { slug: docsSlug },
    // Content images are plain URLs under /docs-assets (public/docs-assets).
    remarkImageOptions: false,
    remarkCodeTabOptions: false,
    remarkNpmOptions: false,
    rehypeCodeOptions: codeBlockOptions,
  },
});
