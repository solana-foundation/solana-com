import { describe, expect, it } from "vitest";
import type {
  AskGenerativeUi,
  AskGenerativeUiComponent,
} from "@solana-com/ui-chrome/ask-solana/api";
import {
  commonVisualGenerativeUiFixtures,
  tokenLifecycleGenerativeUiFixture,
} from "@solana-com/ui-chrome/ask-solana/fixtures";
// Bri's create-token sample, which the package does not export.
import { createTokenGenerativeUiFixture } from "../../../../../../../packages/ui-chrome/src/ask-solana/create-token-generative-ui.fixture";
import {
  ASK_NODE_ARCHETYPES,
  ASK_RELATIONSHIP_TONES,
  modelStateAtStep,
  normalizeAskVisual,
  parseEffectText,
  resolveNodeId,
  safeHref,
  type NormalizedVisual,
} from "@/lib/docs/ask/generative-ui/schema";

function ui(...components: AskGenerativeUiComponent[]): AskGenerativeUi {
  return { version: "solana-docs-ui/v1", kind: "answer", components };
}

function stepTitles(visual: NormalizedVisual) {
  const flow = visual.flow!;
  return {
    setup: flow.setup.map((step) => step.title),
    steps: flow.steps.map((step) => step.title),
    optional: flow.optional.map((step) => step.title),
  };
}

describe("normalizeAskVisual: fixtures", () => {
  it.each(commonVisualGenerativeUiFixtures.map((f) => [f.name, f.ui] as const))(
    "%s: intro, model and flow in the agent's order",
    (_name, fixture) => {
      const visual = normalizeAskVisual(fixture);
      expect(visual.order).toEqual([
        { type: "intro" },
        { type: "model" },
        { type: "flow" },
      ]);
      expect(visual.skipped).toEqual([]);
      expect(visual.model!.nodes.length).toBeGreaterThan(0);
      expect(visual.flow!.steps.length).toBeGreaterThan(0);
      // Every effect target is a node of the model.
      const ids = new Set(visual.model!.nodes.map((node) => node.id));
      for (const step of visual.flow!.steps) {
        for (const id of step.touches) expect(ids.has(id)).toBe(true);
      }
    },
  );

  it("skips source_links (and the other retired types) but keeps the rest", () => {
    const visual = normalizeAskVisual(createTokenGenerativeUiFixture);
    expect(visual.skipped).toEqual(["source_links"]);
    expect(visual.intro?.bullets).toHaveLength(3);
    expect(visual.flow!.steps[0]!.links).toEqual([
      { title: "Token quickstart", href: "/developers/docs/tokens/quickstart" },
    ]);
  });

  it("lists deprecated and unknown component types as skipped", () => {
    const visual = normalizeAskVisual(
      ui(
        { type: "cards", cards: [{ title: "A" }] },
        { type: "code_tabs", tabs: [{ code: "x" }] },
        { type: "comparison", rows: [] },
        { type: "definition_grid", definitions: [] },
        { type: "source_links", links: [] },
        { type: "hologram" },
        { type: "callout", body: "Kept" },
      ),
    );
    expect(visual.skipped).toEqual([
      "cards",
      "code_tabs",
      "comparison",
      "definition_grid",
      "source_links",
      "hologram",
    ]);
    expect(visual.callouts).toEqual([{ tone: "note", body: "Kept" }]);
  });

  it("drops blocks with nothing to draw", () => {
    const visual = normalizeAskVisual(
      ui(
        { type: "answer_intro" },
        { type: "callout", tone: "warning" },
        { type: "command_list", commands: [{ note: "no command" }] },
        { type: "concept_model", nodes: [] },
        { type: "step_flow", steps: [{}] },
      ),
    );
    expect(visual.order).toEqual([]);
  });
});

