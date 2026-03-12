import type { Sponsor, SponsorTier } from "@/types/sponsors";

export const TIER_CONFIG: Record<
  string,
  { name: string; level: string; color: string }
> = {
  Headline: {
    name: "HEADLINE SPONSORS",
    level: "headline",
    color: "#19FB9B", // light green
  },
  Signature: {
    name: "SIGNATURE SPONSORS",
    level: "signature",
    color: "#9945FF", // purple
  },
  Premium: {
    name: "PREMIUM SPONSORS",
    level: "premium",
    color: "#2A88DE", // light blue
  },
};

const TIER_ORDER = ["Headline", "Signature", "Premium"];

export function getSponsorsByTier(sponsors: Sponsor[]): SponsorTier[] {
  const tierMap = new Map<string, Sponsor[]>();

  // Group sponsors by their sponsorship level
  for (const sponsor of sponsors) {
    const level = sponsor.sponsorshipLevel;
    if (!tierMap.has(level)) {
      tierMap.set(level, []);
    }
    tierMap.get(level)!.push(sponsor);
  }

  // Build tier array in order, only including tiers with sponsors
  const tiers: SponsorTier[] = [];

  for (const tierKey of TIER_ORDER) {
    const config = TIER_CONFIG[tierKey];
    const tierSponsors = tierMap.get(tierKey);

    if (config && tierSponsors && tierSponsors.length > 0) {
      tiers.push({
        name: config.name,
        level: config.level,
        color: config.color,
        sponsors: tierSponsors,
      });
    }
  }

  return tiers;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
