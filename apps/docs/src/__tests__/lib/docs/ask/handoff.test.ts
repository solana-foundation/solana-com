import { beforeEach, describe, expect, it } from "vitest";
import { ASK_STORAGE_KEYS } from "@/lib/docs/ask/config";
import {
  ASK_HANDOFF_TTL_MS,
  discardHandoff,
  fullscreenHref,
  isThreadId,
  newThreadId,
  parseHandoff,
  pruneHandoffs,
  readFullscreenLink,
  readHandoff,
  withoutFullscreenParams,
  writeHandoff,
} from "@/lib/docs/ask/handoff";

const ID = "0123456789abcdef01234567";
const KEY = `${ASK_STORAGE_KEYS.handoff}${ID}`;
const NOW = 1_800_000_000_000;

const ACCOUNTS = {
  title: "Accounts",
  url: "https://solana.com/developers/docs/core/accounts",
};

const snapshot = {
  messages: [
    {
      id: "u1",
      role: "user",
      text: "What is a PDA?",
      quote: { text: "A program derived address" },
    },
    { id: "a1", role: "assistant", state: "done", text: "An address." },
  ],
  conversationId: "7",
  pendingReset: null,
  pageContext: ACCOUNTS,
  composerDraft: "And rent?",
  composerQuote: {
    text: "let pda = find();",
    code: true,
    language: "rust",
    pageContext: ACCOUNTS,
  },
};

/** Bri's session token key (@solana-com/ui-chrome/ask-solana/api). */
const SESSION_KEY = "ask-solana:session";

beforeEach(() => {
  localStorage.clear();
});

describe("full-screen link", () => {
  it("is this page with its query and hash, plus ask=full and the thread", () => {
    expect(
      fullscreenHref(
        {
          pathname: "/ja/developers/docs/core/accounts",
          search: "?view=a%20b&flag",
          hash: "#rent",
        },
        ID,
      ),
    ).toBe(
      `/ja/developers/docs/core/accounts?view=a%20b&flag&ask=full&askThread=${ID}#rent`,
    );
    expect(
      fullscreenHref({ pathname: "/developers", search: "", hash: "" }, ID),
    ).toBe(`/developers?ask=full&askThread=${ID}`);
  });

  it("replaces a link's own params instead of repeating them", () => {
    expect(
      fullscreenHref(
        {
          pathname: "/developers/docs",
          search: "?ask=full&q=x&askThread=old",
          hash: "",
        },
        ID,
      ),
    ).toBe(`/developers/docs?q=x&ask=full&askThread=${ID}`);
  });

  it("reads the request: full screen, and the thread only if it is one of ours", () => {
    expect(readFullscreenLink("")).toBeNull();
    expect(readFullscreenLink("?ask=docked")).toBeNull();
    expect(readFullscreenLink("?ask=full")).toEqual({ threadId: null });
    expect(readFullscreenLink("?ask=full&askThread=../x")).toEqual({
      threadId: null,
    });
    expect(readFullscreenLink(`?q=1&ask=full&askThread=${ID}`)).toEqual({
      threadId: ID,
    });
  });

  it("cleans the URL, keeping the other params as written and the hash", () => {
    expect(
      withoutFullscreenParams({
        pathname: "/developers/docs/core/accounts",
        search: `?view=a%20b&ask=full&askThread=${ID}&flag`,
        hash: "#rent",
      }),
    ).toBe("/developers/docs/core/accounts?view=a%20b&flag#rent");
    expect(
      withoutFullscreenParams({
        pathname: "/developers",
        search: `?ask=full&askThread=${ID}`,
        hash: "",
      }),
    ).toBe("/developers");
  });

  it("mints random thread ids that pass its own check", () => {
    const a = newThreadId();
    const b = newThreadId();
    expect(isThreadId(a)).toBe(true);
    expect(a).not.toBe(b);
    expect(isThreadId("")).toBe(false);
    expect(isThreadId("short")).toBe(false);
  });
});

