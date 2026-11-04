import { describe, expect, it } from "vitest";
import { buildExamples, outputCandidates } from "./build-examples.ts";
import {
  isLegacyWeb3jsTab,
  rewriteWeb3jsSpecifier,
  sliceRegion,
} from "./include.ts";
import { LEGACY_NOTICE_TAG, fenceFor, renderSnippet } from "./render.ts";

describe("include (port of @devrelkit/remark-include-code 0.1.2)", () => {
  const src = [
    "import x from 'y';",
    "  // #region a",
    "  const one = 1;",
    "    nested();",
    "  // #endregion a",
    "// #region b",
    "b();",
    "// #endregion",
    "// #region a",
    "// #region inner",
    "const two = 2;",
    "// #endregion whatever",
  ].join("\n");

  it("joins same-name regions, strips the start indent, drops nested markers", () => {
    expect(sliceRegion({ source: src, region: "a", lang: "ts" })).toBe(
      "const one = 1;\n  nested();\n\nconst two = 2;",
    );
  });

  it("uses # for Python and throws on a missing region", () => {
    expect(
      sliceRegion({
        source: "# #region r\nprint(1)\n# #endregion r\n",
        region: "r",
        lang: "py",
      }),
    ).toBe("print(1)");
    expect(() =>
      sliceRegion({ source: src, region: "nope", lang: "ts" }),
    ).toThrow(/not found/);
  });

  it("rewrites the web3.js aliases like remark-web3js-specifier", () => {
    expect(
      rewriteWeb3jsSpecifier(
        'from "@solana/web3.js-legacy"; "@solana/web3.js-v3/x"',
      ),
    ).toBe('from "@solana/web3.js"; "@solana/web3.js/x"');
    expect(rewriteWeb3jsSpecifier("@solana/web3.js-legacy-extra")).toBe(
      "@solana/web3.js-legacy-extra",
    );
  });
});

