import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { resolveDocsPage } from "@/lib/docs/page-data";
import { DOCS_LOCALES } from "@/lib/docs/locales.mjs";

/**
 * Social images for the developer pages:
 * - /opengraph/developers: the /developers landing;
 * - /opengraph/developers/<[locale/]docs|cookbook/...>, /.../learn/...: a docs
 *   page: the section ("Solana Documentation", "Solana Cookbook", "Learn")
 *   over the page title (docs metadata, lib/docs/metadata.ts ogImagePath).
 * The background is one of the shared shapes, picked from the path, so a
 * page always gets the same image.
 */
export const runtime = "nodejs";
export const revalidate = 3600;

const SIZE = { width: 1200, height: 630 };
const CACHE_CONTROL = "public, max-age=3600, s-maxage=86400";

type Assets = {
  backgrounds: string[];
  logo: string;
  medium: Buffer;
  bold: Buffer;
};

let assetsPromise: Promise<Assets> | undefined;

function loadAssets(): Promise<Assets> {
  const root = process.cwd();
  assetsPromise ??= Promise.all([
    Promise.all(
      Array.from({ length: SHAPES }, (_, i) =>
        readFile(
          path.join(root, `public/img/og-backgrounds/shape-${i + 1}.jpg`),
        ),
      ),
    ),
    readFile(path.join(root, "public/img/logomark-color.svg")),
    readFile(path.join(root, "src/fonts/diatype/ABCDiatype-Medium.woff")),
    readFile(path.join(root, "src/fonts/diatype/ABCDiatype-Bold.woff")),
  ]).then(([backgrounds, logo, medium, bold]) => ({
    backgrounds: backgrounds.map(
      (b) => `data:image/jpeg;base64,${b.toString("base64")}`,
    ),
    logo: `data:image/svg+xml;base64,${logo.toString("base64")}`,
    medium,
    bold,
  }));
  return assetsPromise;
}

const SHAPES = 15;

function hash(text: string) {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

/** Section heading and page title for a docs path, or null (404). */
function docsImage(slug: string[]): { heading: string; title: string } | null {
  const locale = DOCS_LOCALES.includes(slug[0] ?? "") ? slug[0]! : "en";
  const rest = locale === "en" ? slug : slug.slice(1);
  const [section] = rest;
  const prefix =
    section === "learn" ? ["learn"] : ["developers", ...rest.slice(0, 1)];
  const pageSlugs = [...prefix, ...rest.slice(1)];
  const heading =
    section === "cookbook"
      ? "Solana Cookbook"
      : section === "learn"
        ? "Learn"
        : section === "docs"
          ? "Solana Documentation"
          : null;
  if (!heading) return null;
  const resolved = resolveDocsPage(locale, pageSlugs);
  if (!resolved) return null;
  const data = resolved.page.data as { title: string; "og:title"?: string };
  return { heading, title: data["og:title"] ?? data.title };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;
  const docs = slug.length ? docsImage(slug) : null;
  if (slug.length && !docs) return new Response("Not Found", { status: 404 });
  const { backgrounds, logo, medium, bold } = await loadAssets();
  const background = backgrounds[docs ? hash(slug.join("/")) % SHAPES : 0];
  const heading = docs?.heading ?? "Solana Developers";
  const title = docs?.title ?? "Build on internet capital markets.";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        backgroundColor: "#000",
        color: "#fff",
        padding: "56px 64px",
        fontFamily: "Diatype",
      }}
    >
      <img
        src={background}
        width={SIZE.width}
        height={SIZE.height}
        alt=""
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <img src={logo} width={64} height={56} alt="" />
        <span style={{ fontSize: 48, fontWeight: 500, color: "#bbb" }}>
          {heading}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: docs ? 72 : 96,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
    </div>,
    {
      ...SIZE,
      fonts: [
        { name: "Diatype", data: medium, style: "normal", weight: 500 },
        { name: "Diatype", data: bold, style: "normal", weight: 700 },
      ],
      headers: { "Cache-Control": CACHE_CONTROL },
    },
  );
}
