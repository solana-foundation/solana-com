import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  pdaDerivationGenerativeUiFixture,
  tokenLifecycleGenerativeUiFixture,
} from "@solana-com/ui-chrome/ask-solana/fixtures";
import en from "../../../../../../packages/i18n/messages/web/en/common.json";
import {
  askStore,
  resetAskStoreForTests,
  type AskAssistantMessage,
  type AskState,
} from "@/lib/docs/ask/store";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ prefetch: vi.fn() }),
}));

const { AskActions } = await import("@/components/docs/ask/ask-actions.client");
const { AskSources } = await import("@/components/docs/ask/ask-sources.client");
const { AskError, AskStopped } =
  await import("@/components/docs/ask/ask-error.client");
const { AskFollowups } =
  await import("@/components/docs/ask/ask-followups.client");
const { AskFullAnswer } =
  await import("@/components/docs/ask/ask-markdown.client");
const { AssistantMessage } =
  await import("@/components/docs/ask/ask-message.client");
const { textDirection } = await import("@/components/docs/ask/ui");

function withIntl(element: ReactElement) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {element}
    </NextIntlClientProvider>
  );
}

let ids = 0;
function message(
  overrides: Partial<AskAssistantMessage> = {},
): AskAssistantMessage {
  return {
    id: `a${++ids}`,
    role: "assistant",
    state: "done",
    text: "A mint account defines a token.",
    citations: [],
    codeFollowups: null,
    runId: "101",
    ...overrides,
  };
}

/** Stands in for the store's state (messages, draft, chip). */
function withState(patch: Partial<AskState>) {
  const state = { ...askStore.getState(), ...patch };
  vi.spyOn(askStore, "getState").mockReturnValue(state);
}

const writeText = vi.fn(async () => {});

beforeEach(() => {
  document.documentElement.lang = "en";
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  writeText.mockClear();
  resetAskStoreForTests();
});

describe("AskActions", () => {
  it("asks Helpful? with Yes / No, toned by the choice, and thanks", () => {
    const rate = vi.spyOn(askStore, "rate").mockImplementation(() => {});
    const answer = message();
    const { rerender } = render(
      withIntl(<AskActions message={answer} copyText="x" />),
    );
    const group = screen.getByRole("group", { name: "Helpful?" });
    expect(within(group).getByRole("status").textContent).toBe("Helpful?");
    const yes = within(group).getByRole("button", { name: "Yes" });
    fireEvent.click(yes);
    expect(rate).toHaveBeenCalledWith(answer.id, "up");

    rerender(
      withIntl(
        <AskActions message={{ ...answer, rating: "up" }} copyText="x" />,
      ),
    );
    expect(yes).toHaveAttribute("aria-pressed", "true");
    expect(yes.firstElementChild!.className).toContain("--tone-green");
    // The reader's own choice pops.
    expect(yes.firstElementChild!.className).toContain("zoom-in-50");
    expect(within(group).getByRole("status").textContent).toBe(
      "Thanks for the feedback.",
    );

    rerender(
      withIntl(
        <AskActions message={{ ...answer, rating: "down" }} copyText="x" />,
      ),
    );
    const no = within(group).getByRole("button", { name: "No" });
    expect(no).toHaveAttribute("aria-pressed", "true");
    expect(no.firstElementChild!.className).toContain("--tone-amber");
    expect(yes).toHaveAttribute("aria-pressed", "false");
  });

  it("doesn't pop a rating restored with the thread", () => {
    render(
      withIntl(<AskActions message={message({ rating: "up" })} copyText="x" />),
    );
    const yes = screen.getByRole("button", { name: "Yes" });
    expect(yes.firstElementChild!.className).not.toContain("zoom-in-50");
  });

  it("hides feedback without a run id; copies and asks again", async () => {
    const retry = vi.spyOn(askStore, "retry").mockImplementation(() => {});
    const answer = message({ runId: null });
    render(withIntl(<AskActions message={answer} copyText="The answer" />));
    expect(screen.queryByRole("group", { name: "Helpful?" })).toBeNull();
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Copy answer" })),
    );
    expect(writeText).toHaveBeenCalledWith("The answer");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ask again" }));
    expect(retry).toHaveBeenCalledWith(answer.id);
  });

  it("shows on the latest answer; older ones wait for hover or focus", () => {
    const { container, rerender } = render(
      withIntl(<AskActions message={message()} copyText="x" latest />),
    );
    const row = container.firstElementChild!;
    expect(row.className).not.toContain("opacity-0");
    // The latest answer's row fades in once it completes.
    expect(row.className).toContain("animate-in");

    const older = message();
    rerender(
      withIntl(<AskActions message={older} copyText="x" latest={false} />),
    );
    const hidden = container.firstElementChild!;
    expect(hidden.className).toContain("opacity-0");
    expect(hidden.className).toContain("group-hover/turn:opacity-100");
    expect(hidden.className).toContain("[@media(hover:none)]:opacity-100");
    expect(hidden.className).not.toContain("animate-in");
  });

  it("fades in only the first time an answer shows", () => {
    const answer = message();
    const first = render(
      withIntl(<AskActions message={answer} copyText="x" />),
    );
    expect(first.container.firstElementChild!.className).toContain(
      "animate-in",
    );
    first.unmount();
    // Docked to full screen remounts the thread: no second entrance.
    const again = render(
      withIntl(<AskActions message={answer} copyText="x" />),
    );
    expect(again.container.firstElementChild!.className).not.toContain(
      "animate-in",
    );
  });

  it("doesn't fade in an answer restored as it was", () => {
    const { container } = render(
      withIntl(<AskActions message={message()} copyText="x" animate={false} />),
    );
    expect(container.firstElementChild!.className).not.toContain("animate-in");
  });
});

