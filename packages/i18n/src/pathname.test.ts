import { describe, expect, it } from "vitest";

import { getLocaleFromPathname, getPathnameWithoutLocale } from "./pathname";

describe("@workspace/i18n pathname helpers", () => {
  it("extracts locale prefixes from localized paths", () => {
    expect(getLocaleFromPathname("/es/docs")).toBe("es");
    expect(getLocaleFromPathname("/")).toBeNull();
    expect(getLocaleFromPathname("/docs")).toBeNull();
  });

  it("removes locale prefixes from pathnames", () => {
    expect(getPathnameWithoutLocale("/es/docs")).toBe("/docs");
    expect(
      getPathnameWithoutLocale("/fr/developers/cookbook?tab=advanced"),
    ).toBe("/developers/cookbook");
    expect(getPathnameWithoutLocale("/docs#rpc")).toBe("/docs");
  });
});