describe("handoff", () => {
  it("is written, read by every tab that asks, then discarded", () => {
    expect(writeHandoff(localStorage, ID, snapshot, NOW)).toBe(NOW);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      v: 1,
      savedAt: NOW,
      ...snapshot,
    });
    const handoff = { v: 1, savedAt: NOW, ...snapshot };
    // Two tabs opened from the same link both get it.
    expect(readHandoff(localStorage, ID, NOW + 1_000)).toEqual(handoff);
    expect(readHandoff(localStorage, ID, NOW + 1_250)).toEqual(handoff);
    expect(parseHandoff(localStorage.getItem(KEY), NOW + 1_000)).toEqual(
      handoff,
    );
    discardHandoff(localStorage, ID, NOW);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(readHandoff(localStorage, ID, NOW + 1_000)).toBeNull();
  });

  it("expires after 10 minutes", () => {
    writeHandoff(localStorage, ID, snapshot, NOW);
    expect(readHandoff(localStorage, ID, NOW + ASK_HANDOFF_TTL_MS)).not.toBe(
      null,
    );
    expect(readHandoff(localStorage, ID, NOW + ASK_HANDOFF_TTL_MS + 1)).toBe(
      null,
    );
    // Saved "later" than now (a clock change): not trusted either.
    writeHandoff(localStorage, ID, snapshot, NOW + 5_000);
    expect(readHandoff(localStorage, ID, NOW)).toBeNull();
  });

  it("drops what it cannot trust in a snapshot", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        v: 1,
        savedAt: NOW,
        messages: "nope",
        conversationId: "  ",
        pendingReset: "maybe",
        pageContext: { title: "x", url: "javascript:alert(1)" },
        composerDraft: 3,
        composerQuote: { text: 5 },
      }),
    );
    expect(readHandoff(localStorage, ID, NOW)).toEqual({
      v: 1,
      savedAt: NOW,
      messages: [],
      conversationId: null,
      pendingReset: null,
      pageContext: null,
      composerDraft: "",
      composerQuote: null,
    });
    // A quote keeps its words without a page it can't trust; snapshots
    // from before quotes have none.
    localStorage.setItem(
      KEY,
      JSON.stringify({
        v: 1,
        savedAt: NOW,
        composerQuote: {
          text: "Rent",
          code: "yes",
          language: "<script>",
          pageContext: { title: "x", url: "javascript:alert(1)" },
        },
      }),
    );
    expect(readHandoff(localStorage, ID, NOW)?.composerQuote).toEqual({
      text: "Rent",
    });
    localStorage.setItem(KEY, JSON.stringify({ v: 1, savedAt: NOW }));
    expect(readHandoff(localStorage, ID, NOW)?.composerQuote).toBeNull();
    localStorage.setItem(KEY, JSON.stringify({ v: 2, savedAt: NOW }));
    expect(readHandoff(localStorage, ID, NOW)).toBeNull();
    localStorage.setItem(KEY, "{not json");
    expect(readHandoff(localStorage, ID, NOW)).toBeNull();
    expect(readHandoff(localStorage, "../../etc", NOW)).toBeNull();
  });

  it("prunes expired and unreadable handoffs when writing, and nothing else", () => {
    const other = `${ASK_STORAGE_KEYS.handoff}ffffffffffffffff`;
    const old = `${ASK_STORAGE_KEYS.handoff}eeeeeeeeeeeeeeee`;
    const broken = `${ASK_STORAGE_KEYS.handoff}dddddddddddddddd`;
    localStorage.setItem(other, JSON.stringify({ v: 1, savedAt: NOW - 1_000 }));
    localStorage.setItem(
      old,
      JSON.stringify({ v: 1, savedAt: NOW - ASK_HANDOFF_TTL_MS - 1 }),
    );
    localStorage.setItem(broken, "{");
    localStorage.setItem(SESSION_KEY, "secret-token");
    localStorage.setItem(ASK_STORAGE_KEYS.width, "480");
    writeHandoff(localStorage, ID, snapshot, NOW);
    expect(localStorage.getItem(old)).toBeNull();
    expect(localStorage.getItem(broken)).toBeNull();
    expect(localStorage.getItem(other)).not.toBeNull();
    expect(localStorage.getItem(KEY)).not.toBeNull();
    expect(localStorage.getItem(SESSION_KEY)).toBe("secret-token");
    expect(localStorage.getItem(ASK_STORAGE_KEYS.width)).toBe("480");
    expect(localStorage.getItem(KEY)).not.toContain("secret-token");
    pruneHandoffs(localStorage, NOW + ASK_HANDOFF_TTL_MS + 1);
    expect(localStorage.getItem(other)).toBeNull();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("is discarded only while it is still the one written", () => {
    writeHandoff(localStorage, ID, snapshot, NOW);
    discardHandoff(localStorage, ID, NOW - 1);
    expect(localStorage.getItem(KEY)).not.toBeNull();
    discardHandoff(localStorage, ID, NOW);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("survives storage that is missing, full or blocked", () => {
    const full = {
      length: 0,
      key: () => null,
      getItem: () => null,
      setItem: () => {
        throw new DOMException("full", "QuotaExceededError");
      },
      removeItem: () => undefined,
      clear: () => undefined,
    } satisfies Storage;
    const blocked = {
      ...full,
      get length(): number {
        throw new DOMException("denied", "SecurityError");
      },
      getItem: () => {
        throw new DOMException("denied", "SecurityError");
      },
    } satisfies Storage;
    expect(writeHandoff(null, ID, snapshot, NOW)).toBeNull();
    expect(writeHandoff(full, ID, snapshot, NOW)).toBeNull();
    expect(writeHandoff(blocked, ID, snapshot, NOW)).toBeNull();
    expect(readHandoff(null, ID, NOW)).toBeNull();
    expect(readHandoff(blocked, ID, NOW)).toBeNull();
    expect(() => pruneHandoffs(blocked, NOW)).not.toThrow();
    expect(() => discardHandoff(blocked, ID, NOW)).not.toThrow();
  });
});
