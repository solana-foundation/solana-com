export type GridProfileUrl = {
  url?: string | null;
  urlType?: { name?: string | null } | null;
};

export type GridProfileSocial = {
  socialType?: { name?: string | null } | null;
  urls?: GridProfileUrl[] | null;
};

export type GridProfile = {
  name?: string | null;
  logo?: string | null;
  tagLine?: string | null;
  descriptionShort?: string | null;
  descriptionLong?: string | null;
  foundingDate?: string | null;
  profileSector?: { name?: string | null } | null;
  profileStatus?: { name?: string | null } | null;
  profileType?: { name?: string | null } | null;
  urls?: GridProfileUrl[] | null;
  root?: { slug?: string | null; socials?: GridProfileSocial[] | null } | null;
};

export interface Sponsor {
  slug: string;
  name: string;
  url: string;
  sponsorshipLevel: string;
  logo: string;
  availableLogos: string[];
  gridProfileSlug?: string | null;
  gridProfile?: GridProfile | null;
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
