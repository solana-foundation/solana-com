import { describe, expect, it } from "vitest";
import { isDocsHref } from "../url-config";

describe("isDocsHref", () => {
  it.each([
    "/developers/docs",
    "/developers/docs/payments/checkout",
    "/ja/developers/docs/core/accounts",
    "/pt/developers/docs/rpc#getbalance",
    "/developers/docs?q=mint",
    "https://solana.com/developers/docs/core",
    // The old prefix still counts: it redirects to /developers/docs.
    "/docs",
    "/docs/payments/checkout",
    "/ja/docs/core/accounts",
    "/pt/docs/rpc#getbalance",
    "/developers/cookbook",
    "/developers/cookbook/tokens/create-mint",
    "/developers/bootcamp/foundations",
    "/learn/what-is-solana",
    "https://solana.com/docs/core",
  ])("treats %s as a docs link", (href) => {
    expect(isDocsHref(href)).toBe(true);
  });

  it.each([
    "/developers",
    "/learn",
    "/developers/payments",
    "/developers/docsearch",
    "/docsearch",
    "https://mcp.solana.com",
    "#picker",
  ])("treats %s as not a docs link", (href) => {
    expect(isDocsHref(href)).toBe(false);
  });
});
