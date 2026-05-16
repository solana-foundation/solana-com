import { getCompanyLogoSrc, type CompanyId } from "@workspace/ecosystem-data";

type LocalizedCompanyLogoRef = {
  companyId?: CompanyId;
  logoId?: string;
  src?: string;
  logo?: string;
};

export function resolveLocalizedCompanyLogo(
  entry: LocalizedCompanyLogoRef,
  field: "src" | "logo" = "src",
): string | undefined {
  const directValue = entry[field];
  if (directValue) {
    return directValue;
  }

  if (!entry.companyId) {
    return undefined;
  }

  return getCompanyLogoSrc(
    entry.companyId,
    entry.logoId ? { id: entry.logoId } : {},
  );
}
