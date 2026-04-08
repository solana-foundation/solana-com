import { reader } from "../reader";
import type { UpgradeNote } from "../upgrade-types";

async function transformNote(
  slug: string,
  note: Awaited<ReturnType<typeof reader.collections.upgradeNotes.read>>,
): Promise<UpgradeNote | null> {
  if (!note) {
    return null;
  }

  const upgradeSlug = typeof note.upgrade === "string" ? note.upgrade : "";
  if (!upgradeSlug) {
    return null;
  }

  let upgradeTitle = "";
  let simdNumber = "";

  try {
    const upgrade = await reader.collections.upgrades.read(upgradeSlug);
    if (upgrade) {
      upgradeTitle = String(upgrade.title || "");
      simdNumber = String(upgrade.simdNumber || "");
    }
  } catch {
    // SIMD may have been removed — still return the note with what we have
  }

  return {
    slug,
    upgradeSlug,
    upgradeTitle,
    simdNumber,
    publishedAt: typeof note.publishedAt === "string" ? note.publishedAt : "",
    body: String(note.body || ""),
  };
}

export async function fetchUpgradeNotes(): Promise<UpgradeNote[]> {
  try {
    const slugs = await reader.collections.upgradeNotes.list();
    const notes: UpgradeNote[] = [];

    for (const slug of slugs) {
      try {
        const entry = await reader.collections.upgradeNotes.read(slug);
        const note = await transformNote(slug, entry);
        if (note) {
          notes.push(note);
        }
      } catch (error) {
        console.error(`Failed to read upgrade note "${slug}":`, error);
      }
    }

    notes.sort((a, b) => {
      const aDate = new Date(a.publishedAt);
      const bDate = new Date(b.publishedAt);
      return bDate.getTime() - aDate.getTime();
    });

    return notes;
  } catch (error) {
    console.error("Failed to fetch upgrade notes:", error);
    return [];
  }
}

export async function fetchLatestNotes(limit = 10): Promise<UpgradeNote[]> {
  const notes = await fetchUpgradeNotes();
  return notes.slice(0, limit);
}

export async function fetchNotesForUpgrade(
  upgradeSlug: string,
): Promise<UpgradeNote[]> {
  const notes = await fetchUpgradeNotes();
  return notes.filter((note) => note.upgradeSlug === upgradeSlug);
}
