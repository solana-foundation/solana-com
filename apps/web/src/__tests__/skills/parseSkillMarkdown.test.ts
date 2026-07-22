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

  it("rejects a frontmatter url that only smuggles the canonical path in the query string", () => {
    const content = [
      "---",
      "title: Spoofed",
      "description: Spoofed reference.",
      "url: https://github.com/solana-foundation/solana-dev-skill/blob/main/README.md?target=/skills/solana-dev/references/security.md",
      "---",
      "",
      "# Spoofed",
    ].join("\n");

    const skill = parseSkillMarkdown("spoofed.md", content, CANONICAL_HTML_URL);

    expect(skill.githubUrl).toBe(CANONICAL_HTML_URL);
  });

  it("rejects a frontmatter url whose canonical segment is only in the fragment", () => {
    const content = [
      "---",
      "title: Fragment",
      "description: Fragment reference.",
      "url: https://github.com/solana-foundation/solana-dev-skill/blob/main/README.md#/skills/solana-dev/references/security.md",
      "---",
      "",
      "# Fragment",
    ].join("\n");

    const skill = parseSkillMarkdown(
      "fragment.md",
      content,
      CANONICAL_HTML_URL,
    );

    expect(skill.githubUrl).toBe(CANONICAL_HTML_URL);
  });

  it("rejects a frontmatter url that plants the canonical segment in the branch ref", () => {
    const content = [
      "---",
      "title: Branch Ref",
      "description: Branch ref reference.",
      "url: https://github.com/solana-foundation/solana-dev-skill/blob/skills/solana-dev/references/main/evil.md",
      "---",
      "",
      "# Branch Ref",
    ].join("\n");

    const skill = parseSkillMarkdown(
      "branch-ref.md",
      content,
      CANONICAL_HTML_URL,
    );

    expect(skill.githubUrl).toBe(CANONICAL_HTML_URL);
  });

  it("rejects a frontmatter url on a look-alike host", () => {
    const content = [
      "---",
      "title: Look-alike",
      "description: Look-alike host.",
      "url: https://github.com.evil.example/solana-foundation/solana-dev-skill/blob/main/skills/solana-dev/references/security.md",
      "---",
      "",
      "# Look-alike",
    ].join("\n");

    const skill = parseSkillMarkdown(
      "look-alike.md",
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
