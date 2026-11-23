import { describe, expect, it } from "vitest";
import { compile } from "@mdx-js/mdx";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import remarkGfm from "remark-gfm";
import {
  isAllowedEmbedSrc,
  parseLiteral,
  remarkRejectMdxCode,
  safeHref,
} from "../lib/mdx-security";
import { preprocessMDX } from "../lib/mdx-preprocess";

async function compileGuarded(source: string) {
  return compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm, remarkRejectMdxCode],
  });
}

describe("remarkRejectMdxCode", () => {
  it("rejects import and export statements", async () => {
    await expect(
      compileGuarded('import x from "node:fs"\n\n# Hi'),
    ).rejects.toThrow(/import and export/);
    await expect(
      compileGuarded("export const leak = process.env.SECRET\n\n# Hi"),
    ).rejects.toThrow(/import and export/);
  });

  it("rejects non-literal expressions in the body and in attributes", async () => {
    await expect(compileGuarded("Value: {process.env.SECRET}")).rejects.toThrow(
      /JavaScript expressions/,
    );
    await expect(
      compileGuarded("<Video url={globalThis.location} />"),
    ).rejects.toThrow(/must be a literal/);
    await expect(compileGuarded("<Video {...props} />")).rejects.toThrow(
      /Spread attributes/,
    );
  });

  it("rejects HTML-injecting attributes and script-capable elements even with literal values", async () => {
    await expect(
      compileGuarded(
        '<div dangerouslySetInnerHTML={{ __html: "<img src=x onerror=alert(1)>" }} />',
      ),
    ).rejects.toThrow(/dangerouslySetInnerHTML/);
    await expect(compileGuarded("<script>alert(1)</script>")).rejects.toThrow(
      /<script> elements/,
    );
    await expect(
      compileGuarded('<img src="/x.png" onError="alert(1)" />'),
    ).rejects.toThrow(/onError/);
    await expect(
      compileGuarded('<object data="https://evil.example/x.swf" />'),
    ).rejects.toThrow(/<object> elements/);
    await expect(
      compileGuarded(
        '<form action="https://evil.example"><button>Go</button></form>',
      ),
    ).rejects.toThrow(/"action"/);
  });

  it("keeps literal expressions and plain JSX working", async () => {
    await expect(
      compileGuarded(
        '<video url="https://youtu.be/x" autoPlay={false} loop={false} muted={false} width={600} />\n\nText{" "}more\n\n<Latex formula="a^2" />',
      ),
    ).resolves.toBeDefined();
  });

  it("accepts every published content file after preprocessing", async () => {
    const root = path.join(__dirname, "..", "content");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (entry.name.endsWith(".mdx")) files.push(p);
      }
    };
    walk(root);
    expect(files.length).toBeGreaterThan(100);
    const failures: string[] = [];
    for (const file of files) {
      const raw = readFileSync(file, "utf8");
      const body = raw.replace(/^---[\s\S]*?\n---\n/, "");
      try {
        await compileGuarded(preprocessMDX(body));
      } catch (error) {
        failures.push(
          `${path.relative(root, file)}: ${(error as Error).message}`,
        );
      }
    }
    expect(failures).toEqual([]);
  }, 120_000);
});

describe("parseLiteral", () => {
  it("parses object and array literals with unquoted keys and trailing commas", () => {
    expect(
      parseLiteral(
        '[{ size: "small", image: { src: "/a.png", alt: \'x\' }, n: 2, ok: true, },]',
      ),
    ).toEqual([
      { size: "small", image: { src: "/a.png", alt: "x" }, n: 2, ok: true },
    ]);
  });

  it("never evaluates code", () => {
    expect(parseLiteral("process.env")).toBeUndefined();
    expect(parseLiteral("[fetch('x')]")).toBeUndefined();
    expect(parseLiteral("`${a}`")).toBeUndefined();
    expect(parseLiteral("{ __proto__: { polluted: true } }")).toBeUndefined();
  });
});

describe("safeHref", () => {
  it("allows http(s), root-relative, fragment and mailto links", () => {
    expect(safeHref("https://solana.com/x")).toBe("https://solana.com/x");
    expect(safeHref("/news")).toBe("/news");
    expect(safeHref("#section")).toBe("#section");
    expect(safeHref("mailto:a@b.c")).toBe("mailto:a@b.c");
  });

  it("drops javascript:, data:, protocol-relative and control characters", () => {
    expect(safeHref("javascript:alert(1)")).toBeUndefined();
    expect(safeHref("data:text/html,x")).toBeUndefined();
    expect(safeHref("//evil.example")).toBeUndefined();
    expect(safeHref("https://a.b/\u0000")).toBeUndefined();
    expect(safeHref(" JAVASCRIPT:alert(1)")).toBeUndefined();
  });
});

describe("isAllowedEmbedSrc", () => {
  it("accepts only https URLs on allow-listed hosts", () => {
    expect(isAllowedEmbedSrc("https://www.loom.com/embed/abc")).toBe(true);
    expect(isAllowedEmbedSrc("https://dune.com/embeds/1/2")).toBe(true);
    expect(isAllowedEmbedSrc("http://www.loom.com/embed/abc")).toBe(false);
    expect(isAllowedEmbedSrc("https://evil.example/")).toBe(false);
    expect(isAllowedEmbedSrc("javascript:alert(1)")).toBe(false);
  });
});
