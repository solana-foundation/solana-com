import { readFileSync } from "node:fs";
import path from "node:path";
import { inflateRawSync } from "node:zlib";
import { beforeEach, describe, expect, it } from "vitest";

/**
 * public/docs-assets/scripts/playground.js on the Playground blocks
 * docs-tooling gen:paths writes (snippets/paths/<lang>/<key>/playground.mdx).
 */
const read = (rel: string) =>
  readFileSync(path.join(process.cwd(), rel), "utf8");
const SCRIPT = read("public/docs-assets/scripts/playground.js");
const QUICKSTART_BLOCK = read(
  "content/snippets/paths/en/quickstart/playground.mdx",
);
/** The Run link as gen:paths wrote it: what readers without JS open. */
const GENERATED_HREF = /href="([^"]+)"/.exec(QUICKSTART_BLOCK)![1]!;
const RUN_ORIGIN = /runOrigin: "([^"]+)"/.exec(SCRIPT)![1]!;

const fragment = (href: string) => new URLSearchParams(href.split("#")[1]);

/** Render the links on `pathname`, run the script, wait for its first scan. */
async function render(pathname: string) {
  window.history.replaceState(null, "", pathname);
  document.body.innerHTML = [
    `<a class="sol-pg-tut" data-pg-run="" href="${GENERATED_HREF}" target="_blank" rel="noopener noreferrer">Run in Playground<span class="sol-vh"> (opens in a new tab)</span></a>`,
    '<a class="sol-pg-tut" data-pg-open="packages/docs-examples/programs/build-first-program/programs/my-program">Open in Playground</a>',
  ].join("");
  delete (window as { __solPlayground?: boolean }).__solPlayground;
  new Function(SCRIPT)();
  await new Promise((resolve) => setTimeout(resolve, 120));
  const [run, program] = document.querySelectorAll("a");
  return { run: run!, program: program! };
}

describe("playground.js", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("leaves the generated Run link as it is on the English page", async () => {
    // gen:paths took its origin from the same CONFIG.runOrigin line, and the
    // file from the current playground.ts (it ran after the last change).
    expect(GENERATED_HREF.startsWith(`${RUN_ORIGIN}/open#`)).toBe(true);
    const code = fragment(GENERATED_HREF).get("code")!;
    expect(inflateRawSync(Buffer.from(code, "base64url")).toString()).toBe(
      read("../../packages/docs-examples/paths/start/quickstart/playground.ts"),
    );
    const { run } = await render("/developers/docs/quickstart");
    expect(run.getAttribute("href")).toBe(GENERATED_HREF);
    expect(run.getAttribute("target")).toBe("_blank");
    expect(run.getAttribute("rel")).toBe("noopener noreferrer");
    // The visually hidden span names the new tab; no aria-label on top.
    expect(run.hasAttribute("aria-label")).toBe(false);
  });

  it("links back to the page the reader is on, locale included", async () => {
    const { run } = await render("/de/developers/docs/quickstart/");
    const href = run.getAttribute("href")!;
    expect(href.startsWith(`${RUN_ORIGIN}/open#`)).toBe(true);
    const params = fragment(href);
    expect(params.get("from")).toBe(
      "https://solana.com/de/developers/docs/quickstart",
    );
    // Everything else is the generated link's.
    const generated = fragment(GENERATED_HREF);
    for (const key of ["v", "name", "title", "sol", "code"])
      expect(params.get(key), key).toBe(generated.get(key));
  });

  it("still points program buttons at the GitHub import", async () => {
    const { program } = await render("/developers/docs/programs/x");
    expect(program.getAttribute("href")).toBe(
      "https://beta.solpg.io/github.com/solana-foundation/solana-com/tree/main/packages/docs-examples/programs/build-first-program/programs/my-program",
    );
    expect(program.getAttribute("aria-label")).toBe(
      "Open in Playground (opens in a new tab)",
    );
  });
});
