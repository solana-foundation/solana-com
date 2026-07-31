import { describe, expect, it } from "vitest";
import { newsNavHref } from "@/lib/news-nav";

describe("newsNavHref", () => {
  it("uses the dedicated changelog landing page when configured", () => {
    expect(
      newsNavHref({
        label: "Changelog",
        slug: "changelog",
        href: "/changelog",
      }),
    ).toBe("/changelog");
  });

  it("keeps standard categories under the news namespace", () => {
    expect(newsNavHref({ label: "Developers", slug: "developers" })).toBe(
      "/news/category/developers",
    );
  });
});
