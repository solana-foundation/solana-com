import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import config, { githubStorage } from "../keystatic.config";
import { upgradeComponentBlocks } from "../lib/keystatic/components";
import { UpgradeDiagram } from "../components/upgrades/mdx-components";

type ProseMirrorNode = {
  content?: ProseMirrorNode[];
  text?: string;
  type: string;
};

function findNodes(node: ProseMirrorNode, type: string): ProseMirrorNode[] {
  return [
    ...(node.type === type ? [node] : []),
    ...(node.content?.flatMap((child) => findNodes(child, type)) ?? []),
  ];
}

function getText(node: ProseMirrorNode): string {
  return node.text ?? node.content?.map(getText).join("") ?? "";
}

describe("Keystatic GitHub storage", () => {
  it("passes the dedicated staging branch policy to Keystatic", () => {
    expect(githubStorage).toMatchObject({
      kind: "github",
      branchPrefix: "staging-",
      pathPrefix: "apps/media",
    });
  });
});

describe("releases collection", () => {
  it("defines the fields the grouped listing page relies on", () => {
    const releaseFields = Object.keys(
      config.collections?.releases?.schema ?? {},
    );
    expect(releaseFields).toEqual(
      expect.arrayContaining(["name", "expectedDate", "status", "overview"]),
    );
  });
});

describe("upgrades schema", () => {
  it("shows the selected diagram description in the Keystatic preview", () => {
    const diagram = upgradeComponentBlocks.UpgradeDiagram;
    if (
      !diagram ||
      diagram.kind !== "block" ||
      !("ContentView" in diagram) ||
      !diagram.ContentView
    ) {
      throw new Error("Expected an UpgradeDiagram block with a preview");
    }

    const html = renderToStaticMarkup(
      createElement(diagram.ContentView, {
        value: { diagram: "tx-wire-layout" },
      }),
    );
    expect(html).toContain("transaction wire layout");
    expect(html).toContain(
      "Byte layout of legacy, v0 and v1 transactions compared",
    );
  });

  it("replaces the freeform badges field with stage, release, and order", () => {
    const upgradeFields = Object.keys(
      config.collections?.upgrades?.schema ?? {},
    );
    expect(upgradeFields).not.toContain("badges");
    expect(upgradeFields).toEqual(
      expect.arrayContaining(["stage", "release", "order"]),
    );
  });

  it("renders the MDX line-break component inside a table cell", () => {
    const lineBreak = upgradeComponentBlocks.br;

    expect(lineBreak).toMatchObject({ kind: "inline", schema: {} });
    if (
      !lineBreak ||
      lineBreak.kind !== "inline" ||
      !("ContentView" in lineBreak) ||
      !lineBreak.ContentView
    ) {
      throw new Error("Expected br to be an inline component with a preview");
    }

    const html = renderToStaticMarkup(
      createElement(
        "table",
        null,
        createElement(
          "tbody",
          null,
          createElement(
            "tr",
            null,
            createElement(
              "td",
              null,
              "first line",
              createElement(lineBreak.ContentView, { value: {} }),
              "second line",
            ),
          ),
        ),
      ),
    );

    expect(html).toContain("<td>first line<br/>second line</td>");
  });

  it("preserves MDX line breaks in upgrade table cells", () => {
    const body = config.collections?.upgrades?.schema.body;
    if (!body) {
      throw new Error("Expected the upgrades body field to be configured");
    }

    const source = readFileSync(
      new URL(
        "../content/upgrades/larger-transaction-sizes.mdx",
        import.meta.url,
      ),
      "utf8",
    );
    const content = source.replace(/^---\n[\s\S]*?\n---\n/, "");
    const parsed = body.parse(
      {},
      {
        content: new TextEncoder().encode(content),
        external: new Map(),
        other: new Map(),
        slug: "larger-transaction-sizes",
      },
    ) as { toJSON(): { doc: ProseMirrorNode } };
    const cells = findNodes(parsed.toJSON().doc, "table_cell");

    for (const [api, lineBreaks] of [
      ["setTransactionMessageComputeUnitLimit", 3],
      ["getTransactionDecoder", 2],
      ["v1::TransactionConfig::empty()", 4],
    ] as const) {
      const cell = cells.find((candidate) => getText(candidate).includes(api));
      expect(cell, `Expected a table cell containing ${api}`).toBeDefined();
      expect(findNodes(cell!, "br")).toHaveLength(lineBreaks);
    }
  });

  it("parses the selected diagrams in both upgrade articles", () => {
    const body = config.collections?.upgrades?.schema.body;
    if (!body) throw new Error("Expected the upgrades body field");

    for (const [slug, count] of [
      ["alpenglow", 5],
      ["larger-transaction-sizes", 2],
    ] as const) {
      const source = readFileSync(
        new URL(`../content/upgrades/${slug}.mdx`, import.meta.url),
        "utf8",
      );
      const content = source.replace(/^---\n[\s\S]*?\n---\n/, "");
      const parsed = body.parse(
        {},
        {
          content: new TextEncoder().encode(content),
          external: new Map(),
          other: new Map(),
          slug,
        },
      ) as { toJSON(): { doc: ProseMirrorNode } };

      expect(findNodes(parsed.toJSON().doc, "UpgradeDiagram")).toHaveLength(
        count,
      );
    }
  });

  it("renders a selected diagram with its existing accessible SVG", () => {
    const html = renderToStaticMarkup(
      createElement(UpgradeDiagram, { diagram: "ag-block-lifecycle" }),
    );
    expect(html).toContain("<svg");
    expect(html).toContain('role="img"');
    expect(html).toContain("<figcaption");
  });
});
