import { describe, expect, it } from "vitest";
import {
  ASK_LINK_DOMAINS,
  ASK_LINK_GITHUB_ORGS,
  askLinkTarget,
} from "@/lib/docs/ask/safe-link";

const ORIGIN = "https://solana.com";
const target = (href: unknown) => askLinkTarget(href, ORIGIN);

describe("askLinkTarget: allowed", () => {
  it.each([
    ["/developers/docs/core/accounts", "/developers/docs/core/accounts"],
    [
      "/developers/docs/core/fees#base-fee",
      "/developers/docs/core/fees#base-fee",
    ],
    ["/ja/developers/docs/tokens?x=1", "/ja/developers/docs/tokens?x=1"],
    ["/news", "/news"],
    ["/", "/"],
    // Written as the browser opens them.
    ["/developers/docs/a b", "/developers/docs/a%20b"],
    ["/developers/docs/x/../y", "/developers/docs/y"],
    ["  /developers/docs  ", "/developers/docs"],
    ["/%2F/evil.example", "/%2F/evil.example"],
    ["/%5Cevil.example", "/%5Cevil.example"],
  ])("the path %s, as %s", (href, expected) => {
    expect(target(href)).toEqual({ href: expected, external: false });
  });

  it.each([
    ["#pda", "#pda"],
    ["#user-content-fn-1", "#user-content-fn-1"],
    ["#a b", "#a%20b"],
  ])("the anchor %s, as %s", (href, expected) => {
    expect(target(href)).toEqual({ href: expected, external: false });
  });

  it("resolves paths against the page's origin", () => {
    expect(askLinkTarget("/developers/docs", "http://localhost:3003")).toEqual({
      href: "/developers/docs",
      external: false,
    });
    // jsdom's own origin by default.
    expect(askLinkTarget("/developers/docs")).toEqual({
      href: "/developers/docs",
      external: false,
    });
  });

  it.each([
    ["https://solana.com", "https://solana.com/"],
    ["https://solana.com/news", "https://solana.com/news"],
    ["https://www.solana.com/x", "https://www.solana.com/x"],
    [
      "https://explorer.solana.com/address/So11111111111111111111111111111111111111112",
      "https://explorer.solana.com/address/So11111111111111111111111111111111111111112",
    ],
    [
      "HTTPS://Explorer.Solana.COM/tx/abc",
      "https://explorer.solana.com/tx/abc",
    ],
    ["https://solana.org/grants", "https://solana.org/grants"],
    ["https://www.anchor-lang.com/docs", "https://www.anchor-lang.com/docs"],
    ["https://anchor-lang.com/docs", "https://anchor-lang.com/docs"],
    ["https://solanakit.com/docs", "https://solanakit.com/docs"],
    ["https://docs.anza.xyz/cli", "https://docs.anza.xyz/cli"],
    [
      "https://solana.stackexchange.com/questions/1",
      "https://solana.stackexchange.com/questions/1",
    ],
    [
      "https://www.npmjs.com/package/@solana/kit",
      "https://www.npmjs.com/package/@solana/kit",
    ],
    ["https://npmjs.com/package/x", "https://npmjs.com/package/x"],
    [
      "https://crates.io/crates/anchor-lang",
      "https://crates.io/crates/anchor-lang",
    ],
    ["https://docs.rs/solana-sdk", "https://docs.rs/solana-sdk"],
    // The default port, which the URL drops.
    ["https://solana.com:443/x", "https://solana.com/x"],
    // A backslash is a path separator in https URLs: still solana.com.
    [
      "https://solana.com\\@evil.example/x",
      "https://solana.com/@evil.example/x",
    ],
    // Full-width letters are read as ASCII (IDNA): solana.com itself.
    ["https://ｓｏｌａｎａ.com/x", "https://solana.com/x"],
  ])("%s, as %s in a new tab", (href, expected) => {
    expect(target(href)).toEqual({ href: expected, external: true });
  });

  it.each(ASK_LINK_DOMAINS.map((domain) => [domain]))(
    "%s and its subdomains",
    (domain) => {
      expect(target(`https://${domain}/x`)?.external).toBe(true);
      expect(target(`https://sub.${domain}/x`)?.external).toBe(true);
    },
  );

  it.each(ASK_LINK_GITHUB_ORGS.map((org) => [org]))("github.com/%s", (org) => {
    expect(target(`https://github.com/${org}/repo`)).toEqual({
      href: `https://github.com/${org}/repo`,
      external: true,
    });
  });

  it.each([
    "https://github.com/solana-foundation",
    "https://github.com/Solana-Foundation/solana-com",
    "https://www.github.com/anza-xyz/agave",
    "https://github.com/solana-program/token/blob/main/README.md#usage",
    // Normalized to /anza-xyz/agave.
    "https://github.com/evil-org/../anza-xyz/agave",
  ])("the allowed GitHub org in %s", (href) => {
    expect(target(href)?.external).toBe(true);
  });
});

