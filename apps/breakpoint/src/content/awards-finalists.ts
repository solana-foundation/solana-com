import { awardCategories } from "@/content/awards";

export type AwardFinalist = {
  name: string;
  twitterHandle: string;
  profileImage: string;
  description?: string;
};

export type FinalistCategory = {
  categoryId: string;
  finalists: AwardFinalist[];
};

type AwardCategoryId = (typeof awardCategories)[number]["id"];

function finalist(name: string, twitterHandle: string): AwardFinalist {
  return {
    name,
    twitterHandle,
    profileImage: `/assets/awards/finalists/${twitterHandle.slice(1)}.webp`,
  };
}

export const approvedFinalistsByCategory = {
  "solana-artist": [
    finalist("degen poet", "@solanapoet"),
    finalist("Grizz", "@grizzle_art"),
    finalist("Pondy", "@ponderman_"),
    finalist("Sirius Crocodile", "@siriuscrocodile"),
  ],
  "solana-content-creator": [
    finalist("nikkideyy", "@nikkideyy"),
    finalist("frisk", "@friskk"),
    finalist("Easy", "@notsoeasymoney"),
    finalist("fabiano.sol", "@fabianosolana"),
  ],
  "solana-trader": [
    finalist("Cryo Palmar", "@cryopalmar"),
    finalist("Ansem", "@blknoiz06"),
    finalist("Lochie", "@lochie_sol"),
    finalist("MINHxDYNASTY", "@minhxdynasty"),
  ],
  "solana-streamer": [
    finalist("ThreadGuy", "@notthreadguy"),
    finalist("Crime", "@crimexbt"),
    finalist("Ansem", "@blknoiz06"),
    finalist("Easy", "@notsoeasymoney"),
  ],
  "solana-ambassador": [
    finalist("Solana Sensei", "@solanasensei"),
    finalist("Alex Scott", "@afscott"),
    finalist("Fluffy", "@fluffyonchain"),
    finalist("Evey", "@eveynft"),
  ],
  "meme-lord": [
    finalist("Doqo", "@doqo_sol"),
    finalist("Wirelyss", "@wirelyss"),
    finalist("chase", "@therealchaseeb"),
    finalist("cloudz", "@cloudz"),
  ],
  "solana-nft-community": [
    finalist("MonkeDAO", "@monkedao"),
    finalist("Claynosaurz", "@claynosaurz"),
    finalist("Galactic Geckos", "@galacticgeckosg"),
    finalist("mallow", "@mallowdotart"),
  ],
  "solana-meme-community": [
    finalist("Luminaries", "@luminaries"),
    finalist("Solana Ecosystem Call", "@ecosystemcall"),
    finalist("Stonk", "@launchonsf"),
    finalist("clawpump", "@clawpumptech"),
  ],
  superteam: [
    finalist("Superteam Thailand", "@superteamth"),
    finalist("Superteam Canada", "@superteamcan"),
    finalist("Superteam Malaysia", "@superteammy"),
    finalist("Superteam UK", "@superteamuk"),
  ],
  "seeker-dapp": [
    finalist("SP3ND", "@sp3nddotshop"),
    finalist("MattleFun", "@mattlefun"),
    finalist("Rosentica", "@rosentica"),
    finalist("Gib.Work", "@gib_work"),
  ],
  "collab-of-the-year": [
    finalist("Claynosaurz", "@claynosaurz"),
    finalist("raposa.", "@raposacoffeeco"),
    finalist("Nomu", "@nomustores"),
    finalist("WSOP", "@wsop"),
  ],
  "campaign-of-the-year": [
    finalist("Solana Ecosystem Call", "@ecosystemcall"),
    finalist("world", "@world_xyz"),
    finalist("Frontier Traders", "@joinfrontier"),
    finalist("Jurassic Finance", "@jurassicfi"),
  ],
} satisfies Record<AwardCategoryId, AwardFinalist[]>;

export const approvedFinalists: FinalistCategory[] = awardCategories.map(
  ({ id }) => ({ categoryId: id, finalists: approvedFinalistsByCategory[id] }),
);

export function validateFinalistRoster(roster: FinalistCategory[]) {
  const categories = new Set<string>(awardCategories.map(({ id }) => id));
  const seenCategories = new Set<string>();
  for (const { categoryId, finalists } of roster) {
    if (!categories.has(categoryId) || seenCategories.has(categoryId))
      return false;
    seenCategories.add(categoryId);
    if (finalists.length !== 4) return false;
    const seenHandles = new Set<string>();
    for (const item of finalists) {
      const handle = item.twitterHandle;
      if (
        !item.name.trim() ||
        !/^@[a-z0-9_]{1,15}$/.test(handle) ||
        item.profileImage !==
          `/assets/awards/finalists/${handle.slice(1)}.webp` ||
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
    ?.finalists.find((item) => item.twitterHandle.toLowerCase() === handle);
}
