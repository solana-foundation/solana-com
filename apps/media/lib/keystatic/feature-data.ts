import { fetchFeaturedUpgrades } from "./upgrade-data";
import { fetchUpgradeNotes } from "./upgrade-note-data";
import type { SIMDStatus, UpgradeNote } from "../upgrade-types";

export type FeatureCard = {
  slug: string;
  title: string;
  summary: string;
  quarter: string;
  order: number;
  heroImage: string | null;
  href?: string;
};

const STATUS_LABEL: Record<SIMDStatus, string> = {
  idea: "Idea",
  draft: "Draft",
  review: "In review",
  accepted: "Accepted",
  implemented: "Implemented",
  activated: "Shipping",
  withdrawn: "Withdrawn",
  stagnant: "Stagnant",
  living: "Living",
};

function latestNoteForUpgrade(
  upgradeSlug: string,
  notes: UpgradeNote[],
): UpgradeNote | null {
  const forUpgrade = notes.filter((note) => note.upgradeSlug === upgradeSlug);
  if (forUpgrade.length === 0) return null;
  return forUpgrade.reduce((latest, current) => {
    const latestTs = new Date(latest.publishedAt).getTime();
    const currentTs = new Date(current.publishedAt).getTime();
    return currentTs > latestTs ? current : latest;
  });
}

// Non-technical landing page for /upgrades reads the featured SIMDs from the
// same `upgrades` collection the SIMD sync writes. Editorial fields
// (`description`, `heroImage`, `featured`) are Jacob-editable in Keystatic;
// everything else is synced from the SIMDs GitHub repo.
export async function fetchFeatureCards(): Promise<FeatureCard[]> {
  try {
    const [featured, allNotes] = await Promise.all([
      fetchFeaturedUpgrades(Number.MAX_SAFE_INTEGER),
      fetchUpgradeNotes(),
    ]);

    const cards: FeatureCard[] = featured
      .map((upgrade): FeatureCard | null => {
        const latestNote = latestNoteForUpgrade(upgrade.slug, allNotes);
        const summary =
          upgrade.description?.trim() ||
          upgrade.editorialNote?.trim() ||
          upgrade.summary?.trim() ||
          "";
        if (!summary) return null;

        const quarter =
          latestNote?.expectedRelease?.trim() ||
          STATUS_LABEL[upgrade.status] ||
          "In progress";

        const latestNoteTs = latestNote
          ? new Date(latestNote.publishedAt).getTime()
          : null;
        const updatedTs = upgrade.updatedDate
          ? new Date(upgrade.updatedDate).getTime()
          : null;
        const sortTs = latestNoteTs ?? updatedTs ?? 0;

        return {
          slug: upgrade.slug,
          title: upgrade.title,
          summary,
          quarter,
          order: -sortTs,
          heroImage: upgrade.heroImage ? String(upgrade.heroImage) : null,
          href: `/upgrades/proposals/${upgrade.slug}`,
        };
      })
      .filter((card): card is FeatureCard => card !== null);

    cards.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.slug.localeCompare(b.slug);
    });

    return cards;
  } catch (error) {
    console.error("Failed to fetch landing feature cards:", error);
    return [];
  }
}