describe("AskSources", () => {
  const citations = [
    {
      title: "Mint accounts",
      url: "/developers/docs/tokens/basics/create-mint",
    },
    { title: "Anza docs", url: "https://docs.anza.xyz/cli" },
  ];

  it("lists pages with a docs icon tile, title and another site's host, unnumbered", () => {
    render(withIntl(<AskSources citations={citations} />));
    const nav = screen.getByRole("navigation", { name: "Sources" });
    const [docs, external] = within(nav).getAllByRole("link");
    expect(docs).toHaveAttribute(
      "href",
      "/developers/docs/tokens/basics/create-mint",
    );
    expect(docs!.textContent).toBe("Mint accounts");
    expect(docs).toHaveAttribute("title", "Mint accounts");
    expect(docs!.querySelector("svg")!.parentElement!.className).toContain(
      "--sol-icon-tile",
    );
    expect(external!.textContent).toBe("Anza docsdocs.anza.xyz");
    expect(external).toHaveAttribute("target", "_blank");
  });

  it("leaves out a host the title already says", () => {
    render(
      withIntl(
        <AskSources
          citations={[
            {
              title: "Agave on github.com",
              url: "https://github.com/anza-xyz/agave",
            },
          ]}
        />,
      ),
    );
    expect(screen.getByRole("link").textContent).toBe("Agave on github.com");
  });

  it("folds older answers' sources into Sources (n)", () => {
    const { container } = render(
      withIntl(<AskSources citations={citations} latest={false} />),
    );
    const details = container.querySelector("details")!;
    expect(details).not.toHaveAttribute("open");
    expect(details.querySelector("summary")!.textContent).toBe("Sources (2)");
  });

  it("renders nothing without citations", () => {
    const { container } = render(withIntl(<AskSources citations={[]} />));
    expect(container.innerHTML).toBe("");
  });
});

