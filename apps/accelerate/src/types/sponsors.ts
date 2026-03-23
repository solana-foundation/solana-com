import type { Profile } from "@workspace/ecosystem-data";

export type SponsorProfile = Omit<Profile, "sector" | "type"> & {
  name?: string | null;
  founded?: string;
  sector?: string;
  status?: string | null;
  type?: string;
  dataPageSlug?: string | null;
};

export interface Sponsor {
  slug: string;
  name: string;
  url: string;
  sponsorshipLevel: string;
  logo: string;
  availableLogos: string[];
  gridProfileSlug?: string | null;
  profile?: SponsorProfile | null;
}

export interface SponsorTier {
  name: string;
  level: string;
  color: string;
  sponsors: Sponsor[];
}

export interface SponsorsData {
  syncedAt: string;
  sponsors: Sponsor[];
}
