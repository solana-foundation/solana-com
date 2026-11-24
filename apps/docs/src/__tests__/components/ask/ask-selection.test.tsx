import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearAskSession } from "@solana-com/ui-chrome/ask-solana/api";
import en from "../../../../../../packages/i18n/messages/web/en/common.json";
import { askStore, resetAskStoreForTests } from "@/lib/docs/ask/store";

let pathname = "/developers/docs/core/accounts";
vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ prefetch: vi.fn() }),
}));
vi.mock("fumadocs-core/highlight/client", () => ({
  useShiki: (code: string) => <pre className="shiki">{code}</pre>,
}));

const { AskAi } = await import("@/components/docs/ask/ask-ai.client");

const sse = (name: string, data: unknown) =>
  `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;

let fetchMock: ReturnType<typeof vi.fn>;
const chatBodies = () =>
  fetchMock.mock.calls
    .filter(([url]) => String(url).endsWith("/chat"))
    .map(([, init]) => JSON.parse(String((init as RequestInit).body)));

const html = document.documentElement;
const ACCOUNTS_URL = "https://solana.com/developers/docs/core/accounts";
const PROSE = "Rent is a deposit that keeps an account alive.";
/** Bri's client sends only the message: the quote's page goes in it. */
const ON_ACCOUNTS = "\n\n(Asked on the docs page “Accounts”.)";

/**
 * A docs page: the header, the sidebar, and the article content (a
 * paragraph, a Rust code block, the pagination nav and a field).
 */
function docsPage() {
  document.body.innerHTML = `
    <header class="dh"><a href="/developers">Solana developers</a></header>
    <aside id="sidebar"><a href="/a">Accounts in the sidebar</a></aside>
    <div id="content-area" data-docs-ask-selection="">
      <div id="content" data-page-title="Accounts" data-page-href="/developers/docs/core/accounts">
        <p id="prose">${PROSE}</p>
        <pre data-language="rust"><code id="code">let rent = 1;
