import { createRequire } from "node:module";
import { VFile } from "vfile";
import { describe, expect, it } from "vitest";
import { remarkHeading } from "fumadocs-core/mdx-plugins";
import { docsSlug } from "@/lib/docs/remark-docs-compat.mjs";
import {
  githubSlugBase,
  rehypeDocsCompat,
} from "@/lib/docs/rehype-docs-compat.mjs";

type Node = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
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

/** Each heading's id and anchor aliases, compiled as source.config.ts does. */
async function headings(value: string, frontmatter: object = {}) {
  let tree: Node | undefined;
  const processor = createProcessor({
    remarkPlugins: [[remarkHeading, { slug: docsSlug }]],
    rehypePlugins: [
      rehypeDocsCompat,
      () => (t: Node) => {
        tree = structuredClone(t);
      },
    ],
  });
  const file = new VFile({ path: "page.mdx", value, data: { frontmatter } });
  await processor.run(processor.parse(file), file);
  const out: [unknown, unknown][] = [];
  const walk = (n: Node) => {
    if (n.type === "element" && /^h[1-6]$/.test(n.tagName ?? ""))
      out.push([n.properties?.id, n.properties?.dataAnchorAliases]);
    n.children?.forEach(walk);
  };
  walk(tree!);
  return out;
}

describe("anchor aliases", () => {
  it("slugs headings as github-slugger does", () => {
    expect(githubSlugBase("Fees & Compute")).toBe("fees--compute");
    expect(githubSlugBase("C# Client")).toBe("c-client");
    expect(githubSlugBase("actions.json")).toBe("actionsjson");
    expect(githubSlugBase("Call stack depth - CallDepthExceeded error")).toBe(
      "call-stack-depth---calldepthexceeded-error",
    );
    expect(githubSlugBase("What's new? 🚀")).toBe("whats-new-");
  });

  it("gives a heading its github-slugger id when that differs", async () => {
    expect(
      await headings(
        [
          "## Accounts",
          "## Fees & Compute",
          "## Solana Web3.js v3",
          "## Create Next.js Project",
        ].join("\n\n"),
      ),
    ).toEqual([
      ["accounts", undefined],
      ["fees-&-compute", "fees--compute"],
      ["solana-web3-js-v3", "solana-web3js-v3"],
      ["create-next-js-project", "create-nextjs-project"],
    ]);
  });

  it("numbers repeats -1, -2 as github-slugger does", async () => {
    expect(
      await headings(
        ["## Prerequisites", "## Prerequisites", "## Prerequisites"].join(
          "\n\n",
        ),
      ),
    ).toEqual([
      ["prerequisites", undefined],
      // The old #prerequisites-2 is the third heading, as it was.
      ["prerequisites-1", undefined],
      ["prerequisites-2", undefined],
    ]);
  });

  it("skips a repeat number another heading already has", async () => {
    expect(
      await headings(["## Output", "## Output 1", "## Output"].join("\n\n")),
    ).toEqual([
      ["output", undefined],
      ["output-1", undefined],
      ["output-2", undefined],
    ]);
  });

  it("numbers repeats by the docs slug and aliases the github-slugger id", async () => {
    expect(
      await headings(["## Fees & Compute", "## Fees & Compute"].join("\n\n")),
    ).toEqual([
      ["fees-&-compute", "fees--compute"],
      ["fees-&-compute-1", "fees--compute-1"],
    ]);
  });

  it("adds the frontmatter's anchorAliases to the headings they name", async () => {
    expect(
      await headings("## Add the Solana MCP server\n\n## Try it", {
        anchorAliases: {
          "set-up-solana-mcp": "add-the-solana-mcp-server",
          "using-solana-mcp": "add-the-solana-mcp-server",
          "example-use-cases": "try-it",
          // No heading has this id: ignored.
          "old-section": "missing-heading",
        },
      }),
    ).toEqual([
      ["add-the-solana-mcp-server", "set-up-solana-mcp using-solana-mcp"],
      ["try-it", "example-use-cases"],
    ]);
  });

  it("adds the frontmatter's anchorAliases to the steps they name", async () => {
    let tree: Node | undefined;
    const processor = createProcessor({
      remarkPlugins: [[remarkHeading, { slug: docsSlug }]],
      rehypePlugins: [
        rehypeDocsCompat,
        () => (t: Node) => {
          tree = structuredClone(t);
        },
      ],
    });
    const file = new VFile({
      path: "page.mdx",
      value: [
        "<Steps>",
        '  <Step title="Set up instance management tooling">',
        "    Text.",
        "  </Step>",
        "</Steps>",
      ].join("\n"),
      data: {
        frontmatter: {
          anchorAliases: {
            "set-up-the-admin-ui": "set-up-instance-management-tooling",
          },
        },
      },
    });
    await processor.run(processor.parse(file), file);
    const steps: Record<string, unknown>[] = [];
    const walk = (
      n: Node & {
        name?: string;
        attributes?: { name: string; value: unknown }[];
      },
    ) => {
      if (n.type === "mdxJsxFlowElement" && n.name === "Step")
        steps.push(
          Object.fromEntries(
            (n.attributes ?? []).map((a) => [a.name, a.value]),
          ),
        );
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(tree!);
    expect(steps).toEqual([
      {
        title: "Set up instance management tooling",
        "data-step-id": "set-up-instance-management-tooling",
        "data-anchor-aliases": "set-up-the-admin-ui",
      },
    ]);
  });

  it("keeps a custom heading id and adds its slug as an alias", async () => {
    expect(
      await headings("## surfnet\\_setAccount [#surfnet\\_setAccount]"),
    ).toEqual([["surfnet_setAccount", "surfnet_setaccount"]]);
  });
});
