export type AwardCategory = {
  id: string;
  name: string;
  description: string;
  section: "Individual" | "Community";
};

export const awardCategories: AwardCategory[] = [
  {
    id: "solana-artist",
    name: "Solana Artist Award",
    description: "For an artist whose work helped shape Solana culture.",
    section: "Individual",
  },
  {
    id: "solana-content-creator",
    name: "Solana Content Creator Award",
    description: "For a creator making exceptional Solana content.",
    section: "Individual",
  },
  {
    id: "solana-trader",
    name: "Solana Trader Award",
    description:
      "For a trader who made a defining contribution to the ecosystem.",
    section: "Individual",
  },
  {
    id: "solana-streamer",
    name: "Solana Streamer Award",
    description: "For a streamer bringing the Solana ecosystem to life.",
    section: "Individual",
  },
  {
    id: "solana-ambassador",
    name: "Solana Ambassador Award",
    description:
      "For an individual who best represented and amplified the Solana ecosystem.",
    section: "Individual",
  },
  {
    id: "meme-lord",
    name: "Meme Lord Award",
    description: "For the individual behind the most iconic Solana memes.",
    section: "Individual",
  },
  {
    id: "solana-nft-community",
    name: "Solana NFT Community Award",
    description:
      "For an NFT community that made Solana more creative, connected, and fun.",
    section: "Community",
  },
  {
    id: "solana-meme-community",
    name: "Solana Meme Community Award",
    description:
      "For the meme community with the greatest impact on Solana culture.",
    section: "Community",
  },
  {
    id: "superteam",
    name: "Superteam Award",
    description:
      "For a Superteam that delivered exceptional impact for the Solana ecosystem.",
    section: "Community",
  },
  {
    id: "seeker-dapp",
    name: "Seeker dApp Award",
    description:
      "For a dApp delivering an outstanding experience for Seeker users.",
    section: "Community",
  },
  {
    id: "collab-of-the-year",
    name: "Collab of the Year Award",
    description:
      "For the collaboration that made an outsized impact on Solana.",
    section: "Community",
  },
  {
    id: "campaign-of-the-year",
    name: "Campaign of the Year Award",
    description:
      "For the campaign that captured the Solana community's attention.",
    section: "Community",
  },
];
