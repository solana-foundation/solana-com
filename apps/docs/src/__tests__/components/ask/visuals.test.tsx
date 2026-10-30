import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  AskGenerativeUi,
  AskGenerativeUiComponent,
} from "@solana-com/ui-chrome/ask-solana/api";
import {
  commonVisualGenerativeUiFixtures,
  tokenLifecycleGenerativeUiFixture,
} from "@solana-com/ui-chrome/ask-solana/fixtures";
import en from "../../../../../../packages/i18n/messages/web/en/common.json";
// Bri's create-token sample, which the package does not export.
import { createTokenGenerativeUiFixture } from "../../../../../../packages/ui-chrome/src/ask-solana/create-token-generative-ui.fixture";
import { AskVisual } from "@/components/docs/ask/visuals/ask-visual.client";

// DocsLink prefetches through the app router, which tests don't mount.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ prefetch: vi.fn() }),
}));

function ui(...components: AskGenerativeUiComponent[]): AskGenerativeUi {
  return { version: "solana-docs-ui/v1", kind: "answer", components };
}

function withIntl(element: ReactElement) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {element}
    </NextIntlClientProvider>
  );
}

function markup(visual: AskGenerativeUi, props = {}) {
  return renderToStaticMarkup(withIntl(<AskVisual ui={visual} {...props} />));
}

function renderVisual(visual: AskGenerativeUi) {
  return render(withIntl(<AskVisual ui={visual} />));
}

const allFixtures = [
  ...commonVisualGenerativeUiFixtures,
  { name: "create token", ui: createTokenGenerativeUiFixture },
];

