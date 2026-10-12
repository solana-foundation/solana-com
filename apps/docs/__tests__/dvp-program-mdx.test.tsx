import { readdir, readFile } from "node:fs/promises";
import { compileMDX } from "@fumadocs/mdx-remote";
import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mdxComponents } from "../src/app/mdx-components";

const CONTENT_DIR = new URL(
  "../content/docs/en/defi/dvp-program/",
  import.meta.url,
);

async function mdxFiles(): Promise<URL[]> {
  const entries = await readdir(CONTENT_DIR);
  return entries
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => new URL(name, CONTENT_DIR));
}

describe("DvP program docs MDX", () => {
  it("renders the overview with the shared MDX component registry", async () => {
    const source = await readFile(new URL("index.mdx", CONTENT_DIR), "utf8");
    const { body: Content } = await compileMDX({ source });

    const stream = await renderToReadableStream(
      <Content components={mdxComponents} />,
    );
    await stream.allReady;
    const markup = await new Response(stream).text();

    expect(markup).toContain("maintained by the Solana Foundation");
  });

  it("documents the deployed DvP program by its program ID", async () => {
    const source = await readFile(new URL("index.mdx", CONTENT_DIR), "utf8");
    expect(source).toContain("dvp34bdbcEm4f4FCUjGV4mDAkDshaQR4LkK8fdcsyZq");
    // The program pages document the deployed program, not the earlier
    // delegation walkthrough's source repository.
    expect(source).not.toContain("Woody4618");
  });

  it("links only to published tokenization pages", async () => {
    const unpublished =
      /\/docs\/tokenization\/(settlement|design|compliance|custody|tutorials|stablecoins|securities|tokenized-funds)/;
    for (const file of await mdxFiles()) {
      const source = await readFile(file, "utf8");
      expect(source, `${file.pathname} links an unpublished page`).not.toMatch(
        unpublished,
      );
    }
  });

  it("documents no unreleased or unspecified architecture", async () => {
    // These docs cover released products only; the phrases below mark
    // unreleased or unspecified designs.
    const banned = [
      "designs under discussion",
      "does not cover yet",
      "Permissioned Environment",
    ];
    for (const file of await mdxFiles()) {
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
});
