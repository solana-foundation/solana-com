/**
 * Which edition of the home page ships.
 *
 * - `pre`: the marketing page (tickets, why attend, announcements).
 * - `live`: the event-day page (livestream, today's agenda, venue map).
 * - `post`: reserved for the recap edition after the conference.
 *
 * The switch is deliberately a constant rather than a date or an environment
 * variable: merging the change that flips it is the release, so the live
 * page can be reviewed on a preview deployment and goes out with the deploy.
 */
export type ConferenceState = "pre" | "live" | "post";

export const CONFERENCE_STATE: ConferenceState = "live";

export function isLiveConference(state: ConferenceState = CONFERENCE_STATE) {
  return state === "live";
}
