import type { CompanyId, LogoSelectorOptions } from "@workspace/ecosystem-data";

export const SPONSOR_LOGO_ID = "breakpoint-2026-white";
export const DEFAULT_SPONSOR_LOGO_VARIANT = {
  id: SPONSOR_LOGO_ID,
} satisfies LogoSelectorOptions;

export type SponsorLogoVariant = LogoSelectorOptions;

export type SponsorLogo = {
  companyId: CompanyId;
  logoVariant?: SponsorLogoVariant;
  width: number;
  height: number;
};

export type SponsorTier = {
  title: string;
  mobileColumns: string;
  mobileLogoScale: number;
  columns: string;
  cellAspect: string;
  sponsors: SponsorLogo[];
  emptyCells?: number;
};

export type SponsorMarqueeRow = {
  title: string;
  direction: "left" | "right";
  density: "featured" | "standard" | "compact";
  duration: string;
  sponsors: SponsorLogo[];
};

const platinumSponsors = [
  {
    companyId: "jito",
    width: 817,
    height: 335,
  },
  {
    companyId: "spi",
    width: 386,
    height: 105,
  },
  {
    companyId: "altitude",
    width: 181.818,
    height: 32,
  },
] satisfies SponsorLogo[];

const goldSponsors = [
  {
    companyId: "cherry-servers",
    width: 213,
    height: 40,
  },
  {
    companyId: "brave",
    width: 3063,
    height: 950,
  },
  {
    companyId: "vybe-network",
    width: 2400,
    height: 1176,
  },
  {
    companyId: "alchemy",
    width: 140,
    height: 30,
  },
  {
    companyId: "walletconnect",
    width: 166.213,
    height: 18,
  },
  {
    companyId: "pyth",
    width: 2037,
    height: 367,
  },
  {
    companyId: "dfdv",
    width: 4096,
    height: 348,
  },
  {
    companyId: "unclaimed-sol",
    logoVariant: { id: "breakpoint-2026-negative-relief" },
    width: 226,
    height: 49,
  },
] satisfies SponsorLogo[];

const activationSponsors = [
  {
    companyId: "blockzero",
    width: 798.91,
    height: 216.29,
  },
] satisfies SponsorLogo[];

export const sponsorTiers = [
  {
    title: "Platinum",
    mobileColumns: "grid-cols-1",
    mobileLogoScale: 0.6,
    columns: "md:grid-cols-3",
    cellAspect: "aspect-[442/221]",
    sponsors: platinumSponsors,
  },
  {
    title: "Gold",
    mobileColumns: "grid-cols-2",
    mobileLogoScale: 0.64,
    columns: "md:grid-cols-5",
    cellAspect: "aspect-[256/128]",
    sponsors: goldSponsors,
    emptyCells: 2,
  },
] satisfies SponsorTier[];

export const sponsorMarqueeRows = [
  {
    title: "Platinum",
    direction: "left",
    density: "featured",
    duration: "72s",
    sponsors: platinumSponsors,
  },
  {
    title: "Gold",
    direction: "right",
    density: "standard",
    duration: "92s",
    sponsors: goldSponsors.slice(0, 4),
  },
  {
    title: "Gold",
    direction: "left",
    density: "standard",
    duration: "104s",
    sponsors: [...goldSponsors.slice(4), ...activationSponsors],
  },
] satisfies SponsorMarqueeRow[];
