import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { enforceVotingRateLimit, hasSameOrigin } from "@/lib/awards-abuse";

const { checkRateLimit } = vi.hoisted(() => ({ checkRateLimit: vi.fn() }));

vi.mock("@vercel/firewall", () => ({ checkRateLimit }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("awards voting rate limits", () => {
  it("counts both vote limits by ballot instead of shared network address", async () => {
    vi.stubEnv("NODE_ENV", "production");
    checkRateLimit.mockResolvedValue({ rateLimited: false });
    const request = new NextRequest(
      "https://example.com/breakpoint/api/votes",
      {
        headers: { "x-real-ip": "203.0.113.1" },
      },
    );

    expect(await enforceVotingRateLimit(request, "validated-ballot")).toBe(
      false,
    );
    expect(checkRateLimit).toHaveBeenCalledTimes(2);
    expect(checkRateLimit).toHaveBeenCalledWith(
      "breakpoint-awards-vote-burst",
      { request, rateLimitKey: "validated-ballot" },
    );
    expect(checkRateLimit).toHaveBeenCalledWith(
      "breakpoint-awards-vote-hourly",
      { request, rateLimitKey: "validated-ballot" },
    );
  });
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