describe("render", () => {
  const block = { runnable: true, tabs: [] };
  it("emits Tabs with a Run block only where output exists", () => {
    const mdx = renderSnippet({
      id: "cookbook/a/b/x",
      source: "packages/docs-examples/cookbook/a/b/blocks.json",
      block,
      tabs: [
        {
          title: "Kit",
          lang: "ts",
          code: "a()",
          output: "Signature: abc {x} <y>",
        },
        { title: "Rust", lang: "rust", code: "b()", highlight: "1" },
      ],
    });
    expect(mdx).toContain('<Tab title="Kit">');
    expect(mdx).toContain('<div className="sol-tab-label">Kit</div>');
    expect(mdx.match(/className="sol-run"/g)).toHaveLength(1);
    expect(mdx).toContain("```text Output\nSignature: abc {x} <y>\n```");
    expect(mdx).toContain("```rust highlight={1}\nb()\n```");
    // Never raw <details>/<noscript>: the renderer at conversion time dropped them.
    expect(mdx).not.toMatch(/<details|<noscript/);
  });

  it("uses CodeGroup and no Run button without outputs, and long fences when needed", () => {
    const mdx = renderSnippet({
      id: "a/b/c",
      source: "s",
      block: { runnable: false, tabs: [] },
      tabs: [
        { title: "Kit", lang: "ts", code: "x", output: "ignored" },
        { title: "With space", lang: "ts", code: "```inner```" },
      ],
    });
    expect(mdx).toContain("<CodeGroup>");
    expect(mdx).not.toContain("sol-run");
    expect(mdx).toContain('````ts title="With space"');
    expect(fenceFor("a ```` b")).toBe("`````");
  });

  it("puts the legacy web3.js notice in legacy tabs only", () => {
    const kit = { title: "Kit", lang: "ts", code: "kit()", output: "ok" };
    const legacy = {
      title: "Web3.js (legacy)",
      lang: "ts",
      code: "legacy()",
      output: "ok",
      legacy: true,
    };
    const tabs = renderSnippet({
      id: "a/b/c",
      source: "s",
      block: { runnable: true, tabs: [] },
      tabs: [kit, legacy],
    });
    expect(tabs.match(/<LegacyWeb3jsNotice \/>/g)).toHaveLength(1);
    expect(tabs).toContain(
      `<Tab title="Web3.js (legacy)">\n<div className="sol-tab-label">Web3.js (legacy)</div>\n\n${LEGACY_NOTICE_TAG}\n\n\`\`\`ts\nlegacy()`,
    );
    // Code groups keep the tag before the legacy fence (shown in its panel).
    const group = renderSnippet({
      id: "a/b/c",
      source: "s",
      block: { runnable: false, tabs: [] },
      tabs: [kit, legacy],
    });
    expect(group).toContain(
      `\`\`\`ts Kit\nkit()\n\`\`\`\n\n${LEGACY_NOTICE_TAG}\n\n\`\`\`ts title="Web3.js (legacy)"`,
    );
    // A single fence gets it above.
    const single = renderSnippet({
      id: "a/b/c",
      source: "s",
      block: { runnable: false, tabs: [] },
      tabs: [legacy],
    });
    expect(single).toMatch(/\*\/\}\n\n<LegacyWeb3jsNotice \/>\n\n```ts title=/);
    // legacyNotice: false (the page shows one notice instead).
    expect(
      renderSnippet({
        id: "a/b/c",
        source: "s",
        block: { runnable: true, legacyNotice: false, tabs: [] },
        tabs: [kit, legacy],
      }),
    ).not.toContain(LEGACY_NOTICE_TAG);
  });

  it("detects legacy tabs by title or by the -legacy import", () => {
    expect(isLegacyWeb3jsTab("Web3.js (legacy) Helper", "")).toBe(true);
    expect(isLegacyWeb3jsTab("Legacy web3.js", "")).toBe(true);
    // "legacy" alone also names a transaction and message format.
    expect(
      isLegacyWeb3jsTab(
        "Kit (legacy transaction)",
        'import { createTransactionMessage } from "@solana/kit";',
      ),
    ).toBe(false);
    expect(isLegacyWeb3jsTab("Legacy message", "")).toBe(false);
    expect(
      isLegacyWeb3jsTab(
        "Web3.js v3 (legacy transaction)",
        'import { Transaction } from "@solana/web3.js-v3";',
      ),
    ).toBe(false);
    expect(
      isLegacyWeb3jsTab(
        "Collect and merge signatures",
        'import { Keypair } from "@solana/web3.js-legacy";',
      ),
    ).toBe(true);
    expect(
      isLegacyWeb3jsTab(
        "Web3.js v3",
        'import { Keypair } from "@solana/web3.js-v3";',
      ),
    ).toBe(false);
    expect(isLegacyWeb3jsTab("Kit", 'import "@solana/kit";')).toBe(false);
  });

  it("looks up outputs like remark-example-output", () => {
    expect(outputCandidates("rust/src/main.rs", "transfer")).toEqual([
      "rust/src/main.transfer.output.txt",
      "rust/src/main.output.txt",
    ]);
  });
});

describe("examples build", () => {
  const r = buildExamples({ check: true });
  it("builds every blocks.json without errors", () => {
    expect(r.errors).toEqual([]);
    expect(Object.keys(r.index).length).toBeGreaterThanOrEqual(53);
  });
  it("embeds at least 88 recorded outputs", () => {
    expect(r.outputsEmbedded).toBeGreaterThanOrEqual(88);
  });
  it("committed snippets are up to date (examples:build --check)", () => {
    expect(r.stale).toEqual([]);
  });
  it("marks the legacy web3.js tabs, neutral titles included", () => {
    const withNotice = [...r.files]
      .filter(([, text]) => text.includes(LEGACY_NOTICE_TAG))
      .map(([rel]) => rel);
    expect(withNotice.length).toBeGreaterThanOrEqual(35);
    expect(withNotice).toContain(
      "apps/docs/content/snippets/examples/cookbook/transactions/partial-signing/partial-signing.mdx",
    );
    for (const [rel, text] of r.files)
      if (/\/paths\//.test(rel)) expect(text).not.toContain(LEGACY_NOTICE_TAG);
  });
});
