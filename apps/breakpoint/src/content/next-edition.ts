/**
 * Next-edition announcement for the Breakpoint home page.
 *
 * Mirrors the format of the archived BP26 announcement that followed BP25: a
 * header with eyebrow, headline, dates and venue; a media card that opens the
 * announcement video; and an updates / early-registration signup block.
 *
 * Every event fact lives here so the events team can review one file. A `null`
 * field is unconfirmed and is simply not rendered; nothing below is a
 * placeholder. Flip `published` once every input has been confirmed. Until
 * then the section only renders on non-production deployments when the page
 * is opened with `?preview=bp27`. It shares the `preview` query with the
 * conference-state switch, so `?preview=live&preview=bp27` shows the
 * announcement on the live edition.
 */

import {
  isProductionDeployment,
  PREVIEW_PARAM,
  type SearchParams,
} from "@/content/conference-state";
import { BREAKPOINT_NEWSLETTER_FORM_ID } from "@/content/links";

export type NextEditionAnnouncement = {
  /** Render the section for every visitor. */
  published: boolean;
  /** Four-digit edition year, used in copy such as "Breakpoint 2027". */
  year: string;
  /** Short edition name, used in copy such as "BP27". */
  shortName: string;
  /** Host city, e.g. "London". */
  city: string | null;
  /** Venue name, e.g. "Olympia London". */
  venue: string | null;
  /** Country or region shown after the city, e.g. "England". */
  region: string | null;
  /** First day, ISO date (YYYY-MM-DD). */
  startDate: string | null;
  /** Last day, ISO date (YYYY-MM-DD). */
  endDate: string | null;
  /** YouTube id of the announcement video. The media card needs it. */
  videoId: string | null;
  /** Thumbnail under `public/img`; falls back to the YouTube poster frame. */
  thumbnail: string | null;
  /** Optional artwork under `public/img` for the signup block. */
  signupArtwork: string | null;
  /**
   * Iterable public form id the signup block posts to. Defaults to the
   * Breakpoint newsletter form that the header "Get Updates" dialog already
   * uses. Confirm the destination before publishing.
   */
  signupFormId: string | null;
};

export const NEXT_EDITION: NextEditionAnnouncement = {
  published: false,
  year: "2027",
  shortName: "BP27",
  city: null,
  venue: null,
  region: null,
  startDate: null,
  endDate: null,
  videoId: null,
  thumbnail: null,
  signupArtwork: null,
  signupFormId: BREAKPOINT_NEWSLETTER_FORM_ID,
};

export const NEXT_EDITION_PREVIEW_VALUE = "bp27";

/**
 * Whether the announcement renders for this request. Published announcements
 * always render. Unpublished ones render only outside production and only when
 * the preview query is present, so reviewers can compare the format against the
 * archived reference without exposing unconfirmed content.
 */
export function isNextEditionVisible(
  searchParams: SearchParams | undefined,
  announcement: NextEditionAnnouncement = NEXT_EDITION,
  production: boolean = isProductionDeployment(),
) {
  if (announcement.published) return true;
  if (production) return false;

  const value = searchParams?.[PREVIEW_PARAM];
  const values = Array.isArray(value) ? value : [value];
  return values.includes(NEXT_EDITION_PREVIEW_VALUE);
}
