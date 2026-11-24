import { describe, expect, it } from "vitest";
import {
  advanceAskStatus,
  askStatusForStage,
  normalizeCodeFollowups,
  normalizeDocsHref,
  splitAnswerSections,
} from "@/lib/docs/ask/protocol";

const followups = {
  prompt: "Do you want code?",
  buttons: [
    {
      type: "show_code",
      label: "Rust",
      language: "rust",
      message: "Show me the code for that in Rust.",
    },
  ],
};

describe("normalizeCodeFollowups", () => {
  it("keeps a prompt with valid buttons", () => {
    expect(normalizeCodeFollowups(followups)).toEqual(followups);
    expect(
      normalizeCodeFollowups({
        prompt: "Code?",
        buttons: [{ label: "TS", language: "ts", message: "In TS." }],
      }),
    ).toEqual({
      prompt: "Code?",
      buttons: [
        { type: "show_code", label: "TS", language: "ts", message: "In TS." },
      ],
    });
  });

  it("drops code follow-ups without a prompt or valid buttons", () => {
    expect(
      normalizeCodeFollowups({ prompt: "Code?", buttons: [{ label: "x" }] }),
    ).toBeNull();
    expect(normalizeCodeFollowups({ buttons: followups.buttons })).toBeNull();
    expect(normalizeCodeFollowups(null)).toBeNull();
  });
});

describe("normalizeDocsHref", () => {
  it("moves /docs links to /developers/docs", () => {
    expect(normalizeDocsHref("/docs/core/pda")).toBe(
      "/developers/docs/core/pda",
    );
    expect(normalizeDocsHref("/docs")).toBe("/developers/docs");
    expect(normalizeDocsHref("/docs/core/pda#bump?x=1")).toBe(
      "/developers/docs/core/pda#bump?x=1",
    );
  });

  it("makes solana.com docs links site-relative", () => {
    expect(normalizeDocsHref("https://solana.com/docs/core/pda")).toBe(
      "/developers/docs/core/pda",
    );
    expect(
      normalizeDocsHref("https://www.solana.com/developers/cookbook/x"),
    ).toBe("/developers/cookbook/x");
  });

  it("adds the reader's locale when the docs are translated into it", () => {
    expect(normalizeDocsHref("/docs/core/pda", "ja")).toBe(
      "/ja/developers/docs/core/pda",
    );
    expect(normalizeDocsHref("/docs/core/pda", "el")).toBe(
      "/el/developers/docs/core/pda",
    );
    expect(normalizeDocsHref("/developers/docs/core", "en")).toBe(
      "/developers/docs/core",
    );
  });

  it("keeps a link's own locale, dropping en", () => {
    expect(normalizeDocsHref("/ko/docs/core", "ja")).toBe(
      "/ko/developers/docs/core",
    );
    expect(normalizeDocsHref("/en/docs/core", "ja")).toBe(
      "/developers/docs/core",
    );
  });

  it("leaves other links alone", () => {
    expect(normalizeDocsHref("https://github.com/anza-xyz/agave")).toBe(
      "https://github.com/anza-xyz/agave",
    );
    expect(normalizeDocsHref("https://solana.com/news")).toBe(
      "https://solana.com/news",
    );
    expect(normalizeDocsHref("/developers/templates", "ja")).toBe(
      "/developers/templates",
    );
    expect(normalizeDocsHref("/docsify")).toBe("/docsify");
  });
});

