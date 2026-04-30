import { withRelatedProject } from "@vercel/related-projects";
import { SIDE_EVENTS_HREF, SPONSOR_FORM_HREF } from "@/content/links";

const VERCEL_MEDIA_APP_URL = withRelatedProject({
  projectName: "solana-com-media",
  defaultHost: "https://solana-com-media.vercel.app",
});

const DEFAULT_MEDIA_APP_URL =
  process.env.NODE_ENV === "production"
    ? VERCEL_MEDIA_APP_URL
    : "http://localhost:3002";

const MEDIA_APP_URL =
  process.env.MEDIA_APP_URL ||
  process.env.NEXT_PUBLIC_MEDIA_APP_URL ||
  DEFAULT_MEDIA_APP_URL;

export interface BreakpointAnnouncementLink {
  id: string;
  title: string;
  url: string;
  tags?: string[];
}

const FALLBACK_BREAKPOINT_ANNOUNCEMENT_LINKS: BreakpointAnnouncementLink[] = [
  {
    id: "breakpoint-2026-plan-your-trip",
    title: "Plan your trip to London",
    url: "/travel",
    tags: ["Travel"],
  },
  {
    id: "breakpoint-2026-community-events",
    title: "Explore community side events \u2197",
    url: SIDE_EVENTS_HREF,
    tags: ["Events"],
  },
  {
    id: "breakpoint-2026-watch-2025-highlights",
    title: "Watch Breakpoint 2025 highlights \u2197",
    url: "https://www.youtube.com/watch?v=394wb968J68",
    tags: ["Recap"],
  },
  {
    id: "breakpoint-2026-become-a-sponsor",
    title: "Become a sponsor \u2197",
    url: SPONSOR_FORM_HREF,
    tags: ["Sponsor"],
  },
];

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return MEDIA_APP_URL;
  }

  return "";
}

function getFallbackBreakpointAnnouncementLinks(): BreakpointAnnouncementLink[] {
  return FALLBACK_BREAKPOINT_ANNOUNCEMENT_LINKS.map((item) => ({ ...item }));
}

function isBreakpointAnnouncementLink(
  item: unknown,
): item is BreakpointAnnouncementLink {
  if (!item || typeof item !== "object") return false;
  const link = item as Partial<BreakpointAnnouncementLink>;
  return (
    typeof link.id === "string" &&
    typeof link.title === "string" &&
    typeof link.url === "string"
  );
}

export async function fetchBreakpointAnnouncementLinks(): Promise<
  BreakpointAnnouncementLink[]
> {
  try {
    const fetchOptions =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 300 } };

    const response = await fetch(
      `${getBaseUrl()}/api/links/latest?category=breakpoint&limit=10&featuredCount=10`,
      fetchOptions,
    );

    if (!response.ok) {
      throw new Error(`Media links request failed with ${response.status}`);
    }

    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) {
      throw new Error("Media links response was not an array");
    }

    const links = data.filter(isBreakpointAnnouncementLink).slice(0, 10);
    return links.length > 0 ? links : getFallbackBreakpointAnnouncementLinks();
  } catch (error) {
    console.error("Failed to fetch Breakpoint announcement links:", error);
    return getFallbackBreakpointAnnouncementLinks();
  }
}
