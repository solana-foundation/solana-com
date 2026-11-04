/** gen:nav-labels, against a throwaway docs root in the OS temp dir. */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DOCS_LOCALES } from "../src/lib/locales.ts";
import { docsRoot as realDocsRoot } from "../src/lib/paths.ts";
import { generateNavLabels, labelSlug } from "../src/generators/nav-labels.ts";

let root: string;
const write = (rel: string, text: string) => {
  const abs = path.join(root, rel);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, text);
};
const read = (rel: string) =>
  JSON.parse(readFileSync(path.join(root, rel), "utf8"));

const NAV = {
  tabs: [
    {
      tab: "Start here",
      pages: [
        "developers/docs/index",
        {
          group: "Quickstart",
          tag: "~8 min",
          pages: ["developers/docs/quickstart/check-balance"],
        },
      ],
    },
    {
      tab: "Costs & speed",
      groups: [
        {
          group: "The basics",
          pages: [
            { group: "Accounts", pages: ["developers/docs/core/accounts"] },
            { type: "link", title: "GitHub", href: "https://github.com" },
          ],
        },
      ],
    },
  ],
};

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "docs-nav-labels-"));
  write("navigation/en.json", JSON.stringify(NAV));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("gen:nav-labels", () => {
  it("lists every tab, group, link and tag label by slug", () => {
    const r = generateNavLabels({ docsRoot: root });
    expect(r.ok).toBe(true);
    expect(read("navigation/en/labels.json")).toEqual({
      tabs: { "costs-and-speed": "Costs & speed", "start-here": "Start here" },
      groups: {
        accounts: "Accounts",
        quickstart: "Quickstart",
        "the-basics": "The basics",
      },
      links: { github: "GitHub" },
      tags: { "8-min": "~8 min" },
    });
  });

  it("gives every locale a placeholder, and never edits a locale's file", () => {
    write(
      "navigation/ja/labels.json",
      '{ "tabs": { "start-here": "はじめに" } }\n',
    );
    generateNavLabels({ docsRoot: root });
    for (const locale of DOCS_LOCALES)
      expect(
        existsSync(path.join(root, `navigation/${locale}/labels.json`)),
      ).toBe(true);
    expect(read("navigation/de/labels.json")).toEqual({});
    expect(read("navigation/ja/labels.json")).toEqual({
      tabs: { "start-here": "はじめに" },
    });
  });

  it("--check reports drift and writes nothing", () => {
    const r = generateNavLabels({ docsRoot: root, check: true });
    expect(r.ok).toBe(false);
    expect(r.written).toContain("navigation/en/labels.json");
    expect(existsSync(path.join(root, "navigation/en/labels.json"))).toBe(
      false,
    );
    generateNavLabels({ docsRoot: root });
    expect(generateNavLabels({ docsRoot: root, check: true }).ok).toBe(true);
  });

  it("rejects two labels that share a key", () => {
    write(
      "navigation/en.json",
      JSON.stringify({
        tabs: [
          {
            tab: "Tools",
            groups: [
              { group: "Fees & rent", pages: [] },
              { group: "Fees and rent", pages: [] },
            ],
          },
        ],
      }),
    );
    const r = generateNavLabels({ docsRoot: root });
    expect(r.ok).toBe(false);
    expect(r.problems[0]!.message).toMatch(/"Fees & rent" and "Fees and rent"/);
  });

  it("slugs labels as the docs app does", () => {
    expect(labelSlug("Video tutorials")).toBe("video-tutorials");
    expect(labelSlug("Costs & speed")).toBe("costs-and-speed");
    expect(labelSlug("~30 min")).toBe("30-min");
    expect(labelSlug("Beta (v2.2.0-beta)")).toBe("beta-v2-2-0-beta");
  });

  it("the committed labels match navigation/en.json", () => {
    expect(
      generateNavLabels({ docsRoot: realDocsRoot, check: true }).written,
    ).toEqual([]);
  });
});
