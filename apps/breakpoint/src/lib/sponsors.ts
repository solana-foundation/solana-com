import {
  getCompany,
  getCompanyLogo,
  resolveImportedAssetSrc,
  type CompanyLogoAsset,
  type CompanyRecord,
  type LogoSelectorOptions,
} from "@workspace/ecosystem-data";
import {
  DEFAULT_SPONSOR_LOGO_VARIANT,
  type SponsorLogo,
} from "@/content/sponsors";

const LOGO_SELECTOR_KEYS = [
  "id",
  "format",
  "theme",
  "kind",
  "treatment",
] satisfies (keyof LogoSelectorOptions)[];

export type ResolvedSponsorLogo = SponsorLogo & {
  alt: string;
  company: CompanyRecord;
  name: string;
  src: string;
};

export function getSponsorCompany(companyId: SponsorLogo["companyId"]) {
  const company = getCompany(companyId);

  if (!company) {
    throw new Error(`Missing Breakpoint sponsor company: ${companyId}`);
  }

  return company;
}

function logoMatchesSelector(
  logo: CompanyLogoAsset,
  selector: LogoSelectorOptions,
) {
  return LOGO_SELECTOR_KEYS.every((key) => {
    const requested = selector[key];
    return requested === undefined || logo[key] === requested;
  });
}

function formatLogoSelector(selector: LogoSelectorOptions) {
  return LOGO_SELECTOR_KEYS.map((key) => {
    const value = selector[key];
    return value === undefined ? null : `${key}: ${value}`;
  })
    .filter(Boolean)
    .join(", ");
}

function getSponsorLogoAsset(sponsor: SponsorLogo) {
  const selector = sponsor.logoVariant ?? DEFAULT_SPONSOR_LOGO_VARIANT;
  const selectedLogo = getCompanyLogo(sponsor.companyId, selector);

  if (selectedLogo && logoMatchesSelector(selectedLogo, selector)) {
    return selectedLogo;
  }

  if (sponsor.logoVariant) {
    throw new Error(
      `Missing Breakpoint sponsor logo variant for ${sponsor.companyId} (${formatLogoSelector(selector)})`,
    );
  }

  return getCompanyLogo(sponsor.companyId, { treatment: "monotone" });
}

export function resolveSponsorLogo(sponsor: SponsorLogo): ResolvedSponsorLogo {
  const company = getSponsorCompany(sponsor.companyId);
  const logo = getSponsorLogoAsset(sponsor);
  const src = logo ? resolveImportedAssetSrc(logo.source) : undefined;

  if (!src) {
    throw new Error(`Missing Breakpoint sponsor logo: ${sponsor.companyId}`);
  }

  return {
    ...sponsor,
    alt: company.name,
    company,
    name: company.name,
    src,
  };
}
