import { readFile } from "node:fs/promises";
import { compileMDX } from "@fumadocs/mdx-remote";
import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mdxComponents } from "../src/app/mdx-components";

const pages = [
  ["payments/agentic-payments/index.mdx", "Agentic payments let software"],
  [
    "payments/agentic-payments/quickstart.mdx",
    "Ask the agent to make one request",
  ],
  ["payments/agentic-payments/mpp.mdx", "MPP Charge Flow"],
  ["payments/agentic-payments/intro-to-x402.mdx", "PAYMENT-SIGNATURE"],
  ["payments/agentic-payments/x402-facilitator.mdx", "Facilitator interface"],
  ["tools/kora/guides/x402.mdx", "Start the reference facilitator"],
] as const;

describe.each(pages)("Agentic payments MDX: %s", (path, expectedText) => {
  it("renders with the shared MDX component registry", async () => {
    const source = await readFile(
      new URL(`../content/docs/en/${path}`, import.meta.url),
      "utf8",
    );
    const { body: PageContent } = await compileMDX({ source });

    const stream = await renderToReadableStream(
      <PageContent components={mdxComponents} />,
    );
    await stream.allReady;
    const markup = await new Response(stream).text();

    expect(markup).toContain(expectedText);
  });
});
