import { getNewsRssResponse, RSS_REVALIDATE_SECONDS } from "@/lib/news-rss";

export const revalidate = RSS_REVALIDATE_SECONDS;

export async function GET() {
  return getNewsRssResponse();
}
