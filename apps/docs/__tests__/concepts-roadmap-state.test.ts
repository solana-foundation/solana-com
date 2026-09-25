import { describe, expect, it } from "vitest";
import {
  parseSharedRoadmap,
  parseStoredProgress,
  serializeSharedRoadmap,
  type PersonalizationProfile,
  type UseCaseRoute,
} from "../src/components/docs/concepts-roadmap-state";

const profile: PersonalizationProfile = {
  goal: "build",
  focus: "defi",
  startingPoint: "ethereum",
  learningStyles: ["Read", "Build"],
};

const validators = {
  isPersonalizationProfile(value: unknown): value is PersonalizationProfile {
    return (
      typeof value === "object" &&
      value !== null &&
      "goal" in value &&
      value.goal === "build" &&
      "focus" in value &&
      value.focus === "defi" &&
      "startingPoint" in value &&
      value.startingPoint === "ethereum" &&
      "learningStyles" in value &&
      Array.isArray(value.learningStyles)
    );
  },
  isUseCaseRoute(value: unknown): value is UseCaseRoute {
    return ["full", "payments", "tokenization", "trading"].includes(
      value as string,
    );
  },
};

describe("roadmap persistence", () => {
  it("filters stale completion IDs from stored progress", () => {
    const progress = parseStoredProgress(
      JSON.stringify({
        completedIds: ["intro", "removed-step", 42],
        entryRoute: "ethereum",
        useCaseRoute: "payments",
        assessmentPassed: true,
        personalization: profile,
      }),
      new Set(["intro"]),
      validators,
    );

    expect(progress).toEqual({
      completedIds: ["intro"],
      entryRoute: "ethereum",
      useCaseRoute: "payments",
      assessmentPassed: true,
      personalization: profile,
    });
  });

  it("shares configuration without sharing progress", () => {
    const progress = {
      completedIds: ["intro"],
      entryRoute: "ethereum",
      useCaseRoute: "trading",
      assessmentPassed: true,
      personalization: profile,
    } as const;
    const serialized = serializeSharedRoadmap(progress);

    expect(parseSharedRoadmap(serialized, validators)).toEqual({
      entryRoute: "ethereum",
      useCaseRoute: "trading",
      personalization: profile,
    });
    expect(serialized).not.toContain("completedIds");
    expect(serialized).not.toContain("assessmentPassed");
  });

  it("rejects invalid or unsupported shared roadmaps", () => {
    expect(parseSharedRoadmap("not json", validators)).toBeNull();
    expect(
      parseSharedRoadmap(
        JSON.stringify({
          version: 2,
          entryRoute: "new",
          useCaseRoute: "full",
          personalization: null,
        }),
        validators,
      ),
    ).toBeNull();
  });
});
