import { describe, expect, it } from "vitest";

import {
  DEFAULT_EPISODE_LIMIT,
  MAX_EPISODE_LIMIT,
  MAX_EPISODE_OFFSET,
  parseEpisodeLimit,
  parseEpisodeOffset,
} from "@/lib/podcast-pagination";

describe("parseEpisodeLimit", () => {
  it("accepts positive whole numbers", () => {
    expect(parseEpisodeLimit("1")).toBe(1);
    expect(parseEpisodeLimit("24")).toBe(24);
  });

  it("falls back to the default when the value is missing", () => {
    expect(parseEpisodeLimit(null)).toBe(DEFAULT_EPISODE_LIMIT);
    expect(parseEpisodeLimit(undefined)).toBe(DEFAULT_EPISODE_LIMIT);
    expect(parseEpisodeLimit("")).toBe(DEFAULT_EPISODE_LIMIT);
  });

  it("falls back to the default for non-numeric input", () => {
    // Regression: `parseInt("abc")` is NaN, and `slice(0, NaN)` returns an
    // empty array, so the endpoint answered with zero episodes.
    expect(parseEpisodeLimit("abc")).toBe(DEFAULT_EPISODE_LIMIT);
    expect(parseEpisodeLimit("NaN")).toBe(DEFAULT_EPISODE_LIMIT);
  });

  it("falls back to the default for zero and negative limits", () => {
    expect(parseEpisodeLimit("0")).toBe(DEFAULT_EPISODE_LIMIT);
    expect(parseEpisodeLimit("-5")).toBe(DEFAULT_EPISODE_LIMIT);
  });

  it("caps the limit so a caller cannot request the whole feed", () => {
    expect(parseEpisodeLimit("999999")).toBe(MAX_EPISODE_LIMIT);
    expect(parseEpisodeLimit(String(MAX_EPISODE_LIMIT + 1))).toBe(
      MAX_EPISODE_LIMIT,
    );
  });

  it("parses in base 10", () => {
    expect(parseEpisodeLimit("08")).toBe(8);
  });
});

describe("parseEpisodeOffset", () => {
  it("accepts non-negative whole numbers", () => {
    expect(parseEpisodeOffset("0")).toBe(0);
    expect(parseEpisodeOffset("36")).toBe(36);
  });

  it("falls back to zero when the value is missing", () => {
    expect(parseEpisodeOffset(null)).toBe(0);
    expect(parseEpisodeOffset(undefined)).toBe(0);
    expect(parseEpisodeOffset("")).toBe(0);
  });

  it("falls back to zero for non-numeric input", () => {
    expect(parseEpisodeOffset("abc")).toBe(0);
  });

  it("rejects negative offsets that would slice from the end of the feed", () => {
    // Regression: `slice(-5, 7)` counts from the end, so a negative offset
    // returned tail episodes and a bogus nextCursor.
    expect(parseEpisodeOffset("-5")).toBe(0);
    expect(parseEpisodeOffset("-1")).toBe(0);
  });

  it("caps the offset", () => {
    expect(parseEpisodeOffset("999999999")).toBe(MAX_EPISODE_OFFSET);
  });
});

describe("pagination results stay usable downstream", () => {
  const episodes = Array.from({ length: 30 }, (_, index) => index);

  const paginate = (limitParam: string | null, offsetParam: string | null) => {
    const limit = parseEpisodeLimit(limitParam);
    const offset = parseEpisodeOffset(offsetParam);
    const hasMore = offset + limit < episodes.length;

    return {
      episodes: episodes.slice(offset, offset + limit),
      hasMore,
      nextCursor: hasMore ? String(offset + limit) : undefined,
    };
  };

  it("returns a full page for valid input", () => {
    const result = paginate("12", "0");

    expect(result.episodes).toHaveLength(12);
    expect(result.episodes[0]).toBe(0);
    expect(result.nextCursor).toBe("12");
  });

  it("returns a page instead of nothing for a non-numeric limit", () => {
    expect(paginate("abc", "0").episodes).toHaveLength(DEFAULT_EPISODE_LIMIT);
  });

  it("returns the first page instead of tail episodes for a negative offset", () => {
    expect(paginate("12", "-5").episodes[0]).toBe(0);
  });

  it("never emits a NaN cursor", () => {
    const inputs: Array<[string | null, string | null]> = [
      ["abc", "abc"],
      ["abc", "0"],
      ["12", "abc"],
      ["-1", "-1"],
      [null, null],
    ];

    for (const [limitParam, offsetParam] of inputs) {
      expect(paginate(limitParam, offsetParam).nextCursor).not.toBe("NaN");
    }
  });
});
