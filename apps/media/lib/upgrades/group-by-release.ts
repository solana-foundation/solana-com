export type UpgradeStage =
  | "planned"
  | "in_development"
  | "pending_activation"
  | "live"
  | "action_required";

export type UpgradeMetric = {
  value: string;
  label: string;
};

export type UpgradeListItem = {
  slug: string;
  title: string;
  description: string;
  subtitle: string;
  publishedAt: string | null;
  stage: UpgradeStage;
  metrics: UpgradeMetric[];
  release: string | null;
  order: number | null;
};

export type ReleaseInput = {
  slug: string;
  name: string;
  status: "planned" | "shipped";
  expectedDate: string | null;
  overview: string | null;
};

export type ReleaseGroup = {
  key: string;
  name: string;
  status: "planned" | "shipped" | null;
  expectedDate: string | null;
  overview: UpgradeListItem | null;
  upgrades: UpgradeListItem[];
};

const UNSCHEDULED_KEY = "unscheduled";

function dateValue(value: string | null): number {
  return value ? new Date(value).getTime() : 0;
}

function compareUpgradeOrder(a: UpgradeListItem, b: UpgradeListItem): number {
  if (a.order !== null && b.order !== null) {
    return a.order - b.order;
  }
  if (a.order !== null) {
    return -1;
  }
  if (b.order !== null) {
    return 1;
  }

  return dateValue(b.publishedAt) - dateValue(a.publishedAt);
}

export function groupUpgradesByRelease(
  upgrades: UpgradeListItem[],
  releases: ReleaseInput[],
): ReleaseGroup[] {
  const upgradeBySlug = new Map(
    upgrades.map((upgrade) => [upgrade.slug, upgrade] as const),
  );
  const releaseSlugs = new Set(releases.map((release) => release.slug));

  const overviewSlugs = new Set(
    releases
      .map((release) => release.overview)
      .filter((slug): slug is string => Boolean(slug)),
  );

  const groups: ReleaseGroup[] = releases.map((release) => {
    const overview = release.overview
      ? (upgradeBySlug.get(release.overview) ?? null)
      : null;

    const groupUpgrades = upgrades
      .filter(
        (upgrade) =>
          upgrade.release === release.slug && !overviewSlugs.has(upgrade.slug),
      )
      .sort(compareUpgradeOrder);

    return {
      key: release.slug,
      name: release.name,
      status: release.status,
      expectedDate: release.expectedDate,
      overview,
      upgrades: groupUpgrades,
    };
  });
  const unscheduledUpgrades = upgrades
    .filter(
      (upgrade) =>
        !overviewSlugs.has(upgrade.slug) &&
        (!upgrade.release || !releaseSlugs.has(upgrade.release)),
    )
    .sort(compareUpgradeOrder);

  if (unscheduledUpgrades.length > 0) {
    groups.push({
      key: UNSCHEDULED_KEY,
      name: "Unscheduled",
      status: null,
      expectedDate: null,
      overview: null,
      upgrades: unscheduledUpgrades,
    });
  }

  const nonEmptyGroups = groups.filter(
    (group) => group.overview !== null || group.upgrades.length > 0,
  );

  const plannedGroups = nonEmptyGroups
    .filter((group) => group.status === "planned")
    .sort((a, b) => dateValue(a.expectedDate) - dateValue(b.expectedDate));

  const shippedGroups = nonEmptyGroups
    .filter((group) => group.status === "shipped")
    .sort((a, b) => dateValue(b.expectedDate) - dateValue(a.expectedDate));

  const unscheduledGroup = nonEmptyGroups.filter(
    (group) => group.status === null,
  );

  return [...plannedGroups, ...shippedGroups, ...unscheduledGroup];
}
