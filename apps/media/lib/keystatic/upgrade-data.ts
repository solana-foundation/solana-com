import { reader } from "../reader";
import type {
  FetchUpgradesParams,
  FetchUpgradesResponse,
  SIMDCategory,
  SIMDStatus,
  SIMDType,
  UpgradeItem,
  UpgradeOverview,
} from "../upgrade-types";

const DEFAULT_PAGE_INFO = {
  hasPreviousPage: false,
  hasNextPage: false,
  startCursor: null,
  endCursor: null,
};

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeEnumValue<T extends string>(
  value: string | null | undefined,
  allowedValues: readonly T[],
  fallback: T,
): T {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase() as T;
  return allowedValues.includes(normalized) ? normalized : fallback;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function compareBySort(
  a: UpgradeItem,
  b: UpgradeItem,
  sort: NonNullable<FetchUpgradesParams["sort"]>,
): number {
  if (sort === "simd-asc") {
    return a.simdNumber.localeCompare(b.simdNumber, undefined, {
      numeric: true,
    });
  }

  const aDate =
    sort === "created-desc"
      ? parseDate(a.createdDate)
      : parseDate(a.updatedDate);
  const bDate =
    sort === "created-desc"
      ? parseDate(b.createdDate)
      : parseDate(b.updatedDate);

  if (!aDate && !bDate) return 0;
  if (!aDate) return 1;
  if (!bDate) return -1;

  const dateDiff = bDate.getTime() - aDate.getTime();
  if (dateDiff !== 0) {
    return dateDiff;
  }

  return a.simdNumber.localeCompare(b.simdNumber, undefined, { numeric: true });
}

async function resolveTagNames(
  tags: Awaited<ReturnType<typeof reader.collections.upgrades.read>>["tags"],
): Promise<string[]> {
  if (!tags) {
    return [];
  }

  const tagNames: string[] = [];
  for (const item of tags) {
    const tagSlug = item?.tag ? String(item.tag) : null;
    if (!tagSlug) continue;

    const tag = await reader.collections.tags.read(tagSlug);
    if (tag?.name) {
      tagNames.push(String(tag.name));
    }
  }

  return dedupeStrings(tagNames);
}

async function transformUpgrade(
  slug: string,
  upgrade: Awaited<ReturnType<typeof reader.collections.upgrades.read>>,
): Promise<UpgradeItem | null> {
  if (!upgrade) {
    return null;
  }

  const tags = await resolveTagNames(upgrade.tags);

  const status = normalizeEnumValue<SIMDStatus>(
    typeof upgrade.status === "string" ? upgrade.status : null,
    [
      "idea",
      "draft",
      "review",
      "accepted",
      "implemented",
      "activated",
      "withdrawn",
      "stagnant",
      "living",
    ],
    "draft",
  );

  const category = normalizeEnumValue<SIMDCategory>(
    typeof upgrade.category === "string" ? upgrade.category : null,
    ["standard", "meta", "advisory"],
    "standard",
  );

  const type = normalizeEnumValue<SIMDType>(
    typeof upgrade.type === "string" ? upgrade.type : null,
    ["core", "networking", "interfaces"],
    "core",
  );

  return {
    id: slug,
    slug,
    simdNumber: String(upgrade.simdNumber || ""),
    title: String(upgrade.title || ""),
    status,
    category,
    type: upgrade.type ? type : undefined,
    authors: dedupeStrings((upgrade.authors || []).map((item) => String(item))),
    createdDate:
      typeof upgrade.createdDate === "string" ? upgrade.createdDate : null,
    updatedDate:
      typeof upgrade.updatedDate === "string" ? upgrade.updatedDate : null,
    featureGate:
      typeof upgrade.featureGate === "string" && upgrade.featureGate.trim()
        ? upgrade.featureGate
        : undefined,
    githubUrl: String(upgrade.githubUrl || ""),
    discussionUrl:
      typeof upgrade.discussionUrl === "string" && upgrade.discussionUrl.trim()
        ? upgrade.discussionUrl
        : undefined,
    summary: String(upgrade.summary || ""),
    editorialNote:
      typeof upgrade.editorialNote === "string" && upgrade.editorialNote.trim()
        ? upgrade.editorialNote
        : undefined,
    relatedSimds: dedupeStrings(
      (upgrade.relatedSimds || []).map((item) => String(item)),
    ),
    featured: Boolean(upgrade.featured),
    tags,
    heroImage: upgrade.heroImage || null,
    cursor: slug,
    url: `/upgrades/${slug}`,
  };
}

export async function fetchUpgradeOverview(): Promise<UpgradeOverview | null> {
  const overview = await reader.singletons.upgradesPage.read();
  if (!overview) {
    return null;
  }

  return {
    eyebrow:
      typeof overview.eyebrow === "string" && overview.eyebrow.trim()
        ? overview.eyebrow
        : undefined,
    title: String(overview.title || "Solana Upgrades"),
    intro: String(overview.intro || ""),
    currentFocus:
      typeof overview.currentFocus === "string" && overview.currentFocus.trim()
        ? overview.currentFocus
        : undefined,
    statusGuide:
      typeof overview.statusGuide === "string" && overview.statusGuide.trim()
        ? overview.statusGuide
        : undefined,
    lastReviewed:
      typeof overview.lastReviewed === "string" && overview.lastReviewed.trim()
        ? overview.lastReviewed
        : undefined,
    resources: (overview.resources || [])
      .map((item) => ({
        label: String(item?.label || ""),
        url: String(item?.url || ""),
      }))
      .filter((item) => item.label && item.url),
  };
}

export async function fetchUpgrades(
  params: FetchUpgradesParams = {},
): Promise<FetchUpgradesResponse> {
  try {
    const allSlugs = await reader.collections.upgrades.list();
    const upgrades: UpgradeItem[] = [];

    for (const slug of allSlugs) {
      try {
        const upgrade = await reader.collections.upgrades.read(slug);
        const transformed = await transformUpgrade(slug, upgrade);
        if (transformed) {
          upgrades.push(transformed);
        }
      } catch (error) {
        console.error(`Failed to read upgrade "${slug}":`, error);
      }
    }

    const normalizedStatus = params.status?.trim().toLowerCase();
    const normalizedCategory = params.category?.trim().toLowerCase();
    const normalizedType = params.type?.trim().toLowerCase();
    const normalizedSearch = params.search?.trim().toLowerCase();

    const filtered = upgrades.filter((upgrade) => {
      if (normalizedStatus && upgrade.status !== normalizedStatus) return false;
      if (normalizedCategory && upgrade.category !== normalizedCategory) {
        return false;
      }
      if (normalizedType && upgrade.type !== normalizedType) return false;

      if (normalizedSearch) {
        const haystack = [
          upgrade.simdNumber,
          upgrade.title,
          upgrade.summary,
          upgrade.editorialNote || "",
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }

      return true;
    });

    const sort = params.sort ?? "updated-desc";
    filtered.sort((a, b) => compareBySort(a, b, sort));

    let startIndex = 0;
    if (params.cursor) {
      const cursorIndex = filtered.findIndex(
        (item) => item.slug === params.cursor,
      );
      if (cursorIndex >= 0) {
        startIndex = cursorIndex + 1;
      }
    }

    const limit = params.limit ?? filtered.length;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      pageInfo: {
        hasNextPage: startIndex + limit < filtered.length,
        hasPreviousPage: startIndex > 0,
        startCursor: items[0]?.slug ?? null,
        endCursor: items[items.length - 1]?.slug ?? null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch upgrades:", error);
    return { items: [], pageInfo: DEFAULT_PAGE_INFO };
  }
}

export async function fetchFeaturedUpgrades(limit = 5): Promise<UpgradeItem[]> {
  const response = await fetchUpgrades({ sort: "updated-desc" });
  return response.items.filter((upgrade) => upgrade.featured).slice(0, limit);
}

export async function fetchUpgradeBySlug(
  slug: string,
): Promise<UpgradeItem | null> {
  const upgrade = await reader.collections.upgrades.read(slug);
  return transformUpgrade(slug, upgrade);
}
