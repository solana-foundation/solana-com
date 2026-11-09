import { readFileSync } from "node:fs";
import path from "node:path";
import { inflateRawSync } from "node:zlib";
import { beforeEach, describe, expect, it } from "vitest";

/**
 * public/docs-assets/scripts/playground.js on the Playground blocks
 * docs-tooling gen:paths writes (snippets/paths/<lang>/<key>/playground.mdx)
 * and on a program button ("Open tutorial in Playground", none on a page for
 * now; AUTHORING.md). Both open the new Playground at CONFIG.origin.
 */
const read = (rel: string) =>
  readFileSync(path.join(process.cwd(), rel), "utf8");
const SCRIPT = read("public/docs-assets/scripts/playground.js");
const QUICKSTART_BLOCK = read(
  "content/snippets/paths/en/quickstart/playground.mdx",
);
/** The Run link as gen:paths wrote it: what readers without JS open. */
const GENERATED_HREF = /href="([^"]+)"/.exec(QUICKSTART_BLOCK)![1]!;
const ORIGIN = /^\s*origin: "([^"]+)",$/m.exec(SCRIPT)![1]!;
const PROGRAM =
  "packages/docs-examples/programs/build-first-program/programs/my-program";

const fragment = (href: string) => new URLSearchParams(href.split("#")[1]);

/** Render the links on `pathname`, run the script, wait for its first scan. */
async function render(pathname: string, open = PROGRAM) {
  window.history.replaceState(null, "", pathname);
  document.body.innerHTML = [
    `<a class="sol-pg-tut" data-pg-run="" href="${GENERATED_HREF}" target="_blank" rel="noopener noreferrer">Run in Playground<span class="sol-vh"> (opens in a new tab)</span></a>`,
    `<a class="sol-pg-tut" data-pg-open="${open}">Open in Playground</a>`,
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
    // gen:paths took its origin from the same CONFIG.origin line, and the
    // file from the current playground.ts (it ran after the last change).
    expect(GENERATED_HREF.startsWith(`${ORIGIN}/open#`)).toBe(true);
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
    expect(href.startsWith(`${ORIGIN}/open#`)).toBe(true);
    const params = fragment(href);
    expect(params.get("from")).toBe(
      "https://solana.com/de/developers/docs/quickstart",
    );
    // Everything else is the generated link's.
    const generated = fragment(GENERATED_HREF);
    for (const key of ["v", "name", "title", "sol", "code"])
      expect(params.get(key), key).toBe(generated.get(key));
  });

  it("points program buttons at the new Playground's /github/ import", async () => {
    const { run, program } = await render("/developers/docs/programs/x");
    const href = program.getAttribute("href")!;
    expect(href).toBe(
      `${ORIGIN}/github/solana-foundation/solana-com/tree/main/${PROGRAM}`,
    );
    // One origin for both kinds of button.
    expect(new URL(href).origin).toBe(
      new URL(run.getAttribute("href")!).origin,
    );
    // The old Playground's form (`beta.solpg.io/github.com/…`) is a 404
    // on the new one.
    expect(href).not.toMatch(/solpg|\/github\.com\//);
    expect(program.getAttribute("target")).toBe("_blank");
    expect(program.getAttribute("rel")).toBe("noopener noreferrer");
    expect(program.getAttribute("aria-label")).toBe(
      "Open in Playground (opens in a new tab)",
    );
  });

  it("leaves a program button with an unsafe folder without a link", async () => {
    for (const open of [
      "",
      "../../evil/repo",
      "https://evil.example/x",
      "a b",
      "a/b?c=1",
      "a/b#c",
    ]) {
      const { program } = await render("/developers/docs/programs/x", open);
      expect(program.hasAttribute("href"), open).toBe(false);
    }
  });
});
