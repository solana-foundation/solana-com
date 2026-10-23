import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { hasSameOrigin } from "@/lib/awards-abuse";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("awards nomination origin check", () => {
  const deploymentUrl = "https://breakpoint.example.vercel.app/api/nominations";

  function request(origin?: string) {
    return new NextRequest(deploymentUrl, {
      method: "POST",
      headers: origin ? { origin } : undefined,
    });
  }

  it("accepts the public site origin behind the production rewrite", () => {
    vi.stubEnv("VERCEL_ENV", "production");

    expect(hasSameOrigin(request("https://solana.com"))).toBe(true);
    expect(
      hasSameOrigin(request("https://breakpoint.example.vercel.app")),
    ).toBe(true);
  });

  it("rejects other origins and requests without an origin in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NODE_ENV", "production");

    expect(hasSameOrigin(request("https://other.example"))).toBe(false);
    expect(hasSameOrigin(request("http://solana.com"))).toBe(false);
    expect(hasSameOrigin(request())).toBe(false);
  });

  it("does not allow the production public origin on preview deployments", () => {
    vi.stubEnv("VERCEL_ENV", "preview");

    expect(hasSameOrigin(request("https://solana.com"))).toBe(false);
  });
});
