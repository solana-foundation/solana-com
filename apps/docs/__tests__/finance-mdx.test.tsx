import { readFile } from "node:fs/promises";
import { compileMDX } from "@fumadocs/mdx-remote";
import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mdxComponents } from "../src/app/mdx-components";

describe("Finance docs MDX", () => {
  it("renders with the shared MDX component registry", async () => {
    const source = await readFile(
      new URL("../content/docs/en/finance/index.mdx", import.meta.url),
      "utf8",
    );
    const { body: FinanceContent } = await compileMDX({ source });

    const stream = await renderToReadableStream(
      <FinanceContent components={mdxComponents} />,
    );
    await stream.allReady;
    const markup = await new Response(stream).text();

    expect(markup).toContain("Assets power payments and onchain markets");
    expect(markup).toContain("/assets/docs/diagrams/finance-overview.svg");
    expect(markup).toContain(
      "/assets/docs/diagrams/finance-overview-light.svg",
    );

    // The Finance hub links every section in the cluster.
    for (const href of [
      "/docs/tokens",
      "/docs/tokenization",
      "/docs/institutional",
      "/docs/payments",
      "/docs/defi",
      "/docs/finance/privacy",
    ]) {
      expect(markup).toContain(`href="${href}"`);
    }
  });
});
