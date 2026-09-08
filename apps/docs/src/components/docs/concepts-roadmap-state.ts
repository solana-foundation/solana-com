export type EntryRoute = "new" | "ethereum";

export type UseCaseId = "payments" | "tokenization" | "trading";

export type UseCaseRoute = "full" | UseCaseId;

export type RoadmapGoal =
  | "build"
  | "developer"
  | "understand"
  | "work"
  | "reference";

export type RoadmapFocus =
  | "apps"
  | "programs"
  | "tokens-payments"
  | "defi"
  | "games-performance"
  | "data"
  | "architecture"
  | "transactions"
  | "ecosystem"
  | "product"
  | "finance"
  | "developer-relations"
  | "client-reference"
  | "program-reference"
  | "production-reference";

export type StartingPoint = "new" | "web" | "rust" | "ethereum" | "solana";

export type LearningStyle = "Read" | "Watch" | "Build";

export type PersonalizationProfile = {
  goal: RoadmapGoal;
  focus: RoadmapFocus;
  startingPoint: StartingPoint;
  learningStyles: LearningStyle[];
};

export type StoredProgress = {
  completedIds: string[];
  entryRoute: EntryRoute;
  useCaseRoute: UseCaseRoute;
  assessmentPassed: boolean;
  personalization: PersonalizationProfile | null;
};

export type SharedRoadmap = Pick<
  StoredProgress,
  "entryRoute" | "useCaseRoute" | "personalization"
>;

type RoadmapValidators = {
  isPersonalizationProfile: (value: unknown) => value is PersonalizationProfile;
  isUseCaseRoute: (value: unknown) => value is UseCaseRoute;
};

export const ROADMAP_STORAGE_KEY = "solana:docs:concepts-roadmap:v2";
export const ROADMAP_SHARE_PARAM = "roadmap";

const SHARE_VERSION = 1;
const MAX_SHARE_LENGTH = 2_048;

export function createEmptyProgress(): StoredProgress {
  return {
    completedIds: [],
    entryRoute: "new",
    useCaseRoute: "full",
    assessmentPassed: false,
    personalization: null,
  };
}

export function parseStoredProgress(
  value: string | null,
  validCompletedIds: ReadonlySet<string>,
  validators: RoadmapValidators,
): StoredProgress {
  if (!value) return createEmptyProgress();

  try {
    const parsed = JSON.parse(value) as Partial<StoredProgress>;

    return {
      completedIds: Array.isArray(parsed.completedIds)
        ? parsed.completedIds.filter(
            (item): item is string =>
              typeof item === "string" && validCompletedIds.has(item),
          )
        : [],
      entryRoute: parsed.entryRoute === "ethereum" ? "ethereum" : "new",
      useCaseRoute: validators.isUseCaseRoute(parsed.useCaseRoute)
        ? parsed.useCaseRoute
        : "full",
      assessmentPassed: parsed.assessmentPassed === true,
      personalization: validators.isPersonalizationProfile(
        parsed.personalization,
      )
        ? parsed.personalization
        : null,
    };
  } catch {
    return createEmptyProgress();
  }
}

export function serializeSharedRoadmap(roadmap: SharedRoadmap): string {
  return JSON.stringify({
    version: SHARE_VERSION,
    entryRoute: roadmap.entryRoute,
    useCaseRoute: roadmap.useCaseRoute,
    personalization: roadmap.personalization,
  });
}

export function parseSharedRoadmap(
  value: string | null,
  validators: RoadmapValidators,
): SharedRoadmap | null {
  if (!value || value.length > MAX_SHARE_LENGTH) return null;

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const entryRoute = parsed.entryRoute;
    const personalization = parsed.personalization;

    if (
      parsed.version !== SHARE_VERSION ||
      (entryRoute !== "new" && entryRoute !== "ethereum") ||
      !validators.isUseCaseRoute(parsed.useCaseRoute) ||
      (personalization !== null &&
        !validators.isPersonalizationProfile(personalization))
    ) {
      return null;
    }

    return {
      entryRoute,
      useCaseRoute: parsed.useCaseRoute,
      personalization,
    };
  } catch {
    return null;
  }
}
