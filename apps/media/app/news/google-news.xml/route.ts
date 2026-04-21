import { getGoogleNewsSitemapResponse } from "@/lib/google-news-sitemap";

export const revalidate = 300;

export async function GET() {
  return getGoogleNewsSitemapResponse();
}
