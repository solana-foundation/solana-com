/**
 * Homepage campaign hero registry.
 *
 * A campaign temporarily takes over the homepage hero between `start` and
 * `end` (inclusive, UTC). Outside every campaign window the default `Hero`
 * in `home.tsx` renders — nothing else on the homepage changes.
 *
 * To run a new campaign:
 *   1. Build a hero component under `campaigns/<id>/`.
 *   2. Add its id + window here.
 *   3. Map the id to the component in `home.tsx` (CAMPAIGN_HEROES).
 * To pull a campaign early, shorten its `end` date.
 */

export type CampaignId = "epoch1000";

export interface Campaign {
  id: CampaignId;
  /** ISO date (UTC) the takeover starts. */
  start: string;
  /** ISO date (UTC) after which the default hero returns. */
  end: string;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: "epoch1000",
    start: "2026-07-09",
    end: "2026-07-17",
  },
];

/** Resolve the campaign that should own the hero right now (first match wins). */
export function getActiveCampaignId(now: Date = new Date()): CampaignId | null {
  const t = now.getTime();
  for (const c of CAMPAIGNS) {
    const start = new Date(`${c.start}T00:00:00Z`).getTime();
    const end = new Date(`${c.end}T23:59:59Z`).getTime();
    if (t >= start && t <= end) return c.id;
  }
  return null;
}