describe("normalizeAskVisual: field aliases and loose values", () => {
  it("reads aliases, numbers and booleans", () => {
    const visual = normalizeAskVisual(
      ui(
        {
          type: "answer_intro",
          heading: "Rent",
          summary: "Accounts hold a deposit.",
          takeaways: ["Rent-exempt", 42, null],
        },
        { type: "callout", variant: "warn", text: "Mainnet costs SOL." },
        {
          type: "command_list",
          items: [
            "$ solana --version",
            { cmd: "solana balance", label: "Check" },
          ],
        },
        {
          type: "concept_model",
          heading: "Parts",
          items: [
            {
              key: "vault",
              title: "Vault",
              kind: "token_account",
              pubkey: "9xQe…",
              properties: { balance: 0, frozen: false },
              inactive: "true",
            },
            { name: "Fee payer", node_type: "Signer" },
          ],
          edges: [{ source: "Fee payer", target: "vault", verb: "pays for" }],
        },
        {
          type: "step_flow",
          items: [
            {
              name: "Pay rent",
              cmd: "$ solana transfer <VAULT> 0.002",
              outcome: "The vault is rent-exempt.",
              stateChanges: ["update vault.balance: 0.002"],
              citations: ["/docs/core/fees"],
            },
          ],
        },
      ),
    );
    expect(visual.intro).toEqual({
      title: "Rent",
      body: "Accounts hold a deposit.",
      bullets: ["Rent-exempt", "42"],
    });
    expect(visual.callouts[0]).toMatchObject({ tone: "warning" });
    expect(visual.commandLists[0]!.commands).toEqual([
      { command: "solana --version" },
      { command: "solana balance", description: "Check" },
    ]);
    const [vault, payer] = visual.model!.nodes;
    expect(vault).toMatchObject({
      id: "vault",
      name: "Vault",
      archetype: "token-account",
      tone: "green",
      address: "9xQe…",
      fields: [
        { key: "balance", value: "0" },
        { key: "frozen", value: "false" },
      ],
      closed: true,
    });
    // `name` doubles as the id, as the agent's renderer always read it.
    expect(payer).toMatchObject({ id: "Fee payer", archetype: "signer" });
    expect(visual.model!.relationships[0]).toMatchObject({
      from: "Fee payer",
      to: "vault",
      kind: null,
      label: "pays for",
      fromName: "Fee payer",
      toName: "Vault",
    });
    const step = visual.flow!.steps[0]!;
    expect(step).toMatchObject({
      n: 1,
      title: "Pay rent",
      command: "solana transfer <VAULT> 0.002",
      result: "The vault is rent-exempt.",
      links: [
        {
          title: "/developers/docs/core/fees",
          href: "/developers/docs/core/fees",
        },
      ],
      touches: ["vault"],
    });
    expect(step.effects[0]).toMatchObject({
      action: "update",
      nodeId: "vault",
      field: "balance",
      value: "0.002",
      previous: "0",
      label: "Vault balance: 0 → 0.002",
    });
  });

  it("guesses an archetype from the node's words, or leaves it unset", () => {
    const visual = normalizeAskVisual(
      ui({
        type: "concept_model",
        nodes: [
          { id: "ata", label: "Associated token account" },
          { id: "m", label: "USDC mint" },
          { id: "x", label: "Oracle feed" },
        ],
      }),
    );
    expect(
      visual.model!.nodes.map((node) => [node.archetype, node.tone]),
    ).toEqual([
      ["token-account", "green"],
      ["mint-account", "purple"],
      [null, "neutral"],
    ]);
  });

  it("keeps node ids unique", () => {
    const visual = normalizeAskVisual(
      ui({
        type: "concept_model",
        nodes: [
          { id: "a", label: "One" },
          { id: "a", label: "Two" },
          { label: "Three" },
          {},
        ],
      }),
    );
    expect(visual.model!.nodes.map((node) => node.id)).toEqual([
      "a",
      "a-2",
      "three",
      "node",
    ]);
  });
});

