export type Request = {
  slug: string;
  accent: "violet" | "green" | "pink" | "blue" | "orange";
  videoId: string;
  speaker: string;
  speakerRole: string;
  speakerXHandle: string;
  aliases: string[];
};

// Keep playlist order and one video per request.
export const REQUESTS: Request[] = [
  {
    slug: "housing-futures",
    accent: "green",
    videoId: "ZxIzUBOnrtQ",
    speaker: "Matty Taylor",
    speakerXHandle: "mattytay",
    speakerRole: "Founder, Colosseum",
    aliases: ["perps-for-real-estate"],
  },
  {
    slug: "ai-inference-marketplace",
    accent: "violet",
    videoId: "tGH2lOT_mno",
    speaker: "Jacob Creech",
    speakerXHandle: "jacobvcreech",
    speakerRole: "VP Technology, Solana Foundation",
    aliases: ["inference-provider-marketplace"],
  },
  {
    slug: "entertainment-finance",
    accent: "orange",
    videoId: "8CUSptfIW_U",
    speaker: "Pedro Miranda",
    speakerXHandle: "pedromiranda",
    speakerRole: "Head of Consumer, Solana Foundation",
    aliases: ["gamified-trading"],
  },
  {
    slug: "agentic-security",
    accent: "blue",
    videoId: "15ecsUCXN1E",
    speaker: "Robert Chen",
    speakerXHandle: "NotDeGhost",
    speakerRole: "Founder, OtterSec",
    aliases: [],
  },
  {
    slug: "exotic-collectibles",
    accent: "pink",
    videoId: "OdhqVLfXPxQ",
    speaker: "Vibhu Norby",
    speakerXHandle: "vibhu",
    speakerRole: "CPO, Solana Foundation",
    aliases: ["exotic-rwas"],
  },
  {
    slug: "attention-tokens",
    accent: "green",
    videoId: "U4DIr3l9A_0",
    speaker: "Farhaj Mayan",
    speakerXHandle: "farhaj",
    speakerRole: "Founder, Forma",
    aliases: ["distribution-platform"],
  },
  {
    slug: "perps-and-onchain-trading",
    accent: "blue",
    videoId: "r9ZQuh3ShV8",
    speaker: "Toly",
    speakerXHandle: "toly",
    speakerRole: "",
    aliases: ["perps"],
  },
  {
    slug: "ai-financial-advisor",
    accent: "violet",
    videoId: "YEO8Gh0PxV4",
    speaker: "Rishin Sharma",
    speakerXHandle: "_rishinsharma",
    speakerRole: "Head of AI, Solana Foundation",
    aliases: ["ai", "better-wallet"],
  },
  {
    slug: "stablecoins",
    accent: "orange",
    videoId: "5jJX-IjTVMw",
    speaker: "Nemil Dalal",
    speakerXHandle: "nemild",
    speakerRole: "Visiting Partner, Y Combinator",
    aliases: ["stable"],
  },
  {
    slug: "startup-fundraising",
    accent: "pink",
    videoId: "D1C95ROUuSo",
    speaker: "Adam Bergeman",
    speakerXHandle: "adamcreates_",
    speakerRole: "Founder, Star.fun",
    aliases: ["stocks"],
  },
  {
    slug: "prediction-markets",
    accent: "green",
    videoId: "ZVyQVSQ9s6U",
    speaker: "Kyle Samani",
    speakerXHandle: "KyleSamani",
    speakerRole: "Chairman, Forward Industries",
    aliases: [],
  },
];

export function resolveRequestSlug(slug: string) {
  return REQUESTS.find(
    (request) => request.slug === slug || request.aliases.includes(slug),
  )?.slug;
}
