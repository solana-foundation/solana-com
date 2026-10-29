import { describe, expect, it } from "vitest";
import { oauthHeader, safeReturnPath } from "@/lib/here-for/x-auth";

describe("here-for X auth", () => {
  // Worked example from X's "Creating a signature" OAuth 1.0a docs.
  it("signs requests the way X documents", () => {
    const header = oauthHeader(
      "post",
      "https://api.twitter.com/1.1/statuses/update.json",
      {
        include_entities: "true",
        status: "Hello Ladies + Gentlemen, a signed OAuth request!",
        oauth_token: "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
      },
      {
        key: "xvz1evFS4wEEPTGEFPHBog",
        secret: "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw",
      },
      "LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE",
      "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",
      "1318622958",
    );
    expect(header).toContain(
      `oauth_signature="${encodeURIComponent("hCtSmYh+iHYCEqBWrE7C7hYmtUk=")}"`,
    );
  });

  it("only returns to same-site paths", () => {
    expect(safeReturnPath("/breakpoint/mutuals/add?add=a")).toBe(
      "/breakpoint/mutuals/add?add=a",
    );
    for (const bad of [
      null,
      "https://evil.test",
      "//evil.test",
      "/\\evil.test",
    ])
      expect(safeReturnPath(bad)).toBeNull();
  });
});