describe("effects", () => {
  it("parses the text forms", () => {
    expect(parseEffectText("connect wallet -> holder: owns")).toEqual({
      action: "connect",
      nodeId: "wallet",
      toNodeId: "holder",
      detail: "owns",
      kind: "owns",
    });
    expect(parseEffectText("update mint.supply: 100")).toEqual({
      action: "update",
      nodeId: "mint",
      field: "supply",
      value: "100",
    });
    expect(parseEffectText("Reveal mint: initialized")).toEqual({
      action: "reveal",
      nodeId: "mint",
      detail: "initialized",
    });
    expect(parseEffectText("close holder")).toEqual({
      action: "close",
      nodeId: "holder",
    });
    expect(parseEffectText("The mint is created")).toEqual({
      action: null,
      detail: "The mint is created",
    });
  });

  it("ties text effects to model nodes by name and words them readably", () => {
    const visual = normalizeAskVisual(
      ui(
        {
          type: "concept_model",
          nodes: [
            { id: "wallet", label: "Wallet" },
            { id: "mint", label: "Mint account", fields: { supply: 0 } },
            { id: "holder-token", label: "Token account" },
          ],
        },
        {
          type: "step_flow",
          steps: [
            {
              title: "Create the account",
              effects: [
                "connect Wallet -> Token account: owns",
                "connect holder token -> mint: mints-to",
              ],
            },
            {
              title: "Mint",
              effects: ["update Mint.supply: 100", "the wallet is happy"],
            },
            { title: "Close", effects: ["close token account"] },
          ],
        },
      ),
    );
    const [create, mint] = visual.flow!.steps;
    // A trailing close step reads as an extra.
    const [close] = visual.flow!.optional;
    expect(create!.effects.map((effect) => effect.label)).toEqual([
      "Wallet owns Token account",
      "Token account mints to Mint account",
    ]);
    expect(create!.touches).toEqual(["wallet", "holder-token", "mint"]);
    // Connect effects add the relationships the model didn't draw.
    expect(
      visual.model!.relationships.map((item) => [item.id, item.label]),
    ).toEqual([
      ["wallet>holder-token", "owns"],
      ["holder-token>mint", "mints to"],
    ]);
    expect(create!.connects).toEqual([
      "wallet>holder-token",
      "holder-token>mint",
    ]);
    expect(mint!.effects.map((effect) => effect.label)).toEqual([
      "Mint account supply: 0 → 100",
      "The wallet is happy",
    ]);
    // Prose effects touch the nodes they name.
    expect(mint!.touches).toEqual(["mint", "wallet"]);
    expect(close!.effects[0]!.label).toBe("Token account closed");
  });

  it("doesn't duplicate a relationship the model already draws", () => {
    const visual = normalizeAskVisual(createTokenGenerativeUiFixture);
    expect(visual.model!.relationships).toEqual([
      {
        id: "token-account>mint",
        from: "token-account",
        to: "mint",
        fromName: "Token account",
        toName: "Mint account",
        kind: "reads",
        label: "references",
      },
    ]);
    expect(visual.flow!.steps[1]!.effects.map((e) => e.label)).toEqual([
      "Token account exists for your wallet and mint",
      "Token account references the mint",
    ]);
  });

  it("falls back to the step's words when no step has effects", () => {
    const visual = normalizeAskVisual(
      ui(
        {
          type: "concept_model",
          nodes: [
            { id: "mint", label: "Mint account" },
            { id: "holder", label: "Token account" },
          ],
          relationships: [{ from: "holder", to: "mint", kind: "reads" }],
        },
        {
          type: "step_flow",
          steps: [
            { title: "Create the mint" },
            { title: "Create a token account for the mint" },
          ],
        },
      ),
    );
    expect(visual.flow!.steps.map((step) => step.touches)).toEqual([
      ["mint"],
      ["mint", "holder"],
    ]);
    expect(visual.flow!.steps[1]!.connects).toEqual(["holder>mint"]);
  });

  it("works out the model after each step", () => {
    const visual = normalizeAskVisual(tokenLifecycleGenerativeUiFixture);
    const { model, flow } = visual;
    const at = (id: string | null) => modelStateAtStep(model!, flow, id);

    expect(at(null).get("mint")!.fields).toEqual([
      { key: "supply", value: "0", changed: false },
      { key: "authority", value: "wallet", changed: false },
    ]);
    const minted = at("step-5");
    expect(minted.get("mint")!.fields).toContainEqual({
      key: "supply",
      value: "100",
      changed: true,
    });
    // Earlier steps applied, not marked.
    expect(minted.get("mint")!.fields).toContainEqual({
      key: "state",
      value: "initialized",
      changed: false,
    });
    expect(minted.get("wallet")!.fields).toContainEqual({
      key: "cluster",
      value: "devnet",
      changed: false,
    });
    expect(minted.get("holder-token")!.closed).toBe(false);
    // The optional close applies after every main step.
    const closed = at("step-6");
    expect(closed.get("holder-token")!.closed).toBe(true);
    expect(closed.get("holder-token")!.fields).toContainEqual({
      key: "balance",
      value: "100",
      changed: false,
    });
    expect(at("missing").get("mint")!.fields[0]!.value).toBe("0");
  });
});

