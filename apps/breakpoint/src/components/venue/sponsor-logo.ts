import { publicAssetPath } from "@/config";
import type { MapSponsor } from "@/content/venue/types";
import { getSponsorCompany, resolveSponsorLogo } from "@/lib/sponsors";

/**
 * URL of the white logo drawn on a sponsor pill: the plan's own artwork
 * when the map data names one, otherwise the company's Breakpoint logo.
 */
export function sponsorLogoSrc(sponsor: MapSponsor): string {
  if (sponsor.logo) return publicAssetPath(sponsor.logo);
  return publicAssetPath(
    resolveSponsorLogo({
      companyId: sponsor.companyId,
      width: sponsor.logoAspect,
      height: 1,
    }).src,
  );
}

export function sponsorCompany(sponsor: MapSponsor) {
  return getSponsorCompany(sponsor.companyId);
}