describe("AskVisual markup", () => {
  it.each(allFixtures.map((f) => [f.name, f.ui] as const))(
    "%s: one merged diagram with the model and the steps",
    (_name, fixture) => {
      const html = markup(fixture);
      expect(html).toContain('data-ask-visual=""');
      expect(html).toContain("[container-type:inline-size]");
      expect(html.match(/<section/g)).toHaveLength(1);
      expect(html).toContain(">Diagram<");
      expect(html).toContain("data-archetype=");
      for (const component of fixture.components) {
        if (component.type !== "step_flow") continue;
        for (const step of component.steps as Array<{ title: string }>) {
          expect(html).toContain(step.title);
        }
      }
      // No simulated execution, mascot or decoration; the Solana gradient
      // only as the step rail's hairline.
      expect(html).not.toMatch(/Execute|Replay|Vector|glow|shimmer/i);
      expect(html.match(/gradient/g)?.length ?? 0).toBe(
        html.match(/data-rail=""/g)?.length ?? 0,
      );
    },
  );

  it("renders setup as a checklist and the cleanup step as an extra", () => {
    const html = markup(tokenLifecycleGenerativeUiFixture);
    expect(html).toContain("Before you start");
    expect(html).toContain("Select devnet");
    expect(html).toContain("Fund wallet");
    expect(html).toContain("Lifecycle flow");
    expect(html).toContain("Create the mint");
    expect(html).toContain("Create the token account");
    expect(html).toContain("Mint supply");
    expect(html).toContain("More you can do (1)");
    expect(html).toContain("Close the empty account");
    expect(html).toContain('data-archetype="mint-account"');
    expect(html).toContain('data-archetype="token-account"');
  });

  it("renders every archetype from concept_model nodes", () => {
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
    const html = markup(
      ui({
        type: "concept_model",
        title: "Network model",
        nodes: labels.map(([archetype, label]) => ({
          id: archetype,
          archetype,
          label,
          fields: [{ label: "role", value: label }],
        })),
        relationships: [{ from: "wallet", to: "transaction", kind: "signs" }],
      }),
    );
    for (const [archetype, label] of labels) {
      expect(html).toContain(label);
      expect(html).toContain(`data-archetype="${archetype}"`);
    }
    expect(html).toContain("How they connect");
    expect(html).toContain(">signs<");
    expect(html).toContain("Network model");
  });

  it("tints each card and link by kind, and drops a type the name says", () => {
    const { container } = renderVisual(
      ui({
        type: "concept_model",
        nodes: [
          { id: "p", archetype: "program", label: "Token Program" },
          { id: "s", archetype: "signer", label: "Mint authority" },
          { id: "r", archetype: "rpc-node", label: "Helius" },
          { id: "x", label: "Oracle feed", address: "9xQeWvG816bUx9EP" },
        ],
        relationships: [
          { from: "s", to: "p", kind: "signs" },
          { from: "p", to: "x", kind: "reads" },
          { from: "x", to: "r", label: "pays" },
        ],
      }),
    );
    const card = (id: string) =>
      container.querySelector<HTMLElement>(`[data-node="${id}"]`)!;
    expect(card("p").className).toContain("[--tone:var(--tone-blue)]");
    expect(card("s").className).toContain("[--tone:var(--tone-green)]");
    expect(card("r").className).toContain("[--tone:var(--tone-amber)]");
    // The tone shows as the docs' chip mark, not a coloured top rule; a
    // part of no known kind has none.
    expect(card("p").className).not.toContain("border-t-");
    expect(card("p").querySelector(".rotate-45")).not.toBeNull();
    expect(card("x").querySelector(".rotate-45")).toBeNull();
    // A breath of the tone on the head, none for an unknown kind.
    const tint = "bg-[color-mix(in_oklab,var(--tone-soft)_55%,transparent)]";
    expect(card("p").firstElementChild).toHaveClass(tint);
    expect(card("x").firstElementChild).not.toHaveClass(tint);
    expect(within(card("p")).queryByText("program")).toBeNull();
    expect(within(card("s")).getByText("signer")).toBeInTheDocument();
    expect(within(card("r")).getByText("RPC node")).toBeInTheDocument();
    expect(within(card("x")).getByText("address")).toBeInTheDocument();
    expect(within(card("x")).getByTitle("9xQeWvG816bUx9EP")).toHaveClass(
      "truncate",
    );
    const link = (id: string) =>
      container.querySelector<HTMLElement>(`[data-relationship="${id}"]`)!;
    expect(link("s>p").className).toContain("[--tone:var(--tone-green)]");
    expect(link("p>x").className).toContain("[--tone:var(--tone-blue)]");
    expect(link("x>r").className).toContain("[--tone:var(--sol-muted)]");
  });

  it.each([
    [1, [], []],
    [
      2,
      ["[@container_(min-width:22rem)]:grid-cols-2"],
      ["[@container_(min-width:36rem)]:grid-cols-3"],
    ],
    [
      3,
      ["[@container_(min-width:36rem)]:grid-cols-3"],
      ["[@container_(min-width:22rem)]:grid-cols-2"],
    ],
    [
      4,
      ["[@container_(min-width:22rem)]:grid-cols-2"],
      ["[@container_(min-width:36rem)]:grid-cols-3"],
    ],
    [
      6,
      [
        "[@container_(min-width:22rem)]:grid-cols-2",
        "[@container_(min-width:36rem)]:grid-cols-3",
      ],
      [],
    ],
  ])("lays out %i cards without a lone last card", (count, has, hasNot) => {
    const { container } = renderVisual(
      ui({
        type: "concept_model",
        nodes: Array.from({ length: count }, (_, i) => ({ label: `N${i}` })),
      }),
    );
    const grid = container.querySelector("[data-node]")!.parentElement!;
    for (const name of has) expect(grid).toHaveClass(name);
    for (const name of hasNot) expect(grid).not.toHaveClass(name);
  });

  it("sets the panel's palette again on its root", () => {
    const html = markup(createTokenGenerativeUiFixture);
    expect(html).toContain("[--tone-purple:var(--sol-purple-text)]");
    expect(html).toContain("dark:[--tone-blue:#82aaff]");
  });

  it("reads in the direction of its own text, not the page's", () => {
    expect(markup(createTokenGenerativeUiFixture)).toMatch(
      /data-ask-visual="" data-dir="ltr" dir="ltr"/,
    );
    const arabic = markup(
      ui({ type: "step_flow", title: "إنشاء رمز", steps: [{ title: "ابدأ" }] }),
    );
    expect(arabic).toMatch(/data-dir="rtl" dir="rtl"/);
  });

  it("ignores the retired heavyweight components", () => {
    const html = markup(
      ui(
        {
          type: "answer_intro",
          title: "Visible answer",
          body: "The compact renderer keeps this content.",
        },
        {
          type: "code_tabs",
          title: "Hidden code tabs",
          tabs: [{ label: "Hidden tab", code: "const hidden = true;" }],
        },
        {
          type: "cards",
          title: "Hidden cards",
          cards: [{ title: "Hidden card" }],
        },
        {
          type: "definition_grid",
          definitions: [{ term: "Hidden term", definition: "Hidden value" }],
        },
        {
          type: "comparison",
          rows: [{ label: "Hidden row", values: ["A", "B"] }],
        },
        {
          type: "source_links",
          links: [{ title: "Hidden source", url: "/docs/hidden" }],
        },
      ),
    );
    expect(html).toContain("Visible answer");
    expect(html).not.toMatch(/Hidden|const hidden/);
  });

  it("renders nothing when no block has content", () => {
    expect(markup(ui({ type: "cards", cards: [] }))).toBe("");
  });

  it("keeps the agent's block order", () => {
    const html = markup(
      ui(
        { type: "callout", tone: "warning", body: "First" },
        { type: "command_list", commands: ["whoami"] },
        { type: "callout", body: "Third" },
      ),
    );
    expect(html.indexOf("First")).toBeLessThan(html.indexOf("whoami"));
    expect(html.indexOf("whoami")).toBeLessThan(html.indexOf("Third"));
  });

  it("wraps commands between words, never inside a flag", () => {
    const html = markup(
      ui({
        type: "command_list",
        commands: ["spl-token create-token --program-2022 <MINT>"],
      }),
    );
    const word =
      /<span class="inline-block[^"]*">(.*?)<\/span>(?=\s|<\/code>)/g;
    const words = [...html.matchAll(word)].map((match) =>
      match[1]!.replace(/<[^>]+>/g, ""),
    );
    expect(words).toEqual([
      "spl-token",
      "create-token",
      "--program-2022",
      "&lt;MINT&gt;",
    ]);
    expect(html).toMatch(/text-\[var\(--sol-purple-text\)\]">&lt;MINT&gt;/);
  });

  it("draws a standalone model and a standalone flow in their own frames", () => {
    const model = markup(
      ui({ type: "concept_model", nodes: [{ id: "a", label: "Alpha" }] }),
    );
    expect(model).toContain(">Diagram<");
    expect(model).toContain(">Accounts and programs<");
    const flow = markup(
      ui({ type: "step_flow", title: "Deploy", steps: [{ title: "Build" }] }),
    );
    expect(flow).toContain(">Steps<");
    expect(flow).toContain(">Deploy<");
    expect(flow).not.toContain("aria-pressed");
  });
});

