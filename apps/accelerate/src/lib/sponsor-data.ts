import {
  getCompany,
  getCompanyLogo,
  resolveImportedAssetSrc,
  type CompanyId,
} from "@workspace/ecosystem-data";
import type { Sponsor } from "@/types/sponsors";

export type SponsorAugmentation = {
  companyId: CompanyId;
  sponsorshipLevel: string;
  url?: string;
  featuredLogoId?: string;
};

function getPublicLogoPath(
  companyId: CompanyId,
  featuredLogoId?: string,
): string {
  const company = getCompany(companyId);
  if (!company) {
    throw new Error(`Unknown sponsor company: ${companyId}`);
  }

  const logo = getCompanyLogo(
    company,
    featuredLogoId ? { id: featuredLogoId } : {},
  );
  if (!logo) {
    throw new Error(`Missing logo for sponsor company: ${companyId}`);
  }

  return resolveImportedAssetSrc(logo.source);
}

export function composeSponsors(
  augmentations: SponsorAugmentation[],
): Sponsor[] {
  return augmentations.map((entry) => {
    const company = getCompany(entry.companyId);
    if (!company) {
      throw new Error(`Unknown sponsor company: ${entry.companyId}`);
    }

    const logo = getPublicLogoPath(entry.companyId, entry.featuredLogoId);

    return {
      slug: company.slug,
      name: company.name,
      url: entry.url ?? "#",
      sponsorshipLevel: entry.sponsorshipLevel,
      logo,
      availableLogos: company.logos.map((asset) =>
        resolveImportedAssetSrc(asset.source),
      ),
      gridProfileSlug: company.gridProfileSlug ?? null,
      gridProfile: company.gridProfile ?? null,
    };
  });
}