describe("splitAnswerSections", () => {
  it("splits the summary from the in-depth part and drops the headings", () => {
    expect(
      splitAnswerSections(
        "### Summary response\nShort answer.\n\n### Indepth response\nLong answer.",
      ),
    ).toEqual({ summary: "Short answer.", inDepth: "Long answer." });
  });

  it("accepts heading variants", () => {
    expect(
      splitAnswerSections("## Summary\nShort.\n## In-depth response:\r\nLong."),
    ).toEqual({ summary: "Short.", inDepth: "Long." });
  });

  it("accepts GLM's bold labels, the colon inside or outside the bold", () => {
    expect(
      splitAnswerSections(
        "**Summary response:**\nShort answer.\n\n**In-depth response:**\nLong answer.",
      ),
    ).toEqual({ summary: "Short answer.", inDepth: "Long answer." });
    expect(
      splitAnswerSections(
        "**Summary response**: Short answer.\n\n**Indepth response**: Long answer.",
      ),
    ).toEqual({ summary: "Short answer.", inDepth: "Long answer." });
    expect(
      splitAnswerSections(
        "**Summary response:** Short.\n\n**In depth response:**\r\nLong.",
      ),
    ).toEqual({ summary: "Short.", inDepth: "Long." });
  });

  it("keeps other bold text", () => {
    expect(
      splitAnswerSections("**Note:** rent is a deposit.\n\n**Summary** of it."),
    ).toEqual({
      summary: "**Note:** rent is a deposit.\n\n**Summary** of it.",
      inDepth: null,
    });
  });

  it("treats text without headings as all summary", () => {
    expect(splitAnswerSections("Plain answer.")).toEqual({
      summary: "Plain answer.",
      inDepth: null,
    });
  });

  it("hides a half-streamed heading", () => {
    expect(
      splitAnswerSections("### Summary response\nShort.\n\n### Indep"),
    ).toEqual({
      summary: "Short.",
      inDepth: null,
    });
    expect(splitAnswerSections("### Summ")).toEqual({
      summary: "",
      inDepth: null,
    });
    expect(splitAnswerSections("Short.\n### Indepth response")).toEqual({
      summary: "Short.",
      inDepth: null,
    });
  });

  it("hides a half-streamed bold label", () => {
    for (const tail of [
      "**",
      "**In",
      "**In-dep",
      "**In-depth response",
      "**In-depth response:",
      "**In-depth response:*",
      "**Indepth response**",
    ]) {
      expect(
        splitAnswerSections(`**Summary response:**\nShort.\n\n${tail}`),
      ).toEqual({ summary: "Short.", inDepth: null });
    }
    for (const text of [
      "**Summ",
      "**Summary response:**",
      "**Summary response:** ",
    ])
      expect(splitAnswerSections(text)).toEqual({ summary: "", inDepth: null });
  });

  it("keeps other headings", () => {
    expect(
      splitAnswerSections("### Summary response\nA.\n### Example\nB.").summary,
    ).toBe("A.\n### Example\nB.");
  });
});

describe("status mapping", () => {
  it("maps the client's own stages to the status row", () => {
    expect(askStatusForStage("session_start")).toBe("preparing");
    expect(askStatusForStage("session_ready")).toBe("preparing");
    expect(askStatusForStage("chat_connecting")).toBe("preparing");
    expect(askStatusForStage("cache_hit")).toBe("writing");
    expect(askStatusForStage("building_visual")).toBe("visual");
    expect(askStatusForStage("something_new")).toBe("preparing");
  });

  it("maps every stage the agent sends", () => {
    const stages = {
      accepted: "preparing",
      starting: "preparing",
      searching_docs: "searching",
      reading_doc: "searching",
      using_tool: "searching",
      retrieving_docs: "searching",
      building_plan: "searching",
      response_cache_hit: "writing",
      rendering_template_answer: "writing",
      writing: "writing",
      building_visual_answer: "visual",
    };
    for (const [stage, status] of Object.entries(stages)) {
      expect([stage, askStatusForStage(stage)]).toEqual([stage, status]);
    }
  });

  it("only moves the status row forward", () => {
    expect(advanceAskStatus(undefined, "searching")).toBe("searching");
    expect(advanceAskStatus("preparing", "searching")).toBe("searching");
    expect(advanceAskStatus("searching", "preparing")).toBe("searching");
    expect(advanceAskStatus("writing", "searching")).toBe("writing");
    expect(advanceAskStatus("writing", "visual")).toBe("visual");
    expect(advanceAskStatus("visual", "writing")).toBe("visual");
  });
});
