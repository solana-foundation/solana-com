import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

// Two English pages: the docs home and "accounts" (translated into ja).
vi.mock("@/lib/docs/source", () => {
  const page = (locale: string, slugs: string[], file: string) => ({
    path: `${file}/${slugs.join("/")}.mdx`,
    url: `${locale === "en" ? "" : `/${locale}`}/${slugs.join("/")}`,
    slugs,
    locale,
    data: { title: slugs.at(-1) },
  });
  return {
    docsSource: {
      getPage(slugs: string[], locale = "en") {
        const key = slugs.join("/");
        if (!["developers/docs", "developers/docs/core/accounts"].includes(key))
          return undefined;
        const translated = key.endsWith("accounts") && locale === "ja";
        return page(locale, slugs, translated ? locale : "en");
      },
    },
  };
});
vi.mock("@/lib/docs/navigation", () => ({
  getDocsNavigation: () => ({ tabs: [], byUrl: new Map() }),
  localizedPageUrl: (_locale: string, page: { url: string }) => page.url,
}));
vi.mock("@/lib/docs/llms", () => ({
  AGENT_PREAMBLE: "",
  pageMarkdown: async (page: { data: { title: string } }) =>
    `# ${page.data.title}\n`,
}));
vi.mock("@/lib/docs/developers-markdown", () => ({
  developersMarkdown: async (locale: string) => `# Developers (${locale})\n`,
}));
const search = vi.fn(async (query: string) =>
  query.includes("acount") || query.includes("accounts")
    ? [
        {
          id: "1",
          type: "page",
          url: "/developers/docs/core/accounts",
          content: "Accounts",
          breadcrumbs: ["How Solana works"],
        },
        {
          id: "2",
          type: "text",
          url: "/developers/docs/core/accounts",
          content: "How Solana stores data.",
        },
      ]
    : [],
);
vi.mock("@/lib/docs/search", () => ({ docsSearchServer: { search } }));

const { GET } = await import("@/app/api/markdown/[...slug]/route");

const get = (path: string, headers?: Record<string, string>) => {
  const url = new URL(`https://solana.com/api/markdown${path}`);
  return GET(new NextRequest(url, { headers }), {
    params: Promise.resolve({
      slug: url.pathname.replace("/api/markdown/", "").split("/"),
    }),
  });
};

describe("markdown route", () => {
  it("serves a page as Markdown with links to its HTML page and the index", async () => {
    const res = await get("/developers/docs/core/accounts");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(res.headers.get("vary")).toBe("Accept");
    expect(res.headers.get("link")).toBe(
      [
        '<https://solana.com/developers/docs/core/accounts>; rel="canonical"; type="text/html"',
        '<https://solana.com/developers/docs/llms.txt>; rel="describedby"; type="text/plain"',
      ].join(", "),
    );
    expect(await res.text()).toBe("# accounts\n");
  });

  it("points an untranslated locale URL's canonical at English", async () => {
    const ja = await get("/ja/developers/docs/core/accounts");
    expect(ja.headers.get("link")).toContain(
      "<https://solana.com/ja/developers/docs/core/accounts>",
    );
    const de = await get("/de/developers/docs/core/accounts");
    expect(de.headers.get("link")).toContain(
      "<https://solana.com/developers/docs/core/accounts>",
    );
  });

  it("answers a matching If-None-Match with 304", async () => {
    const first = await get("/developers/docs/core/accounts");
    const etag = first.headers.get("etag")!;
    expect(etag).toMatch(/^W\/".+"$/);
    const again = await get("/developers/docs/core/accounts", {
      "if-none-match": etag,
    });
    expect(again.status).toBe(304);
    expect(await again.text()).toBe("");
  });

  it("answers a missing page with a Markdown 404 that links the way back", async () => {
    const res = await get("/developers/docs/core/acounts");
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(res.headers.get("vary")).toBe("Accept");
    expect(res.headers.get("etag")).toBeNull();
    const body = await res.text();
    expect(body.split("\n")[0]).toBe("# Page not found");
    expect(body).toContain(
      "No docs page exists at https://solana.com/developers/docs/core/acounts.",
    );
    expect(body).toContain(
      "- [Accounts](https://solana.com/developers/docs/core/accounts.md) (How Solana works): How Solana stores data.",
    );
    expect(body).toContain(
      "https://solana.com/developers/docs?q=core%20acounts",
    );
    expect(body).toContain("https://solana.com/llms.txt");
    expect(body).toContain("https://solana.com/sitemap.xml");
    expect(search).toHaveBeenCalledWith("core acounts", { locale: "en" });
  });

  it("answers docs search on the docs home", async () => {
    const res = await get("/developers/docs?q=accounts");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body.split("\n")[0]).toBe('# Search results for "accounts"');
    expect(body).toContain(
      "- [Accounts](https://solana.com/developers/docs/core/accounts.md)",
    );
    const none = await (await get("/developers/docs?q=zzz")).text();
    expect(none).toContain('No pages match "zzz".');
    // Elsewhere ?q= is not a search.
    expect(await (await get("/developers/docs/core/accounts?q=x")).text()).toBe(
      "# accounts\n",
    );
  });

  it("serves the /developers landing", async () => {
    const res = await get("/ja/developers");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("# Developers (ja)\n");
    expect(res.headers.get("link")).toContain(
      '<https://solana.com/ja/developers>; rel="canonical"',
    );
  });
});
