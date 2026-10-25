import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import middleware from "../src/middleware";

describe("docs Vercel alias", () => {
  it("redirects direct visits to the public site with the path and query", async () => {
    const request = new NextRequest(
      "https://solana-com-docs.vercel.app/docs/intro/quick-start?view=all",
    );

    const response = await middleware(request);

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://solana.com/docs/intro/quick-start?view=all",
    );
  });

  it("serves requests rewritten from solana.com", async () => {
    const request = new NextRequest(
      "https://solana-com-docs.vercel.app/docs/intro/quick-start",
      {
        headers: {
          host: "solana-com-docs.vercel.app",
          "x-forwarded-host": "solana.com",
          "x-forwarded-proto": "https",
        },
      },
    );

    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("keeps the docs markdown API on its existing host", async () => {
    const request = new NextRequest(
      "https://solana-com-docs.vercel.app/api/markdown/docs/intro/quick-start",
    );

    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});

describe("docs markdown twins", () => {
  async function rewriteOf(path: string, headers?: Record<string, string>) {
    const response = await middleware(
      new NextRequest(`https://solana.com${path}`, { headers }),
    );
    const rewrite = response.headers.get("x-middleware-rewrite");
    return rewrite ? new URL(rewrite).pathname : null;
  }

  it("rewrites .md pages to the markdown route", async () => {
    expect(await rewriteOf("/developers/docs/quickstart.md")).toBe(
      "/api/markdown/developers/docs/quickstart",
    );
    expect(await rewriteOf("/developers/docs.md")).toBe(
      "/api/markdown/developers/docs",
    );
    expect(
      await rewriteOf("/developers/cookbook/wallets/create-keypair.md"),
    ).toBe("/api/markdown/developers/cookbook/wallets/create-keypair");
    expect(await rewriteOf("/learn/what-is-solana.md")).toBe(
      "/api/markdown/learn/what-is-solana",
    );
  });

  it("keeps the locale of translated pages", async () => {
    expect(await rewriteOf("/ja/developers/docs/quickstart.md")).toBe(
      "/api/markdown/ja/developers/docs/quickstart",
    );
    expect(await rewriteOf("/en/developers/docs/quickstart.md")).toBe(
      "/api/markdown/developers/docs/quickstart",
    );
  });

  it("answers Accept: text/markdown with the markdown route", async () => {
    expect(
      await rewriteOf("/developers/docs/quickstart", {
        accept: "text/markdown",
      }),
    ).toBe("/api/markdown/developers/docs/quickstart");
    expect(await rewriteOf("/developers/docs/quickstart")).not.toMatch(
      /^\/api\/markdown/,
    );
  });
});
