export interface Sponsor {
  slug: string;
  name: string;
  url: string;
  sponsorshipLevel: string;
  logo: string;
  availableLogos: string[];
  gridProfileSlug?: string | null;
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
