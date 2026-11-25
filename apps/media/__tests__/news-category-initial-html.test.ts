import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PostItem } from "@/lib/post-types";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/components/error-boundary", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/components/news/campaign-hero", () => ({
  CampaignHero: () => null,
}));

vi.mock("@/components/news/news-masthead", () => ({
  NewsMasthead: () => null,
}));

vi.mock("@/components/post/post-card", () => ({
  PostCard: ({ post }: { post: PostItem }) =>
    React.createElement("a", { href: post.url }, post.title),
}));

vi.mock("@/components/ui/load-more-status", () => ({
  default: () => null,
}));

import CategoryPostsClientPage from "@/app/[locale]/news/category/[category]/client-page";

function makePost(id: string): PostItem {
  return {
    id,
    published: "Nov 23, 2026",
    publishedAt: "2026-11-23T00:00:00.000Z",
    title: `Article ${id}`,
    tags: [],
    categories: ["Ecosystem"],
    url: `/news/${id}`,
    description: null,
    heroImage: null,
    author: { name: "Solana Foundation", avatar: null },
  };
}

describe("news category initial HTML", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("server-renders links from the initial posts without effects", () => {
    vi.stubGlobal("React", React);
    const html = renderToStaticMarkup(
      React.createElement(CategoryPostsClientPage, {
        category: "Ecosystem",
        categorySlug: "ecosystem",
        latestPosts: [makePost("first"), makePost("second")],
        navItems: [],
      }),
    );

    expect(html).toContain('href="/news/first"');
    expect(html).toContain('href="/news/second"');
  });
});
