import { describe, expect, it } from "vitest";
import {
  CASE_STUDIES_FILTER_LABEL,
  filterPostsByNewsFilter,
  getNewsFilterOptions,
} from "@/lib/news-filters";
import { PostItem } from "@/lib/post-types";

function post(id: string, categories: string[], tags: string[] = []): PostItem {
  return {
    id,
    published: "Apr 22, 2026",
    publishedAt: "2026-04-22T12:00:00.000Z",
    title: id,
    tags,
    categories,
    url: `/news/${id}`,
    description: null,
    heroImage: null,
    author: {
      name: "Solana Foundation",
      avatar: null,
    },
  };
}

describe("news filters", () => {
  it("promotes case study tags into the news filter options", () => {
    const filters = getNewsFilterOptions([
      post("case-study", ["Payments"], ["Case Studies"]),
      post("standard-news", ["Developers"], ["Product"]),
    ]);

    expect(filters).toEqual([
      CASE_STUDIES_FILTER_LABEL,
      "Developers",
      "Payments",
    ]);
  });

  it("filters case studies by tag without broadening other category filters", () => {
    const posts = [
      post("case-study", ["Payments"], ["case-studies"]),
      post("payments-news", ["Payments"], ["Payments"]),
      post("tag-only-payments", ["Ecosystem"], ["Payments"]),
    ];

    expect(
      filterPostsByNewsFilter(posts, CASE_STUDIES_FILTER_LABEL).map(
        (item) => item?.id,
      ),
    ).toEqual(["case-study"]);

    expect(
      filterPostsByNewsFilter(posts, "Payments").map((item) => item?.id),
    ).toEqual(["case-study", "payments-news"]);
  });
});
