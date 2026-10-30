import { createRequire } from "node:module";
import path from "node:path";
import { VFile } from "vfile";
import { describe, expect, it } from "vitest";
import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import {
  LEGACY_WEB3JS_NOTICE_SOURCE,
  remarkDocsCompat,
} from "@/lib/docs/remark-docs-compat.mjs";

type Node = { type: string; name?: string; children?: Node[] };
type Processor = {
  parse: (file: VFile) => unknown;
  run: (tree: unknown, file: VFile) => Promise<unknown>;
};

// The MDX compiler fumadocs-mdx uses (the docs app has no direct dependency).
const require = createRequire(import.meta.url);
const { createProcessor } = (await import(
  createRequire(require.resolve("fumadocs-mdx/config")).resolve("@mdx-js/mdx")
)) as { createProcessor: (options: object) => Processor };

/** Compile like source.config.ts: the mdast after our plugin and the twin. */
async function compile(value: string, page = "docs/en/core/example.mdx") {
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
  const file = new VFile({
    path: path.join(process.cwd(), "content", page),
    value,
  });
  await processor.run(processor.parse(file), file);
  const names: string[] = [];
  const walk = (n: Node) => {
    if (n.name) names.push(n.name);
    n.children?.forEach(walk);
  };
  walk(tree!);
  return { names, markdown: String(file.data.markdown ?? "") };
}

describe("legacy web3.js notice", () => {
  it("is a Warning with the status, Kit and both migration guides", () => {
    expect(LEGACY_WEB3JS_NOTICE_SOURCE).toBe(
      [
        "<Warning>",
        "  **`@solana/web3.js` 1.x is no longer actively maintained**",
        "",
        "  It receives critical fixes only. Use [Kit](/developers/docs/clients/official/javascript#solana-kit) for new code. To migrate existing code, follow the [Kit upgrade guide](https://www.solanakit.com/docs/upgrade-guide), or the [web3.js v3 migration guide](https://github.com/solana-foundation/solana-web3.js/blob/main/docs/web3js-v1-to-v3-migration.md) to keep the class-based API.",
        "</Warning>",
      ].join("\n"),
    );
  });

  it("expands the tag in the page and in its Markdown twin", async () => {
    const { names, markdown } = await compile(
      [
        "<CodeGroup>",
        "",
        "```ts Kit",
        "kit();",
        "```",
        "",
        "<LegacyWeb3jsNotice />",
        "",
        '```ts title="Web3.js (legacy)"',
        "legacy();",
        "```",
        "",
        "</CodeGroup>",
      ].join("\n"),
    );
    expect(names).toEqual(["CodeGroup", "Warning"]);
    expect(markdown).not.toContain("LegacyWeb3jsNotice");
    expect(markdown).toContain(
      "<Warning>\n  **`@solana/web3.js` 1.x is no longer actively maintained**",
    );
    expect(markdown).toContain(
      "[Kit upgrade guide](https://www.solanakit.com/docs/upgrade-guide)",
    );
    expect(markdown).toContain(
      "[web3.js v3 migration guide](https://github.com/solana-foundation/solana-web3.js/blob/main/docs/web3js-v1-to-v3-migration.md)",
    );
    // The notice sits right before the legacy fence.
    expect(markdown.indexOf("</Warning>")).toBeLessThan(
      markdown.indexOf("legacy();"),
    );
  });

  it("expands notices that generated snippets carry", async () => {
    const { names, markdown } = await compile(
      [
        'import Create from "/snippets/examples/cookbook/wallets/create-keypair/create.mdx";',
        "",
        "<Create />",
      ].join("\n"),
      "cookbook/wallets/create-keypair.mdx",
    );
    expect(names.filter((n) => n === "Warning")).toHaveLength(1);
    expect(names).not.toContain("LegacyWeb3jsNotice");
    expect(markdown).toMatch(
      /<Tab title="Web3\.js \(legacy\)">\n<div className="sol-tab-label">Web3\.js \(legacy\)<\/div>\n\n<Warning>/,
    );
  });

  it("rejects the tag inside a paragraph", async () => {
    await expect(compile("Text <LegacyWeb3jsNotice /> text")).rejects.toThrow(
      /on a line of its own/,
    );
  });
});
