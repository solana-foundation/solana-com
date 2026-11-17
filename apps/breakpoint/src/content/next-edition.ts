/**
 * Next-edition announcement for the Breakpoint home page.
 *
 * It renders as one full-width announcement bar (`NextEditionBar`) directly
 * under the hero on both the live edition and the marketing page. The
 * bar opens a dialog with the announcement video on top and the
 * register-interest email signup underneath.
 *
 * Every event fact lives here so the events team can review one file. A `null`
 * field is unconfirmed and is simply not rendered. Flip `published` once the
 * inputs have been confirmed. Until then the bar only renders on
 * non-production deployments when the page is opened with `?preview=bp27`. It
 * shares the `preview` query with the conference-state switch, so
 * `?preview=live&preview=bp27` shows the announcement on the live edition.
 */

import {
  isProductionDeployment,
  PREVIEW_PARAM,
  type SearchParams,
} from "@/content/conference-state";
import { BP27_UPDATES_FORM_ID } from "@/content/links";

export type NextEditionAnnouncement = {
  /** Render the bar for every visitor. */
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
  /** YouTube id of the announcement (sizzle) video, played in the dialog. */
  videoId: string | null;
  /**
   * Iterable public form id the dialog's signup posts to: the public subscriber
   * form of the Breakpoint 2027 updates list (`BP27_UPDATES_FORM_ID`).
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
  // https://youtu.be/jzxX5B_Ddiw
  videoId: "jzxX5B_Ddiw",
  signupFormId: BP27_UPDATES_FORM_ID,
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
