import { describe, expect, it } from "vitest";
import {
  SHARED_LOCALE_COOKIE,
  buildSharedLocaleCookie,
  getLocaleFromPathname,
  getLocaleRedirectPath,
  getPreferredLocaleCookie,
} from "./middleware";

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
});
