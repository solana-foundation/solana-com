import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { AskGenerativeUi } from "../ask-solana/api";
import {
  commonVisualGenerativeUiFixtures,
  tokenLifecycleGenerativeUiFixture,
} from "../ask-solana/common-visual-generative-ui.fixtures";
import { createTokenGenerativeUiFixture } from "../ask-solana/create-token-generative-ui.fixture";
import {
  GenerativeUiAnswer,
  getAskGenerativeUiDiagnostics,
} from "../ask-solana/generative-ui";

vi.mock("next/font/google", () => ({
  JetBrains_Mono: () => ({ className: "font-mono-test" }),
  Space_Grotesk: () => ({ className: "font-sans-test" }),
}));

describe("GenerativeUiAnswer", () => {
  it("renders concept_model and step_flow with Vector answer primitives", () => {
    const html = renderToStaticMarkup(
      React.createElement(GenerativeUiAnswer, {
        ui: createTokenGenerativeUiFixture,
      }),
    );

    expect(html).toContain("Model");
    expect(html).toContain("CLI flow");
    expect(html).toContain("Create the mint");
    expect(html).toContain("spl-token");
    expect(html).toContain("Execute");
    expect(html).not.toContain("Run step 01 to build the model");
    expect(html).not.toContain("KEY");
    expect(html).toContain("font-sans-test");
  });

  it("uses a quiet next action for no-command state transitions", () => {
    const ui: AskGenerativeUi = {
      version: "solana-docs-ui/v1",
      kind: "answer",
      components: [
        {
          type: "concept_model",
          title: "Live model",
          nodes: [
            {
              id: "mint-account",
              label: "Mint account",
              body: "Stores token configuration.",
            },
          ],
        },
        {
          type: "step_flow",
          title: "State flow",
          steps: [
            {
              title: "Create the mint account",
              body: "The mint-account is allocated and initialized.",
              result: "mint-account exists with zero supply.",
              effects: [
                {
                  action: "reveal",
                  node_id: "mint-account",
                  label: "initialized",
                },
              ],
            },
          ],
        },
      ],
    };

    const html = renderToStaticMarkup(
      React.createElement(GenerativeUiAnswer, { ui }),
    );

    expect(html).toContain("mint-account");
    expect(html).toContain("Next");
    expect(html).not.toContain("State change");
    expect(html).not.toContain("Reveal");
  });

  it("renders prerequisites compactly and optional token cleanup collapsed", () => {
    const html = renderToStaticMarkup(
      React.createElement(GenerativeUiAnswer, {
        ui: tokenLifecycleGenerativeUiFixture,
      }),
    );

    expect(html).toContain("Before you start");
    expect(html).toContain("Select devnet");
    expect(html).toContain("Fund wallet");
    expect(html).toContain("Lifecycle flow");
    expect(html).toContain("3 steps");
    expect(html).toContain("Create the mint");
    expect(html).toContain("Create the token account");
    expect(html).toContain("Mint supply");
    expect(html).toContain("More actions (1)");
    expect(html).toContain("Close the empty account");
  });

  it("renders every supported diagram archetype from concept_model nodes", () => {
    const labels = [
      ["wallet", "User wallet"],
      ["signer", "Mint authority"],
      ["mint-account", "Mint account"],
      ["token-account", "Token account"],
      ["pda", "Escrow PDA"],
      ["program", "Token Program"],
      ["instruction", "InitializeMint"],
      ["transaction", "Create token transaction"],
      ["rpc-node", "RPC node"],
      ["validator", "Validator"],
    ] as const;
    const ui: AskGenerativeUi = {
      version: "solana-docs-ui/v1",
      kind: "answer",
      components: [
        {
          type: "concept_model",
          title: "Network model",
          nodes: labels.map(([archetype, label]) => ({
            id: archetype,
            archetype,
            label,
            fields: [{ label: "role", value: label }],
          })),
          relationships: [
            {
              from: "wallet",
              to: "transaction",
              kind: "signs",
            },
          ],
        },
      ],
    };

    const html = renderToStaticMarkup(
      React.createElement(GenerativeUiAnswer, { ui }),
    );

    for (const [, label] of labels) {
      expect(html).toContain(label);
    }
    expect(html).toContain('data-archetype="mint-account"');
    expect(html).toContain('data-archetype="token-account"');
    expect(html).toContain("signs");
  });

  it("renders the common workflow fixtures through the compact visual path", () => {
    const deprecatedTypes = new Set([
      "cards",
      "code_tabs",
      "comparison",
      "definition_grid",
      "source_links",
    ]);

    for (const fixture of commonVisualGenerativeUiFixtures) {
      const html = renderToStaticMarkup(
        React.createElement(GenerativeUiAnswer, { ui: fixture.ui }),
      );

      expect(html, fixture.name).toContain("Model");
      expect(html, fixture.name).not.toContain(
        "Run step 01 to build the model",
      );
      expect(html, fixture.name).not.toContain("KEY");
      expect(
        fixture.ui.components.some((component) =>
          deprecatedTypes.has(component.type),
        ),
        fixture.name,
      ).toBe(false);
    }
  });

  it("ignores deprecated heavyweight visual components by default", () => {
    const ui: AskGenerativeUi = {
      version: "solana-docs-ui/v1",
      kind: "answer",
      components: [
        {
          type: "answer_intro",
          title: "Visible answer",
          body: "The compact visual renderer should keep this content.",
        },
        {
          type: "code_tabs",
          title: "Hidden code tabs",
          tabs: [
            {
              label: "Hidden tab",
              language: "typescript",
              code: "const hidden = true;",
            },
          ],
        },
        {
          type: "cards",
          title: "Hidden cards",
          cards: [{ title: "Hidden card", body: "Do not render this card." }],
        },
        {
          type: "definition_grid",
          title: "Hidden definitions",
          definitions: [{ term: "Hidden term", definition: "Hidden value" }],
        },
        {
          type: "comparison",
          title: "Hidden comparison",
          rows: [{ label: "Hidden row", values: ["A", "B"] }],
        },
        {
          type: "source_links",
          title: "Hidden source links",
          links: [{ title: "Hidden source", url: "/docs/hidden" }],
        },
      ],
    };

    const html = renderToStaticMarkup(
      React.createElement(GenerativeUiAnswer, { ui }),
    );

    expect(html).toContain("Visible answer");
    expect(html).not.toContain("Hidden code tabs");
    expect(html).not.toContain("const hidden = true;");
    expect(html).not.toContain("Hidden card");
    expect(html).not.toContain("Hidden term");
    expect(html).not.toContain("Hidden row");
    expect(html).not.toContain("Hidden source");
  });

  it("reports diagnostics for skipped components and invalid effect references", () => {
    const ui: AskGenerativeUi = {
      version: "solana-docs-ui/v1",
      kind: "answer",
      components: [
        {
          type: "concept_model",
          nodes: [
            {
              id: "mint",
              archetype: "mint-account",
              label: "Mint account",
            },
          ],
          relationships: [
            {
              from: "mint",
              to: "missing-account",
              kind: "unknown-kind",
            },
          ],
        },
        {
          type: "step_flow",
          steps: [
            {
              title: "Update missing node",
              effects: [
                {
                  action: "update",
                  node_id: "missing-account",
                  field: "state",
                  value: "initialized",
                },
              ],
            },
          ],
        },
        {
          type: "code_tabs",
          title: "Deprecated",
          tabs: [{ label: "Code", code: "const hidden = true;" }],
        },
      ],
    };

    const diagnostics = getAskGenerativeUiDiagnostics(ui);

    expect(diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: "error",
          message: 'Unsupported relationship kind "unknown-kind".',
        }),
        expect.objectContaining({
          level: "error",
          message: 'Effect references unknown node id "missing-account".',
        }),
        expect.objectContaining({
          level: "info",
          message:
            'Deprecated component "code_tabs" is ignored by the visual renderer.',
        }),
      ]),
    );
  });
});
