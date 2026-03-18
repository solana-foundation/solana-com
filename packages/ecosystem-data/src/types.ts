export type ProfileUrl = {
  url?: string | null;
  urlType?: { name?: string | null } | null;
};

export type ProfileSocial = {
  socialType?: { name?: string | null } | null;
  urls?: ProfileUrl[] | null;
};

export type Profile = {
  name?: string | null;
  logo?: string | null;
  tagLine?: string | null;
  descriptionShort?: string | null;
  descriptionLong?: string | null;
  foundingDate?: string | null;
  profileSector?: { name?: string | null } | null;
  profileStatus?: { name?: string | null } | null;
  profileType?: { name?: string | null } | null;
  urls?: ProfileUrl[] | null;
  root?: { slug?: string | null; socials?: ProfileSocial[] | null } | null;
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
  profile?: Profile | null;
  logos: CompanyLogoAsset[];
  defaultLogoId?: string;
};

export type LogoSelectorOptions = {
  id?: string;
  format?: CompanyLogoFormat;
  theme?: CompanyLogoTheme;
  kind?: CompanyLogoKind;
};
