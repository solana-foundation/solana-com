import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnswerMarkdown, markdownToPlainPreview } from "../ask-solana/markdown";

describe("AnswerMarkdown", () => {
  it("renders terminal fences as compact command rows", () => {
    const html = renderToStaticMarkup(
      React.createElement(AnswerMarkdown, {
        isDark: true,
        content: [
          "```terminal",
          "$ solana config set --url devnet",
          "$ solana airdrop 2",
          "```",
        ].join("\n"),
      }),
    );

    expect(html).toContain("Copy commands");
    expect(html).toContain("Copy command");
    expect(html).toContain("solana config set --url devnet");
    expect(html).not.toContain("<pre");
  });

  it("keeps regular code fences as code blocks", () => {
    const html = renderToStaticMarkup(
      React.createElement(AnswerMarkdown, {
        isDark: true,
        content: ["```ts", "const amount = 100n;", "```"].join("\n"),
      }),
    );

    expect(html).toContain("<pre");
    expect(html).toContain("const amount = 100n;");
  });

  it("creates a text-only collapsed preview without fenced code", () => {
    const preview = markdownToPlainPreview(
      [
        "Use the CLI path.",
        "",
        "```bash",
        "solana config set --url devnet",
        "spl-token create-token",
        "```",
        "",
        "Then mint supply.",
      ].join("\n"),
    );

    expect(preview).toContain("Use the CLI path.");
    expect(preview).toContain("Then mint supply.");
    expect(preview).not.toContain("spl-token create-token");
    expect(preview).not.toContain("```");
  });
});
