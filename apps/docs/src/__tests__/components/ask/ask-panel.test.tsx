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
import { ASK_SOLANA_ANALYTICS_EVENT } from "@solana-com/ui-chrome/ask-solana/analytics";
import { clearAskSession } from "@solana-com/ui-chrome/ask-solana/api";
import { tokenLifecycleGenerativeUiFixture } from "@solana-com/ui-chrome/ask-solana/fixtures";
import en from "../../../../../../packages/i18n/messages/web/en/common.json";
import { openAskAi } from "@/lib/docs/ask-ai";
import { askStore, resetAskStoreForTests } from "@/lib/docs/ask/store";

vi.mock("next/navigation", () => ({
  usePathname: () => "/developers/docs/core/accounts",
  useRouter: () => ({ prefetch: vi.fn() }),
}));
vi.mock("fumadocs-core/highlight/client", () => ({
  useShiki: (code: string) => <pre className="shiki">{code}</pre>,
}));

const { AskAi } = await import("@/components/docs/ask/ask-ai.client");
const { AskHeaderButton } =
  await import("@/components/docs/ask/ask-launcher.client");

const encoder = new TextEncoder();
const sse = (name: string, data: unknown) =>
  `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;

/** A long in-depth part (two code blocks), so it folds under "Full answer". */
const ANSWER =
  "### Summary response\nA mint account defines a token.\n\n### Indepth response\nIt stores `decimals` and the mint authority.\n\n```ts\nconst mint = await createMint();\n```\n\n```ts\nconst account = await createAccount();\n```\n\nWant to see this in code?";

function answer(done: Record<string, unknown> = {}, text = ANSWER) {
  return new Response(
    sse("status", { stage: "searching_docs" }) +
      sse("delta", { text }) +
      sse("done", {
        run_id: 101,
        conversation_id: 7,
        citations: [
          {
            title: "Mint accounts",
            url: "/docs/tokens/basics/create-mint",
          },
        ],
        code_followups: {
          prompt: "Want to see this in code?",
          buttons: [
            {
              type: "show_code",
              label: "TypeScript",
              language: "typescript",
              message: "Show me the code in TypeScript.",
            },
          ],
        },
        ...done,
      }),
    { headers: { "content-type": "text/event-stream" } },
  );
}

/** A chat response the test feeds by hand. */
function controllable() {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const body = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
  });
  return {
    response: new Response(body, {
      headers: { "content-type": "text/event-stream" },
    }),
    send: (name: string, data: unknown) =>
      controller.enqueue(encoder.encode(sse(name, data))),
  };
}

let chats: Array<Response | (() => Response)> = [];
let fetchMock: ReturnType<typeof vi.fn>;

const chatBodies = () =>
  fetchMock.mock.calls
    .filter(([url]) => String(url).endsWith("/chat"))
    .map(([, init]) => JSON.parse(String((init as RequestInit).body)));

/** A window `width` px wide; the panel docks from 1280px. */
function setViewport(width: number) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
  });
}

function renderAsk() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <AskAi />
    </NextIntlClientProvider>,
  );
}

const html = document.documentElement;
const composer = () =>
  document.querySelector<HTMLTextAreaElement>("[data-ask-composer]")!;

async function ask(text: string) {
  fireEvent.change(composer(), { target: { value: text } });
  await act(async () => {
    fireEvent.keyDown(composer(), { key: "Enter" });
  });
}

beforeEach(() => {
  resetAskStoreForTests();
  clearAskSession();
  localStorage.clear();
  sessionStorage.clear();
  html.removeAttribute("data-ask");
  html.style.removeProperty("--ask-w");
  html.lang = "en";
  document.body.innerHTML = "";
  // jsdom's 1024px: the overlay, unless a test docks the panel.
  setViewport(1024);
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: window.innerWidth >= Number(/(\d+)px/.exec(query)?.[1] ?? 1e9),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  chats = [];
  fetchMock = vi.fn(async (url: string) => {
    if (url.endsWith("/session"))
      return Response.json({ session_token: "mock-token" });
    if (url.endsWith("/feedback")) return new Response(null, { status: 204 });
    if (url.endsWith("/chat")) {
      const next = chats.shift();
      if (!next) throw new Error("unexpected chat request");
      return typeof next === "function" ? next() : next;
    }
    return new Response(null, { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn(async () => {}) },
    configurable: true,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  resetAskStoreForTests();
});

describe("Ask AI launcher and panel", () => {
  it("is a launcher named exactly “Ask AI” that opens the panel", async () => {
    renderAsk();
    const launcher = screen.getByRole("button", { name: "Ask AI" });
    // The ✨ follows the label, drawn white.
    expect(launcher.textContent).toBe("Ask AI✨");
    expect(launcher.querySelector('[aria-hidden="true"]')!.className).toContain(
      "brightness-0 invert",
    );
    // No kbd hint: the shortcut is only in the tooltip.
    expect(launcher.querySelector("kbd")).toBeNull();
    expect(launcher).toHaveAttribute("title", "Ctrl I to open or close");
    // A floating pill only from 1280px; the header's ✨ covers narrower screens.
    expect(launcher.parentElement!.className).toContain("max-xl:hidden");
    launcher.focus();
    await act(async () => fireEvent.click(launcher));

    const panel = screen.getByRole("dialog", { name: "Ask AI" });
    expect(panel).toHaveAttribute("data-docs");
    expect(panel).toHaveAttribute("data-dev-landing", "docs");
    expect(document.activeElement).toBe(composer());
    // Empty state: four suggestions.
    expect(within(panel).getByText("Try asking")).toBeInTheDocument();
    expect(
      within(panel).getByRole("button", { name: /What is a program derived/ }),
    ).toBeInTheDocument();
    // Nothing to clear yet.
    expect(
      within(panel).queryByRole("button", { name: "New chat" }),
    ).toBeNull();

    await act(async () =>
      fireEvent.click(within(panel).getByRole("button", { name: "Close" })),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    // The dialog hands focus back as it unmounts.
    await waitFor(() => expect(document.activeElement).toBe(launcher));
  });

  it("docks the panel beside the page at 1440px", async () => {
    setViewport(1440);
    renderAsk();
    const launcher = screen.getByRole("button", { name: "Ask AI" });
    launcher.focus();
    await act(async () => fireEvent.click(launcher));

    const panel = screen.getByRole("complementary", { name: "Ask AI" });
    expect(panel).toHaveAttribute("data-docs");
    expect(panel).toHaveAttribute("data-dev-landing", "docs");
    expect(html.dataset.ask).toBe("docked");
    expect(html.style.getPropertyValue("--ask-w")).toBe("420px");
    expect(document.activeElement).toBe(composer());
    // No docs page here, so no page row.
    expect(
      within(panel).queryByRole("button", { name: /Ask about this page/ }),
    ).toBeNull();

    await act(async () =>
      fireEvent.click(within(panel).getByRole("button", { name: "Close" })),
    );
    expect(screen.queryByRole("complementary")).toBeNull();
    expect(html.hasAttribute("data-ask")).toBe(false);
    expect(document.activeElement).toBe(launcher);
  });

  it("gives the page its room back when Ask AI unmounts, and takes it again", async () => {
    // A client-side move to the cookbook (Inkeep) unmounts Ask AI; the
    // panel stays open in the store for the way back.
    setViewport(1440);
    const view = renderAsk();
    await act(async () => askStore.open());
    expect(html.dataset.ask).toBe("docked");
    view.unmount();
    expect(html.hasAttribute("data-ask")).toBe(false);
    expect(html.style.getPropertyValue("--ask-w")).toBe("");
    // A resize while away leaves <html> alone.
    await act(async () => window.dispatchEvent(new Event("resize")));
    expect(html.hasAttribute("data-ask")).toBe(false);
    renderAsk();
    expect(html.dataset.ask).toBe("docked");
    expect(html.style.getPropertyValue("--ask-w")).toBe("420px");
    expect(
      screen.getByRole("complementary", { name: "Ask AI" }),
    ).toBeInTheDocument();
  });

  it("resizes from the keyboard, within its limits", async () => {
    setViewport(1440);
    renderAsk();
    await act(async () => askStore.open());
    const handle = screen.getByRole("separator", { name: "Resize panel" });
    expect(handle).toHaveAttribute("aria-valuenow", "420");
    expect(handle).toHaveAttribute("aria-valuemin", "360");
    expect(handle).toHaveAttribute("aria-valuemax", "720");
    await act(async () => fireEvent.keyDown(handle, { key: "ArrowLeft" }));
    expect(handle).toHaveAttribute("aria-valuenow", "444");
    await act(async () =>
      fireEvent.keyDown(handle, { key: "ArrowRight", shiftKey: true }),
    );
    expect(handle).toHaveAttribute("aria-valuenow", "360");
    await act(async () => fireEvent.keyDown(handle, { key: "End" }));
    expect(html.style.getPropertyValue("--ask-w")).toBe("720px");
    await act(async () => fireEvent.doubleClick(handle));
    expect(handle).toHaveAttribute("aria-valuenow", "420");
  });

  it("closes the docked panel on Esc from inside it, back to the opener", async () => {
    setViewport(1440);
    renderAsk();
    const launcher = screen.getByRole("button", { name: "Ask AI" });
    launcher.focus();
    await act(async () => fireEvent.click(launcher));
    expect(document.activeElement).toBe(composer());
    // An IME composition's Esc stays with the composer.
    await act(async () =>
      fireEvent.keyDown(composer(), { key: "Escape", isComposing: true }),
    );
    expect(askStore.getState().open).toBe(true);
    await act(async () => fireEvent.keyDown(composer(), { key: "Escape" }));
    expect(screen.queryByRole("complementary")).toBeNull();
    expect(askStore.getState().open).toBe(false);
    expect(document.activeElement).toBe(launcher);
  });

  it("keeps focus on the toggle between the overlay and full screen", async () => {
    renderAsk();
    await act(async () => askStore.open());
    const dialog = screen.getByRole("dialog", { name: "Ask AI" });
    const expand = within(dialog).getByRole("link", {
      name: "Expand to full screen",
    });
    expand.focus();
    await act(async () => fireEvent.click(expand));
    expect(html.dataset.ask).toBe("fullscreen");
    const exit = within(dialog).getByRole("button", {
      name: "Exit full screen",
    });
    expect(exit).toHaveFocus();
    await act(async () => fireEvent.click(exit));
    expect(html.dataset.ask).toBe("overlay");
    expect(
      within(dialog).getByRole("link", { name: "Expand to full screen" }),
    ).toHaveFocus();
    // A click from elsewhere leaves focus where the dialog puts it.
    composer().focus();
    await act(async () =>
      fireEvent.click(
        within(dialog).getByRole("link", { name: "Expand to full screen" }),
      ),
    );
    expect(composer()).toHaveFocus();
  });

  it("expands to full screen; Esc returns to the docked panel", async () => {
    setViewport(1440);
    renderAsk();
    await act(async () => askStore.open());
    // A phone sheet is already full screen: no Expand there.
    const expand = screen.getByRole("link", { name: "Expand to full screen" });
    expect(expand.className).toContain("max-sm:hidden");
    await act(async () => fireEvent.click(expand));
    const dialog = screen.getByRole("dialog", { name: "Ask AI" });
    expect(html.dataset.ask).toBe("fullscreen");
    expect(
      within(dialog).getByRole("button", { name: "Exit full screen" }),
    ).toBeInTheDocument();
    await act(async () => fireEvent.keyDown(dialog, { key: "Escape" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen.getByRole("complementary", { name: "Ask AI" }),
    ).toBeInTheDocument();
  });

  it("sends Bri's full-screen event, in place or for a new tab", async () => {
    setViewport(1440);
    const events: unknown[] = [];
    const record = (event: Event) => events.push((event as CustomEvent).detail);
    window.addEventListener(ASK_SOLANA_ANALYTICS_EVENT, record);
    const stay = (event: Event) => event.preventDefault();
    document.addEventListener("click", stay);
    renderAsk();
    await act(async () => askStore.open());
    const link = screen.getByRole("link", { name: "Expand to full screen" });
    events.length = 0;
    await act(async () => fireEvent.click(link, { ctrlKey: true }));
    await act(async () => fireEvent.click(link));
    expect(events).toEqual([
      {
        event: "docs_ai_widget_fullscreen",
        properties: { conversation_id: null, source: "new_tab" },
      },
      {
        event: "docs_ai_widget_fullscreen",
        properties: { conversation_id: null, source: "expand" },
      },
    ]);
    document.removeEventListener("click", stay);
    window.removeEventListener(ASK_SOLANA_ANALYTICS_EVENT, record);
  });

  it("expands from a link: a plain click in place, other clicks for a new tab", async () => {
    setViewport(1440);
    window.history.replaceState(
      null,
      "",
      "/developers/docs/core/accounts?view=a%20b#rent",
    );
    chats.push(answer());
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByRole("button", { name: "Ask again" });
    const panel = screen.getByRole("complementary", { name: "Ask AI" });
    const link = within(panel).getByRole("link", {
      name: "Expand to full screen",
    });
    const { threadId } = askStore.getState();
    const key = `docs-ask:handoff:${threadId}`;
    expect(link).toHaveAttribute("title", "Expand to full screen");
    expect(link).toHaveAttribute(
      "href",
      `/developers/docs/core/accounts?view=a%20b&ask=full&askThread=${threadId}#rent`,
    );
    // The page moved on since render (an anchor): the link follows.
    window.history.replaceState(
      null,
      "",
      "/developers/docs/core/accounts?view=a%20b#pda",
    );
    fireEvent.focus(link);
    expect(link.getAttribute("href")).toMatch(/#pda$/);

    // What the browser does with a click once React is done: record, and
    // stop jsdom from navigating.
    let prevented: boolean | null = null;
    const record = (event: Event) => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener("click", record);
    document.addEventListener("auxclick", record);
    const handedOff = () => JSON.parse(localStorage.getItem(key) ?? "null");

    // Ctrl/Cmd-click: the browser opens the link; this tab stays as it is.
    for (const modifier of ["ctrlKey", "metaKey", "shiftKey"] as const) {
      localStorage.removeItem(key);
      await act(async () => {
        fireEvent.pointerDown(link, { [modifier]: true });
        fireEvent.click(link, { [modifier]: true });
      });
      expect(prevented).toBe(false);
      expect(handedOff()?.messages).toHaveLength(2);
      expect(askStore.getState().layout).toBe("docked");
    }

    // Middle click.
    localStorage.removeItem(key);
    prevented = null;
    await act(async () => {
      fireEvent.pointerDown(link, { button: 1 });
      fireEvent(link, new MouseEvent("auxclick", { bubbles: true, button: 1 }));
    });
    expect(prevented).toBe(false);
    expect(handedOff()).toMatchObject({ v: 1, conversationId: "7" });

    // Context menu ("Open in new tab"), and Ctrl+Enter from the keyboard.
    localStorage.removeItem(key);
    fireEvent.contextMenu(link);
    expect(handedOff()).not.toBeNull();
    localStorage.removeItem(key);
    fireEvent.keyDown(link, { key: "Enter", ctrlKey: true });
    expect(handedOff()).not.toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();

    // A plain click: full screen in place.
    await act(async () => fireEvent.click(link));
    expect(prevented).toBe(true);
    const dialog = screen.getByRole("dialog", { name: "Ask AI" });
    expect(html.dataset.ask).toBe("fullscreen");
    // Its way back stays a button.
    expect(
      within(dialog).getByRole("button", { name: "Exit full screen" }),
    ).toBeInTheDocument();
    expect(within(dialog).queryByRole("link", { name: /full screen/ })).toBe(
      null,
    );
    document.removeEventListener("click", record);
    document.removeEventListener("auxclick", record);
    window.history.replaceState(null, "", "/");
  });

  it("opens a full-screen link with the thread its tab left", async () => {
    setViewport(1440);
    const id = "0123456789abcdef01234567";
    localStorage.setItem(
      `docs-ask:handoff:${id}`,
      JSON.stringify({
        v: 1,
        savedAt: Date.now(),
        messages: [
          { id: "u1", role: "user", text: "What is a mint?" },
          {
            id: "a1",
            role: "assistant",
            state: "done",
            text: "### Summary response\nA mint account defines a token.",
            runId: "101",
          },
        ],
        conversationId: "7",
        composerDraft: "And decimals?",
      }),
    );
    window.history.replaceState(
      null,
      "",
      `/developers/docs/core/accounts?ask=full&askThread=${id}`,
    );
    renderAsk();
    const dialog = await screen.findByRole("dialog", { name: "Ask AI" });
    expect(html.dataset.ask).toBe("fullscreen");
    expect(within(dialog).getByText("What is a mint?")).toBeInTheDocument();
    expect(
      within(dialog).getByText("A mint account defines a token."),
    ).toBeInTheDocument();
    expect(composer().value).toBe("And decimals?");
    await waitFor(() => expect(location.search).toBe(""));
    // Esc: back to the docked panel, in this tab.
    await act(async () => fireEvent.keyDown(dialog, { key: "Escape" }));
    expect(
      screen.getByRole("complementary", { name: "Ask AI" }),
    ).toBeInTheDocument();
    expect(html.dataset.ask).toBe("docked");
    window.history.replaceState(null, "", "/");
  });

  it("shows an answer its tab was still writing as arriving, then finished", async () => {
    setViewport(1440);
    const id = "0123456789abcdef01234567";
    const key = `docs-ask:handoff:${id}`;
    const handoff = (last: Record<string, unknown>) =>
      JSON.stringify({
        v: 1,
        savedAt: Date.now(),
        messages: [
          { id: "u1", role: "user", text: "What is a mint?" },
          { id: "a1", role: "assistant", ...last },
        ],
        conversationId: null,
        composerDraft: "",
      });
    localStorage.setItem(
      key,
      handoff({
        state: "streaming",
        status: "writing",
        text: "### Summary response\nA mint account",
      }),
    );
    window.history.replaceState(
      null,
      "",
      `/developers/docs/core/accounts?ask=full&askThread=${id}`,
    );
    renderAsk();
    const dialog = await screen.findByRole("dialog", { name: "Ask AI" });
    expect(within(dialog).getByText("A mint account")).toBeInTheDocument();
    expect(
      within(dialog).queryByText(en.docsAsk.errors.incomplete, {
        exact: false,
      }),
    ).toBeNull();
    expect(
      within(dialog).getByRole("button", { name: "Stop" }),
    ).toBeInTheDocument();

    await act(async () =>
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: handoff({
            state: "done",
            text: "### Summary response\nA mint account defines a token.",
            runId: "101",
          }),
        }),
      ),
    );
    expect(
      within(dialog).getAllByText("A mint account defines a token.")[0],
    ).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: "Stop" })).toBeNull();
    window.history.replaceState(null, "", "/");
  });

  it("goes full screen over the whole window, docs header included", async () => {
    setViewport(1440);
    const page = document.createElement("div");
    page.innerHTML =
      '<header class="dh"><button>Theme</button></header><main id="docs-body"></main><footer></footer>';
    document.body.appendChild(page);
    renderAsk();
    await act(async () => askStore.setFullscreen(true));
    const dialog = screen.getByRole("dialog", { name: "Ask AI" });
    expect(dialog.className).toContain("inset-0");
    expect(dialog.className).not.toContain("top-16");
    // Modal: the page, header included, is hidden from assistive tech.
    expect(page).toHaveAttribute("aria-hidden", "true");
    await act(async () => fireEvent.keyDown(dialog, { key: "Escape" }));
    expect(askStore.getState().layout).toBe("docked");
    expect(page).not.toHaveAttribute("aria-hidden");
    page.remove();
  });

  it("is a modal overlay below 1280px; Esc closes it", async () => {
    renderAsk();
    await act(async () => askStore.open());
    const dialog = screen.getByRole("dialog", { name: "Ask AI" });
    expect(dialog).toHaveAttribute("data-docs");
    expect(html.dataset.ask).toBe("overlay");
    await act(async () => fireEvent.keyDown(dialog, { key: "Escape" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(askStore.getState().open).toBe(false);
  });

  it("tells assistive tech whether the panel is open, and which it is", async () => {
    setViewport(1440);
    renderAsk();
    const launcher = screen.getByRole("button", { name: "Ask AI" });
    expect(launcher).toHaveAttribute("aria-expanded", "false");
    expect(launcher).not.toHaveAttribute("aria-controls");
    // Docked, the panel is a sidebar, not a popup.
    expect(launcher).not.toHaveAttribute("aria-haspopup");
    await act(async () => fireEvent.click(launcher));
    expect(launcher).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("complementary", { name: "Ask AI" });
    expect(launcher).toHaveAttribute("aria-controls", panel.id);
  });

  it("gives the header's ✨ the same state, a dialog below 1280px, and warms the session", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <AskHeaderButton label="Ask AI">✨</AskHeaderButton>
        <AskAi />
      </NextIntlClientProvider>,
    );
    const header = screen.getByTitle("Ask AI");
    expect(header).toHaveAttribute("aria-haspopup", "dialog");
    expect(header).toHaveAttribute("aria-expanded", "false");
    const sessions = () =>
      fetchMock.mock.calls.filter(([url]) => String(url).endsWith("/session"))
        .length;
    expect(sessions()).toBe(0);
    await act(async () => fireEvent.focus(header));
    await waitFor(() => expect(sessions()).toBe(1));
    await act(async () => fireEvent.click(header));
    const dialog = screen.getByRole("dialog", { name: "Ask AI" });
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(header).toHaveAttribute("aria-controls", dialog.id);
  });

  it("toggles with ⌘I / Ctrl+I, but not from other text fields", async () => {
    renderAsk();
    const input = document.createElement("input");
    document.body.appendChild(input);
    await act(async () =>
      fireEvent.keyDown(input, { key: "i", ctrlKey: true }),
    );
    expect(askStore.getState().open).toBe(false);
    await act(async () =>
      fireEvent.keyDown(document.body, { key: "i", metaKey: true }),
    );
    expect(askStore.getState().open).toBe(true);
    // From our own composer it closes again.
    await act(async () =>
      fireEvent.keyDown(composer(), { key: "I", ctrlKey: true }),
    );
    expect(askStore.getState().open).toBe(false);
  });
});