describe("AskError", () => {
  it("is a red line with Try again on the latest turn", () => {
    const retry = vi.spyOn(askStore, "retry").mockImplementation(() => {});
    render(
      withIntl(
        <AskError kind="generic" messageId="a1" latest hasPartial={false} />,
      ),
    );
    // In <bdi>: an English line keeps its full stop in an Arabic answer.
    const text = screen.getByText("The answer didn’t load.", {
      selector: "p > bdi",
    });
    expect(
      text.closest("p")!.parentElement!.parentElement!.className,
    ).toContain("--sol-red");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledWith("a1");
  });

  it("is a muted line for a wait, not a red one", () => {
    render(
      withIntl(
        <AskError
          kind="rateLimited"
          messageId="a1"
          latest
          hasPartial={false}
        />,
      ),
    );
    const row = screen
      .getByText(en.docsAsk.errors.rateLimited, { selector: "p > bdi" })
      .closest("p")!.parentElement!.parentElement!;
    expect(row.className).toContain("--sol-muted");
    expect(row.className).not.toContain("--sol-red");
  });

  it("says the answer stopped when part of it arrived", () => {
    render(
      withIntl(<AskError kind="generic" messageId="a1" latest hasPartial />),
    );
    expect(
      screen.getByText("The answer stopped before it finished.", {
        selector: "p > bdi",
      }),
    ).toBeInTheDocument();
  });

  it("says a timeout mid-answer stopped it, in a line, not a box", () => {
    const { container } = render(
      withIntl(
        <AskError kind="unavailable" messageId="a1" latest hasPartial />,
      ),
    );
    expect(
      screen.getByText("The answer stopped before it finished.", {
        selector: "p > bdi",
      }),
    ).toBeInTheDocument();
    expect(container.firstElementChild!.className).not.toContain("rounded-xl");
  });

  it("boxes only service and network failures", () => {
    const { container } = render(
      withIntl(<AskError kind="offline" messageId="a1" latest />),
    );
    expect(container.firstElementChild!.className).toContain("rounded-xl");
    expect(screen.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  it("offers New chat when the conversation is full", () => {
    const reset = vi.spyOn(askStore, "reset").mockImplementation(() => {});
    render(
      withIntl(<AskError kind="conversationFull" messageId="a1" latest />),
    );
    fireEvent.click(screen.getByRole("button", { name: "New chat" }));
    expect(reset).toHaveBeenCalled();
  });

  it("puts a rate-limited question back in the composer, with no button", () => {
    const setDraft = vi
      .spyOn(askStore, "setComposerDraft")
      .mockImplementation(() => {});
    const setPage = vi
      .spyOn(askStore, "setPageContext")
      .mockImplementation(() => {});
    const page = { title: "Accounts", url: "https://solana.com/docs/a" };
    withState({
      composerDraft: "",
      pageContext: null,
      messages: [
        { id: "u9", role: "user", text: "What is rent?", pageContext: page },
        message({ id: "a9", state: "error", error: "rateLimited", text: "" }),
      ],
    });
    render(withIntl(<AskError kind="rateLimited" messageId="a9" />));
    expect(screen.queryByRole("button")).toBeNull();
    expect(setDraft).toHaveBeenCalledWith("What is rent?");
    expect(setPage).toHaveBeenCalledWith(page);
  });

  it("puts a refused code question back as it was sent", () => {
    const setDraft = vi
      .spyOn(askStore, "setComposerDraft")
      .mockImplementation(() => {});
    withState({
      composerDraft: "",
      messages: [
        {
          id: "u7",
          role: "user",
          text: "Explain this code from Keypairs:\n\n```\nx\n```",
          sent: "Explain this code:\n\n```\nx\n```",
        },
        message({ id: "a7", state: "error", error: "rateLimited", text: "" }),
      ],
    });
    render(withIntl(<AskError kind="rateLimited" messageId="a7" />));
    expect(screen.queryByRole("button")).toBeNull();
    // What was sent goes back: a code ask without the page title.
    expect(setDraft).toHaveBeenCalledWith("Explain this code:\n\n```\nx\n```");
  });

  it("leaves a draft the reader already started", () => {
    const setDraft = vi
      .spyOn(askStore, "setComposerDraft")
      .mockImplementation(() => {});
    withState({
      composerDraft: "Something else",
      messages: [
        { id: "u8", role: "user", text: "What is rent?" },
        message({ id: "a8", state: "error", error: "rateLimited" }),
      ],
    });
    render(withIntl(<AskError kind="rateLimited" messageId="a8" />));
    expect(setDraft).not.toHaveBeenCalled();
  });

  it("collapses older failures to a dim line", () => {
    render(withIntl(<AskError kind="generic" messageId="a1" latest={false} />));
    expect(
      screen.getByText("Didn’t finish.", { selector: "p > bdi" }).parentElement!
        .className,
    ).toContain("--sol-dim");
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("AskStopped", () => {
  it("reads Stopped · Ask again", () => {
    const retry = vi.spyOn(askStore, "retry").mockImplementation(() => {});
    render(withIntl(<AskStopped messageId="a3" />));
    expect(
      screen.getByText("Stopped", { selector: "p > bdi" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ask again" }));
    expect(retry).toHaveBeenCalledWith("a3");
  });
});

describe("AskFollowups", () => {
  it("puts the prompt and its pills on one row", () => {
    const send = vi
      .spyOn(askStore, "send")
      .mockImplementation(() => ({ ok: true, queued: false }));
    render(
      withIntl(
        <AskFollowups
          prompt="Want to see this in code?"
          followups={{
            prompt: "Want to see this in code?",
            buttons: [
              {
                type: "show_code",
                label: "Rust",
                language: "rust",
                message: "Show me the code in Rust.",
              },
            ],
          }}
        />,
      ),
    );
    const row = screen.getByRole("group", {
      name: "Want to see this in code?",
    });
    expect(row.className).toContain("flex-wrap");
    const pill = within(row).getByRole("button", { name: "Rust" });
    expect(pill.className).toContain("hover:text-[var(--sol-purple-text)]");
    fireEvent.click(pill);
    expect(send).toHaveBeenCalledWith("Show me the code in Rust.", {
      pageContext: null,
    });
  });
});

describe("AskFullAnswer", () => {
  it("folds the in-depth part under a docs accordion row", async () => {
    render(
      withIntl(
        <AskFullAnswer
          messageId="f1"
          text="It stores `decimals`."
          streaming={false}
        />,
      ),
    );
    const row = screen.getByRole("button", { name: "Full answer" });
    expect(row).toHaveAttribute("aria-expanded", "false");
    expect(row.className).toContain("rounded-xl");
    expect(screen.queryByText("decimals")).toBeNull();
    await act(async () => fireEvent.click(row));
    expect(
      screen.getByRole("button", { name: "Hide full answer" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("decimals")).toBeInTheDocument();
  });

  it("calls a stopped or failed answer's rest partial", async () => {
    render(
      withIntl(
        <AskFullAnswer
          messageId="f2"
          text="It stores"
          streaming={false}
          partial
        />,
      ),
    );
    const row = screen.getByRole("button", { name: "Partial answer" });
    await act(async () => fireEvent.click(row));
    expect(
      screen.getByRole("button", { name: "Hide partial answer" }),
    ).toBeInTheDocument();
  });
});

describe("AssistantMessage", () => {
  it("puts an older answer's folded sources and actions on one row", () => {
    const answer = message({
      citations: [{ title: "Accounts", url: "/docs/core/accounts" }],
    });
    const { rerender } = render(
      withIntl(<AssistantMessage message={answer} latest fullscreen={false} />),
    );
    const nav = () => screen.getByRole("navigation", { name: "Sources" });
    const actions = () =>
      screen.getByRole("button", { name: "Ask again" }).closest(".flex-wrap")!;
    expect(nav().className).toContain("mt-6");
    expect(nav().parentElement).toBe(actions().parentElement);

    rerender(
      withIntl(
        <AssistantMessage message={answer} latest={false} fullscreen={false} />,
      ),
    );
    // No blank band of hidden actions under the folded list.
    const row = nav().parentElement!;
    expect(row.className).toContain("justify-between");
    expect(row).toContainElement(actions() as HTMLElement);
    expect(nav().className).toContain("mt-0");
    expect(actions().className).toContain("mt-0");
    expect(actions().className).toContain("opacity-0");
  });
});

describe("AssistantMessage folding", () => {
  const fullAnswer = () =>
    screen.queryByRole("button", { name: "Full answer" });
  const twoBlocks = "```ts\nconst a = 1;\n```\n\n```ts\nconst b = 2;\n```";
  const sectioned = (inDepth: string) =>
    `### Summary response\nA mint defines a token.\n\n### Indepth response\n${inDepth}`;

  it("folds a GLM answer's in-depth part, the bold labels hidden", () => {
    render(
      withIntl(
        <AssistantMessage
          message={message({
            text: `**Summary response:**\nA mint defines a token.\n\n**In-depth response:**\nIt stores:\n\n${twoBlocks}`,
          })}
          latest
          fullscreen={false}
        />,
      ),
    );
    expect(screen.getByText("A mint defines a token.")).toBeInTheDocument();
    expect(fullAnswer()).toBeInTheDocument();
    expect(screen.queryByText("const a = 1;")).toBeNull();
    expect(document.body.textContent).not.toContain("response:");
  });

  it("reads a short in-depth part inline, after the summary", () => {
    render(
      withIntl(
        <AssistantMessage
          message={message({ text: sectioned("It stores decimals.") })}
          latest
          fullscreen={false}
        />,
      ),
    );
    expect(fullAnswer()).toBeNull();
    expect(screen.getByText("It stores decimals.")).toBeInTheDocument();
  });

  it("folds a long in-depth part, and the in-depth part while it streams", () => {
    const { rerender } = render(
      withIntl(
        <AssistantMessage
          message={message({
            id: "s1",
            state: "streaming",
            text: sectioned("It stores"),
          })}
          latest
          fullscreen={false}
        />,
      ),
    );
    expect(fullAnswer()).toBeInTheDocument();
    expect(screen.queryByText("It stores")).toBeNull();
    rerender(
      withIntl(
        <AssistantMessage
          message={message({
            id: "s1",
            text: sectioned(`It stores:\n\n${twoBlocks}`),
          })}
          latest
          fullscreen={false}
        />,
      ),
    );
    expect(fullAnswer()).toBeInTheDocument();
    expect(screen.queryByText("It stores:")).toBeNull();
  });

  it("folds a shorter in-depth part beside a visual, as Bri's panel does", () => {
    const inDepth = "It stores decimals and the mint authority. ".repeat(16);
    const text = sectioned(inDepth.trim());
    const { rerender } = render(
      withIntl(
        <AssistantMessage
          message={message({ text })}
          latest
          fullscreen={false}
        />,
      ),
    );
    expect(fullAnswer()).toBeNull();
    rerender(
      withIntl(
        <AssistantMessage
          message={message({ text, ui: tokenLifecycleGenerativeUiFixture })}
          latest
          fullscreen={false}
        />,
      ),
    );
    expect(fullAnswer()).toBeInTheDocument();
  });

  it("keeps the status row above a visual that arrives before the text", () => {
    const { container } = render(
      withIntl(
        <AssistantMessage
          message={message({
            state: "streaming",
            status: "writing",
            text: "",
            ui: pdaDerivationGenerativeUiFixture,
          })}
          latest
          fullscreen={false}
        />,
      ),
    );
    const status = screen.getByText(en.docsAsk.status.writing);
    const visual = container.querySelector("[data-ask-visual]")!;
    expect(visual).not.toBeNull();
    expect(
      status.compareDocumentPosition(visual) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("folds a long answer without headings after its opening paragraph", () => {
    const opening =
      `A PDA is an address without a private key. ${"Programs derive it from seeds. ".repeat(6)}`.trim();
    render(
      withIntl(
        <AssistantMessage
          message={message({ text: `${opening}\n\n${twoBlocks}` })}
          latest
          fullscreen={false}
        />,
      ),
    );
    expect(screen.getByText(opening)).toBeInTheDocument();
    expect(fullAnswer()).toBeInTheDocument();
    expect(screen.queryByText("const a = 1;")).toBeNull();
  });
});

describe("AssistantMessage thinking words", () => {
  const words: string[] = en.docsAsk.status.thinking;
  const shownWord = () =>
    [...document.querySelectorAll('span[aria-hidden="true"]')]
      .map((span) => span.textContent ?? "")
      .find((text) => words.includes(text));

  afterEach(() => {
    vi.useRealTimers();
  });

  it("are Solana words only, none about money or trading", () => {
    expect(words).toHaveLength(25);
    expect(words).toContain("Alpenglowing…");
    for (const word of [
      "HODLing…",
      "Aping in…",
      "Yield-farming…",
      "Proof-of-historying…",
    ])
      expect(words).not.toContain(word);
  });

  it("rotate at every stage until the answer's text starts, the stage kept for screen readers", () => {
    vi.useFakeTimers();
    const streaming = (patch: Partial<AskAssistantMessage>) =>
      withIntl(
        <AssistantMessage
          message={message({
            id: "a-thinking",
            state: "streaming",
            text: "",
            ...patch,
          })}
          latest
          fullscreen={false}
        />,
      );
    const { rerender } = render(streaming({ status: "searching" }));
    const first = shownWord();
    expect(first).toBeDefined();
    expect(screen.getByText(en.docsAsk.status.searching)).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2600));
    const second = shownWord();
    expect(second).toBeDefined();
    expect(second).not.toBe(first);

    // Drawing a diagram is still before the text: the words go on.
    rerender(streaming({ status: "visual" }));
    expect(shownWord()).toBeDefined();
    expect(screen.getByText(en.docsAsk.status.visual)).toBeInTheDocument();

    // The first words of the answer end them.
    rerender(streaming({ status: "writing", text: "A mint account" }));
    expect(shownWord()).toBeUndefined();
    expect(screen.getByText("A mint account")).toBeInTheDocument();
  });

  it("hold still with reduced motion", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(
      withIntl(
        <AssistantMessage
          message={message({ state: "pending", status: "preparing", text: "" })}
          latest
          fullscreen={false}
        />,
      ),
    );
    const first = shownWord();
    act(() => vi.advanceTimersByTime(10_000));
    expect(shownWord()).toBe(first);
    vi.unstubAllGlobals();
  });
});

describe("AssistantMessage tail", () => {
  const codeFollowups = {
    prompt: "Do you want to see a code example for that?",
    buttons: [
      {
        type: "show_code",
        label: "TypeScript",
        language: "typescript",
        message: "Show me the code in TypeScript.",
      },
    ],
  };

  it("shows the code follow-ups on the latest answer only", () => {
    const answer = message({ codeFollowups });
    const { rerender } = render(
      withIntl(<AssistantMessage message={answer} latest fullscreen={false} />),
    );
    expect(
      screen.getByRole("group", { name: codeFollowups.prompt }),
    ).toBeInTheDocument();
    rerender(
      withIntl(
        <AssistantMessage message={answer} latest={false} fullscreen={false} />,
      ),
    );
    expect(
      screen.queryByRole("group", { name: codeFollowups.prompt }),
    ).toBeNull();
  });

  it("says answers can be wrong once, under the actions of the answer that carries it", () => {
    const disclaimer =
      "Answers can be wrong. Check them against the linked pages.";
    const { rerender } = render(
      withIntl(
        <AssistantMessage message={message()} latest fullscreen={false} />,
      ),
    );
    expect(screen.queryByText(disclaimer)).toBeNull();
    rerender(
      withIntl(
        <AssistantMessage
          message={message()}
          latest

          disclaimer
          fullscreen={false}
        />,
      ),
    );
    const line = screen.getByText(disclaimer).closest("p")!;
    expect(line.className).toContain("text-[12px]");
    expect(line.className).toContain("text-[var(--sol-dim)]");
    const actions = screen
      .getByRole("button", { name: "Ask again" })
      .closest(".flex-wrap")!;
    expect(
      actions.compareDocumentPosition(line) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // Not while the answer is on its way.
    rerender(
      withIntl(
        <AssistantMessage
          message={message({ state: "streaming" })}
          latest

          disclaimer
          fullscreen={false}
        />,
      ),
    );
    expect(screen.queryByText(disclaimer)).toBeNull();
  });
});

describe("textDirection", () => {
  it("reads the first letter, as dir=auto would", () => {
    expect(textDirection("A mint account defines a token.")).toBe("ltr");
    expect(textDirection("حساب السك يعرّف الرمز.")).toBe("rtl");
    // Digits and punctuation don't decide; no letters at all is ltr.
    expect(textDirection("1. «حساب» first")).toBe("rtl");
    expect(textDirection("123 …")).toBe("ltr");
  });
});
