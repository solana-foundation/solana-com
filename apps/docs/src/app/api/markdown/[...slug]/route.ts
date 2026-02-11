import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "@workspace/i18n/config";
import { docsSource } from "@@/src/app/sources/docs";
import { guidesSource } from "@@/src/app/sources/guides";
import { cookbookSource } from "@@/src/app/sources/cookbook";
import { learnSource } from "@@/src/app/sources/learn";
import { developersLearnSource } from "@@/src/app/sources/developers-learn";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  let page:
    | ReturnType<typeof docsSource.getPage>
    | ReturnType<typeof guidesSource.getPage>
    | ReturnType<typeof cookbookSource.getPage>
    | ReturnType<typeof learnSource.getPage>
    | ReturnType<typeof developersLearnSource.getPage>
    | null = null;

  if (slug[0] === "docs") {
    const rest = slug.slice(1);
    if (rest[0] === "payments") {
      page = docsSource.getPage(["payments", ...rest.slice(1)], defaultLocale);
    } else if (rest[0] === "rpc") {
      page = docsSource.getPage(["rpc", ...rest.slice(1)], defaultLocale);
    } else {
      page = docsSource.getPage(rest, defaultLocale);
    }
  } else if (slug[0] === "developers" && slug[1] === "guides") {
    page = guidesSource.getPage(slug.slice(2), defaultLocale);
  } else if (slug[0] === "developers" && slug[1] === "cookbook") {
    page = cookbookSource.getPage(slug.slice(2), defaultLocale);
  } else if (slug[0] === "developers" && slug[1] === "learn") {
    page = developersLearnSource.getPage(slug.slice(2), defaultLocale);
  } else if (slug[0] === "learn") {
    page = learnSource.getPage(slug.slice(1), defaultLocale);
  }

  if (!page) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const markdown = await page.data.getText("raw");
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
