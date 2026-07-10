export type TierId =
  | "genesis"
  | "diamond"
  | "obsidian"
  | "veteran"
  | "survivor"
  | "settler";

export interface Tier {
  id: TierId;
  name: string;
  /** Minimum epochs survived to qualify. */
  min: number;
  /** Primary accent color. */
  color: string;
  /** Softer companion color for gradients/glows. */
  glow: string;
  /** One-line flex for the card. */
  line: string;
}

/** Ordered highest to lowest. Survival = current epoch − first epoch. */
export const TIERS: Tier[] = [
  {
    id: "genesis",
    name: "GENESIS CLASS",
    min: 900,
    color: "#FFD66B",
    glow: "#8a6a1f",
    line: "Here before almost everyone.",
  },
  {
    id: "diamond",
    name: "DIAMOND CLASS",
    min: 750,
    color: "#A5F3FC",
    glow: "#1e6b7a",
    line: "Forged under pressure.",
  },
  {
    id: "obsidian",
    name: "OBSIDIAN CLASS",
    min: 600,
    color: "#C084FC",
    glow: "#4c1d95",
    line: "Cooled in the fire of the bear.",
  },
  {
    id: "veteran",
    name: "VETERAN CLASS",
    min: 450,
    color: "#14F195",
    glow: "#065f46",
    line: "Seen some things.",
  },
  {
    id: "survivor",
    name: "SURVIVOR CLASS",
    min: 250,
    color: "#60A5FA",
    glow: "#1e3a8a",
    line: "Still here. Still early.",
  },
  {
    id: "settler",
    name: "SETTLER CLASS",
    min: 0,
    color: "#9CA3AF",
    glow: "#374151",
    line: "Welcome aboard. Epoch 2000 awaits.",
  },
];

export function tierFor(epochsSurvived: number): Tier {
  return TIERS.find((t) => epochsSurvived >= t.min) ?? TIERS[TIERS.length - 1];
}
