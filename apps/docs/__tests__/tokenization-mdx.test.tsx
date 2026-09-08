import { readdir, readFile } from "node:fs/promises";
import { compileMDX } from "@fumadocs/mdx-remote";
import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mdxComponents } from "../src/app/mdx-components";
import { Code } from "../src/app/components/code/code";

const CONTENT_DIR = new URL(
  "../content/docs/en/tokenization/",
  import.meta.url,
);
const REPO_ROOT = new URL("../../../", import.meta.url);

async function mdxFiles(dir: URL): Promise<URL[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const found: URL[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      found.push(...(await mdxFiles(new URL(`${entry.name}/`, dir))));
    } else if (entry.name.endsWith(".mdx")) {
      found.push(new URL(entry.name, dir));
    }
  }
  return found;
}

async function render(element: React.ReactElement) {
  const stream = await renderToReadableStream(element);
  await stream.allReady;
  return new Response(stream).text();
}

describe("Tokenization docs MDX", () => {
  it("renders the section index with the shared MDX component registry", async () => {
    const source = await readFile(new URL("index.mdx", CONTENT_DIR), "utf8");
    const { body: Tokenization } = await compileMDX({ source });
    const markup = await render(<Tokenization components={mdxComponents} />);

    expect(markup).toContain("/assets/docs/diagrams/tokenization-overview.svg");
    expect(markup).toContain(
      "/assets/docs/diagrams/tokenization-overview-light.svg",
    );

    // The overview links every asset type and every shared capability group.
    for (const href of [
      "/docs/tokenization/stablecoins",
      "/docs/tokenization/tokenized-funds",
      "/docs/tokenization/securities",
      "/docs/tokenization/design",
      "/docs/tokenization/design/deployment-options",
      "/docs/tokenization/compliance",
      "/docs/tokenization/custody",
      "/docs/tokenization/compliance/token-acl",
      "/docs/tokenization/settlement",
      "/docs/tokenization/settlement/cash-leg",
      "/docs/tokenization/settlement/finality",
      "/docs/tokenization/tutorials",
      "/docs/tokenization/quickstart",
    ]) {
      expect(markup).toContain(`href="${href}"`);
    }
  });

  it("renders each asset-type entry point", async () => {
    // tokenized-funds is a folder (it owns nav-strikes); the others are leaves.
    for (const path of [
      "stablecoins.mdx",
      "tokenized-funds/index.mdx",
      "securities.mdx",
    ]) {
      const source = await readFile(new URL(path, CONTENT_DIR), "utf8");
      const { body: AssetType } = await compileMDX({ source });
      const markup = await render(<AssetType components={mdxComponents} />);
      // Each routing page must lead somewhere, not dead-end.
      expect(markup, `${path} routes nowhere`).toContain(
        'href="/docs/tokenization/',
      );
    }
  });

  it("retains no reference to the removed institutional section", async () => {
    for (const file of await mdxFiles(CONTENT_DIR)) {
      const source = await readFile(file, "utf8");
      expect(
        source,
        `${file.pathname} still links /docs/institutional`,
      ).not.toContain("/docs/institutional");
    }
  });

  it("documents no unreleased or unspecified architecture", async () => {
    // Feedback on the first PR: these docs cover released products only.
    // Private Channels and the Solana Privacy Protocol are released and carry
    // their own pages, so deployment options names them and defers the model
    // comparison to /docs/finance/privacy. A Permissioned Environment has no
    // docs page and stays out.
    const banned = [
      "designs under discussion",
      "does not cover yet",
      "Permissioned Environment",
    ];
    for (const file of await mdxFiles(CONTENT_DIR)) {
      // Collapse whitespace so a phrase wrapped across two prose lines by the
      // formatter is still caught.
      const source = (await readFile(file, "utf8")).replace(/\s+/g, " ");
      for (const phrase of banned) {
        expect(source, `${file.pathname} mentions "${phrase}"`).not.toContain(
          phrase,
        );
      }
    }
  });

  it("ships no unresolved authoring placeholders", async () => {
    for (const file of await mdxFiles(CONTENT_DIR)) {
      const source = await readFile(file, "utf8");
      expect(source, `${file.pathname} has an unresolved TODO`).not.toContain(
        "TODO(devnet)",
      );
    }
  });

  it("resolves every command-output file referenced by a tutorial", async () => {
    let referenced = 0;
    for (const file of await mdxFiles(CONTENT_DIR)) {
      const source = await readFile(file, "utf8");
      for (const [, path] of source.matchAll(/\soutput=(\S+)/g)) {
        referenced++;
        const text = await readFile(new URL(path, REPO_ROOT), "utf8");
        // An empty file renders an unexplained blank console.
        expect(text.trim(), `${path} is empty`).not.toBe("");
      }
    }
    expect(referenced).toBeGreaterThan(0);
  });

  it("wraps every command-output block so its console renders", async () => {
    // A fence-level flag never reaches SingleCode, so an output block outside
    // <CodeTabs flags="r"> renders no console at all. Pin the wrapper here:
    // compileMDX cannot cover this, because it does not run the codehike recma
    // plugin that lifts `!!` fences into the CodeTabs `code` prop.
    const WRAPPER = '<CodeTabs flags="r">';
    for (const file of await mdxFiles(CONTENT_DIR)) {
      const lines = (await readFile(file, "utf8")).split("\n");
      lines.forEach((line, index) => {
        if (!/^```\w+.*\soutput=/.test(line)) return;

        expect(
          line,
          `${file.pathname}:${index + 1} marks the fence runnable`,
        ).not.toMatch(/^```\w+\s+-\w/);
        expect(
          line,
          `${file.pathname}:${index + 1} lacks a !! marker`,
        ).toContain("!!");

        // Look back for the wrapper rather than pinning an exact offset, so
        // reflowing a tutorial does not break this guard. The group must not
        // have closed in between.
        const preceding = lines.slice(Math.max(0, index - 5), index);
        const opened = preceding.lastIndexOf(WRAPPER);
        expect(
          opened,
          `${file.pathname}:${index + 1} is not wrapped in ${WRAPPER}`,
        ).toBeGreaterThan(-1);
        expect(
          preceding.slice(opened).some((l) => l.includes("</CodeTabs>")),
          `${file.pathname}:${index + 1} sits outside its CodeTabs group`,
        ).toBe(false);
      });
    }
  });

  it("renders a console for a runnable code group", async () => {
    // Guards the coupling between the `flags` prop and `group.options.runnable`:
    // a fence-level flag does not reach SingleCode, so command output only
    // renders when the block sits inside <CodeTabs flags="r">.
    const markup = await render(
      <Code
        flags="r"
        codeblocks={[
          {
            lang: "bash",
            meta: 'title="mosaic inspect-mint"',
            value: "mosaic inspect-mint --mint-address $MINT",
          },
        ]}
      />,
    );

    expect(markup).toContain("Console");
    expect(markup).toContain("Run");
  });
});
