/**
 * Old #anchors whose section moved, was merged or was cut. The fragment
 * never reaches the server, so no redirect can move `#old`; this does, in
 * the browser: when the page has no element for the hash, it looks the page
 * and the anchor up in the generated map and goes to the section that holds
 * that content now (scrolling on the same page, replacing the URL for
 * another page).
 *
 * The map is /docs-assets/legacy-anchors/<locale>.json (one file per
 * locale), written by docs-tooling's gen:legacy-anchors from
 * content/legacy-anchors/<locale>.json:
 *
 *   { "<page path>": { "<old anchor>": "#id" | "/path#id" | "/path" } }
 *
 * It is fetched only when a hash matches nothing, so pages and valid
 * anchors never wait for it. Every target id exists on its page (the
 * generator checks), and after moving to another page the next page never
 * moves again for the same hop, so there are no loops.
 */
import { defaultLocale, locales } from "@workspace/i18n/config";

export type LegacyAnchorMap = Record<string, Record<string, string> | string>;

export const LEGACY_ANCHORS_BASE = "/docs-assets/legacy-anchors";
/** sessionStorage key: the URL the last cross-page move went to. */
export const LEGACY_HOP_KEY = "sol-legacy-anchor-hop";

/** The decoded id of a `#hash`, or null for none. */
export function hashId(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** The locale of a public path (`/ja/developers/...` -> `ja`). */
export function localeOf(pathname: string): string {
  const first = pathname.split("/")[1] ?? "";
  return first !== defaultLocale && locales.includes(first)
    ? first
    : defaultLocale;
}

/** A public path as the map keys it: no trailing slash, no `/en` prefix. */
export function pagePath(pathname: string): string {
  let p = pathname.replace(/\/+$/, "") || "/";
  if (p === `/${defaultLocale}` || p.startsWith(`/${defaultLocale}/`))
    p = p.slice(defaultLocale.length + 1) || "/";
  try {
    return decodeURI(p);
  } catch {
    return p;
  }
}

/** Where `#id` on `pathname` goes now, or null when the map has no entry. */
export function legacyTarget(
  map: LegacyAnchorMap | null | undefined,
  pathname: string,
  id: string,
): string | null {
  const page = map?.[pagePath(pathname)];
  if (!page || typeof page !== "object") return null;
  const target = page[id];
  return typeof target === "string" && target ? target : null;
}

const maps = new Map<string, Promise<LegacyAnchorMap | null>>();

/** The locale's map, fetched once per page session (null when missing). */
export function loadLegacyAnchors(locale: string) {
  let map = maps.get(locale);
  if (!map) {
    map = fetch(`${LEGACY_ANCHORS_BASE}/${locale}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<LegacyAnchorMap>) : null))
      .catch(() => null);
    maps.set(locale, map);
  }
  return map;
}

export interface LegacyAnchorEnv {
  location: Pick<Location, "pathname" | "search" | "hash" | "href"> & {
    replace(url: string): void;
  };
  document: Pick<Document, "getElementById">;
  history: Pick<History, "replaceState" | "state">;
  load: (locale: string) => Promise<LegacyAnchorMap | null>;
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem"> | null;
}

function hasElement(env: LegacyAnchorEnv, id: string) {
  const raw = env.location.hash.slice(1);
  return Boolean(
    env.document.getElementById(id) ||
    (raw !== id && env.document.getElementById(raw)),
  );
}

function storage(env: LegacyAnchorEnv, op: (s: Storage) => unknown) {
  try {
    if (env.storage) return op(env.storage as Storage);
  } catch {
    // Storage disabled: the generator's checks still rule out loops.
  }
  return null;
}

/**
 * Follow the current hash if the page has no element for it and the map
 * has an entry: "scrolled" (same page), "navigated" (another page) or
 * "none".
 */
export async function followLegacyAnchor(
  env: LegacyAnchorEnv,
): Promise<"none" | "scrolled" | "navigated"> {
  const { pathname, hash } = env.location;
  const id = hashId(hash);
  if (!id || id === "top") return "none";
  // Arrived here from a move: never move again (even if the section is
  // missing), so a stale map can't send the reader round in circles.
  const here = `${pagePath(pathname)}#${id}`;
  const hopped = storage(env, (s) => s.getItem(LEGACY_HOP_KEY)) === here;
  if (hopped) storage(env, (s) => s.removeItem(LEGACY_HOP_KEY));
  if (hopped || hasElement(env, id)) return "none";
  const map = await env.load(localeOf(pathname));
  // The reader moved on while the map loaded.
  if (env.location.pathname !== pathname || env.location.hash !== hash)
    return "none";
  const target = legacyTarget(map, pathname, id);
  if (!target) return "none";
  const url = new URL(target, env.location.href);
  const targetId = hashId(url.hash);
  url.hash = targetId ? encodeURIComponent(targetId) : "";
  if (pagePath(url.pathname) === pagePath(pathname)) {
    const el = targetId ? env.document.getElementById(targetId) : null;
    if (!el || targetId === id) return "none";
    env.history.replaceState(
      env.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
    el.scrollIntoView();
    return "scrolled";
  }
  storage(env, (s) =>
    s.setItem(LEGACY_HOP_KEY, `${pagePath(url.pathname)}#${targetId ?? ""}`),
  );
  env.location.replace(`${url.pathname}${url.search}${url.hash}`);
  return "navigated";
}
