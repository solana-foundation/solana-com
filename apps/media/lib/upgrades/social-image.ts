export const UPGRADE_SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const UPGRADE_SOCIAL_IMAGE_TYPE = "image/png";

export function getUpgradeSocialImageUrl(
  slug: string,
  publicUrl = "https://solana.com",
): string {
  return `${publicUrl}/upgrades/${encodeURIComponent(slug)}/social-image`;
}

export function createUpgradeSocialImage(
  slug: string,
  title: string,
  publicUrl?: string,
) {
  return {
    url: getUpgradeSocialImageUrl(slug, publicUrl),
    width: UPGRADE_SOCIAL_IMAGE_SIZE.width,
    height: UPGRADE_SOCIAL_IMAGE_SIZE.height,
    type: UPGRADE_SOCIAL_IMAGE_TYPE,
    alt: `${title} — Solana Upgrades`,
  };
}

export function formatUpgradePublishedDate(
  publishedAt: string | null | undefined,
): string | null {
  if (!publishedAt) return null;

  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getUpgradeTitleFontSize(title: string): number {
  if (title.length > 72) return 46;
  if (title.length > 52) return 54;
  return 64;
}
