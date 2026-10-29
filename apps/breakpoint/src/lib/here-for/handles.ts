import type { HereForHandle } from "./types";

export function normalizeHandle(value: unknown): HereForHandle | null {
  if (typeof value !== "string") return null;
  const name = value.trim().replace(/^@+/, "").toLowerCase();
  return /^[a-z0-9_]{1,15}$/.test(name) ? `@${name}` : null;
}

const PROFILE_HOSTS = /^(?:www\.|mobile\.)?(?:x|twitter)\.com$/i;

/**
 * Reads a handle from what people actually type or paste: "alice",
 * "@Alice", or a profile link copied from the X app such as
 * "https://x.com/alice?s=21".
 */
export function handleFromInput(value: string): HereForHandle | null {
  const text = value.trim();
  const link = text.match(/^(?:https?:\/\/)?([^/\s]+)\/([^/?#\s]+)/i);
  if (link && PROFILE_HOSTS.test(link[1]!)) return normalizeHandle(link[2]);
  return normalizeHandle(text);
}

export function validateAdds(handle: HereForHandle, values: unknown) {
  if (!Array.isArray(values) || values.length !== 3)
    return { code: "invalid_adds" as const };
  const adds = values.map(normalizeHandle);
  if (adds.some((item) => !item) || new Set(adds).size !== 3)
    return { code: "invalid_adds" as const };
  if (adds.includes(handle)) return { code: "self_add" as const };
  return { adds: adds as HereForHandle[] };
}
