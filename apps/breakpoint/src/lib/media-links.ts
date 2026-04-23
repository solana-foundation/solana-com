const DEFAULT_MEDIA_APP_URL =
  process.env.NODE_ENV === "production"
    ? "https://solana-com-media.vercel.app"
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

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return MEDIA_APP_URL;
  }

  return "";
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

    const data = (await response.json()) as BreakpointAnnouncementLink[];

    return data.slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch Breakpoint announcement links:", error);
    return [];
  }
}
