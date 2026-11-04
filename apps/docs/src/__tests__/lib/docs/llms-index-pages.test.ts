import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/docs/source", () => {
  const page = (url: string, data: Record<string, unknown>) => ({
    url,
    data: { title: url.split("/").pop(), ...data },
  });
  return {
    docsSource: {
      getPages: () => [
        page("/developers/docs/core/accounts", { description: "Data." }),
        page("/developers/docs/tags/payments", { noindex: true }),
        page("/developers/docs/tools/microscope", {
          url: "https://solana.com/microscope",
        }),
      ],
    },
    // The /learn articles, read from apps/web.
    learnSource: {
      getPages: () => [
        page("/learn/what-is-solana", { title: "What is Solana" }),
      ],
    },
  };
});

const { indexPages } = await import("@/lib/docs/llms");

describe("indexPages", () => {
  it("leaves out noindex and nav-only (url frontmatter) pages", () => {
    expect(indexPages()).toEqual([
      {
        url: "/developers/docs/core/accounts",
        title: "accounts",
        description: "Data.",
      },
      { url: "/learn/what-is-solana", title: "What is Solana" },
    ]);
  });
});
