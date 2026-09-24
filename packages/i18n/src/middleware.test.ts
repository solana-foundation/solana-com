import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import {
  SHARED_LOCALE_COOKIE,
  createMiddleware,
  getFixedProxiedLocation,
  getLocaleFromPathname,
  routing,
  routingWithoutDetection,
} from "./middleware";
import { getAlternates } from "./alternates";

describe("@workspace/i18n middleware", () => {
  it("extracts locale prefixes from localized paths", () => {
    expect(getLocaleFromPathname("/es/docs")).toBe("es");
    expect(getLocaleFromPathname("/")).toBeNull();
    expect(getLocaleFromPathname("/docs")).toBeNull();
  });

  it("uses the shared locale cookie when locale detection is enabled", async () => {
    const handleI18nRouting = createMiddleware(routing);
    const request = new NextRequest("https://solana.com/breakpoint", {
      headers: { cookie: `${SHARED_LOCALE_COOKIE}=uk` },
    });

    const response = await handleI18nRouting(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://solana.com/uk/breakpoint",
    );
  });

  it("defaults unprefixed sub-app routes to English", async () => {
    const handleI18nRouting = createMiddleware(routingWithoutDetection);
    const request = new NextRequest("https://solana.com/breakpoint", {
      headers: {
        "accept-language": "uk,en;q=0.5",
        cookie: `${SHARED_LOCALE_COOKIE}=uk; NEXT_LOCALE=uk`,
      },
    });

    const response = await handleI18nRouting(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toContain(
      "/en/breakpoint",
    );
  });

  it("keeps explicit non-English sub-app routes localized", async () => {
    const handleI18nRouting = createMiddleware(routingWithoutDetection);
    const request = new NextRequest("https://solana.com/uk/breakpoint");

    const response = await handleI18nRouting(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("does not let a proxied sub-app overwrite the shared locale cookie", async () => {
    const handleI18nRouting = createMiddleware(routingWithoutDetection, {
      preserveProxiedLocaleCookie: true,
    });
    const request = new NextRequest(
      "https://solana-com-breakpoint.vercel.app/uk/breakpoint",
      {
        headers: {
          cookie: `${SHARED_LOCALE_COOKIE}=en`,
          host: "solana-com-breakpoint.vercel.app",
          "x-forwarded-host": "solana.com",
          "x-forwarded-proto": "https",
        },
      },
    );

    const response = await handleI18nRouting(request);

    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("normalizes canonical and hreflang alternate paths", () => {
    expect(getAlternates("/docs/tools", "es")).toEqual({
      canonical: "/es/docs/tools",
      languages: expect.objectContaining({
        "x-default": "/docs/tools",
        en: "/docs/tools",
        es: "/es/docs/tools",
      }),
    });
    expect(getAlternates("docs/tools", "en").canonical).toBe("/docs/tools");
    expect(getAlternates("/", "fr")).toEqual({
      canonical: "/fr",
      languages: expect.objectContaining({
        "x-default": "/",
        en: "/",
        fr: "/fr",
      }),
    });
  });

  it("rewrites proxied redirect locations to the forwarded public host", () => {
    expect(
      getFixedProxiedLocation({
        currentHost: "solana-com-docs.vercel.app",
        forwardedHost: "solana.com",
        forwardedProto: "https",
        location: "https://solana-com-docs.vercel.app/docs/tools",
      }),
    ).toBe("https://solana.com/docs/tools");
  });
});
