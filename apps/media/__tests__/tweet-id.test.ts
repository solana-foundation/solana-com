import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { tweetIdField } from "@/lib/keystatic/tweet-id-field";
import { normalizeTweetId } from "@/lib/tweet-id";

describe("normalizeTweetId", () => {
  it.each([
    ["2087597654276477298", "2087597654276477298"],
    [
      "https://x.com/jacobvcreech/status/2087597654276477298?s=46",
      "2087597654276477298",
    ],
    [
      "https://twitter.com/i/web/status/2087597654276477298/photo/1",
      "2087597654276477298",
    ],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeTweetId(input)).toBe(expected);
  });

  it.each([
    "",
    "not-a-tweet",
    "https://example.com/user/status/2087597654276477298",
    "https://x.com.example.com/user/status/2087597654276477298",
    "https://x.com/user/status/not-numeric",
  ])("rejects %s", (input) => {
    expect(normalizeTweetId(input)).toBeNull();
  });
});

describe("Keystatic tweet field", () => {
  it("validates and serializes a pasted URL as a numeric ID", () => {
    const input = "https://x.com/jacobvcreech/status/2087597654276477298?s=46";

    expect(tweetIdField.validate(input, undefined)).toBe("2087597654276477298");
    expect(tweetIdField.serialize(input)).toEqual({
      value: "2087597654276477298",
    });
  });

  it("rejects unsupported tweet values", () => {
    expect(() =>
      tweetIdField.validate(
        "https://example.com/user/status/2087597654276477298",
        undefined,
      ),
    ).toThrow("valid X/Twitter status URL");
  });
});

describe("media tweet content contract", () => {
  it("stores every tweet embed as a canonical numeric ID", () => {
    const postsDir = join(import.meta.dirname, "../content/posts");
    const invalid: string[] = [];

    for (const filename of readdirSync(postsDir).filter((name) =>
      name.endsWith(".mdx"),
    )) {
      const content = readFileSync(join(postsDir, filename), "utf8");
      for (const tag of content.match(/<tweet\b[^>]*>/gi) ?? []) {
        if (!/^<tweet\s+id=["']\d{1,40}["']\s*\/>$/i.test(tag)) {
          invalid.push(`${filename}: ${tag}`);
        }
      }
    }

    expect(invalid).toEqual([]);
  });
});
