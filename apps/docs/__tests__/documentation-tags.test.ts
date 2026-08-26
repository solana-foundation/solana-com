import { describe, expect, it } from "vitest";
import {
  getDocumentationTag,
  getDocumentationTags,
  getDocumentationTagUrl,
  toDocumentationTagSlug,
  type DocumentationTagPage,
} from "../src/app/sources/documentation-tags";

const pages = [
  {
    url: "/docs/payments/overview",
    data: {
      title: "Payments overview",
      description: "Understand payment flows on Solana.",
      documentationTags: ["Payments", "Stablecoins", "payments"],
    },
  },
  {
    url: "/docs/payments/checkout",
    data: {
      title: "Build a checkout",
      documentationTags: ["payments"],
    },
  },
  {
    url: "/docs/core/accounts",
    data: { title: "Accounts" },
  },
] satisfies DocumentationTagPage[];

describe("documentation tags", () => {
  it("returns an empty collection when no pages are tagged", () => {
    expect(getDocumentationTags(pages.slice(2))).toEqual([]);
  });

  it("groups, deduplicates, and sorts tagged pages", () => {
    const tags = getDocumentationTags(pages, {
      payments: "Build payment experiences on Solana.",
    });

    expect(tags.map(({ slug }) => slug)).toEqual(["payments", "stablecoins"]);
    expect(tags[0]).toMatchObject({
      slug: "payments",
      label: "Payments",
      summary: "Build payment experiences on Solana.",
    });
    expect(tags[0].pages.map(({ data }) => data.title)).toEqual([
      "Build a checkout",
      "Payments overview",
    ]);
    expect(tags[1].summary).toBeUndefined();
  });

  it("finds tags by their normalized URL slug", () => {
    expect(toDocumentationTagSlug(" Token Extensions ")).toBe(
      "token-extensions",
    );
    expect(toDocumentationTagSlug("DéFi")).toBe("defi");
    expect(getDocumentationTag(pages, "payments")?.label).toBe("Payments");
  });

  it("builds default and localized tag URLs", () => {
    expect(getDocumentationTagUrl("en")).toBe("/docs/tags");
    expect(getDocumentationTagUrl("en", "payments")).toBe(
      "/docs/tags/payments",
    );
    expect(getDocumentationTagUrl("es", "payments")).toBe(
      "/es/docs/tags/payments",
    );
  });
});
