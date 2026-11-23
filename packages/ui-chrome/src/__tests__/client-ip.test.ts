import { describe, expect, it } from "vitest";
import { clientIpFromHeaders } from "../client-ip";

describe("clientIpFromHeaders", () => {
  it("prefers the Vercel-set x-real-ip", () => {
    const headers = new Headers({
      "x-real-ip": "203.0.113.7",
      "x-forwarded-for": "198.51.100.1, 10.0.0.1",
    });
    expect(clientIpFromHeaders(headers)).toBe("203.0.113.7");
  });

  it("falls back to the first x-forwarded-for hop, then unknown", () => {
    expect(
      clientIpFromHeaders(
        new Headers({ "x-forwarded-for": "198.51.100.1, 10.0.0.1" }),
      ),
    ).toBe("198.51.100.1");
    expect(clientIpFromHeaders(new Headers())).toBe("unknown");
  });

  it("ignores client-supplied proxy headers that Vercel does not rewrite", () => {
    const headers = new Headers({
      "cf-connecting-ip": "1.1.1.1",
      "true-client-ip": "2.2.2.2",
      forwarded: "for=3.3.3.3",
      "x-real-ip": "203.0.113.7",
    });
    expect(clientIpFromHeaders(headers)).toBe("203.0.113.7");
    expect(
      clientIpFromHeaders(
        new Headers({
          "cf-connecting-ip": "1.1.1.1",
          forwarded: "for=3.3.3.3",
        }),
      ),
    ).toBe("unknown");
  });
});
