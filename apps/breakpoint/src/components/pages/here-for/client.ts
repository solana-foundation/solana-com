"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { localizedRouteUrl } from "@/config";
import type {
  HereForAddsRequest,
  HereForAddsResponse,
  HereForErrorResponse,
  HereForGraphPayload,
  HereForHandle,
  HereForMePayload,
} from "@/lib/here-for/types";
import { HERE_FOR_PATH } from "./constants";
import { buildGraphIndex, withMe, type GraphIndex } from "./graph-index";

// Production serves this app under /breakpoint; the dev server rewrites the
// same prefix back to /api (see next.config.ts), so one path works in both.
const API = "/breakpoint/api/here-for";

export { HERE_FOR_PATH, EGG_COUPON_CODE, EGG_COUPON_HREF } from "./constants";

export type Loadable<T> =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: T };

export function useGraphIndex(me: HereForMePayload | null): {
  graph: Loadable<GraphIndex>;
  refreshing: boolean;
  refresh: () => void;
} {
  const [payload, setPayload] = useState<Loadable<HereForGraphPayload>>({
    status: "loading",
  });
  const [version, setVersion] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    let cancelled = false;
    // A refresh skips the browser and CDN caches; the first load uses them.
    const url = version ? `${API}/graph?fresh=${Date.now()}` : `${API}/graph`;
    fetch(url, version ? { cache: "no-store" } : undefined)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<HereForGraphPayload>;
      })
      .then((data) => {
        if (!cancelled) setPayload({ status: "ready", data });
      })
      .catch(() => {
        // A failed refresh keeps the map it already has.
        if (!cancelled)
          setPayload((current) =>
            version && current.status === "ready"
              ? current
              : { status: "error" },
          );
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [version]);
  const refresh = useCallback(() => {
    setRefreshing(true);
    setVersion((current) => current + 1);
  }, []);
  const personalised = useMemo(
    () => (payload.status === "ready" ? withMe(payload.data, me) : null),
    [payload, me],
  );
  const graph = useMemo<Loadable<GraphIndex>>(
    () =>
      personalised
        ? { status: "ready", data: buildGraphIndex(personalised) }
        : payload.status === "error"
          ? { status: "error" }
          : { status: "loading" },
    [personalised, payload],
  );
  return { graph, refreshing, refresh };
}

export function useMe(): [
  Loadable<HereForMePayload>,
  (me: HereForMePayload) => void,
] {
  const [state, setState] = useState<Loadable<HereForMePayload>>({
    status: "loading",
  });
  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/me`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<HereForMePayload>;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return [state, (data) => setState({ status: "ready", data })];
}

export async function submitAdds(
  body: HereForAddsRequest,
): Promise<
  | { ok: true; data: HereForAddsResponse }
  | { ok: false; error: HereForErrorResponse }
> {
  try {
    const response = await fetch(`${API}/adds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return response.ok
      ? { ok: true, data: json as HereForAddsResponse }
      : { ok: false, error: json as HereForErrorResponse };
  } catch {
    return {
      ok: false,
      error: { code: "unavailable", error: "Network error" },
    };
  }
}

/**
 * Starts X sign-in and comes back to the current page afterwards. Picks ride
 * along in the return URL, which survives X opening the callback in another
 * browser where local storage would be empty.
 */
export function xSignInUrl(picks: readonly HereForHandle[] = []) {
  const back = new URL(window.location.href);
  back.searchParams.delete("x");
  back.searchParams.delete("add");
  back.searchParams.delete("picks");
  if (picks.length)
    back.searchParams.set("picks", picks.map(handleSlug).join(","));
  return `${API}/x/login?return=${encodeURIComponent(back.pathname + back.search)}`;
}

export async function signOutOfX() {
  try {
    return (await fetch(`${API}/x/logout`, { method: "POST" })).ok;
  } catch {
    return false;
  }
}

/** "@handle" -> "handle" for URL segments. */
export const handleSlug = (handle: string) =>
  handle.replace(/^@+/, "").toLowerCase();

/** Which share card a person link unfurls with; the default is their 3. */
export type PersonShare = { with: string } | { card: "mutuals" };

export function personUrl(locale: string, handle: string, share?: PersonShare) {
  const url = localizedRouteUrl(
    locale,
    `${HERE_FOR_PATH}/${handleSlug(handle)}`,
  );
  if (!share) return url;
  return "with" in share
    ? `${url}?with=${handleSlug(share.with)}`
    : `${url}?card=${share.card}`;
}

/** Opens X's composer. Tagging handles in the text notifies those people. */
export function xIntentUrl(text: string, url: string) {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export function openXIntent(text: string, url: string) {
  window.open(xIntentUrl(text, url), "_blank", "noopener,noreferrer");
}

export const joinHandles = (handles: readonly (HereForHandle | string)[]) =>
  handles.join(" ");

/**
 * Ends a post with the "who are you here for" ask only while someone it tags
 * still hasn't added their own 3; asking people who already have is noise.
 */
export const withAsk = (text: string, ask: string, anyoneLeft: boolean) =>
  anyoneLeft ? `${text} ${ask}` : text;

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
