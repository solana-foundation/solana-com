import { describe, expect, it } from "vitest";
import { awardCategories } from "@/content/awards";
import {
  findApprovedFinalist,
  validateFinalistRoster,
} from "@/content/awards-finalists";

const completeRoster = awardCategories.map(({ id }) => ({
  categoryId: id,
  finalists: [
    { name: "Candidate One", twitterHandle: "@candidate_one" },
    { name: "Candidate Two", twitterHandle: "@candidate_two" },
  ],
}));

describe("approved awards finalists", () => {
  it("requires all current categories", () => {
    expect(validateFinalistRoster(completeRoster)).toBe(true);
    expect(validateFinalistRoster(completeRoster.slice(1))).toBe(false);
  });

  it("rejects duplicate categories and nominees within a category", () => {
    expect(
      validateFinalistRoster([...completeRoster, completeRoster[0]!]),
    ).toBe(false);
    expect(
      validateFinalistRoster([
        {
          ...completeRoster[0]!,
          finalists: [
            completeRoster[0]!.finalists[0]!,
            completeRoster[0]!.finalists[0]!,
          ],
        },
        ...completeRoster.slice(1),
      ]),
    ).toBe(false);
  });

  it("rejects malformed handles", () => {
    expect(
      validateFinalistRoster([
        {
          ...completeRoster[0]!,
          finalists: [
            { name: "Invalid", twitterHandle: "bad handle" },
            completeRoster[0]!.finalists[1]!,
          ],
        },
        ...completeRoster.slice(1),
      ]),
    ).toBe(false);
    expect(
      validateFinalistRoster([
        {
          ...completeRoster[0]!,
          finalists: [
            { name: "Mixed case", twitterHandle: "@Candidate_One" },
            completeRoster[0]!.finalists[1]!,
          ],
        },
        ...completeRoster.slice(1),
      ]),
    ).toBe(false);
  });

  it("only accepts a finalist in the matching category", () => {
    const roster = completeRoster.map((entry, index) => ({
      ...entry,
      finalists: entry.finalists.map((finalist, nomineeIndex) => ({
        ...finalist,
        twitterHandle: `@candidate_${index}_${nomineeIndex}`,
      })),
    }));
    const firstHandle = roster[0]!.finalists[0]!.twitterHandle;
    expect(
      findApprovedFinalist(roster[0]!.categoryId, firstHandle, roster),
    ).toBeDefined();
    expect(
      findApprovedFinalist(roster[1]!.categoryId, firstHandle, roster),
    ).toBeUndefined();
  });
});
