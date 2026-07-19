import { describe, expect, it } from "vitest";
import { parseSkillMarkdown } from "@/app/[locale]/skills/skills";

const CANONICAL_HTML_URL =
  "https://github.com/solana-foundation/solana-dev-skill/blob/main/skills/solana-dev/references/security.md";

describe("parseSkillMarkdown endorsed skill URL", () => {
  it("falls back to the canonical html_url when frontmatter url is stale/invalid", () => {
    const content = [
      "---",
      "title: Security Checklist",
      "description: Program and client security checklist.",
      "url: https://github.com/solana-foundation/solana-dev-skill/blob/main/skill/references/security.md",
      "---",
      "",
      "# Security",
    ].join("\n");

    const skill = parseSkillMarkdown(
      "security.md",
      content,
      CANONICAL_HTML_URL,
    );

    expect(skill.githubUrl).toBe(CANONICAL_HTML_URL);
    expect(skill.githubUrl).not.toContain("/skill/references/");
  });

  it("uses the canonical html_url when frontmatter has no url", () => {
    const content = [
      "---",
      "title: Frontend",
      "description: Frontend reference.",
      "---",
      "",
      "# Frontend",
    ].join("\n");

    const skill = parseSkillMarkdown(
      "frontend.md",
      content,
      CANONICAL_HTML_URL,
    );

    expect(skill.githubUrl).toBe(CANONICAL_HTML_URL);
  });

  it("honors a canonical frontmatter url when present", () => {
    const canonicalFrontmatterUrl =
      "https://github.com/solana-foundation/solana-dev-skill/blob/main/skills/solana-dev/references/testing.md";
    const content = [
      "---",
      "title: Testing",
      "description: Testing reference.",
      `url: ${canonicalFrontmatterUrl}`,
      "---",
      "",
      "# Testing",
    ].join("\n");

    const skill = parseSkillMarkdown("testing.md", content, CANONICAL_HTML_URL);

    expect(skill.githubUrl).toBe(canonicalFrontmatterUrl);
  });
});
