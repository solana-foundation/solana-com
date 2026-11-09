import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import middleware from "../src/middleware";

const event = { waitUntil() {} } as unknown as Parameters<typeof middleware>[1];

describe("docs Vercel alias", () => {
  it("redirects direct visits to the public site with the path and query", async () => {
    const request = new NextRequest(
      "https://solana-com-docs.vercel.app/docs/intro/quick-start?view=all",
    );

    const response = await middleware(request, event);

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

    const response = await middleware(request, event);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("keeps the docs markdown API on its existing host", async () => {
    const request = new NextRequest(
      "https://solana-com-docs.vercel.app/api/markdown/docs/intro/quick-start",
    );

    const response = await middleware(request, event);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