describe("Ask AI conversation", () => {
  it("streams an answer: summary, folded in-depth part, sources, follow-ups, actions", async () => {
    chats.push(
      answer({
        generative_ui: tokenLifecycleGenerativeUiFixture,
      }),
    );
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    const panel = screen.getByRole("dialog", { name: "Ask AI" });

    // One turn: the question as its heading, then the answer.
    const turn = within(panel).getAllByRole("listitem")[0]!;
    expect(within(turn).getByRole("heading", { level: 3 }).textContent).toBe(
      "You: What is a mint?",
    );
    expect(turn.textContent).toContain("A mint account defines a token.");
    expect(chatBodies()[0]).toMatchObject({ message: "What is a mint?" });

    // The visual draws through AskVisual.
    expect(within(panel).getByText("Diagram")).toBeInTheDocument();

    // In-depth part folded behind "Full answer".
    expect(within(panel).queryByText(/stores/)).toBeNull();
    await act(async () =>
      fireEvent.click(
        within(panel).getByRole("button", { name: "Full answer" }),
      ),
    );
    expect(within(panel).getByText(/mint authority/)).toBeInTheDocument();
    expect(
      within(panel).getByRole("button", { name: "Hide full answer" }),
    ).toHaveAttribute("aria-expanded", "true");

    // Sources, normalized to /developers/docs.
    const sources = within(panel).getByRole("navigation", { name: "Sources" });
    const source = within(sources).getByRole("link");
    expect(source).toHaveAttribute(
      "href",
      "/developers/docs/tokens/basics/create-mint",
    );
    expect(source.textContent).toContain("Mint accounts");

    // The follow-up prompt shows once, above its chip.
    expect(
      within(panel).getAllByText("Want to see this in code?"),
    ).toHaveLength(1);
    chats.push(answer({}, "Here it is."));
    const picked = vi.fn();
    const onPick = (event: Event) => picked((event as CustomEvent).detail);
    window.addEventListener(ASK_SOLANA_ANALYTICS_EVENT, onPick);
    await act(async () =>
      fireEvent.click(
        within(panel).getByRole("button", { name: "TypeScript" }),
      ),
    );
    window.removeEventListener(ASK_SOLANA_ANALYTICS_EVENT, onPick);
    expect(picked).toHaveBeenCalledWith({
      event: "docs_ai_code_followup_clicked",
      properties: {
        language: "typescript",
        type: "show_code",
        surface: "overlay",
      },
    });
    await screen.findByText("Here it is.", { selector: "p" });
    // The agent's integer id goes back as an integer (Bri's client).
    expect(chatBodies()[1]).toMatchObject({
      message: "Show me the code in TypeScript.",
      conversation_id: 7,
    });
  });

  it("rates an answer and thanks the reader", async () => {
    chats.push(answer());
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    const feedback = await screen.findByRole("group", { name: "Helpful?" });
    const helpful = within(feedback).getByRole("button", { name: "Yes" });
    await act(async () => fireEvent.click(helpful));
    expect(helpful).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Thanks for the feedback.")).toBeInTheDocument();
    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(([url]) => String(url).endsWith("/feedback")),
      ).toBe(true),
    );
  });

  it("keeps the full answer open when the panel opens again", async () => {
    chats.push(answer());
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Full answer" })),
    );
    await act(async () => askStore.close());
    await act(async () => askStore.open());
    const dialog = screen.getByRole("dialog", { name: "Ask AI" });
    expect(
      within(dialog).getByRole("button", { name: "Hide full answer" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps the full answer open when switching to full screen", async () => {
    setViewport(1440);
    chats.push(answer());
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Full answer" })),
    );
    await act(async () =>
      fireEvent.click(
        screen.getByRole("link", { name: "Expand to full screen" }),
      ),
    );
    const dialog = screen.getByRole("dialog", { name: "Ask AI" });
    expect(
      within(dialog).getByRole("button", { name: "Hide full answer" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("hides rating when the answer has no run id", async () => {
    chats.push(answer({ run_id: null }));
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByRole("button", { name: "Ask again" });
    expect(screen.queryByRole("group", { name: "Helpful?" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Copy answer" }),
    ).toBeInTheDocument();
  });

  it("sends on Enter, not on Shift+Enter", async () => {
    renderAsk();
    await act(async () => askStore.open());
    fireEvent.change(composer(), { target: { value: "two\nlines" } });
    await act(async () =>
      fireEvent.keyDown(composer(), { key: "Enter", shiftKey: true }),
    );
    expect(chatBodies()).toHaveLength(0);
    expect(composer().value).toBe("two\nlines");
  });

  it("refuses questions over 4,000 characters without sending", async () => {
    renderAsk();
    await act(async () => askStore.open());
    await ask("x".repeat(4001));
    expect(screen.getByRole("alert").textContent).toBe(
      "Shorten your question to under 4,000 characters.",
    );
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    expect(chatBodies()).toHaveLength(0);
  });

  it("shows the error kind and asks again on Try again", async () => {
    chats.push(
      () =>
        new Response(sse("error", { message: "boom" }), {
          headers: { "content-type": "text/event-stream" },
        }),
    );
    chats.push(answer());
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("The answer didn’t load.", {
      selector: "p > bdi",
    });
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Try again" })),
    );
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
  });

  it("asks the agent again on Ask again, in the same conversation", async () => {
    chats.push(answer(), answer({}, "A mint holds a token's supply."));
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Ask again" })),
    );
    // Without the conversation, Bri's client would replay its cached first
    // answer, with no run id (so no Helpful?) and no conversation.
    await screen.findByText("A mint holds a token's supply.", {
      selector: "p",
    });
    expect(chatBodies()).toEqual([
      expect.objectContaining({ message: "What is a mint?" }),
      expect.objectContaining({
        message: "What is a mint?",
        conversation_id: 7,
      }),
    ]);
    expect(screen.getByRole("group", { name: "Helpful?" })).toBeInTheDocument();
  });

  it("offers New chat when the conversation is full", async () => {
    chats.push(
      new Response(JSON.stringify({ error: "conversation_limit" }), {
        status: 409,
      }),
    );
    renderAsk();
    await act(async () => askStore.open());
    await ask("One more?");
    const newChat = await screen.findAllByRole("button", { name: "New chat" });
    // The header's, and the callout's.
    expect(newChat).toHaveLength(2);
    await act(async () => fireEvent.click(newChat[1]!));
    expect(askStore.getState().messages).toHaveLength(0);
  });

  it("starts a new conversation after the agent says this one is full", async () => {
    chats.push(answer());
    chats.push(
      Response.json(
        { code: "conversation_full", message: "full" },
        { status: 409 },
      ),
    );
    chats.push(answer({ conversation_id: 10 }, "### Summary response\nNew."));
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await ask("One more?");
    await screen.findByText(
      "This chat has reached its length limit. Start a new chat to keep going.",
      { selector: "p > bdi" },
    );
    expect(askStore.getState().conversationId).toBeNull();
    // Asked here anyway, it goes out without the full conversation, and
    // the answer says so.
    await ask("And another?");
    const fresh = await screen.findByText("New.", { selector: "p" });
    expect(chatBodies().map((body) => body.conversation_id)).toEqual([
      undefined,
      7,
      undefined,
    ]);
    const notice = screen.getByText(
      "This chat reached its length limit, so Ask AI answered this without your earlier messages.",
      { selector: "p > bdi" },
    );
    expect(
      fresh.compareDocumentPosition(notice) & Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy();
    expect(askStore.getState().conversationId).toBe("10");
  });

  it("says a renewed session on the answer that has it, not on the failure before it", async () => {
    chats.push(answer());
    // A rejected session, then Bri's client's second send fails too.
    chats.push(new Response(null, { status: 401 }));
    chats.push(new Response(null, { status: 503 }));
    chats.push(
      answer({ conversation_id: 8 }, "### Summary response\nAbout 0.0015 SOL."),
    );
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is rent?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await ask("And how much does that cost?");
    await screen.findByText(
      "Ask AI isn’t available right now. Try again in a few minutes.",
      { selector: "p > bdi" },
    );
    const notice =
      "Your session expired, so Ask AI answered this without your earlier messages.";
    expect(screen.queryByText(notice)).toBeNull();
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Try again" })),
    );
    await screen.findByText("About 0.0015 SOL.", { selector: "p" });
    expect(screen.getAllByText(notice, { selector: "p > bdi" })).toHaveLength(
      1,
    );
    expect(chatBodies().map((body) => body.conversation_id)).toEqual([
      undefined,
      7,
      undefined,
      undefined,
    ]);
    expect(askStore.getState().conversationId).toBe("8");
  });

  it("asks the agent again after New chat, not Bri's cached answer", async () => {
    chats.push(answer(), answer({ run_id: 102, conversation_id: 11 }));
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await act(async () =>
      fireEvent.click(screen.getAllByRole("button", { name: "New chat" })[0]!),
    );
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    // A new conversation, with a run to rate.
    expect(chatBodies()).toHaveLength(2);
    expect(askStore.getState().conversationId).toBe("11");
    expect(screen.getByRole("group", { name: "Helpful?" })).toBeInTheDocument();
  });

  it("answers in a new conversation when the session was renewed, and says so", async () => {
    chats.push(answer());
    // The session token was rejected: Bri's client gets a new one and sends
    // the question again without the old session's conversation.
    chats.push(new Response(null, { status: 401 }));
    chats.push(
      answer(
        { conversation_id: 8 },
        "### Summary response\nAbout 0.0015 SOL for 82 bytes.",
      ),
    );
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is rent?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await ask("And how much does that cost?");
    await screen.findByText("About 0.0015 SOL for 82 bytes.", {
      selector: "p",
    });
    expect(chatBodies().map((body) => body.conversation_id)).toEqual([
      undefined,
      7,
      undefined,
    ]);
    // Above the second answer only.
    const notices = screen.getAllByText(
      "Your session expired, so Ask AI answered this without your earlier messages.",
      { selector: "p > bdi" },
    );
    expect(notices).toHaveLength(1);
    const answers = screen.getAllByText(/^(?:A mint account|About 0\.0015)/, {
      selector: "p",
    });
    expect(
      answers[1]!.compareDocumentPosition(notices[0]!) &
        Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy();
    expect(
      answers[0]!.compareDocumentPosition(notices[0]!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(askStore.getState().conversationId).toBe("8");
  });

  it("puts the question back when the agent no longer has the chat", async () => {
    chats.push(answer());
    chats.push(
      Response.json({ message: "Conversation not found" }, { status: 404 }),
    );
    chats.push(answer({ conversation_id: 9 }, "### Summary response\nFresh."));
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await ask("Who can mint more?");
    await screen.findByText(
      "This chat expired, so Ask AI no longer has your earlier messages. Add any details your question needs and send it again.",
      { selector: "p > bdi" },
    );
    // A muted line, the question back in the composer, no Try again.
    await waitFor(() => expect(composer().value).toBe("Who can mint more?"));
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
    expect(screen.queryByText(/Your session expired/)).toBeNull();
    expect(askStore.getState().conversationId).toBeNull();
    await ask("Who can mint more of a token?");
    await screen.findByText("Fresh.", { selector: "p" });
    expect(chatBodies().map((body) => body.conversation_id)).toEqual([
      undefined,
      7,
      undefined,
    ]);
    expect(askStore.getState().conversationId).toBe("9");
  });

  it("stops a streaming answer, keeping what arrived", async () => {
    const stream = controllable();
    chats.push(stream.response);
    renderAsk();
    await act(async () => askStore.open());
    await ask("Explain rent");
    await screen.findByText("Preparing an answer", { selector: "span" });
    await act(async () => stream.send("status", { stage: "searching_docs" }));
    await screen.findByText("Searching the docs", { selector: "span" });
    await act(async () => stream.send("delta", { text: "Rent is a deposit" }));
    await screen.findByText("Rent is a deposit", { selector: "p" });
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Stop" })),
    );
    expect(
      screen.getByText("Stopped", { selector: "p > bdi" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Rent is a deposit", { selector: "p" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
    // One line, "Stopped · Ask again"; no actions row for half an answer.
    expect(screen.getByRole("button", { name: "Ask again" }).tagName).toBe(
      "BUTTON",
    );
    expect(screen.queryByRole("button", { name: "Copy answer" })).toBeNull();
  });

  it("attaches this page to the question as a removable chip", async () => {
    chats.push(answer());
    const article = document.createElement("div");
    article.id = "content";
    article.dataset.pageTitle = "Accounts";
    article.dataset.pageHref = "/developers/docs/core/accounts";
    document.body.appendChild(article);
    renderAsk();
    await act(async () => askStore.open());
    // The empty state offers this page until it is attached.
    expect(
      screen.getByRole("button", { name: /Ask about this page/ }),
    ).toBeInTheDocument();
    await act(async () => openAskAi({ aboutPage: true }));
    expect(screen.getByText("This page: Accounts")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Ask about this page/ }),
    ).toBeNull();
    expect(document.activeElement).toBe(composer());
    expect(chatBodies()).toHaveLength(0);

    await ask("What is rent?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    // The reader's words, then the page's title on its own line.
    expect(chatBodies()[0]).toMatchObject({
      message: "What is rent?\n\n(Asked on the docs page “Accounts”.)",
    });
    // Shown above the question, and gone from the composer.
    expect(screen.getAllByText("This page: Accounts")).toHaveLength(1);

    await act(async () => askStore.attachCurrentPage());
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: "Remove page from question" }),
      ),
    );
    expect(askStore.getState().pageContext).toBeNull();
  });

  it("asks about a code block from the docs page", async () => {
    chats.push(answer());
    document.title = "Create a keypair";
    renderAsk();
    await act(async () => openAskAi("const signer = await generate();"));
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    // Sent without the page title, which the agent's router would answer
    // with a canned template; shown with it.
    expect(chatBodies()[0]!.message).toBe(
      "Explain this code:\n\n```\nconst signer = await generate();\n```",
    );
    // The question reads as a title, its code in a frame under it, not as
    // raw fences.
    const turn = screen.getAllByRole("listitem")[0]!;
    expect(within(turn).getByRole("heading", { level: 3 }).textContent).toBe(
      "You: Explain this code from Create a keypair",
    );
    expect(turn.querySelector("pre")!.textContent).toBe(
      "const signer = await generate();",
    );
    expect(turn.textContent).not.toContain("```");
  });
});

describe("Ask AI panel shell", () => {
  /**
   * Fakes the thread's scroll box (jsdom has no layout): 3000px of content
   * in 500px, scrolled to the top until something scrolls it.
   */
  function scrolledUp() {
    const el = document.querySelector<HTMLElement>(
      "[data-ask-panel] .overflow-y-auto",
    )!;
    let top = 0;
    const scrollTo = (next: number) => {
      top = Math.min(next, 2500);
      el.dispatchEvent(new Event("scroll"));
    };
    Object.defineProperties(el, {
      scrollHeight: { value: 3000, configurable: true },
      clientHeight: { value: 500, configurable: true },
      scrollTop: {
        get: () => top,
        set: (next: number) => scrollTo(next),
        configurable: true,
      },
      scrollTo: {
        value: (options: ScrollToOptions) => scrollTo(options.top ?? 0),
        configurable: true,
      },
    });
    fireEvent.scroll(el);
  }

  it("groups each question with its answer, the question in a bubble", async () => {
    chats.push(answer(), answer({}, "Rent is a deposit."));
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await ask("And rent?");
    await screen.findByText("Rent is a deposit.", { selector: "p" });

    const thread = document.querySelector("[data-ask-panel] ol")!;
    const turns = [...thread.children];
    expect(turns).toHaveLength(2);
    // Turns are spaced, not ruled off.
    expect(turns[1]!.className).toContain("mt-8");
    expect(turns[1]!.className).not.toContain("border-t");
    // Questions are headings in their own direction, inside a bubble at the
    // inline end; answers stay unboxed.
    const heading = within(turns[1] as HTMLElement).getByRole("heading", {
      level: 3,
    });
    expect(heading).toHaveAttribute("dir", "auto");
    expect(heading.textContent).toBe("You: And rent?");
    const bubble = heading.parentElement!;
    expect(bubble.className).toContain("rounded-[20px]");
    expect(bubble.className).toContain("bg-[var(--sol-purple-soft)]");
    expect(bubble.parentElement!.className).toContain("items-end");
    // The answer takes its text's direction (and says so, for icons that
    // flip with it): English stays left to right on an Arabic page.
    const answerRoot = within(turns[1] as HTMLElement)
      .getByText("Rent is a deposit.")
      .closest("[data-dir]");
    expect(answerRoot).toHaveAttribute("dir", "ltr");
    expect(answerRoot).toHaveAttribute("data-dir", "ltr");
    // Only the latest answer offers follow-ups; older sources fold away.
    expect(screen.getAllByRole("button", { name: "TypeScript" })).toHaveLength(
      1,
    );
    expect(
      within(turns[0] as HTMLElement).getByText("Sources (1)"),
    ).toBeInTheDocument();
  });

  it("keeps one disclaimer, under the first finished answer", async () => {
    chats.push(answer(), answer({}, "Rent is a deposit."));
    renderAsk();
    await act(async () => askStore.open());
    const disclaimer =
      "Answers can be wrong. Check them against the linked pages.";
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    await ask("And rent?");
    await screen.findByText("Rent is a deposit.", { selector: "p" });
    const turns = [
      ...document.querySelector("[data-ask-panel] ol")!.children,
    ] as HTMLElement[];
    expect(turns).toHaveLength(2);
    expect(within(turns[0]!).getByText(disclaimer)).toBeInTheDocument();
    expect(screen.getAllByText(disclaimer)).toHaveLength(1);
    // With it, one line that chats are recorded.
    expect(
      within(turns[0]!).getByText(disclaimer).closest("p")!.textContent,
    ).toBe(
      "Answers can be wrong. Check them against the linked pages. Chats are recorded to improve answers. Don’t share personal information.",
    );
  });

  it("puts the disclaimer under the first answer that links pages, not a decline", async () => {
    chats.push(
      answer(
        { citations: [], code_followups: null },
        "I can't help with that here.",
      ),
      answer(),
    );
    renderAsk();
    await act(async () => askStore.open());
    await ask("Will SOL go up?");
    await screen.findByText("I can't help with that here.", { selector: "p" });
    const disclaimer =
      "Answers can be wrong. Check them against the linked pages.";
    expect(screen.queryByText(disclaimer)).toBeNull();
    // The line that chats are recorded goes under the first answer of all.
    const privacy =
      "Chats are recorded to improve answers. Don’t share personal information.";
    expect(screen.getAllByText(privacy)).toHaveLength(1);
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    const turns = [
      ...document.querySelector("[data-ask-panel] ol")!.children,
    ] as HTMLElement[];
    expect(within(turns[1]!).getByText(disclaimer)).toBeInTheDocument();
    expect(screen.getAllByText(disclaimer)).toHaveLength(1);
    expect(within(turns[0]!).getByText(privacy)).toBeInTheDocument();
    expect(screen.getAllByText(privacy)).toHaveLength(1);
  });

  it("shows New chat as a labelled button once there is a conversation", async () => {
    chats.push(answer());
    renderAsk();
    await act(async () => askStore.open());
    const panel = screen.getByRole("dialog", { name: "Ask AI" });
    expect(
      within(panel).queryByRole("button", { name: "New chat" }),
    ).toBeNull();
    await ask("What is a mint?");
    const newChat = await within(panel).findByRole("button", {
      name: "New chat",
    });
    expect(newChat.textContent).toBe("New chat");
    await act(async () => fireEvent.click(newChat));
    expect(askStore.getState().messages).toHaveLength(0);
    expect(
      within(panel).queryByRole("button", { name: "New chat" }),
    ).toBeNull();
  });

  it("starts with one sentence, this page, unboxed suggestions and the disclaimer last", async () => {
    const article = document.createElement("div");
    article.id = "content";
    article.dataset.pageTitle = "Accounts";
    article.dataset.pageHref = "/developers/docs/core/accounts";
    document.body.appendChild(article);
    renderAsk();
    await act(async () => askStore.open());
    const panel = screen.getByRole("dialog", { name: "Ask AI" });
    expect(within(panel).queryByRole("heading", { level: 3 })).toBeNull();
    const thisPage = within(panel).getByRole("button", {
      name: "Ask about this page Accounts",
    });
    const suggestion = within(panel).getByRole("button", {
      name: "How does one program call another?",
    });
    // Rows follow the page's direction; the words isolate their own, so an
    // English question keeps its "?" at the end on an Arabic page.
    expect(suggestion).not.toHaveAttribute("dir");
    expect(suggestion.querySelector("bdi")!.textContent).toBe(
      "How does one program call another?",
    );
    const paragraphs = [
      ...panel.querySelectorAll(".overflow-y-auto > div > div > p"),
    ];
    expect(paragraphs[0]!.textContent).toBe(
      "Answers draw on the Solana docs and link to the pages they use.",
    );
    expect(paragraphs.at(-1)!.textContent).toBe(
      "Answers can be wrong. Check them against the linked pages. Chats are recorded to improve answers. Don’t share personal information.",
    );
    // The disclaimer is not under the composer.
    expect(
      within(panel).getAllByText(
        "Answers can be wrong. Check them against the linked pages.",
      ),
    ).toHaveLength(1);
    await act(async () => fireEvent.click(thisPage));
    expect(askStore.getState().pageContext?.title).toBe("Accounts");
    // A suggestion goes without the page.
    chats.push(answer());
    await act(async () => fireEvent.click(suggestion));
    expect(chatBodies()[0]).toEqual(
      expect.objectContaining({
        message: "How does one program call another?",
      }),
    );
  });

  it("shows the asked page above the question", async () => {
    chats.push(answer());
    renderAsk();
    await act(async () =>
      askStore.open({
        aboutPage: {
          title: "Accounts",
          url: "https://solana.com/developers/docs/core/accounts",
        },
      }),
    );
    await ask("What is rent?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    const turn = screen.getAllByRole("listitem")[0]!;
    const context = turn.querySelector("p")!;
    expect(context.textContent).toBe("AccountsThis page: Accounts");
    expect(within(turn).getByRole("heading", { level: 3 }).textContent).toBe(
      "You: What is rent?",
    );
  });

  it("turns the field red and counts characters when the question is too long", async () => {
    renderAsk();
    await act(async () => askStore.open());
    fireEvent.change(composer(), { target: { value: "x".repeat(4100) } });
    expect(composer()).toHaveAttribute("aria-invalid", "true");
    expect(composer().parentElement!.className).toContain("var(--sol-red)");
    expect(screen.getByText("4,100/4,000")).toBeInTheDocument();
    fireEvent.change(composer(), { target: { value: "Short" } });
    expect(composer()).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByText(/\/4,000/)).toBeNull();
  });

  it("folds an older failed turn to “Didn’t finish.”", async () => {
    chats.push(
      () =>
        new Response(sse("error", { message: "boom" }), {
          headers: { "content-type": "text/event-stream" },
        }),
      answer(),
    );
    renderAsk();
    await act(async () => askStore.open());
    await ask("First?");
    await screen.findByRole("button", { name: "Try again" });
    await ask("Second?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    const first = screen.getAllByRole("listitem")[0]!;
    expect(within(first).getByText("Didn’t finish.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
  });

  it("puts a rate-limited question back in the composer, with no Try again", async () => {
    chats.push(
      new Response(JSON.stringify({ error: "rate_limited" }), { status: 429 }),
    );
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText(
      "You’ve asked several questions in a row. Wait a minute, then send it again.",
      { selector: "p > bdi" },
    );
    await waitFor(() => expect(composer().value).toBe("What is a mint?"));
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
  });

  it("puts a refused question back once, not again after a reload", async () => {
    chats.push(
      new Response(JSON.stringify({ error: "rate_limited" }), { status: 429 }),
    );
    const view = renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await waitFor(() => expect(composer().value).toBe("What is a mint?"));
    // Kept with the thread, so a reload knows.
    const saved = () =>
      JSON.parse(sessionStorage.getItem("docs-ask:thread:v1")!);
    expect(saved().messages.at(-1)).toMatchObject({
      error: "rateLimited",
      questionRestored: true,
    });
    // A reload of a thread whose question went back already, and which the
    // reader then cleared: the composer stays empty.
    sessionStorage.setItem(
      "docs-ask:thread:v1",
      JSON.stringify({
        conversationId: null,
        messages: [
          { id: "q-reload", role: "user", text: "Who can mint more?" },
          {
            id: "a-reload",
            role: "assistant",
            state: "error",
            text: "",
            error: "conversationNotFound",
            questionRestored: true,
          },
        ],
      }),
    );
    view.unmount();
    resetAskStoreForTests();
    renderAsk();
    await act(async () => askStore.open());
    await screen.findByText(
      "This chat expired, so Ask AI no longer has your earlier messages. Add any details your question needs and send it again.",
      { selector: "p > bdi" },
    );
    expect(composer().value).toBe("");
  });

  it("offers Jump to latest only while something new is below", async () => {
    chats.push(answer());
    const stream = controllable();
    chats.push(stream.response);
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    await screen.findByText("A mint account defines a token.", {
      selector: "p",
    });
    // Reading up a finished answer: nothing new, no pill.
    await act(async () => scrolledUp());
    expect(screen.queryByRole("button", { name: "Jump to latest" })).toBeNull();

    // An answer arriving while the reader is up the thread.
    await ask("And rent?");
    await act(async () => scrolledUp());
    await act(async () => stream.send("delta", { text: "Rent is" }));
    const jump = await screen.findByRole("button", { name: "Jump to latest" });
    expect(jump.className).toContain("end-4");
    await act(async () => fireEvent.click(jump));
    expect(screen.queryByRole("button", { name: "Jump to latest" })).toBeNull();
  });

  it("closes when a docs link in the answer is followed", async () => {
    chats.push(answer());
    renderAsk();
    await act(async () => askStore.open());
    await ask("What is a mint?");
    const source = await screen.findByRole("link", { name: /Mint accounts/ });
    // jsdom can't navigate; the panel's own handler runs first.
    const stay = (event: Event) => event.preventDefault();
    document.addEventListener("click", stay);
    await act(async () => fireEvent.click(source));
    document.removeEventListener("click", stay);
    expect(askStore.getState().open).toBe(false);
  });
});
