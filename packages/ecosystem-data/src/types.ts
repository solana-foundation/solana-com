export const COMPANY_PROFILE_SECTORS = [
  "Community",
  "DeFi",
  "DePIN",
  "Developer Tools",
  "Exchange",
  "Gaming",
  "Infrastructure",
  "Payments",
  "Policy",
  "Restaking",
  "Robotics",
  "Staking",
  "Tokenization",
  "Wallet",
] as const;

export type CompanyProfileSector = (typeof COMPANY_PROFILE_SECTORS)[number];

export const COMPANY_PROFILE_TYPES = [
  "Community",
  "Company",
  "DAO",
  "Platform",
  "Protocol",
] as const;

export type CompanyProfileType = (typeof COMPANY_PROFILE_TYPES)[number];

export type ProfileLinks = {
  website?: string;
  app?: string;
  docs?: string;
  blog?: string;
  careers?: string;
};

export type ProfileSocials = {
  x?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  telegram?: string;
  youtube?: string;
  medium?: string;
};

export type Profile = {
  tagline?: string;
  summary?: string;
  description?: string;
  founded?: string;
  sector?: CompanyProfileSector;
  status?: string;
  type?: CompanyProfileType;
  links?: ProfileLinks;
  socials?: ProfileSocials;
};

export type CompanyLogoFormat = "svg" | "png" | "jpg" | "jpeg" | "webp";

export type CompanyLogoTheme = "light" | "dark";

export type CompanyLogoKind = "logo" | "mark" | "wordmark";

export type CompanyLogoTreatment = "brand" | "monotone";

export type ImportedAssetModule = string | { src: string };

export type CompanyLogoAsset = {
  id: string;
  fileName: string;
  format: CompanyLogoFormat;
  source: ImportedAssetModule;
  theme?: CompanyLogoTheme;
  kind?: CompanyLogoKind;
  treatment?: CompanyLogoTreatment;
  width?: number;
  height?: number;
  background?: "transparent" | "light" | "dark";
};

export type CompanyRecord = {
  id: string;
  slug: string;
  name: string;
  legalName?: string;
  profile?: Profile | null;
  logos: CompanyLogoAsset[];
  defaultLogoId?: string;
};

export type LogoSelectorOptions = {
  id?: string;
  format?: CompanyLogoFormat;
  theme?: CompanyLogoTheme;
  kind?: CompanyLogoKind;
  treatment?: CompanyLogoTreatment;
};
