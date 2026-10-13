import { awardCategories } from "@/content/awards";

export type AwardFinalist = {
  name: string;
  twitterHandle: string;
  description?: string;
};

export type FinalistCategory = {
  categoryId: string;
  finalists: AwardFinalist[];
};

// Awards owners add the reviewed finalists here after nominations close.
// Voting stays unavailable until every category has an approved roster.
export const approvedFinalists: FinalistCategory[] = [];

export function validateFinalistRoster(roster: FinalistCategory[]) {
  const categories = new Set<string>(awardCategories.map(({ id }) => id));
  const seenCategories = new Set<string>();
  for (const { categoryId, finalists } of roster) {
    if (!categories.has(categoryId) || seenCategories.has(categoryId))
      return false;
    seenCategories.add(categoryId);
    if (finalists.length < 2) return false;
    const seenHandles = new Set<string>();
    for (const finalist of finalists) {
      const handle = finalist.twitterHandle;
      if (
        !finalist.name.trim() ||
        !/^@[a-z0-9_]{1,15}$/.test(handle) ||
        seenHandles.has(handle)
      ) {
        return false;
      }
      seenHandles.add(handle);
    }
  }
  return seenCategories.size === categories.size;
}

export function getApprovedFinalists() {
  if (!validateFinalistRoster(approvedFinalists)) return null;
  return approvedFinalists;
}

export function findApprovedFinalist(
  categoryId: string,
  handle: string,
  roster = getApprovedFinalists(),
) {
  return roster
    ?.find((entry) => entry.categoryId === categoryId)
    ?.finalists.find(
      (finalist) => finalist.twitterHandle.toLowerCase() === handle,
    );
}
