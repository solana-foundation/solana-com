import { describe, expect, it } from "vitest";
import {
  SHARED_LOCALE_COOKIE,
  buildSharedLocaleCookie,
  getFixedProxiedLocation,
  getLocaleFromPathname,
  getLocaleRedirectPath,
  getPreferredLocaleCookie,
} from "./middleware";
import { getAlternates } from "./alternates";

describe("@workspace/i18n middleware", () => {
  it("extracts locale prefixes from localized paths", () => {
    expect(getLocaleFromPathname("/es/docs")).toBe("es");
    expect(getLocaleFromPathname("/")).toBeNull();
    expect(getLocaleFromPathname("/docs")).toBeNull();
  });

  it("accepts only supported shared locale cookie values", () => {
    expect(getPreferredLocaleCookie("es")).toBe("es");
    expect(getPreferredLocaleCookie("sv")).toBeNull();
    expect(getPreferredLocaleCookie(null)).toBeNull();
  });

  it("builds localized redirect paths for non-default locales", () => {
    expect(getLocaleRedirectPath("/", "es")).toBe("/es");
    expect(getLocaleRedirectPath("/docs/payments", "es")).toBe(
      "/es/docs/payments",
    );
    expect(getLocaleRedirectPath("/docs/payments", "en")).toBe(
      "/docs/payments",
    );
  });

  it("serializes the shared locale cookie", () => {
    expect(buildSharedLocaleCookie("es")).toContain(
      `${SHARED_LOCALE_COOKIE}=es`,
    );
    expect(buildSharedLocaleCookie("es")).toContain("Path=/");
    expect(buildSharedLocaleCookie("es")).toContain("Max-Age=31536000");
    expect(buildSharedLocaleCookie("es")).toContain("Expires=");
    expect(buildSharedLocaleCookie("es")).toContain("SameSite=Lax");
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
