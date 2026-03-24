import { describe, expect, it } from "vitest";
import { getAlternates } from "./routing";

describe("@workspace/i18n routing", () => {
  it("normalizes leading slashes for canonical and alternate paths", () => {
    expect(getAlternates("/developers/payments", "en")).toEqual({
      canonical: "/developers/payments",
      languages: expect.objectContaining({
        "x-default": "/developers/payments",
        en: "/developers/payments",
        es: "/es/developers/payments",
      }),
    });
  });

  it("keeps the site root canonical clean across locales", () => {
    expect(getAlternates("/", "en")).toEqual({
      canonical: "/",
      languages: expect.objectContaining({
        "x-default": "/",
        en: "/",
        es: "/es",
      }),
    });
  });
});
