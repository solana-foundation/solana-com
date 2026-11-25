export type AwardCategory = {
  id: string;
  section: "individual" | "community";
};

export const awardCategories = [
  { id: "solana-artist", section: "individual" },
  { id: "solana-content-creator", section: "individual" },
  { id: "solana-trader", section: "individual" },
  { id: "solana-streamer", section: "individual" },
  { id: "solana-ambassador", section: "individual" },
  { id: "meme-lord", section: "individual" },
  { id: "solana-nft-community", section: "community" },
  { id: "solana-meme-community", section: "community" },
  { id: "superteam", section: "community" },
  { id: "seeker-dapp", section: "community" },
  { id: "collab-of-the-year", section: "community" },
  { id: "campaign-of-the-year", section: "community" },
] as const satisfies readonly AwardCategory[];
