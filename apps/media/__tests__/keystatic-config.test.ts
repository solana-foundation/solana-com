import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import config, { githubStorage } from "../keystatic.config";
import { upgradeComponentBlocks } from "../lib/keystatic/components";

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
});
