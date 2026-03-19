/**
 * SEO Metadata Tests
 *
 * Ensures all pages emit correct Open Graph and Twitter Card meta tags.
 * Tests call the centralized metadata functions in lib/metadata.ts directly.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("server-only", () => ({}));

vi.mock("@solana-com/ui-chrome/assets/favicon.png", () => ({
  default: { src: "/favicon.png" },
}));

vi.mock("@/lib/reader", () => ({
  reader: {
    collections: {
      posts: { read: vi.fn(), list: vi.fn() },
      authors: { read: vi.fn() },
      categories: { read: vi.fn() },
      tags: { read: vi.fn() },
    },
  },
}));

vi.mock("@/lib/category-data", () => ({
  fetchCategoryByPath: vi.fn(),
}));

vi.mock("@/lib/podcast-data", () => ({
  fetchPodcastBySlug: vi.fn(),
  fetchEpisodeById: vi.fn(),
  fetchAllPodcasts: vi.fn(),
  filterAndSortPodcasts: vi.fn(),
  fetchLatestEpisodeForPodcast: vi.fn(),
  fetchEpisodesForPodcast: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { config } from "@/lib/config";
import { reader } from "@/lib/reader";
import { fetchCategoryByPath } from "@/lib/category-data";
import { fetchPodcastBySlug, fetchEpisodeById } from "@/lib/podcast-data";
import {
  newsListingMetadata,
  newsPostMetadata,
  categoryListingMetadata,
  podcastsListingMetadata,
  podcastShowMetadata,
  podcastEpisodeMetadata,
} from "@/lib/metadata";

// Typed mock references
const mockReader = reader as any;
const mockFetchCategory = fetchCategoryByPath as ReturnType<typeof vi.fn>;
const mockFetchPodcast = fetchPodcastBySlug as ReturnType<typeof vi.fn>;
const mockFetchEpisode = fetchEpisodeById as ReturnType<typeof vi.fn>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PUBLIC_URL = "https://solana.com";

function expectOgFields(og: any) {
  expect(og).toBeDefined();
  expect(og.title).toBeTruthy();
  expect(og.description).toBeTruthy();
  expect(og.url).toMatch(/^https:\/\/solana\.com\//);
  expect(og.siteName).toBe(config.siteMetadata.title);
  expect(og.images).toBeDefined();
  expect(og.images.length).toBeGreaterThan(0);
}

function expectTwitterFields(twitter: any) {
  expect(twitter).toBeDefined();
  expect(twitter.card).toBe("summary_large_image");
  expect(twitter.title).toBeTruthy();
  expect(twitter.description).toBeTruthy();
  expect(twitter.images).toBeDefined();
  expect(twitter.images.length).toBeGreaterThan(0);
}

function expectCanonical(alternates: any, path: string) {
  expect(alternates?.canonical).toBe(`${PUBLIC_URL}${path}`);
}

function expectNoInternalUrls(og: any, alternates: any) {
  const urls = [og?.url, alternates?.canonical].filter(Boolean);
  for (const url of urls) {
    expect(url).not.toContain("media.solana.com");
    expect(url).not.toContain("localhost");
    expect(url).not.toContain("vercel.app");
  }
}

// ---------------------------------------------------------------------------
// Test Data
// ---------------------------------------------------------------------------

const MOCK_POST = {
  status: "published",
  title: "State of Solana February 2026",
  description: "A deep dive into the Solana ecosystem in February 2026.",
  heroImage: "/uploads/state-of-solana-feb-2026.jpg",
  date: "2026-02-15",
  author: "solana-team",
  category: "ecosystem",
  tags: ["defi", "nft"],
};

const MOCK_AUTHOR = { name: "Solana Team" };
const MOCK_CATEGORY = { name: "Ecosystem" };
const MOCK_TAGS: Record<string, { name: string }> = {
  defi: { name: "DeFi" },
  nft: { name: "NFT" },
};

const MOCK_PODCAST = {
  title: "Validated",
  slug: "validated",
  description: "Conversations with builders on Solana.",
  coverImage: "/uploads/validated-cover.jpg",
};

const MOCK_EPISODE = {
  id: "ep-123",
  title: "The Future of DeFi",
  description: "Exploring DeFi innovations on Solana.",
  thumbnailUrl: "/uploads/ep-123-thumb.jpg",
  audioUrl: "https://cdn.example.com/ep-123.mp3",
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

// ---- Config safety ----

describe("Config — publicUrl", () => {
  it("is https://solana.com", () => {
    expect(config.publicUrl).toBe("https://solana.com");
  });

  it("never points to media.solana.com or localhost", () => {
    expect(config.publicUrl).not.toContain("media.solana.com");
    expect(config.publicUrl).not.toContain("localhost");
  });
});

// ---- News Listing ----

describe("newsListingMetadata", () => {
  it("sets title and description", async () => {
    const meta = await newsListingMetadata();
    expect(meta.title).toBeTruthy();
    expect(meta.description).toBeTruthy();
  });

  it("has complete OpenGraph", async () => {
    const meta = await newsListingMetadata();
    expectOgFields(meta.openGraph as any);
  });

  it("has complete Twitter card", async () => {
    const meta = await newsListingMetadata();
    expectTwitterFields(meta.twitter as any);
  });

  it("sets canonical to /news", async () => {
    const meta = await newsListingMetadata();
    expectCanonical(meta.alternates, "/news");
  });

  it("uses only public URLs", async () => {
    const meta = await newsListingMetadata();
    expectNoInternalUrls(meta.openGraph, meta.alternates);
  });
});

// ---- News Post ----

describe("newsPostMetadata", () => {
  const slug = "state-of-solana-february-2026";

  beforeEach(() => {
    mockReader.collections.posts.read.mockResolvedValue(MOCK_POST);
    mockReader.collections.authors.read.mockResolvedValue(MOCK_AUTHOR);
    mockReader.collections.categories.read.mockResolvedValue(MOCK_CATEGORY);
    mockReader.collections.tags.read.mockImplementation((ref: string) =>
      Promise.resolve(MOCK_TAGS[ref] || null)
    );
  });

  it("sets title and description from post", async () => {
    const meta = await newsPostMetadata(slug);
    expect(meta.title).toBe(MOCK_POST.title);
    expect(meta.description).toBe(MOCK_POST.description);
  });

  it("sets og:type to article", async () => {
    const meta = await newsPostMetadata(slug);
    expect((meta.openGraph as any).type).toBe("article");
  });

  it("has complete OpenGraph with all required fields", async () => {
    const meta = await newsPostMetadata(slug);
    const og = meta.openGraph as any;

    expectOgFields(og);
    expect(og.publishedTime).toBe(MOCK_POST.date);
    expect(og.authors).toEqual(["Solana Team"]);
  });

  it("sets article:section and article:tag", async () => {
    const meta = await newsPostMetadata(slug);
    const og = meta.openGraph as any;
    expect(og.section).toBe("Ecosystem");
    expect(og.tags).toEqual(["DeFi", "NFT"]);
  });

  it("has complete Twitter card", async () => {
    const meta = await newsPostMetadata(slug);
    expectTwitterFields(meta.twitter as any);
  });

  it("uses hero image for OG and Twitter", async () => {
    const meta = await newsPostMetadata(slug);
    expect((meta.openGraph as any).images[0].url).toBe(MOCK_POST.heroImage);
    expect((meta.twitter as any).images[0]).toBe(MOCK_POST.heroImage);
  });

  it("falls back to default image when no hero", async () => {
    mockReader.collections.posts.read.mockResolvedValue({
      ...MOCK_POST,
      heroImage: null,
    });
    const meta = await newsPostMetadata(slug);
    expect((meta.openGraph as any).images[0].url).toBe(
      config.siteMetadata.socialShare
    );
  });

  it("sets canonical to /news/{slug}", async () => {
    const meta = await newsPostMetadata(slug);
    expectCanonical(meta.alternates, `/news/${slug}`);
  });

  it("uses only public URLs", async () => {
    const meta = await newsPostMetadata(slug);
    expectNoInternalUrls(meta.openGraph, meta.alternates);
  });

  it("returns fallback when post not found", async () => {
    mockReader.collections.posts.read.mockResolvedValue(null);
    const meta = await newsPostMetadata(slug);
    expect(meta.title).toBe("Post Not Found");
  });
});

// ---- Category Listing ----

describe("categoryListingMetadata", () => {
  beforeEach(() => {
    mockFetchCategory.mockResolvedValue({
      category: { id: "ecosystem", name: "Ecosystem", slug: "ecosystem" },
    });
  });

  it("includes category name in title", async () => {
    const meta = await categoryListingMetadata("ecosystem");
    expect(meta.title).toContain("Ecosystem");
  });

  it("has complete OpenGraph", async () => {
    const meta = await categoryListingMetadata("ecosystem");
    expectOgFields(meta.openGraph as any);
  });

  it("has complete Twitter card", async () => {
    const meta = await categoryListingMetadata("ecosystem");
    expectTwitterFields(meta.twitter as any);
  });

  it("sets canonical to /news/category/{slug}", async () => {
    const meta = await categoryListingMetadata("ecosystem");
    expectCanonical(meta.alternates, "/news/category/ecosystem");
  });

  it("uses only public URLs", async () => {
    const meta = await categoryListingMetadata("ecosystem");
    expectNoInternalUrls(meta.openGraph, meta.alternates);
  });

  it("returns fallback when category not found", async () => {
    mockFetchCategory.mockResolvedValue({ category: null });
    const meta = await categoryListingMetadata("nonexistent");
    expect(meta.title).toBe("Category Not Found");
  });
});

// ---- Podcasts Listing ----

describe("podcastsListingMetadata", () => {
  it("sets title and description", () => {
    const meta = podcastsListingMetadata();
    expect(meta.title).toBeTruthy();
    expect(meta.description).toBeTruthy();
  });

  it("has complete OpenGraph", () => {
    const meta = podcastsListingMetadata();
    expectOgFields(meta.openGraph as any);
  });

  it("has complete Twitter card", () => {
    const meta = podcastsListingMetadata();
    expectTwitterFields(meta.twitter as any);
  });

  it("sets canonical to /podcasts", () => {
    const meta = podcastsListingMetadata();
    expectCanonical(meta.alternates, "/podcasts");
  });

  it("uses only public URLs", () => {
    const meta = podcastsListingMetadata();
    expectNoInternalUrls(meta.openGraph, meta.alternates);
  });
});

// ---- Podcast Show ----

describe("podcastShowMetadata", () => {
  beforeEach(() => {
    mockFetchPodcast.mockResolvedValue(MOCK_PODCAST);
  });

  it("includes podcast name in title", async () => {
    const meta = await podcastShowMetadata("validated");
    expect(meta.title).toContain("Validated");
  });

  it("has complete OpenGraph", async () => {
    const meta = await podcastShowMetadata("validated");
    expectOgFields(meta.openGraph as any);
  });

  it("uses cover image for OG", async () => {
    const meta = await podcastShowMetadata("validated");
    expect((meta.openGraph as any).images).toContain(MOCK_PODCAST.coverImage);
  });

  it("has complete Twitter card", async () => {
    const meta = await podcastShowMetadata("validated");
    expectTwitterFields(meta.twitter as any);
  });

  it("sets canonical to /podcasts/{slug}", async () => {
    const meta = await podcastShowMetadata("validated");
    expectCanonical(meta.alternates, "/podcasts/validated");
  });

  it("uses only public URLs", async () => {
    const meta = await podcastShowMetadata("validated");
    expectNoInternalUrls(meta.openGraph, meta.alternates);
  });

  it("falls back to default image when no cover", async () => {
    mockFetchPodcast.mockResolvedValue({ ...MOCK_PODCAST, coverImage: null });
    const meta = await podcastShowMetadata("validated");
    expect((meta.openGraph as any).images[0].url).toBe(
      config.siteMetadata.socialShare
    );
  });

  it("returns fallback when not found", async () => {
    mockFetchPodcast.mockResolvedValue(null);
    const meta = await podcastShowMetadata("nonexistent");
    expect(meta.title).toBe("Podcast Not Found");
  });
});

// ---- Podcast Episode ----

describe("podcastEpisodeMetadata", () => {
  beforeEach(() => {
    mockFetchPodcast.mockResolvedValue(MOCK_PODCAST);
    mockFetchEpisode.mockResolvedValue(MOCK_EPISODE);
  });

  it("includes episode and podcast name in title", async () => {
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expect(meta.title).toContain("The Future of DeFi");
    expect(meta.title).toContain("Validated");
  });

  it("sets og:type to article", async () => {
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expect((meta.openGraph as any).type).toBe("article");
  });

  it("has complete OpenGraph", async () => {
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expectOgFields(meta.openGraph as any);
  });

  it("uses episode thumbnail for OG image", async () => {
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expect((meta.openGraph as any).images).toContain(MOCK_EPISODE.thumbnailUrl);
  });

  it("includes audio URL in OpenGraph", async () => {
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expect((meta.openGraph as any).audio).toContain(MOCK_EPISODE.audioUrl);
  });

  it("has complete Twitter card", async () => {
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expectTwitterFields(meta.twitter as any);
  });

  it("sets canonical to /podcasts/{slug}/episodes/{id}", async () => {
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expectCanonical(meta.alternates, "/podcasts/validated/episodes/ep-123");
  });

  it("uses only public URLs", async () => {
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expectNoInternalUrls(meta.openGraph, meta.alternates);
  });

  it("falls back to podcast cover when no thumbnail", async () => {
    mockFetchEpisode.mockResolvedValue({
      ...MOCK_EPISODE,
      thumbnailUrl: null,
    });
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expect((meta.openGraph as any).images).toContain(MOCK_PODCAST.coverImage);
  });

  it("falls back to default image when no thumbnail or cover", async () => {
    mockFetchEpisode.mockResolvedValue({
      ...MOCK_EPISODE,
      thumbnailUrl: null,
    });
    mockFetchPodcast.mockResolvedValue({ ...MOCK_PODCAST, coverImage: null });
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expect((meta.openGraph as any).images[0].url).toBe(
      config.siteMetadata.socialShare
    );
  });

  it("returns fallback when not found", async () => {
    mockFetchEpisode.mockResolvedValue(null);
    const meta = await podcastEpisodeMetadata("validated", "ep-123");
    expect(meta.title).toBe("Episode Not Found");
  });
});