describe("askLinkTarget: rejected", () => {
  it.each([
    // Another host, or a path that names one.
    "//evil.example/login",
    "///evil.example/login",
    "/\\evil.example/login",
    "\\\\evil.example/login",
    "/\t/evil.example/login",
    "/\n/evil.example/login",
    " //evil.example/login",
    "\u0000//evil.example/login",
    "/developers/docs/../..//evil.example/login",
    "/developers/docs/%2e%2e/%2e%2e//evil.example",
    // Userinfo and lookalike hosts.
    "https://solana.com@evil.example/login",
    "https://solana.com:x@evil.example/login",
    "https://user@solana.com/",
    "https://solana.com.evil.example/login",
    "https://solana.com%2eevil.example/login",
    "https://solana.com%2Eevil.example/login",
    "https://solana.com\t.evil.example/login",
    "https://solana.com。evil.example/login",
    "https://evilsolana.com/",
    "https://solana.co/",
    "https://solana.com./",
    "https://evil.example/solana.com",
    "https://evil.example#solana.com",
    "https://evil.example?solana.com",
    "https://evil.example\\.solana.com",
    "https://anza.xyz/",
    "https://evil.docs.rs.evil.example/",
    // Look-alikes in other scripts (punycode) of allowed hosts.
    "https://sоlana.com/",
    "https://xn--olana-7ve.com/",
    "https://xn--slana-k8a.com/",
    "https://xn--solana-com.evil.example/",
    "https://docs.anza.xyz.xn--evil-qza.example/",
    // Ports and IP hosts.
    "https://solana.com:8443/",
    "https://explorer.solana.com:444/",
    "https://127.0.0.1/",
    "https://0x7f000001/",
    "https://2130706433/",
    "https://[::1]/",
    "https://[2606:4700::1]/",
    // Other schemes.
    "http://solana.com/news",
    "http://explorer.solana.com/",
    "http://evil.example/",
    "http:evil.example/login",
    "https:evil.example/login",
    "https:/evil.example/login",
    "HTTPS://EVIL.EXAMPLE/",
    "mailto:hello@solana.org",
    "MAILTO:hello@solana.org",
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "java\tscript:alert(1)",
    " javascript:alert(1)",
    "data:text/html,<p>hi</p>",
    "vbscript:msgbox(1)",
    "ftp://solana.com/",
    "ws://solana.com/",
    "wss://solana.com/",
    "file:///etc/passwd",
    "blob:https://solana.com/x",
    "tel:+15555555555",
    // Not a path from the root.
    "relative/path",
    "./x",
    "../x",
    "?q=1",
    "www.evil.example/login",
    "evil.example",
    "#",
    "",
    "   ",
    42,
    null,
    undefined,
  ])("%s", (href) => {
    expect(target(href)).toBeNull();
  });

  it.each([
    "https://github.com/evil-org/repo",
    "https://github.com/",
    "https://github.com",
    "https://github.com/solana-foundation-evil/x",
    "https://github.com/solana-foundation/../evil-org/phish",
    "https://github.com/solana-foundation/%2e%2e/evil-org/phish",
    "https://github.com/solana-foundation/.%2e/evil-org/phish",
    "https://github.com/%73olana-foundation/x",
    "https://github.com/solana-foundation%2F..%2Fevil-org/x",
    "https://github.com//solana-foundation/x",
    "https://gist.github.com/solana-foundation/abc",
    "https://raw.github.com/solana-foundation/x",
    "https://solana-foundation.github.io/x",
    "https://github.com.evil.example/solana-foundation/x",
    "https://solana-foundation@github.com/evil-org/x",
    "http://github.com/solana-foundation/x",
  ])("GitHub outside the allowed orgs: %s", (href) => {
    expect(target(href)).toBeNull();
  });

  it("rejects a path when the page has no usable origin", () => {
    expect(askLinkTarget("/developers/docs", "not a url")).toBeNull();
  });
});
