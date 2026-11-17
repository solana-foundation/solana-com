"use client";

import type { ReactNode } from "react";
import type { CompanyRecord } from "@workspace/ecosystem-data";
import type { useTranslations } from "@workspace/i18n/client";
import { publicAssetPath } from "@/config";

/**
 * Company profile links and tags shared by the sponsors page modal and the
 * venue map's sponsor details. `t` is the `breakpoint.pages.sponsors`
 * namespace, which owns the social-link labels.
 */

export function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3C14.4 5.45 15.6 8.45 15.6 12C15.6 15.55 14.4 18.55 12 21C9.6 18.55 8.4 15.55 8.4 12C8.4 8.45 9.6 5.45 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path d="M13.93 10.62L21.47 2H19.68L13.14 9.49L7.91 2H1.88L9.79 13.34L1.88 22.39H3.67L10.58 14.47L16.1 22.39H22.13L13.93 10.62ZM11.48 13.42L10.68 12.3L4.3 3.33H7.05L12.19 10.56L12.99 11.69L19.68 21.12H16.93L11.48 13.42Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path d="M22.2 0H1.8C1.32261 0 0.864773 0.189642 0.527208 0.527208C0.189642 0.864773 0 1.32261 0 1.8V22.2C0 22.6774 0.189642 23.1352 0.527208 23.4728C0.864773 23.8104 1.32261 24 1.8 24H22.2C22.6774 24 23.1352 23.8104 23.4728 23.4728C23.8104 23.1352 24 22.6774 24 22.2V1.8C24 1.32261 23.8104 0.864773 23.4728 0.527208C23.1352 0.189642 22.6774 0 22.2 0ZM7.2 20.4H3.6V9.6H7.2V20.4ZM5.4 7.5C4.98742 7.48821 4.58746 7.35509 4.2501 7.11729C3.91274 6.87949 3.65294 6.54754 3.50315 6.16293C3.35337 5.77832 3.32025 5.35809 3.40793 4.95476C3.49561 4.55144 3.7002 4.18289 3.99614 3.89517C4.29207 3.60745 4.66624 3.41332 5.07188 3.33704C5.47752 3.26075 5.89664 3.30569 6.27688 3.46625C6.65712 3.62681 6.98162 3.89586 7.20983 4.23978C7.43804 4.5837 7.55983 4.98725 7.56 5.4C7.55052 5.96442 7.318 6.50214 6.91326 6.89564C6.50852 7.28914 5.96446 7.50642 5.4 7.5ZM20.4 20.4H16.8V14.712C16.8 13.008 16.08 12.396 15.144 12.396C14.8696 12.4143 14.6015 12.4866 14.3551 12.6088C14.1087 12.731 13.8888 12.9006 13.7082 13.108C13.5275 13.3154 13.3897 13.5565 13.3025 13.8173C13.2152 14.0782 13.1804 14.3537 13.2 14.628C13.194 14.6838 13.194 14.7402 13.2 14.796V20.4H9.6V9.6H13.08V11.16C13.431 10.626 13.9133 10.1911 14.4806 9.89692C15.0479 9.60276 15.6813 9.4592 16.32 9.48C18.18 9.48 20.352 10.512 20.352 13.872L20.4 20.4Z" />
    </svg>
  );
}

function AssetIcon({ src }: { src: string }) {
  return (
    <img
      src={publicAssetPath(src)}
      alt=""
      aria-hidden="true"
      className="block max-h-5 max-w-5 brightness-0 invert"
    />
  );
}

export type SponsorSocialLink = {
  href: string;
  icon: ReactNode;
  label: string;
};

export function getSponsorSocialLinks(
  company: CompanyRecord,
  t: ReturnType<typeof useTranslations>,
): SponsorSocialLink[] {
  const profile = company.profile;
  const socials = profile?.socials;
  const links: SponsorSocialLink[] = [];

  if (profile?.links?.website) {
    links.push({
      href: profile.links.website,
      icon: <GlobeIcon />,
      label: t("social.website"),
    });
  }

  if (socials?.x) {
    links.push({
      href: socials.x,
      icon: <XIcon />,
      label: "X",
    });
  }

  if (socials?.linkedin) {
    links.push({
      href: socials.linkedin,
      icon: <LinkedInIcon />,
      label: t("social.linkedin"),
    });
  }

  if (socials?.github) {
    links.push({
      href: socials.github,
      icon: <AssetIcon src="/assets/icon-github.svg" />,
      label: t("social.github"),
    });
  }

  if (socials?.discord) {
    links.push({
      href: socials.discord,
      icon: <AssetIcon src="/assets/icon-discord.svg" />,
      label: t("social.discord"),
    });
  }

  if (socials?.telegram) {
    links.push({
      href: socials.telegram,
      icon: <AssetIcon src="/assets/icon-telegram.svg" />,
      label: t("social.telegram"),
    });
  }

  if (socials?.youtube) {
    links.push({
      href: socials.youtube,
      icon: <AssetIcon src="/assets/icon-youtube.svg" />,
      label: t("social.youtube"),
    });
  }

  return links;
}

export function getSponsorTags(company: CompanyRecord) {
  const tags: string[] = [];

  if (company.profile?.sector) {
    tags.push(company.profile.sector);
  }

  if (company.profile?.type) {
    tags.push(company.profile.type);
  }

  return Array.from(new Set(tags));
}
