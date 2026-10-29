import type { HereForHandle } from "./types";

export function normalizeHandle(value: unknown): HereForHandle | null {
  if (typeof value !== "string") return null;
  const name = value.trim().replace(/^@+/, "").toLowerCase();
  return /^[a-z0-9_]{1,15}$/.test(name) ? `@${name}` : null;
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