describe("intro and paragraphs", () => {
  const intro = ui({
    type: "answer_intro",
    title: "Token lifecycle",
    body: "Create a token by creating a mint account, then minting supply.",
  });

  it("shows the intro only when the answer has no summary", () => {
    expect(markup(intro)).toContain("Token lifecycle");
    expect(markup(intro, { summary: "Tokens live in accounts." })).toBe("");
  });

  it("waits for the stream to finish", () => {
    expect(markup(intro, { streaming: true })).toBe("");
  });

  it("gives the merged diagram one paragraph, and none under a summary", () => {
    const modelBody = "The mint is the token definition.";
    const flowBody = "These commands create the mint";
    const html = markup(createTokenGenerativeUiFixture);
    expect(html).toContain(modelBody);
    expect(html).not.toContain(flowBody);
    const summarized = markup(createTokenGenerativeUiFixture, {
      summary: "Create the mint, then a token account, then mint supply.",
    });
    expect(summarized).not.toContain(modelBody);
    expect(summarized).not.toContain(flowBody);
    expect(summarized).not.toContain("Create a token in three parts");
  });

  it("keeps a standalone flow's paragraph when there's no summary", () => {
    const flow = ui({
      type: "step_flow",
      body: "Two commands.",
      steps: [{ title: "Build" }],
    });
    expect(markup(flow)).toContain("Two commands.");
    expect(markup(flow, { summary: "Build it." })).not.toContain(
      "Two commands.",
    );
  });
});

