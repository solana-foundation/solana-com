import { getChangelogRssResponse } from "@/lib/changelog-rss";

export const revalidate = 300;

export async function GET() {
  return getChangelogRssResponse();
}
