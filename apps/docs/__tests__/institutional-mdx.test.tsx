import { readdir, readFile } from "node:fs/promises";
import { compileMDX } from "@fumadocs/mdx-remote";
import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mdxComponents } from "../src/app/mdx-components";
import { Code } from "../src/app/components/code/code";

const CONTENT_DIR = new URL(
  "../content/docs/en/institutional/",
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

describe("Institutional docs MDX", () => {
  it("renders the section index with the shared MDX component registry", async () => {
    const source = await readFile(new URL("index.mdx", CONTENT_DIR), "utf8");
    const { body: Institutional } = await compileMDX({ source });
    const markup = await render(<Institutional components={mdxComponents} />);

    expect(markup).toContain(
      "/assets/docs/diagrams/institutional-overview.svg",
    );
    expect(markup).toContain(
      "/assets/docs/diagrams/institutional-overview-light.svg",
    );

    // The section index links every subsection.
    for (const href of [
      "/docs/institutional/token-design",
      "/docs/institutional/compliance-and-privacy",
      "/docs/institutional/architecture",
      "/docs/institutional/custody-and-vaults",
      "/docs/institutional/payments-and-interoperability",
      "/docs/institutional/tutorials",
      "/docs/institutional/settlement-finality",
      "/docs/institutional/risk-and-diligence",
    ]) {
      expect(markup).toContain(`href="${href}"`);
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
    for (const file of await mdxFiles(CONTENT_DIR)) {
      const lines = (await readFile(file, "utf8")).split("\n");
      lines.forEach((line, index) => {
        if (!/^```\w+.*\soutput=/.test(line)) return;

        expect(
          line,
          `${file.pathname}:${index + 1} marks the fence runnable`,
        ).not.toMatch(/^```\w+\s+-\w/);
        expect(
          lines[index - 2],
          `${file.pathname}:${index + 1} is not wrapped in CodeTabs`,
        ).toBe('<CodeTabs flags="r">');
        expect(
          line,
          `${file.pathname}:${index + 1} lacks a !! marker`,
        ).toContain("!!");
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
