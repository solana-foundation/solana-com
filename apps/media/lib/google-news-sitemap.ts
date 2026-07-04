import { NextResponse } from "next/server";
import { reader } from "@/lib/reader";
import { fetchPublishedPostBySlug } from "@/lib/post-data";
import { parsePublishedAt } from "@/lib/keystatic/publishing";

const BASE_URL = "https://solana.com";
const NEWS_URL = `${BASE_URL}/news`;
const GOOGLE_NEWS_SITEMAP_CANONICAL_PATH = "/news/sitemap-news.xml";
const PUBLICATION_NAME = "Solana";
const PUBLICATION_LANGUAGE = "en";
const GOOGLE_NEWS_LOOKBACK_HOURS = 48;
const MIN_NEWS_URLS = 10;
const MAX_NEWS_URLS = 1000;
const XML_CONTENT_TYPE = "application/xml; charset=utf-8";
const XML_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

export const GOOGLE_NEWS_SITEMAP_CANONICAL_URL = `${BASE_URL}${GOOGLE_NEWS_SITEMAP_CANONICAL_PATH}`;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type RecentPublishedPost = {
  slug: string;
  title: string;
  publishedAt: Date;
};

async function getRecentPublishedPosts(
  now: Date,
): Promise<RecentPublishedPost[]> {
  const minNewsPublishedAt = new Date(
    now.getTime() - GOOGLE_NEWS_LOOKBACK_HOURS * 60 * 60 * 1000,
  );
  const allSlugs = await reader.collections.posts.list();
  const posts: RecentPublishedPost[] = [];

  for (const slug of allSlugs) {
    const post = await fetchPublishedPostBySlug(slug, now);
    if (!post) {
      continue;
    }

    const publishedAt = parsePublishedAt(post.publishedAt);
    if (!publishedAt) {
      continue;
    }

    if (publishedAt > now) {
      continue;
    }

    posts.push({
      slug,
      title: String(post.title || slug),
      publishedAt,
    });
  }

  posts.sort(
    (left, right) => right.publishedAt.getTime() - left.publishedAt.getTime(),
  );

  // Google News wants articles from the last 48 hours, but our publishing
  // cadence often leaves that window empty. Top up with the newest older
  // posts so the sitemap always has URLs for crawlers to read.
  const withinLookback = posts.filter(
    (post) => post.publishedAt >= minNewsPublishedAt,
  );
  if (withinLookback.length >= MIN_NEWS_URLS) {
    return withinLookback.slice(0, MAX_NEWS_URLS);
  }

  return posts.slice(0, MIN_NEWS_URLS);
}

async function buildGoogleNewsSitemapXml(
  now: Date = new Date(),
): Promise<string> {
  const posts = await getRecentPublishedPosts(now);
  const urls = posts.map((post) => {
    const loc = `${NEWS_URL}/${post.slug}`;
    const lines = [
      "<url>",
      `<loc>${escapeXml(loc)}</loc>`,
      `<lastmod>${escapeXml(post.publishedAt.toISOString())}</lastmod>`,
      "<news:news>",
      "<news:publication>",
      `<news:name>${escapeXml(PUBLICATION_NAME)}</news:name>`,
      `<news:language>${escapeXml(PUBLICATION_LANGUAGE)}</news:language>`,
      "</news:publication>",
      `<news:publication_date>${escapeXml(post.publishedAt.toISOString())}</news:publication_date>`,
      `<news:title>${escapeXml(post.title)}</news:title>`,
      "</news:news>",
      "</url>",
    ];

    return lines.join("");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

export async function getGoogleNewsSitemapResponse(
  now: Date = new Date(),
): Promise<NextResponse> {
  try {
    const xml = await buildGoogleNewsSitemapXml(now);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": XML_CONTENT_TYPE,
        "Cache-Control": XML_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error("Error generating Google News sitemap:", error);
    return new NextResponse("Error generating Google News sitemap", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
