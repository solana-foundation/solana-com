import { describe, expect, it } from "vitest";
import {
  answerParts,
  isLongAnswer,
  splitLead,
} from "@/components/docs/ask/answer-fold";

const code = (n: number) => `\`\`\`ts\nconst value${n} = ${n};\n\`\`\``;

describe("isLongAnswer", () => {
  it("uses Bri's thresholds: 1,600 characters, 36 lines, two code blocks", () => {
    expect(isLongAnswer("x".repeat(1600))).toBe(false);
    expect(isLongAnswer("x".repeat(1601))).toBe(true);
    expect(isLongAnswer(Array(36).fill("line").join("\n"))).toBe(false);
    expect(isLongAnswer(Array(37).fill("line").join("\n"))).toBe(true);
    expect(isLongAnswer(`One block.\n\n${code(1)}`)).toBe(false);
    expect(isLongAnswer(`Two blocks.\n\n${code(1)}\n\n${code(2)}`)).toBe(true);
  });
});

describe("splitLead", () => {
  it("leads with the first paragraph and keeps code whole", () => {
    const first = `A PDA is an address with no private key. ${"It is derived from seeds and a program id. ".repeat(4)}`;
    const { lead, rest } = splitLead(
      `${first}\n\n${code(1).replace("\n", "\n\n")}\n\nMore.`,
    );
    expect(lead).toBe(first);
    expect(rest).toContain("const value1");
    expect(rest!.match(/```/g)).toHaveLength(2);
  });

  it("adds a second paragraph after a short lead-in, and a heading above", () => {
    expect(splitLead("## PDAs\n\nShort.\n\nSecond.\n\nThird.")).toEqual({
      lead: "## PDAs\n\nShort.\n\nSecond.",
      rest: "Third.",
    });
    expect(splitLead("Short:\n\n- one\n- two\n\nAfter.")).toEqual({
      lead: "Short:",
      rest: "- one\n- two\n\nAfter.",
    });
  });

  it("leads with the first block when the answer opens with a list or code", () => {
    expect(splitLead("- one\n- two\n\nAfter.")).toEqual({
      lead: "- one\n- two",
      rest: "After.",
    });
  });

  it("has no rest while the first paragraph is still arriving", () => {
    expect(splitLead("A PDA is")).toEqual({ lead: "A PDA is", rest: null });
  });
});

describe("answerParts", () => {
  const sectioned = (inDepth: string) =>
    `### Summary response\nA mint defines a token.\n\n### Indepth response\n${inDepth}`;

  it("reads a short in-depth part inline once the answer is done", () => {
    expect(answerParts(sectioned("It stores decimals."), false)).toEqual({
      lead: "A mint defines a token.",
      rest: "It stores decimals.",
      fold: false,
      sectioned: true,
    });
  });

  it("folds a long in-depth part, and any in-depth part while it streams", () => {
    const long = `${code(1)}\n\n${code(2)}`;
    expect(answerParts(sectioned(long), false).fold).toBe(true);
    expect(answerParts(sectioned("It stores"), true).fold).toBe(true);
  });

  it("folds at Bri's lower thresholds beside a visual", () => {
    const medium = "It stores decimals and the mint authority. ".repeat(16);
    expect(answerParts(sectioned(medium), false).fold).toBe(false);
    expect(answerParts(sectioned(medium), false, true).fold).toBe(true);
    expect(answerParts(sectioned(code(1)), false, true).fold).toBe(true);
    expect(
      answerParts(sectioned("It stores decimals."), false, true),
    ).toMatchObject({ fold: false });
  });

  it("reads GLM's bold labels like the headings", () => {
    expect(
      answerParts(
        "**Summary response:**\nA mint defines a token.\n\n**In-depth response:**\nIt stores decimals.",
        false,
      ),
    ).toEqual({
      lead: "A mint defines a token.",
      rest: "It stores decimals.",
      fold: false,
      sectioned: true,
    });
  });

  it("has no lead while only a label has arrived", () => {
    for (const text of ["**Summ", "**Summary response:**", "### Summary"])
      expect(answerParts(text, true)).toMatchObject({ lead: "", rest: null });
    expect(answerParts("**Summary response:** A mint", true).lead).toBe(
      "A mint",
    );
  });

  it("keeps a streaming summary whole before the in-depth heading arrives", () => {
    const parts = answerParts(
      "### Summary response\nFirst paragraph.\n\nSecond paragraph.\n\nThird.",
      true,
    );
    expect(parts.rest).toBeNull();
    expect(parts.lead).toContain("Third.");
  });

  it("reads a short answer without headings as one text", () => {
    expect(answerParts("One.\n\nTwo.\n\nThree.", false)).toEqual({
      lead: "One.\n\nTwo.\n\nThree.",
      rest: null,
      fold: false,
      sectioned: false,
    });
  });

  it("folds all but the opening of a long answer without headings", () => {
    const body = `${"Opening sentence that runs on. ".repeat(8)}\n\n${code(1)}\n\n${code(2)}`;
    const parts = answerParts(body, false);
    expect(parts.fold).toBe(true);
    expect(parts.lead).toMatch(/^Opening/);
    expect(parts.rest).toContain("const value2");
  });

  it("folds the rest of an answer without headings while it streams", () => {
    expect(answerParts("One.\n\nTwo.\n\nThree", true)).toMatchObject({
      lead: "One.\n\nTwo.",
      rest: "Three",
      fold: true,
    });
  });
});
