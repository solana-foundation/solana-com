import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";

const redirects = rewritesAndRedirects.redirects;
const localePattern =
  "/:locale(en|ar|de|el|es|fi|fr|id|it|ja|ko|nl|pl|pt|ru|tr|uk|vi|zh)";

describe("Accelerate China redirects", () => {
  it.each(["/accelerate/china", "/accelerate/china/:path*"])(
    "redirects %s and its localized URL to the Accelerate home page",
    (source) => {
      expect(redirects).toEqual(
        expect.arrayContaining([
          {
            source,
            destination: "/accelerate",
            locale: false,
            permanent: true,
          },
          {
            source: `${localePattern}${source}`,
            destination: "/:locale/accelerate",
            locale: false,
            permanent: true,
          },
        ]),
      );
    },
  );
});
