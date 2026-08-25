import { describe, expect, it } from "vitest";

import {
  capitalize,
  capitalizeFirstChar,
  createSlugFromTitle,
  isString,
  truncateTextByWord,
} from "@/utils/stringUtils";

describe("truncateTextByWord", () => {
  it("returns text that already fits unchanged", () => {
    expect(truncateTextByWord("hello world", 20)).toBe("hello world");
    expect(truncateTextByWord("hello world", 20, "...")).toBe("hello world");
  });

  it("keeps the final word when the text is exactly at the limit", () => {
    // Regression: the trailing-word strip used to run even when no truncation
    // was needed, silently dropping the last word.
    expect(truncateTextByWord("hello world", 11)).toBe("hello world");
    expect(truncateTextByWord("hello world", 11, "...")).toBe("hello world");
    expect(truncateTextByWord("a b", 3)).toBe("a b");
  });

  it("truncates on a word boundary", () => {
    expect(truncateTextByWord("one two three four five", 12, "...")).toBe(
      "one two...",
    );
    expect(truncateTextByWord("one two three four five", 12)).toBe("one two");
  });

  it("never returns more characters than the requested length", () => {
    const samples: Array<[string, number, string]> = [
      ["supercalifragilistic", 10, "..."],
      ["one two three four five", 12, "..."],
      ["one two three four five", 5, "..."],
      ["hello world", 4, "..."],
      ["a bb ccc dddd eeeee", 9, " [more]"],
      ["lorem ipsum dolor sit amet", 26, "..."],
    ];

    for (const [text, limit, append] of samples) {
      expect(
        truncateTextByWord(text, limit, append).length,
      ).toBeLessThanOrEqual(limit);
    }
  });

  it("hard-clips a single word longer than the budget", () => {
    // Regression: this used to emit "superca ..." (11 chars) for a limit of 10.
    expect(truncateTextByWord("supercalifragilistic", 10, "...")).toBe(
      "superca...",
    );
    expect(truncateTextByWord("supercalifragilistic", 10)).toBe("supercalif");
  });

  it("appends the postfix without inserting a separating space", () => {
    expect(truncateTextByWord("one two three", 9, "...")).toBe("one...");
  });

  it("degrades to a clipped postfix when there is no room for text", () => {
    expect(truncateTextByWord("hello world", 3, "...")).toBe("...");
    expect(truncateTextByWord("hello world", 2, "...")).toBe("..");
  });

  it("handles an empty postfix and empty text", () => {
    expect(truncateTextByWord("", 10)).toBe("");
    expect(truncateTextByWord("", 10, "...")).toBe("");
  });
});

describe("capitalizeFirstChar", () => {
  it("upper-cases only the first character", () => {
    expect(capitalizeFirstChar("solana")).toBe("Solana");
    expect(capitalizeFirstChar("sOLANA")).toBe("SOLANA");
  });

  it("returns an empty string for empty input", () => {
    expect(capitalizeFirstChar("")).toBe("");
  });
});

describe("capitalize", () => {
  it("title-cases every word", () => {
    expect(capitalize("solana changelog")).toBe("Solana Changelog");
    expect(capitalize("  SOLANA CHANGELOG  ")).toBe("Solana Changelog");
  });
});

describe("isString", () => {
  it("recognizes primitives and String objects", () => {
    expect(isString("solana")).toBe(true);
    expect(isString(new String("solana"))).toBe(true);
  });

  it("rejects non-strings", () => {
    expect(isString(42)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });
});

describe("createSlugFromTitle", () => {
  it("lower-cases and collapses whitespace", () => {
    expect(createSlugFromTitle("Solana Changelog")).toBe("solanachangelog");
    expect(createSlugFromTitle("Solana Changelog", "-")).toBe(
      "solana-changelog",
    );
  });
});