describe("steps", () => {
  it("folds the result into the step's paragraph, without labels", () => {
    renderVisual(createTokenGenerativeUiFixture);
    expect(
      screen.getByText(
        "Use Token-2022 for the new mint. The command returns the mint address used by later steps. Save the mint address from the command output.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Result")).toBeNull();
    // Step links sit in the meta row without the "Docs" label.
    expect(
      screen.getAllByRole("link", { name: "Token quickstart" }).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText("Docs")).toBeNull();
  });

  it("uses the result as the paragraph when there's no body, once", () => {
    const html = markup(
      ui({
        type: "step_flow",
        steps: [
          { title: "One", result: "It works" },
          { title: "Two", body: "Run it. It works.", result: "It works." },
        ],
      }),
    );
    expect(html).toContain(">It works<");
    expect(html).toContain(">Run it. It works.<");
  });

  it("opens what changes under the meta row, each with its mark", () => {
    const { container } = renderVisual(createTokenGenerativeUiFixture);
    const toggles = screen.getAllByRole("button", { name: "What changes" });
    const toggle = toggles[1]!;
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const list = container.querySelector(
      `#${CSS.escape(toggle.getAttribute("aria-controls")!)}`,
    )!;
    expect(
      [...list.querySelectorAll("[data-effect]")].map((item) => [
        item.getAttribute("data-effect"),
        item.firstElementChild!.textContent,
      ]),
    ).toEqual([
      ["reveal", "+"],
      ["connect", "→"],
    ]);
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("numbers each step in the tone of the card it changes; the rail runs purple to green", () => {
    const { container } = renderVisual(createTokenGenerativeUiFixture);
    const steps = [...container.querySelectorAll<HTMLElement>("ol > li")];
    // Create the mint (purple), create your token account (green), mint
    // the supply (the mint first: purple). No colour per position.
    expect(steps.map((step) => step.dataset.tone)).toEqual([
      "purple",
      "green",
      "purple",
    ]);
    expect(steps[1]!.className).toContain("[--tone:var(--tone-green)]");
    for (const step of steps) {
      expect(step.style.getPropertyValue("--step")).toBe("");
      const circle = step.querySelector("span")!;
      expect(circle.className).toContain("text-[var(--tone)]");
      expect(circle.className).toContain("bg-[var(--tone-soft)]");
    }
    // The title lights in the same tone.
    expect(
      screen.getByRole("button", { name: "Create your token account" })
        .className,
    ).toContain("hover:text-[var(--tone)]");
    expect(
      steps.map((step) => step.style.getPropertyValue("--rail-from")),
    ).toEqual([
      "var(--tone-purple)",
      expect.stringContaining("color-mix(in oklab, var(--tone-green) 50%"),
      "var(--tone-green)",
    ]);
    expect(container.querySelectorAll("[data-rail]")).toHaveLength(2);
  });
});

describe("step tones", () => {
  const tones = (visual: AskGenerativeUi) =>
    [
      ...renderVisual(visual).container.querySelectorAll<HTMLElement>(
        "li[data-tone]",
      ),
    ].map((step) => step.dataset.tone);

  it("follow the kind of card each step acts on", () => {
    const signing = commonVisualGenerativeUiFixtures.find(
      (fixture) => fixture.name === "transaction signing",
    )!;
    // Instructions (blue), the signer (green), the RPC node (amber).
    expect(tones(signing.ui)).toEqual(["blue", "green", "amber"]);
  });

  it("tone the optional steps' titles too", () => {
    const { container } = renderVisual(tokenLifecycleGenerativeUiFixture);
    // Closing the token account: green, as the account's card.
    const extra = container.querySelector<HTMLElement>('[data-step="step-6"]')!;
    expect(extra.className).toContain("[--tone:var(--tone-green)]");
  });

  it("stay purple without a model to point at", () => {
    expect(
      tones(
        ui({
          type: "step_flow",
          title: "Deploy",
          steps: [{ title: "Build" }, { title: "Ship" }],
        }),
      ),
    ).toEqual(["purple", "purple"]);
  });
});

describe("callouts and commands", () => {
  it("labels note and warning callouts", () => {
    renderVisual(
      ui(
        { type: "callout", body: "Plain note" },
        { type: "callout", tone: "warning", title: "Careful", body: "Body" },
      ),
    );
    const notes = screen.getAllByRole("note");
    expect(notes.map((note) => note.getAttribute("aria-label"))).toEqual([
      "Note",
      "Warning",
    ]);
    expect(within(notes[1]!).getByText("Careful")).toBeInTheDocument();
  });

  it("copies a command without its prompt", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    renderVisual(
      ui({
        type: "command_list",
        commands: [
          { command: "$ spl-token create-account <MINT>", note: "Holds it" },
        ],
      }),
    );
    expect(screen.getByText("<MINT>")).toHaveClass(
      "text-[var(--sol-purple-text)]",
    );
    expect(screen.getByText("Holds it")).toBeInTheDocument();
    expect(screen.getByText("$")).toHaveClass("text-[#15803d]");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy command" }));
    });
    expect(writeText).toHaveBeenCalledWith("spl-token create-account <MINT>");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });

  it("shows a line of code without the shell prompt", () => {
    renderVisual(
      ui({
        type: "command_list",
        commands: [
          { command: "rpc.getBalance(address).send()" },
          { command: "solana balance <ADDRESS>" },
        ],
      }),
    );
    expect(screen.getAllByText("$")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Copy code" })).toHaveLength(
      1,
    );
    expect(
      screen.getAllByRole("button", { name: "Copy command" }),
    ).toHaveLength(1);
  });

  it("labels multi-line code as code", () => {
    renderVisual(
      ui({
        type: "command_list",
        commands: [{ code: "const a = 1;\na + 1;" }],
      }),
    );
    expect(screen.getByRole("button", { name: "Copy code" })).toBeVisible();
  });
});