describe("setup and optional steps", () => {
  const flow = (...steps: Record<string, unknown>[]) =>
    stepTitles(normalizeAskVisual(ui({ type: "step_flow", steps })));

  it("splits the token lifecycle into setup, steps and extras", () => {
    expect(
      stepTitles(normalizeAskVisual(tokenLifecycleGenerativeUiFixture)),
    ).toEqual({
      setup: ["Select devnet", "Fund wallet"],
      steps: ["Create the mint", "Create the token account", "Mint supply"],
      optional: ["Close the empty account"],
    });
  });

  it("numbers each group from 1", () => {
    const visual = normalizeAskVisual(tokenLifecycleGenerativeUiFixture);
    expect(visual.flow!.setup.map((step) => step.n)).toEqual([1, 2]);
    expect(visual.flow!.steps.map((step) => step.n)).toEqual([1, 2, 3]);
    expect(visual.flow!.optional.map((step) => step.n)).toEqual([1]);
  });

  it("honours flags and roles anywhere", () => {
    expect(
      flow(
        { title: "Build" },
        { title: "Install", role: "Prerequisite" },
        { title: "Deploy" },
        { title: "Verify", is_optional: "yes" },
        { title: "Test", advanced: true },
      ),
    ).toEqual({
      setup: ["Install"],
      steps: ["Build", "Deploy"],
      optional: ["Verify", "Test"],
    });
  });

  it("guesses setup only for a leading run and extras only for a trailing run", () => {
    expect(
      flow(
        {
          title: "Point the CLI at devnet",
          command: "solana config set --url devnet",
        },
        { title: "Get SOL", command: "solana airdrop 2" },
        { title: "Create the mint" },
        { title: "Burn a few tokens" },
        { title: "Mint more" },
        { title: "Close the account" },
      ),
    ).toEqual({
      setup: ["Point the CLI at devnet", "Get SOL"],
      steps: ["Create the mint", "Burn a few tokens", "Mint more"],
      optional: ["Close the account"],
    });
  });

  it("never guesses away every main step", () => {
    expect(
      flow({ title: "Empty the account" }, { title: "Close the account" }),
    ).toEqual({
      setup: [],
      steps: ["Empty the account", "Close the account"],
      optional: [],
    });
    expect(flow({ title: "Close the account" })).toEqual({
      setup: [],
      steps: ["Close the account"],
      optional: [],
    });
    expect(
      flow(
        { title: "Airdrop", setup: true },
        { title: "Extra", optional: true },
      ),
    ).toEqual({
      setup: ["Airdrop"],
      steps: ["Extra"],
      optional: [],
    });
  });
});

