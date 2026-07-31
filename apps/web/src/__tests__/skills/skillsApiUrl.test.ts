import { describe, expect, it } from "vitest";
import { SOLANA_DEV_SKILLS_GITHUB_API_URL } from "@/components/skills/skills";

describe("SOLANA_DEV_SKILLS_GITHUB_API_URL", () => {
  it("targets the canonical solana-dev-skill references path", () => {
    expect(SOLANA_DEV_SKILLS_GITHUB_API_URL).toBe(
      "https://api.github.com/repos/solana-foundation/solana-dev-skill/contents/skills/solana-dev/references",
    );
  });

  it("does not use the stale singular /contents/skill/references path", () => {
    expect(SOLANA_DEV_SKILLS_GITHUB_API_URL).not.toContain(
      "/contents/skill/references",
    );
  });
});
