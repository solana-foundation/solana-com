import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { VFile } from "vfile";
import { describe, expect, it } from "vitest";
import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import { remarkDocsCompat } from "@/lib/docs/remark-docs-compat.mjs";

type Node = {
  type: string;
  name?: string;
  attributes?: { type: string; name: string; value: unknown }[];
  children?: Node[];
};
type Processor = {
  parse: (file: VFile) => unknown;
  run: (tree: unknown, file: VFile) => Promise<unknown>;
};

// The MDX compiler fumadocs-mdx uses (the docs app has no direct dependency).
const require = createRequire(import.meta.url);
const { createProcessor } = (await import(
  createRequire(require.resolve("fumadocs-mdx/config")).resolve("@mdx-js/mdx")
)) as { createProcessor: (options: object) => Processor };

/** Compile a content page like source.config.ts: its mdast and its twin. */
async function compile(page: string) {
  let tree: Node | undefined;
  const processor = createProcessor({
    remarkPlugins: [
      remarkDocsCompat,
      () => (t: Node) => {
        tree = structuredClone(t);
      },
      [remarkLLMs, { headingIds: false, _data: true }],
    ],
  });
  const abs = path.join(process.cwd(), "content", page);
  const file = new VFile({ path: abs, value: readFileSync(abs, "utf8") });
  await processor.run(processor.parse(file), file);
  return { tree: tree!, markdown: String(file.data.markdown ?? "") };
}

const find = (n: Node, test: (n: Node) => boolean): Node[] => [
  ...(test(n) ? [n] : []),
  ...(n.children ?? []).flatMap((c) => find(c, test)),
];

describe("Run in Playground in the Markdown output", () => {
  it("keeps the file in the page's link and out of quickstart.md", async () => {
    const { tree, markdown } = await compile("docs/en/quickstart.mdx");

    // The page: the generated link, with the file in it (works without JS).
    const [link] = find(
      tree,
      (n) =>
        n.name === "a" && !!n.attributes?.some((a) => a.name === "data-pg-run"),
    );
    const href = link!.attributes!.find((a) => a.name === "href")!.value;
    expect(href).toMatch(/\/open#v=1&.*&code=[\w-]{1000,}$/);

    // The twin (.md and llms-full.txt): one line instead, no base64.
    expect(markdown).not.toContain("code=");
    expect(markdown).not.toContain("data-pg-run");
    expect(markdown).toContain(
      "Run in Playground: open https://solana.com/developers/docs/quickstart in a browser.",
    );
    // The block's lead and note and the rest of the page are unchanged.
    expect(markdown).toContain("Try it in your browser");
    expect(markdown).toContain(
      "It runs on devnet from your Playground wallet, with nothing to install.",
    );
    expect(markdown).toContain("## Follow along locally");
    expect(markdown.length).toBeLessThan(10_000);
  });
});
