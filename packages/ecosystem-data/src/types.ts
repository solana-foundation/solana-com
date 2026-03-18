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

export type CompanyLogoFormat = "svg" | "png" | "jpg" | "jpeg" | "webp";

export type CompanyLogoTheme = "light" | "dark";

export type CompanyLogoKind = "logo" | "mark" | "wordmark";

export type ImportedAssetModule = string | { src: string };

export type CompanyLogoAsset = {
  id: string;
  fileName: string;
  format: CompanyLogoFormat;
  source: ImportedAssetModule;
  theme?: CompanyLogoTheme;
  kind?: CompanyLogoKind;
  width?: number;
  height?: number;
  background?: "transparent" | "light" | "dark";
};

export type CompanyRecord = {
  id: string;
  slug: string;
  name: string;
  legalName?: string;
  gridProfileSlug?: string | null;
  gridProfile?: GridProfile | null;
  logos: CompanyLogoAsset[];
  defaultLogoId?: string;
};

export type LogoSelectorOptions = {
  id?: string;
  format?: CompanyLogoFormat;
  theme?: CompanyLogoTheme;
  kind?: CompanyLogoKind;
};
