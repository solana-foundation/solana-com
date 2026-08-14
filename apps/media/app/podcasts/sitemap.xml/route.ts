import { getPodcastSitemapResponse } from "@/lib/podcast-sitemap";

export const revalidate = 1800;

export async function GET() {
  return getPodcastSitemapResponse();
}