describe("links", () => {
  it("rewrites old docs paths and opens other sites in a tab", () => {
    renderVisual(
      ui({
        type: "step_flow",
        steps: [
          {
            title: "Read up",
            sources: [
              { title: "Accounts", url: "/docs/core/accounts" },
              { title: "Anchor", url: "https://www.anchor-lang.com/docs" },
              { title: "Bad", url: "javascript:alert(1)" },
            ],
          },
        ],
      }),
    );
    expect(screen.getByRole("link", { name: "Accounts" })).toHaveAttribute(
      "href",
      "/developers/docs/core/accounts",
    );
    const anchor = screen.getByRole("link", { name: "Anchor" });
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noreferrer");
    expect(screen.queryByText("Bad")).toBeNull();
  });
});

describe("merged diagram", () => {
  afterEach(() => vi.useRealTimers());

  const node = (container: HTMLElement, id: string) =>
    container.querySelector<HTMLElement>(`[data-node="${id}"]`)!;
  const step = (container: HTMLElement, id: string) =>
    container.querySelector<HTMLElement>(`[data-step="${id}"]`)!;

  it("highlights what a hovered step touches and shows its result", () => {
    const { container } = renderVisual(tokenLifecycleGenerativeUiFixture);
    expect(container.querySelector("[data-touched]")).toBeNull();

    fireEvent.mouseEnter(step(container, "step-5"));
    expect(node(container, "mint")).toHaveAttribute("data-touched", "true");
    expect(node(container, "holder-token")).toHaveAttribute("data-touched");
    expect(node(container, "wallet")).not.toHaveAttribute("data-touched");
    expect(node(container, "wallet")).toHaveClass("opacity-70");
    const changed = node(container, "mint").querySelector("[data-changed]");
    expect(changed).toHaveTextContent("100");
    // Keys on the tint use muted, not dim (AA).
    expect(node(container, "mint").querySelector("dt")!.className).toContain(
      "text-[var(--sol-muted)]",
    );

    fireEvent.mouseLeave(step(container, "step-5"));
    expect(container.querySelector("[data-touched]")).toBeNull();
    expect(node(container, "wallet")).not.toHaveClass("opacity-70");
  });

  it("highlights the relationships a step creates", () => {
    const { container } = renderVisual(tokenLifecycleGenerativeUiFixture);
    fireEvent.mouseEnter(step(container, "step-4"));
    const linked = container.querySelector(
      '[data-relationship="wallet>holder-token"]',
    );
    expect(linked).not.toHaveClass("opacity-70");
    fireEvent.mouseEnter(step(container, "step-3"));
    expect(linked).toHaveClass("opacity-70");
  });

  it("marks a closed node when the cleanup step is in view", () => {
    const { container } = renderVisual(tokenLifecycleGenerativeUiFixture);
    fireEvent.mouseEnter(step(container, "step-6"));
    const holder = node(container, "holder-token");
    expect(holder).toHaveClass("border-dashed");
    expect(within(holder).getByText("Closed")).toBeInTheDocument();
  });

  it("ignores the mouseenter a tap sends", () => {
    const { container } = renderVisual(tokenLifecycleGenerativeUiFixture);
    const target = step(container, "step-5");
    // jsdom has no PointerEvent: React's pointerenter comes from pointerover.
    const pointerOver = (pointerType: string) => {
      const event = new MouseEvent("pointerover", { bubbles: true });
      Object.defineProperty(event, "pointerType", { value: pointerType });
      fireEvent(target, event);
    };
    pointerOver("touch");
    fireEvent.mouseEnter(target);
    expect(container.querySelector("[data-touched]")).toBeNull();
    // A mouse after the finger hovers again.
    pointerOver("mouse");
    fireEvent.mouseEnter(target);
    expect(node(container, "mint")).toHaveAttribute("data-touched");
  });

  it("follows keyboard focus and pins a step on click", () => {
    const { container } = renderVisual(tokenLifecycleGenerativeUiFixture);
    const title = screen.getByRole("button", {
      name: "Create the token account",
    });
    expect(title).toHaveAttribute("aria-pressed", "false");

    fireEvent.focus(title);
    expect(node(container, "holder-token")).toHaveAttribute("data-touched");
    fireEvent.blur(title);
    expect(container.querySelector("[data-touched]")).toBeNull();

    fireEvent.click(title);
    expect(title).toHaveAttribute("aria-pressed", "true");
    expect(node(container, "holder-token")).toHaveAttribute("data-touched");
    // Hover elsewhere wins while it lasts, then the pinned step returns.
    fireEvent.mouseEnter(step(container, "step-3"));
    expect(node(container, "holder-token")).not.toHaveAttribute("data-touched");
    fireEvent.mouseLeave(step(container, "step-3"));
    expect(node(container, "holder-token")).toHaveAttribute("data-touched");
    fireEvent.click(title);
    expect(title).toHaveAttribute("aria-pressed", "false");
    expect(container.querySelector("[data-touched]")).toBeNull();
  });
});

