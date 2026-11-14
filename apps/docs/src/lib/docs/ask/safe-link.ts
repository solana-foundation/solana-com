/**
 * Where a link the Ask AI panel draws may take the reader. Answers'
 * Markdown links, their sources, search results and the visuals' links all
 * go through `askLinkTarget`. The agent cleans the links in its answers but
 * misses encoded and prose forms, so the panel decides again here. It
 * decides on the URL the browser would open: the href is parsed with WHATWG
 * URL, as `<a href>` is.
 *
 * Allowed:
 * - a path on this origin ("/developers/docs/x"), or an in-page "#anchor";
 * - an https link to solana.com or one of its subdomains
 *   (explorer.solana.com), or to a site the agent may cite
 *   (ASK_LINK_DOMAINS, each with its subdomains). On github.com, only pages
 *   of the ASK_LINK_GITHUB_ORGS are allowed.
 *
 * Everything else returns null and the caller draws the text without a
 * link: other sites, `//host` and `/\host`, userinfo (`solana.com@host`),
 * ports, IP hosts, http:, mailto:, javascript:, data:, and paths without a
 * leading slash.
 */

/**
 * Sites allowed with their subdomains: solana.com and the agent's
 * citation allowlist (solana-com-agent config/agent.php):
 * - `citation_allowed_domains`, the AGENT_CITATION_ALLOWED_DOMAINS default
 *   (its github.com is checked by org, below);
 * - `docs_citation_enforcement.url_check_extra_domains`, the package
 *   registries its version lookups cite.
 */
export const ASK_LINK_DOMAINS: readonly string[] = [
  "solana.com",
  "solana.org",
  "anchor-lang.com",
  "solanakit.com",
  "docs.anza.xyz",
  "solana.stackexchange.com",
  "npmjs.com",
  "crates.io",
  "docs.rs",
];

/**
 * The GitHub orgs and users whose pages are allowed (first path segment),
 * as the agent's `citation_github_orgs` (the AGENT_CITATION_GITHUB_ORGS
 * default). Anyone can make a github.com repo, so the host alone is not
 * enough.
 */
export const ASK_LINK_GITHUB_ORGS: readonly string[] = [
  "solana-foundation",
  "anza-xyz",
  "solana-program",
  "solana-developers",
  "coral-xyz",
  "codama-idl",
  "metaplex-foundation",
  "txtx",
  "solana-labs",
  "magicblock-labs",
  "litesvm",
  "wallet-standard",
  "x402-foundation",
  "rpcpool",
  "otter-sec",
];

/** github.com itself; never a subdomain (gist., raw., ...), as the agent. */
const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);
const GITHUB_ORGS = new Set(ASK_LINK_GITHUB_ORGS);

/** How WHATWG URL writes an IPv4 host (any other IPv4 form is rewritten to it). */
const IPV4_HOST = /^\d+\.\d+\.\d+\.\d+$/;

/** Where pages are served when there is no window (server rendering). */
const FALLBACK_ORIGIN = "https://solana.com";

export type AskLinkTarget = {
  /**
   * The href to render: a path on this origin or an "#anchor", or an
   * absolute https URL. It is the parsed URL written back out, so the
   * browser opens exactly the URL that was checked.
   */
  href: string;
  /** Another site: open it in a new tab, with rel="noopener noreferrer". */
  external: boolean;
};

function parse(href: string, base?: string): URL | null {
  try {
    return new URL(href, base);
  } catch {
    return null;
  }
}

/**
 * The href as the URL parser reads it: leading and trailing control
 * characters and spaces trimmed, tabs and newlines dropped everywhere.
 * Without this, "/\t/evil.example" would pass for a path.
 */
function asParsed(href: string): string {
  let start = 0;
  let end = href.length;
  while (start < end && href.charCodeAt(start) <= 0x20) start++;
  while (end > start && href.charCodeAt(end - 1) <= 0x20) end--;
  return href.slice(start, end).replace(/[\t\n\r]/g, "");
}

function isAllowedHost(url: URL): boolean {
  const host = url.hostname;
  if (host.startsWith("[") || IPV4_HOST.test(host)) return false;
  if (GITHUB_HOSTS.has(host)) {
    // After URL normalization ("/a/../b", "/a/%2e%2e/b"), and as written:
    // an encoded name ("%73olana-foundation") is not an allowed org.
    const owner = url.pathname.split("/")[1]?.toLowerCase();
    return !!owner && GITHUB_ORGS.has(owner);
  }
  return ASK_LINK_DOMAINS.some(
    (domain) => host === domain || host.endsWith(`.${domain}`),
  );
}

/**
 * Where `href` may take the reader, or null when it must not be a link.
 * `origin` is this page's origin (`location.origin` in the browser).
 */
export function askLinkTarget(
  href: unknown,
  origin: string = typeof window === "undefined"
    ? FALLBACK_ORIGIN
    : window.location.origin,
): AskLinkTarget | null {
  if (typeof href !== "string") return null;
  const value = asParsed(href);
  const page = parse(origin);
  if (!value || !page) return null;

  // An in-page anchor: only the fragment changes.
  if (value.startsWith("#")) {
    const hash = parse(value, page.href)?.hash;
    return hash ? { href: hash, external: false } : null;
  }

  // A path on this origin; "//host" and "/\host" name another host.
  if (value.startsWith("/")) {
    if (value[1] === "/" || value[1] === "\\") return null;
    const url = parse(value, page.origin);
    if (!url || url.origin !== page.origin || url.username || url.password) {
      return null;
    }
    // "/a/..//host" normalizes to the path "//host", which, written out
    // as a relative href, would name another host.
    if (url.pathname.startsWith("//")) return null;
    return { href: `${url.pathname}${url.search}${url.hash}`, external: false };
  }

  // Another site: https on an allowed host, nothing else in the authority.
  const url = parse(value);
  if (
    !url ||
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    !isAllowedHost(url)
  ) {
    return null;
  }
  return { href: url.href, external: true };
}
