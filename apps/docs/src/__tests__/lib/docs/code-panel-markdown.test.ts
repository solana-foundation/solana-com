import { createRequire } from "node:module";
import path from "node:path";
import { VFile } from "vfile";
import { describe, expect, it, vi } from "vitest";
import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import { remarkDocsCompat } from "@/lib/docs/remark-docs-compat.mjs";

// A snippet's source (/snippets/code-panel-fixture.mdx), set per test.
const snippet = vi.hoisted(() => ({ value: "" }));
vi.mock("node:fs", async (importOriginal) => {
  const fs = await importOriginal<typeof import("node:fs")>();
  const readFileSync = ((file: string, ...rest: never[]) =>
    String(file).endsWith("code-panel-fixture.mdx")
      ? snippet.value
      : fs.readFileSync(file, ...rest)) as typeof fs.readFileSync;
  return { ...fs, default: { ...fs, readFileSync }, readFileSync };
});

type Node = {
  type: string;
  name?: string;
  meta?: string;
  attributes?: { name: string; value: unknown }[];
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

/** Compile like source.config.ts: the mdast after our plugin and the twin. */
async function compile(value: string) {
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
    path: path.join(process.cwd(), "content/docs/en/core/example.mdx"),
    value,
  });
  await processor.run(processor.parse(file), file);
  return { tree: tree!, markdown: String(file.data.markdown ?? "") };
}

const find = (n: Node, test: (n: Node) => boolean): Node[] => [
  ...(test(n) ? [n] : []),
  ...(n.children ?? []).flatMap((c) => find(c, test)),
];

const PAGE = [
  "# Example",
  "",
  "<Steps codePanel>",
  '  <Step title="Manifest">',
  "    Add the dependency.",
  "",
  "    ```sh Terminal",
  "    cargo add solana-program",
  "    ```",
  "",
  "    ```toml Cargo.toml focus={2} panel",
  "    [dependencies]",
  '    solana-program = "2"',
  "    ```",
  "",
  "    ```rs src/lib.rs   panel",
  "    fn main() {}",
  "    ```",
  "  </Step>",
  '  <Step title="Build">',
  "    ```rs src/lib.rs expandable panel",
  "    fn main() {}",
  "    ```",
  "  </Step>",
  "</Steps>",
  "",
  "<Steps>",
  '  <Step title="Plain">',
  "    ```ts",
  "    plain();",
  "    ```",
  "  </Step>",
  "</Steps>",
  "",
].join("\n");

describe("<Steps codePanel> in the Markdown output", () => {
  it("leaves codePanel and the panel marks out of the twin", async () => {
    const plain = PAGE.replace(" codePanel", "").replace(/[ \t]+panel$/gm, "");
    expect(plain).not.toMatch(/panel/i);
    const marked = await compile(PAGE);
    const unmarked = await compile(plain);
    expect(marked.markdown).toBe(unmarked.markdown);
    expect(marked.markdown).toContain("```toml Cargo.toml focus={2}\n");
    // The components still get them.
    const steps = find(marked.tree, (n) => n.name === "Steps");
    expect(steps[0].attributes?.map((a) => a.name)).toEqual(["codePanel"]);
    expect(steps[1].attributes).toEqual([]);
    const fences = find(marked.tree, (n) => n.type === "code");
    expect(fences.map((f) => f.meta)).toEqual([
      "Terminal",
      "Cargo.toml focus={2} panel",
      "src/lib.rs   panel",
      "src/lib.rs expandable panel",
      null,
    ]);
  });

  const fails = (value: string, message: RegExp) =>
    expect(compile(value)).rejects.toThrow(message);
  const lines = (...l: string[]) => l.join("\n");

  it("rejects marks that are not next to each other", () =>
    fails(
      lines(
        "<Steps codePanel>",
        '  <Step title="A">',
        "    ```rs a.rs panel",
        "    a",
        "    ```",
        "",
        "    Text between.",
        "",
        "    ```rs b.rs panel",
        "    b",
        "    ```",
        "  </Step>",
        "</Steps>",
      ),
      /example\.mdx:3: the fences marked "panel" in a step must be next to each other/,
    ));

  it("rejects a mark outside <Steps codePanel>", async () => {
    await fails(
      lines("```rs a.rs panel", "a", "```"),
      /example\.mdx:1: a fence marked "panel" must be directly in a <Step> of <Steps codePanel>/,
    );
    await fails(
      lines(
        "<Steps>",
        '  <Step title="A">',
        "    ```rs a.rs panel",
        "    a",
        "    ```",
        "  </Step>",
        "</Steps>",
      ),
      /must be directly in a <Step> of <Steps codePanel>/,
    );
    await fails(
      lines(
        "<Steps codePanel>",
        '  <Step title="A">',
        "    <Tabs>",
        '      <Tab title="Rust">',
        "        ```rs a.rs panel",
        "        a",
        "        ```",
        "      </Tab>",
        "    </Tabs>",
        "  </Step>",
        "</Steps>",
      ),
      /must be directly in a <Step> of <Steps codePanel>/,
    );
  });

  it("cuts the marks from a source with CRLF line endings", async () => {
    const crlf = (text: string) => text.replace(/\n/g, "\r\n");
    const plain = PAGE.replace(" codePanel", "").replace(/[ \t]+panel$/gm, "");
    const marked = await compile(crlf(PAGE));
    expect(marked.markdown).toBe((await compile(crlf(plain))).markdown);
    expect(marked.markdown).not.toMatch(/panel/i);
  });

  it("rejects a mark in the list outside a <Step>", () =>
    fails(
      lines(
        "<Steps codePanel>",
        '  <Step title="A">',
        "    Text",
        "  </Step>",
        "",
        "  ```rs a.rs panel",
        "  a",
        "  ```",
        "</Steps>",
      ),
      /example\.mdx:6: a fence marked "panel" must be directly in a <Step> of <Steps codePanel>/,
    ));

  it("rejects the markers in a snippet", async () => {
    const page = lines(
      'import Fixture from "/snippets/code-panel-fixture.mdx";',
      "",
      "<Fixture />",
    );
    snippet.value = lines(
      "<Steps codePanel>",
      '  <Step title="A">',
      "    Text",
      "  </Step>",
      "</Steps>",
    );
    await fails(page, /code-panel-fixture\.mdx:1: .* not allowed in snippets/);
    snippet.value = lines("```rs a.rs panel", "a", "```");
    await fails(page, /code-panel-fixture\.mdx:1: .* not allowed in snippets/);
  });

  it("rejects a mark that is not last in the meta", () =>
    fails(
      lines(
        "<Steps codePanel>",
        '  <Step title="A">',
        "    ```rs a.rs panel focus={1}",
        "    a",
        "    ```",
        "  </Step>",
        "</Steps>",
      ),
      /example\.mdx:3: put "panel" last in the fence meta/,
    ));

  it("rejects <Steps codePanel> inside another component", async () => {
    await fails(
      lines(
        "<Steps codePanel>",
        '  <Step title="A">',
        "    <Steps codePanel>",
        '      <Step title="B">',
        "        Text",
        "      </Step>",
        "    </Steps>",
        "  </Step>",
        "</Steps>",
      ),
      /example\.mdx:3: <Steps codePanel> must be at the top level of the page/,
    );
    await fails(
      lines(
        "<Tabs>",
        '  <Tab title="A">',
        "    <Steps codePanel>",
        '      <Step title="A">',
        "        Text",
        "      </Step>",
        "    </Steps>",
        "  </Tab>",
        "</Tabs>",
      ),
      /example\.mdx:3: <Steps codePanel> must be at the top level of the page/,
    );
  });
});
