import { NextResponse } from "next/server";
import { defaultLocale } from "@workspace/i18n/config";
import { docsSource } from "@@/src/app/sources/docs";
import { cookbookSource } from "@@/src/app/sources/cookbook";
import { learnSource } from "@@/src/app/sources/learn";
import { developersLearnSource } from "@@/src/app/sources/developers-learn";

export const revalidate = 3600;

const SITE_ORIGIN = "https://solana.com";

export async function GET() {
  const sources = [
    docsSource,
    cookbookSource,
    developersLearnSource,
    learnSource,
  ];

  const chunks: string[] = [
    "# Solana Documentation (full corpus)",
    "",
    "> The complete Solana developer documentation as a single Markdown",
    "> file. Canonical per-page URLs are noted above each section.",
    "",
  ];

  for (const source of sources) {
    const pages = source
      .getPages(defaultLocale)
      .slice()
      .sort((a, b) => a.url.localeCompare(b.url));
    for (const page of pages) {
      let raw: string;
      try {
        raw = await page.data.getText("raw");
      } catch {
        continue;
      }
      chunks.push(`---`, ``, `URL: ${SITE_ORIGIN}${page.url}`, ``, raw, ``);
    }
  }

  return new NextResponse(chunks.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
