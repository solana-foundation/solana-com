import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { awardCategories } from "@/content/awards";
import {
  type AwardFinalist,
  approvedFinalists,
  findApprovedFinalist,
  getApprovedFinalists,
  validateFinalistRoster,
} from "@/content/awards-finalists";

describe("approved awards finalists", () => {
  it("has four approved finalists with local profile images in every category", () => {
    expect(approvedFinalists).toHaveLength(awardCategories.length);
    expect(validateFinalistRoster(approvedFinalists)).toBe(true);
    expect(getApprovedFinalists()).toBe(approvedFinalists);

    for (const { finalists } of approvedFinalists) {
      expect(finalists).toHaveLength(4);
      for (const finalist of finalists) {
        expect(
          existsSync(join(process.cwd(), "public", finalist.profileImage)),
        ).toBe(true);
      }
    }
  });

  it("rejects missing or duplicate categories", () => {
    expect(validateFinalistRoster(approvedFinalists.slice(1))).toBe(false);
    expect(
      validateFinalistRoster([...approvedFinalists, approvedFinalists[0]!]),
    ).toBe(false);
  });

  it("requires four distinct finalists with valid handles and image paths", () => {
    const [first, ...rest] = approvedFinalists;
    const [candidate, ...otherCandidates] = first!.finalists;
    const withFinalists = (finalists: AwardFinalist[]) =>
      validateFinalistRoster([{ ...first!, finalists }, ...rest]);

    expect(withFinalists(otherCandidates)).toBe(false);
    expect(
      withFinalists([candidate!, candidate!, ...otherCandidates.slice(1)]),
    ).toBe(false);
    expect(
      withFinalists([
        { ...candidate!, twitterHandle: "invalid handle" },
        ...otherCandidates,
      ]),
    ).toBe(false);
    expect(
      withFinalists([
        { ...candidate!, profileImage: "/assets/other.webp" },
        ...otherCandidates,
      ]),
    ).toBe(false);
  });

  it("only accepts a finalist in the matching category", () => {
    const first = approvedFinalists[0]!;
    const second = approvedFinalists[1]!;
    const handle = first.finalists[0]!.twitterHandle;
    expect(findApprovedFinalist(first.categoryId, handle)).toBeDefined();
    expect(findApprovedFinalist(second.categoryId, handle)).toBeUndefined();
  });
});