describe("caps", () => {
  const many = (count: number, make: (i: number) => unknown) =>
    Array.from({ length: count }, (_, i) => make(i));

  it("caps nodes, fields, relationships, steps, effects, links and commands", () => {
    const visual = normalizeAskVisual(
      ui(
        {
          type: "concept_model",
          nodes: many(20, (i) => ({
            id: `n${i}`,
            label: `Node ${i}`,
            fields: many(10, (j) => ({ label: `f${j}`, value: j })),
          })),
          relationships: many(12, (i) => ({ from: "n0", to: `n${i + 1}` })),
        },
        {
          type: "step_flow",
          steps: many(15, (i) => ({
            title: `Step ${i}`,
            effects: many(6, (j) => `update n${j}.f0: ${i}`),
            links: many(10, (j) => `/developers/docs/page-${j}`),
          })),
        },
        {
          type: "command_list",
          commands: many(20, (i) => `echo ${i}`),
        },
        { type: "answer_intro", bullets: many(12, (i) => `Point ${i}`) },
      ),
    );
    expect(visual.model!.nodes).toHaveLength(12);
    expect(visual.model!.nodes[0]!.fields).toHaveLength(8);
    expect(visual.model!.relationships).toHaveLength(8);
    expect(visual.flow!.steps).toHaveLength(12);
    expect(visual.flow!.steps[0]!.effects).toHaveLength(4);
    expect(visual.flow!.steps[0]!.links).toHaveLength(8);
    expect(visual.commandLists[0]!.commands).toHaveLength(12);
    expect(visual.intro!.bullets).toHaveLength(8);
  });
});

describe("safeHref", () => {
  it.each([
    ["/developers/docs/core/accounts", "/developers/docs/core/accounts"],
    ["/docs/core/accounts", "/developers/docs/core/accounts"],
    ["/docs", "/developers/docs"],
    ["/docs#fees", "/developers/docs#fees"],
    ["/en/docs/tokens", "/developers/docs/tokens"],
    ["/ja/docs/tokens", "/ja/developers/docs/tokens"],
    ["/docsify", "/docsify"],
    ["https://solana.com/docs/core/fees", "/developers/docs/core/fees"],
    ["https://www.solana.com", "/"],
    ["https://www.anchor-lang.com/docs", "https://www.anchor-lang.com/docs"],
    ["http://localhost:3000/x", "http://localhost:3000/x"],
  ])("keeps %s as %s", (input, expected) => {
    expect(safeHref(input)).toBe(expected);
  });

  it.each([
    "javascript:alert(1)",
    "JAVASCRIPT:alert(1)",
    "data:text/html,<p>hi</p>",
    "mailto:hello@solana.org",
    "//evil.example",
    "/\\evil.example",
    "relative/path",
    "",
    "   ",
    42,
    null,
  ])("rejects %s", (input) => {
    expect(safeHref(input)).toBeNull();
  });
});

describe("resolveNodeId", () => {
  const { model } = normalizeAskVisual(
    ui({
      type: "concept_model",
      nodes: [
        { id: "mint", label: "Mint account" },
        { id: "holder-token", label: "Token account" },
      ],
    }),
  );
  const nodes = model!.nodes;

  it.each([
    ["mint", "mint"],
    ["Mint account", "mint"],
    ["holder token", "holder-token"],
    ["the token account", "holder-token"],
    ["minter", null],
    ["ab", null],
    [undefined, null],
  ])("%s → %s", (ref, expected) => {
    expect(resolveNodeId(ref, nodes)).toBe(expected);
  });
});

describe("tones", () => {
  it("colours each archetype and relationship kind by what it is", () => {
    const tones = Object.fromEntries(
      Object.entries(ASK_NODE_ARCHETYPES).map(([key, { tone }]) => [key, tone]),
    );
    expect(tones).toEqual({
      wallet: "green",
      signer: "green",
      "mint-account": "purple",
      "token-account": "green",
      pda: "purple",
      program: "blue",
      instruction: "blue",
      transaction: "blue",
      "rpc-node": "amber",
      validator: "amber",
    });
    expect(ASK_RELATIONSHIP_TONES).toEqual({
      owns: "purple",
      initializes: "purple",
      derives: "purple",
      signs: "green",
      "mints-to": "green",
      "transfers-to": "green",
      invokes: "blue",
      writes: "blue",
      reads: "blue",
    });
  });
});
