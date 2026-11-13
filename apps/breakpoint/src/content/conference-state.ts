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
 *
 * Outside production, `?preview=live` (or `pre` / `post`) shows another
 * edition without touching the constant, so the live page can be checked on
 * a preview deployment while the marketing page is still what ships.
 */
export type ConferenceState = "pre" | "live" | "post";

export const CONFERENCE_STATE: ConferenceState = "pre";

export const PREVIEW_PARAM = "preview";

const STATES: ReadonlySet<string> = new Set<ConferenceState>([
  "pre",
  "live",
  "post",
]);

export function isConferenceState(value: unknown): value is ConferenceState {
  return typeof value === "string" && STATES.has(value);
}

/** The production deployment behind solana.com; previews and local dev are not. */
export function isProductionDeployment(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.VERCEL_ENV === "production";
}

export type SearchParams = Record<string, string | string[] | undefined>;

/**
 * The edition to render for a request: the shipped constant, or the
 * `?preview=` edition when the deployment is not production.
 */
export function resolveConferenceState(
  searchParams: SearchParams | undefined,
  {
    production = isProductionDeployment(),
    shipped = CONFERENCE_STATE,
  }: { production?: boolean; shipped?: ConferenceState } = {},
): ConferenceState {
  if (production) return shipped;
  const raw = searchParams?.[PREVIEW_PARAM];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return isConferenceState(value) ? value : shipped;
}

export function isLiveConference(state: ConferenceState = CONFERENCE_STATE) {
  return state === "live";
}