describe("entrance", () => {
  it("animates a visual that arrives while its answer streams, once", () => {
    const visual = structuredClone(createTokenGenerativeUiFixture);
    const first = render(withIntl(<AskVisual ui={visual} streaming />));
    const root = first.container.querySelector("[data-ask-visual]")!;
    expect(root).toHaveClass("motion-safe:animate-in");
    const cards = first.container.querySelectorAll<HTMLElement>("[data-node]");
    expect(
      [...cards].map((card) => card.style.getPropertyValue("--enter-delay")),
    ).toEqual(["100ms", "150ms"]);
    const steps = first.container.querySelectorAll<HTMLElement>("ol > li");
    expect(steps[0]!.style.getPropertyValue("--enter-delay")).toBe("200ms");
    expect(first.container.querySelector("[data-rail]")).toHaveClass(
      "motion-safe:[@starting-style]:scale-y-0",
    );
    first.unmount();

    // Re-mounted (full screen, a new layout): drawn as it is.
    const again = render(withIntl(<AskVisual ui={visual} streaming />));
    expect(again.container.querySelector("[data-ask-visual]")).not.toHaveClass(
      "motion-safe:animate-in",
    );
    expect(again.container.querySelector("[data-rail]")).not.toHaveClass(
      "motion-safe:[@starting-style]:scale-y-0",
    );
  });

  it("doesn't animate a finished answer's visual", () => {
    const { container } = renderVisual(
      structuredClone(createTokenGenerativeUiFixture),
    );
    expect(container.querySelector("[data-ask-visual]")).not.toHaveClass(
      "motion-safe:animate-in",
    );
    expect(container.querySelector("[style*='--enter-delay']")).toBeNull();
  });
});
