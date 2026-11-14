import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import middleware from "../src/middleware";

/**
 * The docs app no longer has a locale index route (app/[locale]/route.ts,
 * which redirected /<locale> to /<locale>/docs). The locale is the first
 * segment the middleware reads instead, so the same guarantees are checked
 * there: an unknown first segment is never echoed into a Location, and a
 * redirect is never built from a forwarded host that isn't one of ours.
 */
const run = (url: string, headers?: Record<string, string>) =>
  middleware(new NextRequest(url, { headers }));

const locationHost = (response: Response) => {
  const location = response.headers.get("location");
  return location ? new URL(location).host : null;
};

describe("docs locale segment", () => {
  it("refuses to echo unknown segments into Location (no open redirect)", async () => {
    for (const path of [
      "/%2Fevil.com",
      "/%2fevil.com",
      "/%2f%2fevil.com/docs",
      "//evil.com",
      "/evil.com",
      "/xx/docs",
    ]) {
      const response = await run(`https://solana.com${path}`);
      const location = response.headers.get("location");
      if (location === null) continue;
      expect(location.startsWith("//")).toBe(false);
      expect(new URL(location).host).toBe("solana.com");
    }
  });

  it("never builds a redirect from a forged x-forwarded-host", async () => {
    const forged = { "x-forwarded-host": "evil.example" };
    // The production alias: the forged host is ignored, so the visit counts
    // as direct and goes to solana.com.
    const alias = await run(
      "https://solana-com-docs.vercel.app/Developers/Docs",
      { host: "solana-com-docs.vercel.app", ...forged },
    );
    expect(alias.status).toBe(308);
    expect(alias.headers.get("location")).toBe(
      "https://solana.com/Developers/Docs",
    );

    // Every redirect the docs middleware builds itself stays on the host
    // the request reached.
    for (const path of [
      "/Developers/Docs",
      "/de/de/developers/docs",
      "/developers/learn",
      "/developers/docs/index",
    ]) {
      const response = await run(`https://docs-preview.vercel.app${path}`, {
        host: "docs-preview.vercel.app",
        ...forged,
      });
      expect(response.headers.get("location")).not.toBeNull();
      expect(locationHost(response)).toBe("docs-preview.vercel.app");
    }
  });

  it("still redirects to the public host a rewrite from solana.com reports", async () => {
    const response = await run(
      "https://solana-com-docs.vercel.app/Developers/Docs",
      {
        host: "solana-com-docs.vercel.app",
        "x-forwarded-host": "solana.com",
        "x-forwarded-proto": "https",
      },
    );
    expect(response.headers.get("location")).toBe(
      "https://solana.com/developers/docs",
    );
  });
});
