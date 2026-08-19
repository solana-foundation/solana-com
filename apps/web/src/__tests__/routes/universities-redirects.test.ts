import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";

const redirects = rewritesAndRedirects.redirects;

describe("Universities redirects", () => {
  it("does not redirect the universities route, which now serves the ambassador program page", () => {
    const universitiesRedirects = redirects.filter((redirect) =>
      redirect.source.includes("/universities"),
    );
    expect(universitiesRedirects).toEqual([]);
  });
});
