import { getNewsRssResponse } from "@/lib/news-rss";

export const revalidate = 300;

export async function GET() {
  return getNewsRssResponse();
}
