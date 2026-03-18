import {
  getCompany,
  type CompanyId,
} from "./companies/registry.js";
import type {
  CompanyLogoAsset,
  CompanyRecord,
  ImportedAssetModule,
  LogoSelectorOptions,
} from "./types.js";

function resolveCompany(companyOrId: CompanyId | CompanyRecord): CompanyRecord {
  if (typeof companyOrId !== "string") {
    return companyOrId;
  }

  const company = getCompany(companyOrId);
  if (!company) {
    throw new Error(`Unknown ecosystem company: ${companyOrId}`);
  }

  return company;
}

function byPreference(
  logos: CompanyLogoAsset[],
  company: CompanyRecord,
): CompanyLogoAsset[] {
  const defaultIndex = company.defaultLogoId
    ? logos.findIndex((logo) => logo.id === company.defaultLogoId)
    : -1;

  if (defaultIndex <= 0) {
    return logos;
  }

  const defaultLogo = logos[defaultIndex];
  if (!defaultLogo) {
    return logos;
  }

  return [
    defaultLogo,
    ...logos.slice(0, defaultIndex),
    ...logos.slice(defaultIndex + 1),
  ];
}

export function getCompanyLogos(
  companyOrId: CompanyId | CompanyRecord,
): CompanyLogoAsset[] {
  return [...resolveCompany(companyOrId).logos];
}

export function getCompanyLogo(
  companyOrId: CompanyId | CompanyRecord,
  options: LogoSelectorOptions = {},
): CompanyLogoAsset | undefined {
  const company = resolveCompany(companyOrId);
  const ordered = byPreference(company.logos, company);

  const exactId = options.id
    ? ordered.find((logo) => logo.id === options.id)
    : undefined;
  if (exactId) {
    return exactId;
  }

  const filtered = ordered.filter((logo) => {
    if (options.kind && logo.kind !== options.kind) {
      return false;
    }
    if (options.theme && logo.theme !== options.theme) {
      return false;
    }
    if (options.format && logo.format !== options.format) {
      return false;
    }
    return true;
  });

  return filtered[0] ?? ordered[0];
}

export function resolveImportedAssetSrc(asset: ImportedAssetModule): string {
  return typeof asset === "string" ? asset : asset.src;
}
