import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackAskSolana } from "@solana-com/ui-chrome/ask-solana/analytics";
import { connectAskAnalytics, redactQuery } from "@/lib/docs/ask/analytics";

let gtag: ReturnType<
  typeof vi.fn<(command: string, ...args: unknown[]) => void>
>;
let disconnect: () => void;

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "production");
  gtag = vi.fn<(command: string, ...args: unknown[]) => void>();
  window.gtag = gtag;
  disconnect = connectAskAnalytics();
});

afterEach(() => {
  disconnect();
  delete window.gtag;
  vi.unstubAllEnvs();
});

describe("Ask AI analytics in GA4", () => {
  it("sends Bri's events with her properties, as the docs app", () => {
    trackAskSolana("docs_ai_message_sent", {
      conversation_id: "7",
      message_length: 15,
      surface: "docked",
    });
    trackAskSolana("docs_ai_widget_expanded", {});
    expect(gtag.mock.calls).toEqual([
      [
        "event",
        "docs_ai_message_sent",
        {
          conversation_id: "7",
          message_length: 15,
          surface: "docked",
          app_name: "docs",
        },
      ],
      ["event", "docs_ai_widget_expanded", { app_name: "docs" }],
    ]);
  });

  it("leaves out what GA4 can't take: no conversation yet, objects", () => {
    trackAskSolana("docs_ai_timing", {
      phase: "done",
      elapsed_ms: 1200,
      detail: undefined,
      conversation_id: null,
      surface: "overlay",
      extra: { nested: true },
    });
    expect(gtag).toHaveBeenCalledWith("event", "docs_ai_timing", {
      phase: "done",
      elapsed_ms: 1200,
      surface: "overlay",
      app_name: "docs",
    });
  });

  it("redacts email addresses and phone numbers in a search query", () => {
    trackAskSolana("docs_ai_search", {
      query: "rent for me@example.com, call +1 (415) 555-0100",
      result_count: 3,
    });
    expect(gtag).toHaveBeenCalledWith("event", "docs_ai_search", {
      query: "rent for [email], call [phone]",
      result_count: 3,
      app_name: "docs",
    });
    // Ordinary queries, numbers included, go as they are.
    expect(redactQuery("getSlot 4000 lamports")).toBe("getSlot 4000 lamports");
    expect(redactQuery("slot 312456789 paid 1500000000 lamports")).toBe(
      "slot 312456789 paid 1500000000 lamports",
    );
    expect(redactQuery("call 415-555-0100")).toBe("call [phone]");
  });

  it("sends nothing else, nothing outside production, nothing once disconnected", () => {
    trackAskSolana("something_else", { query: "x" });
    expect(gtag).not.toHaveBeenCalled();
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "preview");
    trackAskSolana("docs_ai_chat_opened", { view: "chat" });
    expect(gtag).not.toHaveBeenCalled();
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "production");
    disconnect();
    trackAskSolana("docs_ai_chat_opened", { view: "chat" });
    expect(gtag).not.toHaveBeenCalled();
  });
});
