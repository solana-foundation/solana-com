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
        // No longer maintained (UNINDEXED_PREFIXES).
        page("/developers/docs/tools/commerce-kit", { title: "Commerce Kit" }),
        page("/developers/docs/tools/commerce-kit/quickstart/installation", {}),
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

const { inAgentIndexes, indexPages } = await import("@/lib/docs/llms");

describe("indexPages", () => {
  it("leaves out noindex, nav-only (url frontmatter) and unmaintained pages", () => {
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

describe("inAgentIndexes", () => {
  it("matches whole path segments of the unindexed sections", () => {
    expect(inAgentIndexes("/developers/docs/tools/commerce-kit")).toBe(false);
    expect(
      inAgentIndexes(
        "/developers/docs/tools/commerce-kit/quickstart/react-hooks",
      ),
    ).toBe(false);
    expect(inAgentIndexes("/developers/docs/tools/commerce-kits")).toBe(true);
    expect(inAgentIndexes("/developers/docs/tools/solana-pay")).toBe(true);
  });
});
