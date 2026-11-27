import "server-only";
import { reader } from "@/lib/reader";
import { safeHref } from "@/lib/mdx-security";
import type {
  ReleaseInput,
  SupportedClient,
} from "@/lib/upgrades/group-by-release";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeClients(value: unknown): SupportedClient[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item): SupportedClient | null => {
      if (!isRecord(item)) {
        return null;
      }

      const name = toStringValue(item.name);
      if (!name) {
        return null;
      }

      return {
        name,
        version: toStringValue(item.version),
        url: safeHref(toStringValue(item.url) || null) ?? null,
      };
    })
    .filter((client): client is SupportedClient => client !== null);
}

/** Reads every protocol version (and legacy client release) record. */
export async function getReleases(): Promise<ReleaseInput[]> {
  const slugs = await reader.collections.releases.list();
  const releases = await Promise.all(
    slugs.map(async (slug: string) => {
      const entry = (await reader.collections.releases.read(slug)) as Record<
        string,
        unknown
      > | null;

      if (!entry) {
        return null;
      }

      return {
        slug,
        name: toStringValue(entry.name) || slug,
        kind: entry.kind === "client" ? "client" : "protocol",
        status: entry.status === "shipped" ? "shipped" : "planned",
        expectedDate: toStringValue(entry.expectedDate) || null,
        overview: toStringValue(entry.overview) || null,
        clients: normalizeClients(entry.clients),
      } satisfies ReleaseInput;
    }),
  );

  return releases.filter(
    (release): release is ReleaseInput => release !== null,
  );
}

/** The release that features the given upgrade article as its overview. */
export async function getReleaseForOverview(
  upgradeSlug: string,
): Promise<ReleaseInput | null> {
  const releases = await getReleases();
  return releases.find((release) => release.overview === upgradeSlug) ?? null;
}
