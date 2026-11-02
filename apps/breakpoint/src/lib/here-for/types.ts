/**
 * Shared contract for the "Who are you here for?" community graph.
 *
 * Handles are always stored and transported lowercase with a leading "@".
 * Graph payloads use flat arrays indexed by node so 10k people and 21k adds
 * stay small on the wire and map straight onto three.js buffers.
 */

export const HERE_FOR_MAX_ADDS = 3;

export type HereForHandle = `@${string}`;

/** GET /api/here-for/graph */
export type HereForGraphPayload = {
  /** Layout snapshot id the positions came from. */
  version: string;
  generatedAt: string;
  /** Node index -> handle. */
  handles: HereForHandle[];
  /** Node index -> 1 when the person has added their own 3, else 0. */
  claimed: number[];
  /** Flat [x, y, z, x, y, z, ...] in layout units, one decimal place. */
  positions: number[];
  /** Node index -> community id (index into `communities`). */
  community: number[];
  communities: HereForCommunity[];
  /** Flat [from, to, from, to, ...] node indices, one pair per add. */
  links: number[];
  /** Node index -> number of people who added them. */
  inDegree: number[];
};

export type HereForCommunity = {
  id: number;
  size: number;
  /** Most-added handle in the community, used as "Around @handle". */
  label: HereForHandle;
};

export type HereForPersonLink = {
  handle: HereForHandle;
  mutual: boolean;
};

/** GET /api/here-for/people/[handle] */
export type HereForPersonPayload = {
  handle: HereForHandle;
  claimed: boolean;
  /** Their adds in rank order (1-3). */
  adds: (HereForPersonLink & { rank: number })[];
  addedBy: HereForPersonLink[];
  mutualCount: number;
};

export type HereForSuggestionReason =
  | { kind: "addedYou" }
  | { kind: "sharedAdd"; via: HereForHandle }
  | { kind: "yourAddAdded"; via: HereForHandle }
  | { kind: "coAdded"; via: HereForHandle };

export type HereForSuggestion = {
  handle: HereForHandle;
  /** True when they've added their own 3. */
  claimed: boolean;
  score: number;
  reasons: HereForSuggestionReason[];
};

/** GET /api/here-for/me (identified by the signed ballot cookie). */
export type HereForMePayload = {
  handle: HereForHandle | null;
  /** Handle the visitor signed in with on X, before or after adding. */
  xHandle: HereForHandle | null;
  adds: HereForHandle[];
  mutuals: HereForHandle[];
  addedBy: HereForHandle[];
  suggestions: HereForSuggestion[];
  status: HereForCampaignStatus;
};

export type HereForCampaignStatus = "open" | "closed";

/** POST /api/here-for/adds */
export type HereForAddsRequest = {
  /** The sender's own handle comes from their X sign-in, not the body. */
  adds: string[];
};

export type HereForAddsResponse = {
  me: HereForMePayload;
  /** Handles that became mutual because of this submission. */
  newMutuals: HereForHandle[];
};

export type HereForErrorCode =
  | "invalid_handle"
  | "auth_required"
  | "invalid_adds"
  | "self_add"
  | "handle_claimed"
  | "rate_limited"
  | "closed"
  | "unavailable";

export type HereForErrorResponse = {
  error: string;
  code: HereForErrorCode;
};

/**
 * GET /api/here-for/directory: known X accounts for typeahead, most followed
 * first, as [handle without "@", display name] pairs to keep the payload small.
 */
export type HereForDirectoryPayload = {
  entries: [string, string][];
};
