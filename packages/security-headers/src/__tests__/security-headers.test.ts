import { describe, expect, it } from "vitest";
import { securityHeaders, securityHeadersRoute } from "../index.js";

const get = (headers: { key: string; value: string }[], key: string) =>
  headers.find((h) => h.key === key)?.value;

describe("securityHeaders", () => {
  it("sends the baseline set without X-XSS-Protection", () => {
    const h = securityHeaders({ preview: false });
    expect(get(h, "X-Content-Type-Options")).toBe("nosniff");
    expect(get(h, "X-Frame-Options")).toBe("SAMEORIGIN");
    expect(get(h, "Content-Security-Policy")).toBe("frame-ancestors 'self'");
    expect(get(h, "Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(get(h, "Permissions-Policy")).toContain("camera=()");
    expect(get(h, "X-XSS-Protection")).toBeUndefined();
    expect(get(h, "X-Robots-Tag")).toBeUndefined();
  });

  it("adds noindex on preview deployments", () => {
    expect(get(securityHeaders({ preview: true }), "X-Robots-Tag")).toBe(
      "noindex",
    );
  });

  it("extends frame-ancestors and appends extra headers", () => {
    const h = securityHeaders({
      preview: false,
      frameAncestors: ["https://partner.example"],
      extra: [{ key: "X-Custom", value: "1" }],
    });
    expect(get(h, "Content-Security-Policy")).toBe(
      "frame-ancestors 'self' https://partner.example",
    );
    expect(get(h, "X-Custom")).toBe("1");
  });

  it("targets every route", () => {
    expect(securityHeadersRoute({ preview: false }).source).toBe("/:path*");
  });
});
