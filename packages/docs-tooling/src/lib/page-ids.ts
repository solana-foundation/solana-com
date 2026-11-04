/**
 * The anchor ids a docs page renders, from its MDX: heading ids, `<Step>`
 * ids, anchor aliases (github-slugger ids and `anchorAliases` frontmatter)
 * and literal `id` attributes on elements.
 *
 * It runs the docs app's own plugins (apps/docs/src/lib/docs:
 * remark-docs-compat for snippets and `docsSlug`, rehype-docs-compat for
 * steps and aliases) with remark-gfm and Fumadocs' remarkHeading, as
 * source.config.ts does, without code highlighting. Ids that a component
 * makes at render time (tab and accordion ids) are not listed.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import YAML from "yaml";
import { repoRoot } from "./paths.ts";

export interface PageId {
  id: string;
  kind: "heading" | "step" | "alias" | "element";
  /** Heading level (h1-h6), for headings. */
  level?: number;
  /** The id this alias leads to. */
  of?: string;
}

interface HastNode {
  type: string;
  tagName?: string;
  name?: string;
  properties?: Record<string, unknown>;
  attributes?: { type: string; name: string; value?: unknown }[];
  children?: HastNode[];
}

type Processor = {
  parse: (file: unknown) => unknown;
  run: (tree: unknown, file: unknown) => Promise<unknown>;
};
type PageFile = { data: { pageIdsTree?: HastNode } };

const appDir = path.join(repoRoot, "apps", "docs");
let processorPromise: Promise<{
  processor: Processor;
  VFile: new (o: object) => PageFile;
}> | null = null;

const importFrom = (abs: string) => import(pathToFileURL(abs).href);

/** One processor for every page (the plugins keep no state across files). */
function loadProcessor() {
  processorPromise ??= (async () => {
    const req = createRequire(path.join(appDir, "package.json"));
    const mdxReq = createRequire(req.resolve("fumadocs-mdx/config"));
    const [{ createProcessor }, plugins, remark, rehype, { VFile }] =
      await Promise.all([
        importFrom(mdxReq.resolve("@mdx-js/mdx")),
        importFrom(req.resolve("fumadocs-core/mdx-plugins")),
        importFrom(path.join(appDir, "src/lib/docs/remark-docs-compat.mjs")),
        importFrom(path.join(appDir, "src/lib/docs/rehype-docs-compat.mjs")),
        importFrom(req.resolve("vfile")),
      ]);
    const processor = createProcessor({
      remarkPlugins: [
        remark.remarkDocsCompat,
        plugins.remarkGfm,
        [plugins.remarkHeading, { generateToc: false, slug: remark.docsSlug }],
      ],
      rehypePlugins: [
        rehype.rehypeDocsCompat,
        // The compiler turns the tree into JavaScript next; keep the HTML tree.
        () => (tree: HastNode, file: { data: Record<string, unknown> }) => {
          file.data.pageIdsTree = tree;
        },
      ],
    }) as Processor;
    return { processor, VFile };
  })();
  return processorPromise;
}

/** Frontmatter data and the body after it (as fumadocs-mdx splits them). */
export function splitFrontmatter(source: string) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!m) return { data: {}, body: source };
  const data = (YAML.parse(m[1]!) as Record<string, unknown> | null) ?? {};
  return { data, body: source.slice(m[0].length) };
}

function attr(node: HastNode, name: string): string | undefined {
  const a = node.attributes?.find(
    (x) => x.type === "mdxJsxAttribute" && x.name === name,
  );
  return typeof a?.value === "string" ? a.value : undefined;
}

/** Every id the page at `absFile` renders, in document order. */
export async function pageIds(absFile: string): Promise<PageId[]> {
  const { processor, VFile } = await loadProcessor();
  const { data, body } = splitFrontmatter(readFileSync(absFile, "utf8"));
  const file = new VFile({
    path: absFile,
    value: body,
    data: { frontmatter: data },
  });
  await processor.run(processor.parse(file), file);
  const tree = file.data.pageIdsTree!;
  const out: PageId[] = [];
  const aliases = (of: string, list: unknown) => {
    if (typeof list !== "string") return;
    for (const id of list.split(" ").filter(Boolean))
      out.push({ id, kind: "alias", of });
  };
  const walk = (node: HastNode) => {
    if (node.type === "element") {
      const id = node.properties?.id;
      if (typeof id === "string") {
        const h = /^h([1-6])$/.exec(node.tagName ?? "");
        if (h && "dataStepTitle" in (node.properties ?? {})) {
          // The <Step> above it renders this id.
        } else if (h) out.push({ id, kind: "heading", level: Number(h[1]) });
        else out.push({ id, kind: "element" });
        aliases(id, node.properties?.dataAnchorAliases);
      }
    } else if (
      node.type === "mdxJsxFlowElement" ||
      node.type === "mdxJsxTextElement"
    ) {
      const id =
        node.name === "Step"
          ? (attr(node, "data-step-id") ?? attr(node, "id"))
          : attr(node, "id");
      if (id) {
        out.push({ id, kind: node.name === "Step" ? "step" : "element" });
        aliases(id, attr(node, "data-anchor-aliases"));
      }
    }
    for (const child of node.children ?? []) walk(child);
  };
  walk(tree);
  return out;
}
