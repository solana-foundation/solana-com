import { NextRequest } from "next/server";
import { afterEach, describe, expect, it } from "vitest";
import middleware from "../src/middleware";

const run = (path: string, headers?: Record<string, string>) =>
  middleware(new NextRequest(`https://solana.com${path}`, { headers }));

const rewriteOf = (response: Response) => {
  const rewrite = response.headers.get("x-middleware-rewrite");
  return rewrite ? new URL(rewrite).pathname : null;
};

describe("Markdown content negotiation", () => {
  it("rewrites to the markdown route only when Markdown is preferred", async () => {
    const path = "/developers/docs/core/accounts";
    const md = "/api/markdown/developers/docs/core/accounts";
    expect(rewriteOf(await run(path, { accept: "text/markdown" }))).toBe(md);
    expect(
      rewriteOf(await run(path, { accept: "text/markdown, text/html;q=0.9" })),
    ).toBe(md);
    for (const accept of [
      "text/html, text/markdown;q=0.1",
      "*/*",
      "text/html,application/xhtml+xml,*/*;q=0.8",
    ]) {
      expect(rewriteOf(await run(path, { accept }))).not.toBe(md);
    }
  });

  it("keeps the query for docs search", async () => {
    const response = await run("/developers/docs?q=accounts", {
      accept: "text/markdown",
    });
    const rewrite = new URL(response.headers.get("x-middleware-rewrite")!);
    expect(rewrite.pathname).toBe("/api/markdown/developers/docs");
    expect(rewrite.searchParams.get("q")).toBe("accounts");
  });

  it("negotiates the /developers landing, not other apps' pages", async () => {
    expect(
      rewriteOf(await run("/developers", { accept: "text/markdown" })),
    ).toBe("/api/markdown/developers");
    expect(rewriteOf(await run("/developers.md"))).toBe(
      "/api/markdown/developers",
    );
    expect(rewriteOf(await run("/ja/developers.md"))).toBe(
      "/api/markdown/ja/developers",
    );
    // Learn's Markdown is apps/web's.
    expect(rewriteOf(await run("/learn/what-is-solana.md"))).not.toMatch(
      /^\/api\/markdown/,
    );
  });

  it("answers Markdown requests for paths no docs route serves with the Markdown 404", async () => {
    // Another app's page on solana.com, a 404 here; and a 404 probe.
    expect(
      rewriteOf(
        await run("/developers/templates", { accept: "text/markdown" }),
      ),
    ).toBe("/api/markdown/developers/templates");
    expect(
      rewriteOf(await run("/__ora-404-probe-x1", { accept: "text/markdown" })),
    ).toBe("/api/markdown/__ora-404-probe-x1");
    expect(rewriteOf(await run("/__ora-404-probe-x1"))).not.toMatch(
      /^\/api\/markdown/,
    );
    expect(rewriteOf(await run("/", { accept: "text/markdown" }))).not.toMatch(
      /^\/api\/markdown/,
    );
  });

  it("marks HTML pages as negotiated and links their Markdown twin", async () => {
    const response = await run("/developers/docs/core/accounts", {
      accept: "text/html",
    });
    expect(response.status).toBe(200);
    // Next's own Vary first, for a platform that replaces the page's.
    expect(response.headers.get("vary")).toBe(
      "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept",
    );
    const link = response.headers.get("link")!;
    expect(link).toContain(
      '<https://solana.com/developers/docs/core/accounts.md>; rel="alternate"; type="text/markdown"',
    );
    expect(link).toContain(
      '<https://solana.com/developers/docs/llms.txt>; rel="describedby"; type="text/plain"',
    );
    // next-intl's hreflang links stay.
    expect(link).toMatch(/hreflang="ja"/);

    const ja = await run("/ja/developers/docs/core/accounts");
    expect(ja.headers.get("link")).toContain(
      "<https://solana.com/ja/developers/docs/core/accounts.md>",
    );
    const landing = await run("/developers");
    expect(landing.headers.get("link")).toContain(
      "<https://solana.com/developers.md>",
    );
  });
});

describe("docs redirects", () => {
  it("lowercases paths permanently, keeping the query", async () => {
    const response = await run("/developers/docs/Core/Accounts?x=1");
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://solana.com/developers/docs/core/accounts?x=1",
    );
  });

  it("sends a page's /index URL to the page", async () => {
    const response = await run("/ja/developers/docs/core/index");
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://solana.com/ja/developers/docs/core",
    );
    expect(rewriteOf(await run("/developers/docs/core/index.md"))).toBe(
      "/api/markdown/developers/docs/core/index",
    );
  });
});

describe("missing docs pages", () => {
  afterEach(() => {
    delete process.env.DOCS_PAGE_PATHS;
  });

  const withPages = (...paths: string[]) => {
    process.env.DOCS_PAGE_PATHS = JSON.stringify(paths);
  };

  it("render the 404 page on the server", async () => {
    withPages("/developers/docs/core/accounts");
    for (const path of [
      "/developers/docs/does-not-exist",
      "/ja/developers/docs/does-not-exist",
      "/developers/cookbook/nope",
    ]) {
      const response = await run(path, { accept: "text/html" });
      expect(rewriteOf(response), path).toBe("/_docs/not-found");
      expect(response.headers.get("vary")).toMatch(/\bAccept$/);
      expect(response.headers.get("link")).toBeNull();
    }
  });

  it("serve known pages, in every locale", async () => {
    withPages("/developers/docs/core/accounts");
    for (const path of [
      "/developers/docs/core/accounts",
      "/ja/developers/docs/core/accounts",
    ]) {
      expect(rewriteOf(await run(path)), path).not.toBe("/_docs/not-found");
    }
    // Not docs pages: the landings and other apps' paths.
    for (const path of ["/developers", "/learn"]) {
      expect(rewriteOf(await run(path)), path).not.toBe("/_docs/not-found");
    }
  });

  it("answer Markdown requests from the markdown route (its 404)", async () => {
    withPages("/developers/docs/core/accounts");
    expect(
      rewriteOf(
        await run("/developers/docs/does-not-exist", {
          accept: "text/markdown",
        }),
      ),
    ).toBe("/api/markdown/developers/docs/does-not-exist");
    expect(rewriteOf(await run("/developers/docs/does-not-exist.md"))).toBe(
      "/api/markdown/developers/docs/does-not-exist",
    );
  });

  it("are not guessed without the build's page list", async () => {
    expect(rewriteOf(await run("/developers/docs/does-not-exist"))).not.toBe(
      "/_docs/not-found",
    );
  });
});