let lamports = rent * 2;</code></pre>
      </div>
      <nav id="pagination"><a href="/b">Next: Transactions</a></nav>
      <input id="field" value="Typed in a field" />
      <p contenteditable="true" id="editable">Edited by hand</p>
    </div>`;
}

function renderAsk() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <AskAi />
    </NextIntlClientProvider>,
    { container },
  );
}

/** Selects `start` to `end` of the text in `id` (or of two elements). */
function select(id: string, start: number, end: number, endId = id) {
  const from = document.getElementById(id)!.firstChild!;
  const to = document.getElementById(endId)!.firstChild!;
  document.getSelection()!.setBaseAndExtent(from, start, to, end);
}

/** A pointer event (jsdom has no PointerEvent). */
function pointer(
  type: "pointerdown" | "pointerup",
  target: Element,
  pointerType = "mouse",
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
  });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
}

/** A mouse drag over `id`: the pill waits for the button to come up. */
async function dragSelect(id: string, start: number, end: number) {
  const el = document.getElementById(id)!;
  pointer("pointerdown", el);
  select(id, start, end);
  await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
  pointer("pointerup", el);
}

/** Named exactly so: the code blocks' button is "Ask AI about this code". */
const pill = () => screen.queryByRole("button", { name: "Ask AI about this" });
/** Long enough for a touch or keyboard selection to settle (400ms). */
const settle = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 550)));

beforeEach(() => {
  resetAskStoreForTests();
  clearAskSession();
  localStorage.clear();
  sessionStorage.clear();
  html.removeAttribute("data-ask");
  html.style.removeProperty("--ask-w");
  html.lang = "en";
  pathname = "/developers/docs/core/accounts";
  Object.defineProperty(window, "innerWidth", {
    value: 1440,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", {
    value: 768,
    configurable: true,
  });
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: window.innerWidth >= Number(/(\d+)px/.exec(query)?.[1] ?? 1e9),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  fetchMock = vi.fn(async (url: string) => {
    if (url.endsWith("/session"))
      return Response.json({ session_token: "mock-token" });
    if (url.endsWith("/chat"))
      return new Response(
        sse("delta", { text: "### Summary response\nA deposit." }) +
          sse("done", { run_id: 1, conversation_id: 2 }),
        { headers: { "content-type": "text/event-stream" } },
      );
    return new Response(null, { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn(async () => {}), readText: vi.fn() },
    configurable: true,
  });
  // jsdom lays nothing out: every selection is one line at (100, 300).
  Object.defineProperty(Range.prototype, "getClientRects", {
    value: () => [
      { left: 100, top: 300, width: 200, height: 20, right: 300, bottom: 320 },
    ],
    configurable: true,
  });
  docsPage();
});

afterEach(() => {
  delete (Range.prototype as Partial<Range>).getClientRects;
  vi.unstubAllGlobals();
  document.getSelection()?.removeAllRanges();
  resetAskStoreForTests();
});

describe("Ask AI about this", () => {
  it("shows a pill by a mouse selection once the button is up, without taking focus", async () => {
    renderAsk();
    const prose = document.getElementById("prose")!;
    pointer("pointerdown", prose);
    select("prose", 0, 14);
    await settle();
    // Mid-drag: nothing yet.
    expect(pill()).toBeNull();
    pointer("pointerup", prose);
    await waitFor(() => expect(pill()).not.toBeNull());
    const button = pill()!;
    // "Ask AI about this", then the launcher's white ✨.
    expect(button.textContent).toBe("Ask AI about this✨");
    expect(button.querySelector('[aria-hidden="true"]')!.className).toContain(
      "brightness-0 invert",
    );
    expect(button.className).toContain("bg-[var(--sol-cta)]");
    expect(document.activeElement).toBe(document.body);
    // Centred above the selection's first line.
    const box = button.parentElement!;
    expect(box.style.getPropertyValue("--ask-sel-x")).toBe("200px");
    expect(box.style.getPropertyValue("--ask-sel-y")).toBe("292px");
  });

  it("shows for a keyboard selection once it holds still, and goes when it collapses", async () => {
    renderAsk();
    select("prose", 0, 4);
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
    select("prose", 0, 10);
    await act(() => new Promise((resolve) => setTimeout(resolve, 200)));
    expect(pill()).toBeNull();
    await settle();
    expect(pill()).not.toBeNull();
    act(() => document.getSelection()!.collapseToEnd());
    await waitFor(() => expect(pill()).toBeNull());
  });

  it("goes under a touch selection, clear of the OS menu", async () => {
    renderAsk();
    pointer("pointerdown", document.getElementById("prose")!, "touch");
    select("prose", 0, 14);
    await settle();
    const box = pill()!.parentElement!;
    // 28px under the line's bottom (320).
    expect(box.style.getPropertyValue("--ask-sel-y")).toBe("348px");
  });

  it("goes above a touch selection with no room under it, off the selection", async () => {
    // The selected line (300 to 320) sits at the bottom of the screen.
    Object.defineProperty(window, "innerHeight", {
      value: 340,
      configurable: true,
    });
    renderAsk();
    pointer("pointerdown", document.getElementById("prose")!, "touch");
    select("prose", 0, 14);
    await settle();
    const box = pill()!.parentElement!;
    expect(box.style.getPropertyValue("--ask-sel-y")).toBe("292px");
  });

  it("is not offered outside the article, in its nav or fields, across its edge, or for one character", async () => {
    renderAsk();
    const cases: Array<() => void> = [
      () => select("prose", 3, 4),
      () => {
        // From the article into its pagination.
        const text = document.getElementById("prose")!.firstChild!;
        const link = document.querySelector("#pagination a")!.firstChild!;
        document.getSelection()!.setBaseAndExtent(text, 4, link, 7);
      },
      () => {
        const link = document.querySelector("#pagination a")!.firstChild!;
        document.getSelection()!.setBaseAndExtent(link, 0, link, 10);
      },
      () => {
        const link = document.querySelector("#sidebar a")!.firstChild!;
        document.getSelection()!.setBaseAndExtent(link, 0, link, 8);
      },
      () => {
        const link = document.querySelector(".dh a")!.firstChild!;
        document.getSelection()!.setBaseAndExtent(link, 0, link, 8);
      },
      () => {
        // From the sidebar into the article.
        const link = document.querySelector("#sidebar a")!.firstChild!;
        const text = document.getElementById("prose")!.firstChild!;
        document.getSelection()!.setBaseAndExtent(link, 0, text, 10);
      },
      () => select("editable", 0, 6),
      () => {
        const field = document.getElementById("field") as HTMLInputElement;
        field.focus();
        field.setSelectionRange(0, 8);
        select("prose", 0, 10);
      },
      () => select("prose", 0, 0),
    ];
    for (const choose of cases) {
      act(() => document.getSelection()!.removeAllRanges());
      act(choose);
      await settle();
      expect(pill()).toBeNull();
      (document.activeElement as HTMLElement | null)?.blur();
    }
    // Nine selections, each waiting out the 400ms settle.
  }, 20_000);

  it("is not offered for text in the Ask panel, or in full screen", async () => {
    renderAsk();
    await act(async () => askStore.open());
    const body = screen.getByText(/Answers draw on the Solana docs/);
    act(() =>
      document
        .getSelection()!
        .setBaseAndExtent(body.firstChild!, 0, body.firstChild!, 20),
    );
    await settle();
    expect(pill()).toBeNull();

    select("prose", 0, 14);
    await settle();
    expect(pill()).not.toBeNull();
    await act(async () => askStore.setFullscreen(true));
    expect(pill()).toBeNull();
    // Closed here, so the dialog's late focus return lands in this test.
    await act(async () => askStore.close());
    await act(() => new Promise((resolve) => setTimeout(resolve, 20)));
  });

  it("goes on Esc, keeping the selection, and on navigation", async () => {
    const { rerender } = renderAsk();
    await dragSelect("prose", 0, 14);
    await waitFor(() => expect(pill()).not.toBeNull());
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });
    expect(pill()).toBeNull();
    expect(document.getSelection()!.toString()).toBe("Rent is a depo");
    await settle();
    expect(pill()).toBeNull();

    // A click away, then the same text again (a double-click on the same
    // word): it shows again.
    act(() => document.getSelection()!.collapseToEnd());
    await settle();
    await dragSelect("prose", 0, 14);
    await waitFor(() => expect(pill()).not.toBeNull());

    await dragSelect("prose", 0, 20);
    await waitFor(() => expect(pill()).not.toBeNull());
    pathname = "/developers/docs/core/transactions";
    rerender(
      <NextIntlClientProvider locale="en" messages={en}>
        <AskAi />
      </NextIntlClientProvider>,
    );
    expect(pill()).toBeNull();
  });

  it("opens Ask AI with the selection as a quote: focused, unsent, and the clipboard untouched", async () => {
    const execCommand = vi.fn(() => true);
    Object.defineProperty(document, "execCommand", {
      value: execCommand,
      configurable: true,
    });
    const clipboardEvents: string[] = [];
    const onClipboard = (event: Event) => clipboardEvents.push(event.type);
    document.addEventListener("copy", onClipboard, true);
    document.addEventListener("cut", onClipboard, true);
    renderAsk();
    askStore.setComposerDraft("Why does it matter?");
    await dragSelect("prose", 0, PROSE.length);
    await waitFor(() => expect(pill()).not.toBeNull());

    // Pressing the pill keeps the page's selection for the click.
    const press = pointer("pointerdown", pill()!);
    expect(press.defaultPrevented).toBe(true);
    expect(document.getSelection()!.toString()).toBe(PROSE);
    await act(async () => pill()!.click());

    const panel = screen.getByRole("complementary", { name: "Ask AI" });
    const card = within(panel).getByText(PROSE);
    expect(card.textContent).toBe(`Selected text: ${PROSE}`);
    expect(card.getAttribute("dir")).toBe("auto");
    // The draft stays, with the caret in it; nothing is sent.
    const composer = document.querySelector<HTMLTextAreaElement>(
      "[data-ask-composer]",
    )!;
    expect(composer.value).toBe("Why does it matter?");
    expect(document.activeElement).toBe(composer);
    expect(chatBodies()).toHaveLength(0);
    // The selection is cleared, so the pill goes.
    expect(document.getSelection()!.toString()).toBe("");
    expect(pill()).toBeNull();
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(navigator.clipboard.readText).not.toHaveBeenCalled();
    expect(execCommand).not.toHaveBeenCalled();
    expect(clipboardEvents).toEqual([]);
    document.removeEventListener("copy", onClipboard, true);
    document.removeEventListener("cut", onClipboard, true);
  });

  it("keeps a code block's selection as code, with its language", async () => {
    renderAsk();
    await dragSelect("code", 4, 30);
    await waitFor(() => expect(pill()).not.toBeNull());
    await act(async () => pill()!.click());
    expect(askStore.getState().composerQuote).toEqual({
      text: "rent = 1;\nlet lamports = r",
      code: true,
      language: "rust",
      pageContext: { title: "Accounts", url: ACCOUNTS_URL },
    });
    const panel = screen.getByRole("complementary", { name: "Ask AI" });
    const card = within(panel).getByText(/rent = 1;/);
    expect(card.className).toContain("--sol-font-mono");
    expect(card.getAttribute("dir")).toBe("ltr");
  });

  it("keeps code as code when the drag runs past the block over only its UI", async () => {
    // A runnable example (its Run bar under it), then the next step.
    document
      .getElementById("content")!
      .insertAdjacentHTML(
        "beforeend",
        '<div class="code-block" data-language="ts"><pre data-language="ts"><code><span class="line" id="l1">const a = 1;</span>\n<span class="line" id="l2">  send(a);</span></code></pre></div>\n' +
          '<div class="sol-run"><div class="sol-run-bar"><button type="button" id="run">Run</button><span>Output from a local network</span></div></div>\n' +
          '<div class="steps"><div class="step"><div data-component-part="step-number"><div>1</div></div><div class="step-body"><p id="step">Lamports hold the balance.</p></div></div></div>',
      );
    renderAsk();
    const line = document.getElementById("l2")!.firstChild!;
    const step = document.getElementById("step")!;
    const ends: Array<[Node, number]> = [
      // Released on the Run button.
      [document.getElementById("run")!.firstChild!, 3],
      // Released at the start of the next step (its number is selected).
      [step, 0],
    ];
    for (const [node, offset] of ends) {
      pointer("pointerdown", step);
      act(() =>
        document.getSelection()!.setBaseAndExtent(line, 0, node, offset),
      );
      pointer("pointerup", step);
      await waitFor(() => expect(pill()).not.toBeNull());
      await act(async () => pill()!.click());
      // Verbatim and fenced, without "Run" or the step's "1".
      expect(askStore.getState().composerQuote).toEqual({
        text: "  send(a);",
        code: true,
        language: "ts",
        pageContext: { title: "Accounts", url: ACCOUNTS_URL },
      });
      await act(async () => askStore.setComposerQuote(null));
    }

    // On into the step's words: prose.
    pointer("pointerdown", step);
    act(() =>
      document.getSelection()!.setBaseAndExtent(line, 0, step.firstChild!, 8),
    );
    pointer("pointerup", step);
    await waitFor(() => expect(pill()).not.toBeNull());
    await act(async () => pill()!.click());
    const quote = askStore.getState().composerQuote!;
    expect(quote.code).toBeUndefined();
    expect(quote.text).toMatch(/^send\(a\);.*Lamports$/s);
  });

  it("puts the caret at the end of the draft", async () => {
    renderAsk();
    await act(async () => askStore.open());
    await act(async () =>
      askStore.setComposerDraft("Why does this matter here?"),
    );
    const field = document.querySelector<HTMLTextAreaElement>(
      "[data-ask-composer]",
    )!;
    // The reader last fixed a word near the start.
    field.setSelectionRange(4, 4);
    field.blur();
    await dragSelect("prose", 0, 14);
    await waitFor(() => expect(pill()).not.toBeNull());
    await act(async () => pill()!.click());
    expect(document.activeElement).toBe(field);
    expect([field.selectionStart, field.selectionEnd]).toEqual([26, 26]);
  });
});

describe("the quote in the composer and the bubble", () => {
  const composer = () =>
    document.querySelector<HTMLTextAreaElement>("[data-ask-composer]")!;
  const send = () => screen.getByRole("button", { name: "Send" });

  it("sends with no question as “Explain this”, then shows the quote in the bubble under its page", async () => {
    renderAsk();
    await act(async () => askStore.open({ selection: { text: PROSE } }));
    expect(composer().value).toBe("");
    expect(send()).toBeEnabled();
    await act(async () => send().click());
    await screen.findByText("A deposit.", { selector: "p" });
    expect(chatBodies()[0]).toMatchObject({
      message: `> ${PROSE}\n\nExplain this${ON_ACCOUNTS}`,
    });
    const turn = screen.getAllByRole("listitem")[0]!;
    expect(turn.querySelector("p")!.textContent).toBe(
      "AccountsThis page: Accounts",
    );
    const quote = turn.querySelector("blockquote")!;
    expect(quote.textContent).toBe(`Selected text: ${PROSE}`);
    expect(quote.className).toContain("border-s-2");
    const heading = within(turn).getByRole("heading", { level: 3 });
    expect(heading.textContent).toBe("You: Explain this");
    // The heading starts the turn for screen readers; the quote shows on
    // top but is read after it.
    expect(heading.nextElementSibling).toBe(quote);
    expect(quote.className).toContain("order-first");
    expect(heading.parentElement!.className).toContain("flex-col");
    // Sent: gone from the composer, and Send waits for words again.
    expect(screen.queryByRole("button", { name: "Remove selected text" })).toBe(
      null,
    );
    expect(send()).toBeDisabled();
  });

  it("shows a code quote in the snippet frame, and the reader's question", async () => {
    renderAsk();
    await act(async () =>
      askStore.open({
        selection: { text: "let rent = 1;", code: true, language: "rust" },
      }),
    );
    askStore.setComposerDraft("What does this do?");
    await act(async () => send().click());
    await screen.findByText("A deposit.", { selector: "p" });
    expect(chatBodies()[0]!.message).toBe(
      `\`\`\`rust\nlet rent = 1;\n\`\`\`\n\nWhat does this do?${ON_ACCOUNTS}`,
    );
    const turn = screen.getAllByRole("listitem")[0]!;
    expect(turn.querySelector("pre")!.textContent).toBe("let rent = 1;");
    expect(within(turn).getByRole("heading", { level: 3 }).textContent).toBe(
      "You: What does this do?",
    );
  });

  it("removes the quote with its ×, back to the field", async () => {
    renderAsk();
    await act(async () => askStore.open({ selection: { text: PROSE } }));
    const remove = screen.getByRole("button", { name: "Remove selected text" });
    await act(async () => remove.click());
    expect(askStore.getState().composerQuote).toBeNull();
    const panel = screen.getByRole("complementary", { name: "Ask AI" });
    expect(within(panel).queryByText(PROSE)).toBeNull();
    expect(document.activeElement).toBe(composer());
    expect(send()).toBeDisabled();
  });

  it("counts the quote in the length limit", async () => {
    renderAsk();
    await act(async () =>
      askStore.open({ selection: { text: "q".repeat(1000) } }),
    );
    await act(async () => askStore.setComposerDraft("x".repeat(2997)));
    // "> " + 1,000 + a blank line + 2,997.
    expect(composer()).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("4,001/4,000")).toBeInTheDocument();
    // The count includes the quote, so the line says removing it helps.
    expect(
      screen.getByText(
        "Shorten your question or remove the selected text to stay under 4,000 characters.",
      ),
    ).toBeInTheDocument();
    expect(send()).toBeDisabled();
    await act(async () => askStore.setComposerDraft("x".repeat(2996)));
    expect(composer()).not.toHaveAttribute("aria-invalid");
  });

  it("lifts a too-long refusal when a shorter quote replaces the long one", async () => {
    renderAsk();
    await act(async () =>
      askStore.open({ selection: { text: "q".repeat(1000) } }),
    );
    await act(async () => askStore.setComposerDraft("x".repeat(2997)));
    await act(async () => fireEvent.keyDown(composer(), { key: "Enter" }));
    expect(composer()).toHaveAttribute("aria-invalid", "true");
    expect(chatBodies()).toHaveLength(0);
    // The pill again, on a short phrase: the message fits now.
    await act(async () =>
      askStore.open({ selection: { text: "A transaction is a request" } }),
    );
    expect(composer()).not.toHaveAttribute("aria-invalid");
    expect(send()).toBeEnabled();
  });

  it("puts a refused quote back, with the reader's words but not “Explain this”", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.endsWith("/session")
        ? Response.json({ session_token: "mock-token" })
        : new Response(JSON.stringify({ error: "rate_limited" }), {
            status: 429,
          }),
    );
    renderAsk();
    await act(async () => askStore.open({ selection: { text: PROSE } }));
    await act(async () => send().click());
    await waitFor(() =>
      expect(askStore.getState().composerQuote).toMatchObject({
        text: PROSE,
        pageContext: { title: "Accounts" },
      }),
    );
    // Sent without words: the field is empty again, not "Explain this".
    expect(chatBodies()[0]!.message).toBe(
      `> ${PROSE}\n\nExplain this${ON_ACCOUNTS}`,
    );
    expect(composer().value).toBe("");

    await act(async () => askStore.setComposerDraft("Why?"));
    await act(async () => send().click());
    await waitFor(() => expect(chatBodies()).toHaveLength(2));
    await waitFor(() => expect(composer().value).toBe("Why?"));
    expect(askStore.getState().composerQuote).toMatchObject({ text: PROSE });
  });
});
