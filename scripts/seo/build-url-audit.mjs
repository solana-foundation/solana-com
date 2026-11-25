import fs from "node:fs";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { locales } from "../../packages/i18n/src/config.ts";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, values) => {
    if (value.startsWith("--") && values[index + 1]) {
      pairs.push([value.slice(2), values[index + 1]]);
    }
    return pairs;
  }, []),
);

if (!args.sitemap || !args.output) {
  console.error(
    "Usage: node scripts/seo/build-url-audit.mjs --sitemap <xml> --output <csv> [--logs <jsonl>] [--hosts <csv>]",
  );
  process.exit(1);
}

const localeSet = new Set(locales);
const redirectTargets = new Map([
  ["/rss", "/news/rss.xml"],
  ["/feed.xml", "/news/rss.xml"],
  ["/sitemap-0.xml", "/sitemap.xml"],
  ["/sitemap-index.xml", "/sitemap.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"],
]);
const restoredAssets = new Set([
  "/favicon.ico",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
]);

function xmlText(value) {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };
  return value.replace(/&(amp|lt|gt|quot|apos);/g, (_, name) => entities[name]);
}

function csvRow(values) {
  return values
    .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
    .join(",");
}

function routeInfo(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = localeSet.has(segments[0]) ? segments.shift() : "en";
  const route = `/${segments.join("/")}`;
  let owner = "web";

  if (
    route === "/developers/templates" ||
    route.startsWith("/developers/templates/")
  ) {
    owner = "templates";
  } else if (
    ["/news", "/changelog", "/reports", "/upgrades", "/podcasts"].some(
      (prefix) => route === prefix || route.startsWith(`${prefix}/`),
    )
  ) {
    owner = "media";
  } else if (route === "/accelerate" || route.startsWith("/accelerate/")) {
    owner = "accelerate";
  } else if (route === "/breakpoint" || route.startsWith("/breakpoint/")) {
    owner = "breakpoint";
  } else if (
    [
      "/docs",
      "/learn",
      "/developers/cookbook",
      "/developers/bootcamp",
      "/developers/guides",
    ].some((prefix) => route === prefix || route.startsWith(`${prefix}/`)) ||
    route === "/developers"
  ) {
    owner = "docs";
  }

  return { locale, route, owner };
}

const rows = [];
const sitemapXml = args.sitemap.endsWith(".gz")
  ? gunzipSync(fs.readFileSync(args.sitemap)).toString("utf8")
  : fs.readFileSync(args.sitemap, "utf8");
for (const match of sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const loc = match[1].match(/<loc>([\s\S]*?)<\/loc>/)?.[1];
  if (!loc) continue;
  const url = new URL(xmlText(loc));
  const lastmod = match[1].match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1] ?? "";
  const { locale, route, owner } = routeInfo(url.pathname);
  rows.push({
    record_type: "url",
    url: url.href,
    host: url.hostname,
    path: url.pathname,
    locale,
    owner,
    current_platform: "Vercel Next.js",
    source: "live_sitemap",
    last_modified: lastmod,
    observed_status: "not_checked",
    sampled_404_count: "",
    redirect_need: "none_listed",
    redirect_target: "",
    migration_candidacy: owner === "web" ? "review" : "not_applicable",
    notes:
      route.startsWith("/developers/") && owner === "web"
        ? "Check app ownership"
        : "",
  });
}

if (args.logs) {
  const counts = new Map();
  for (const line of fs.readFileSync(args.logs, "utf8").split("\n")) {
    if (!line.trim()) continue;
    const log = JSON.parse(line);
    if (log.responseStatusCode !== 404 || !log.requestPath) continue;
    counts.set(log.requestPath, (counts.get(log.requestPath) ?? 0) + 1);
  }
  for (const [pathname, count] of counts) {
    const { locale, route, owner } = routeInfo(pathname);
    const target = redirectTargets.get(route);
    const assetAdded = restoredAssets.has(route);
    rows.push({
      record_type: "404_candidate",
      url: `https://solana.com${pathname}`,
      host: "solana.com",
      path: pathname,
      locale,
      owner,
      current_platform: "Vercel Next.js",
      source: "vercel_404_sample",
      last_modified: "",
      observed_status: "404",
      sampled_404_count: count,
      redirect_need: target ? "planned" : assetAdded ? "asset_added" : "review",
      redirect_target: target ? `https://solana.com${target}` : "",
      migration_candidacy: "not_applicable",
      notes: assetAdded
        ? "Asset restored in ECO-514; sample count is not total traffic"
        : "Sample count, not total traffic",
    });
  }
}

if (args.hosts) {
  for (const line of fs
    .readFileSync(args.hosts, "utf8")
    .trim()
    .split("\n")
    .slice(1)) {
    if (!line.trim()) continue;
    const [host, owner, platform, source, notes, httpStatus] = line.split(",");
    const existingRedirect = notes.startsWith("Redirect to ")
      ? notes.slice("Redirect to ".length).split(";")[0]
      : "";
    rows.push({
      record_type: "subdomain",
      url: `https://${host}/`,
      host,
      path: "/",
      locale: "",
      owner,
      current_platform: platform,
      source,
      last_modified: "",
      observed_status: httpStatus || "not_checked",
      sampled_404_count: "",
      redirect_need: existingRedirect ? "already_redirects" : "review",
      redirect_target: existingRedirect ? `https://${existingRedirect}/` : "",
      migration_candidacy: owner === "solana-com" ? "review" : "not_applicable",
      notes,
    });
  }
}

const columns = [
  "record_type",
  "url",
  "host",
  "path",
  "locale",
  "owner",
  "current_platform",
  "source",
  "last_modified",
  "observed_status",
  "sampled_404_count",
  "redirect_need",
  "redirect_target",
  "migration_candidacy",
  "notes",
];
rows.sort(
  (a, b) =>
    a.record_type.localeCompare(b.record_type) || a.url.localeCompare(b.url),
);
fs.mkdirSync(path.dirname(args.output), { recursive: true });
fs.writeFileSync(
  args.output,
  `${csvRow(columns)}\n${rows.map((row) => csvRow(columns.map((column) => row[column]))).join("\n")}\n`,
);
console.log(`Wrote ${rows.length} audit rows to ${args.output}`);
