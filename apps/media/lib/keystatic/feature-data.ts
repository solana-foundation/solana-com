import { reader } from "../reader";

export type FeatureCard = {
  slug: string;
  title: string;
  summary: string;
  quarter: string;
  order: number;
  heroImage: string | null;
  href?: string;
};

const QUARTER_PATTERN = /^Q([1-4])\s+(\d{4})$/i;
const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// Turn a ship-window label ("Q3 2026", "May 2026", "2026-05-01") into a number
// we can sort ascending. Returns null for values we can't parse so they sink
// to the bottom instead of silently reordering the grid.
function parseShipWindow(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const quarterMatch = trimmed.match(QUARTER_PATTERN);
  if (quarterMatch) {
    const quarter = Number(quarterMatch[1]);
    const year = Number(quarterMatch[2]);
    const month = (quarter - 1) * 3;
    return new Date(Date.UTC(year, month, 1)).getTime();
  }

  const monthYearMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const monthIndex = MONTH_NAMES.indexOf(monthYearMatch[1].toLowerCase());
    const year = Number(monthYearMatch[2]);
    if (monthIndex >= 0) {
      return new Date(Date.UTC(year, monthIndex, 1)).getTime();
    }
  }

  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function isShipping(value: string): boolean {
  return value.trim().toLowerCase() === "shipping";
}

// Sort order: "Shipping" pinned to the top, then ship-window ascending,
// unparseable windows last. Within each bucket, `order` ascending, then slug.
function compareFeatures(a: FeatureCard, b: FeatureCard): number {
  const aShipping = isShipping(a.quarter);
  const bShipping = isShipping(b.quarter);
  if (aShipping !== bShipping) return aShipping ? -1 : 1;

  if (!aShipping) {
    const aTime = parseShipWindow(a.quarter);
    const bTime = parseShipWindow(b.quarter);
    if (aTime === null && bTime !== null) return 1;
    if (bTime === null && aTime !== null) return -1;
    if (aTime !== null && bTime !== null && aTime !== bTime) {
      return aTime - bTime;
    }
  }

  if (a.order !== b.order) return a.order - b.order;
  return a.slug.localeCompare(b.slug);
}

function transformFeature(
  slug: string,
  entry: Awaited<
    ReturnType<typeof reader.collections.featureUpgrades.read>
  > | null,
): FeatureCard | null {
  if (!entry) return null;

  const title = typeof entry.title === "string" ? entry.title.trim() : "";
  const summary = typeof entry.summary === "string" ? entry.summary.trim() : "";
  const quarter = typeof entry.quarter === "string" ? entry.quarter.trim() : "";
  if (!title || !summary || !quarter) return null;

  const href =
    typeof entry.href === "string" && entry.href.trim()
      ? entry.href.trim()
      : undefined;

  return {
    slug,
    title,
    summary,
    quarter,
    order: typeof entry.order === "number" ? entry.order : 0,
    heroImage: entry.heroImage ? String(entry.heroImage) : null,
    href,
  };
}

export async function fetchFeatureCards(): Promise<FeatureCard[]> {
  try {
    const slugs = await reader.collections.featureUpgrades.list();
    const cards: FeatureCard[] = [];

    for (const slug of slugs) {
      try {
        const entry = await reader.collections.featureUpgrades.read(slug);
        const card = transformFeature(slug, entry);
        if (card) cards.push(card);
      } catch (error) {
        console.error(`Failed to read feature upgrade "${slug}":`, error);
      }
    }

    return cards.sort(compareFeatures);
  } catch (error) {
    console.error("Failed to fetch feature upgrades:", error);
    return [];
  }
}
