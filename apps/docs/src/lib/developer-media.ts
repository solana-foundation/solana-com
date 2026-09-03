import "server-only";

export type DeveloperUpdate = {
  kind: "News" | "Changelog" | "Upgrade" | "Release";
  title: string;
  description: string;
  href: string;
  publishedAt?: string;
};

const REVALIDATE_SECONDS = 300;
const DEFAULT_MEDIA_APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://solana-com-media.vercel.app";

function getDeveloperUpdatesUrl(): string {
  const mediaAppUrl =
    process.env.NEXT_PUBLIC_MEDIA_APP_URL || DEFAULT_MEDIA_APP_URL;

  return new URL("/api/developer-updates/latest", mediaAppUrl).toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDeveloperUpdate(value: unknown): value is DeveloperUpdate {
  if (!isRecord(value)) return false;

  return (
    (value.kind === "News" ||
      value.kind === "Changelog" ||
      value.kind === "Upgrade" ||
      value.kind === "Release") &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.href === "string" &&
    (value.publishedAt === undefined || typeof value.publishedAt === "string")
  );
}

/**
 * Fetches the Media-owned developer feed at runtime. A failed or malformed
 * response leaves the rest of the developer hub available.
 */
export async function getLatestDeveloperUpdates(): Promise<DeveloperUpdate[]> {
  try {
    const response = await fetch(getDeveloperUpdatesUrl(), {
      headers: { accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data: unknown = await response.json();
    if (!isRecord(data) || !Array.isArray(data.updates)) {
      throw new Error("Invalid developer updates response");
    }

    return data.updates.filter(isDeveloperUpdate);
  } catch (error) {
    console.error("Failed to fetch latest developer updates:", error);
    return [];
  }
}
