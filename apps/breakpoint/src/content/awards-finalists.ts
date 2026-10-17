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

type AwardCategoryId = (typeof awardCategories)[number]["id"];

// Development-only ballot placeholders. Never add these to approvedFinalists.
export const mockFinalistsByCategory = {
  "solana-artist": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_01" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_02" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_25" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_26" },
  ],
  "solana-content-creator": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_03" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_04" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_27" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_28" },
  ],
  "solana-trader": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_05" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_06" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_29" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_30" },
  ],
  "solana-streamer": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_07" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_08" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_31" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_32" },
  ],
  "solana-ambassador": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_09" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_10" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_33" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_34" },
  ],
  "meme-lord": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_11" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_12" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_35" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_36" },
  ],
  "solana-nft-community": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_13" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_14" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_37" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_38" },
  ],
  "solana-meme-community": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_15" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_16" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_39" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_40" },
  ],
  superteam: [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_17" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_18" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_41" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_42" },
  ],
  "seeker-dapp": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_19" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_20" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_43" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_44" },
  ],
  "collab-of-the-year": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_21" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_22" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_45" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_46" },
  ],
  "campaign-of-the-year": [
    { name: "Mock finalist A", twitterHandle: "@mock_bp26_23" },
    { name: "Mock finalist B", twitterHandle: "@mock_bp26_24" },
    { name: "Mock finalist C", twitterHandle: "@mock_bp26_47" },
    { name: "Mock finalist D", twitterHandle: "@mock_bp26_48" },
  ],
} satisfies Record<AwardCategoryId, AwardFinalist[]>;

export const mockFinalists: FinalistCategory[] = awardCategories.map(
  ({ id }) => ({
    categoryId: id,
    finalists: mockFinalistsByCategory[id],
  }),
);

// Add the awards owner's reviewed finalist map here when it is available.
// Production voting stays unavailable until every category is approved.
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
  const roster =
    process.env.NODE_ENV === "development" && approvedFinalists.length === 0
      ? mockFinalists
      : approvedFinalists;
  if (!validateFinalistRoster(roster)) return null;
  return roster;
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
