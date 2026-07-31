/**
 * Optional campaign / promo surface for the News experience.
 *
 * This is a safe static/config fallback for high-priority promotions (e.g.
 * Breakpoint) that does NOT require any new CMS schema. Campaigns are declared
 * here, date-gated, and targeted at surfaces. If nothing is active for a given
 * surface, the hero simply does not render.
 *
 * When a first-class campaign-promo collection is added to Keystatic later
 * (see the conversion brief), `getActiveCampaign` can be swapped to read from
 * the CMS without changing the consuming components.
 */

export type CampaignSurface =
  | "news-front"
  | "all-news-verticals"
  | `category:${string}`;

export interface NewsCampaign {
  /**
   * Also the i18n key: all display copy (eyebrow, title, description, CTA
   * labels, image alt) lives in packages/i18n media messages under
   * `news.campaigns.<id>`. Add the message entry when declaring a campaign.
   */
  id: string;
  primaryCtaUrl: string;
  secondaryCtaUrl?: string;
  /**
   * Surfaces this campaign may render on. Use "news-front" for /news,
   * "all-news-verticals" for every category page, or "category:<slug>" for a
   * specific vertical.
   */
  targetSurfaces: CampaignSurface[];
  /** ISO date; campaign is inactive before this. Optional = no lower bound. */
  startAt?: string;
  /** ISO date; campaign is inactive after this. Optional = no upper bound. */
  endAt?: string;
  /** Higher wins when multiple campaigns match a surface. */
  priority: number;
  enabled: boolean;
}

/**
 * Declared campaigns. Editors can enable/disable or adjust dates here without a
 * schema migration. Kept intentionally small.
 */
export const NEWS_CAMPAIGNS: NewsCampaign[] = [
  {
    id: "breakpoint-2026",
    primaryCtaUrl: "https://solana.com/breakpoint/registration",
    secondaryCtaUrl: "https://solanafoundation.typeform.com/bp26sponsorform",
    targetSurfaces: [
      "news-front",
      "category:breakpoint",
      "category:developers",
      "category:ecosystem",
      "category:community",
    ],
    startAt: "2026-01-01T00:00:00.000Z",
    endAt: "2026-12-31T23:59:59.000Z",
    priority: 100,
    enabled: true,
  },
];

function surfaceMatches(
  campaign: NewsCampaign,
  surface: CampaignSurface,
): boolean {
  if (campaign.targetSurfaces.includes(surface)) return true;
  // A category surface also matches an "all verticals" campaign.
  if (
    surface.startsWith("category:") &&
    campaign.targetSurfaces.includes("all-news-verticals")
  ) {
    return true;
  }
  return false;
}

function isWithinWindow(campaign: NewsCampaign, now: Date): boolean {
  if (campaign.startAt && now < new Date(campaign.startAt)) return false;
  if (campaign.endAt && now > new Date(campaign.endAt)) return false;
  return true;
}

/**
 * Returns the highest-priority active campaign for a surface, or null when none
 * apply. `now` is injectable for testing.
 */
export function getActiveCampaign(
  surface: CampaignSurface,
  now: Date = new Date(),
): NewsCampaign | null {
  const matches = NEWS_CAMPAIGNS.filter(
    (c) => c.enabled && surfaceMatches(c, surface) && isWithinWindow(c, now),
  ).sort((a, b) => b.priority - a.priority);

  return matches[0] ?? null;
}
