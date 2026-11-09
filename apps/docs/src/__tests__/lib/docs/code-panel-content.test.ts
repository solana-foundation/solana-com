import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { VFile } from "vfile";
import { describe, expect, it } from "vitest";

/**
 * The `<Steps codePanel>` walkthroughs in the docs content (Steps in
 * components/docs/docs-components.tsx; rules in
 * packages/docs-tooling/AUTHORING.md). remark-docs-compat checks where marks
 * go at build time; this checks what makes a walkthrough worth a panel.
 */

type Node = {
  type: string;
  name?: string;
  meta?: string | null;
  attributes?: { type: string; name: string }[];
  position?: { start: { line: number } };
  children?: Node[];
};

const require = createRequire(import.meta.url);
const { createProcessor } = (await import(
  createRequire(require.resolve("fumadocs-mdx/config")).resolve("@mdx-js/mdx")
)) as { createProcessor: () => { parse: (file: VFile) => Node } };
const processor = createProcessor();

const DOCS = path.join(process.cwd(), "content/docs");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory()
      ? files(path.join(dir, d.name))
      : d.name.endsWith(".mdx")
        ? [path.join(dir, d.name)]
        : [],
  );

const isEl = (n: Node, name: string) =>
  n.type === "mdxJsxFlowElement" && n.name === name;
const isCode = (n: Node) =>
  n.type === "code" || isEl(n, "CodeGroup") || isEl(n, "Tabs");
const isMark = (n: Node) =>
  n.type === "code" && /(^|\s)panel$/.test(n.meta ?? "");
const walk = (n: Node, out: Node[] = []) => {
  if (
    isEl(n, "Steps") &&
    n.attributes?.some(
      (a) => a.type === "mdxJsxAttribute" && a.name === "codePanel",
    )
  )
    out.push(n);
  n.children?.forEach((c) => walk(c, out));
  return out;
};

/** The page's `<Steps codePanel>` blocks, as [where, [codes, marks] per step]. */
function walkthroughs(file: string) {
  const value = readFileSync(file, "utf8");
  if (!value.includes("codePanel")) return [];
  const where = (n: Node) =>
    `${path.relative(DOCS, file)}:${n.position?.start.line}`;
  return walk(processor.parse(new VFile({ path: file, value }))).map(
    (block) => ({
      where: where(block),
      steps: (block.children ?? [])
        .filter((s) => isEl(s, "Step"))
        .map((s) => ({
          where: where(s),
          codes: (s.children ?? []).filter(isCode).length,
          marks: (s.children ?? []).filter(isMark).length,
        })),
    }),
  );
}

const english = files(path.join(DOCS, "en")).map((file) => ({
  file,
  blocks: walkthroughs(file),
}));
const withPanels = english.filter((p) => p.blocks.length);
const count = (text: string) => ({
  blocks: (text.match(/<Steps codePanel[\s>]/g) ?? []).length,
  marks: (text.match(/^\s*(`{3,}|~{3,}).*\spanel[ \t]*$/gm) ?? []).length,
});

describe("<Steps codePanel> walkthroughs", () => {
  it("has the walkthroughs the docs chose", () => {
    const n = withPanels.reduce((a, p) => a + p.blocks.length, 0);
    expect(
      n,
      "a <Steps codePanel> was added or removed: if that is deliberate, update this count",
    ).toBe(30);
  });

  it("gives every walkthrough at least two steps with panel code", () => {
    const thin = withPanels.flatMap((p) =>
      p.blocks
        .filter((b) => {
          const marked = b.steps.some((s) => s.marks);
          return (
            b.steps.filter((s) => (marked ? s.marks : s.codes === 1)).length < 2
          );
        })
        .map((b) => b.where),
    );
    expect(thin).toEqual([]);
  });

  it("has at most one code element per step in unmarked walkthroughs", () => {
    const crowded = withPanels.flatMap((p) =>
      p.blocks
        .filter((b) => !b.steps.some((s) => s.marks))
        .flatMap((b) => b.steps.filter((s) => s.codes > 1).map((s) => s.where)),
    );
    expect(
      crowded,
      "mark the fences that go to the panel with `panel` (AUTHORING.md)",
    ).toEqual([]);
  });

  it("keeps the walkthroughs and marks in translations", () => {
    const locales = readdirSync(DOCS).filter((l) => l !== "en");
    const drift: string[] = [];
    for (const { file } of withPanels) {
      const want = count(readFileSync(file, "utf8"));
      const rel = path.relative(path.join(DOCS, "en"), file);
      for (const locale of locales) {
        let text: string;
        try {
          text = readFileSync(path.join(DOCS, locale, rel), "utf8");
        } catch {
          continue; // not translated: the locale serves the English page
        }
        const got = count(text);
        if (got.blocks !== want.blocks || got.marks !== want.marks)
          drift.push(
            `${locale}/${rel}: ${got.blocks} blocks, ${got.marks} marks (en: ${want.blocks}, ${want.marks})`,
          );
      }
    }
    expect(drift).toEqual([]);
  });
});
