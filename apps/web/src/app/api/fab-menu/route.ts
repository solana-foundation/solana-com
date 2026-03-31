import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GET_STARTED_LINKS } from "@/data/index/data";

interface GetStartedMessages {
  title: string;
  tabs: Record<string, string>;
  links: Record<string, string[]>;
}

async function loadMessages(
  locale: string,
): Promise<GetStartedMessages | null> {
  try {
    const messages = await import(
      `@workspace/i18n/messages/web/${locale}/common.json`
    );
    return messages.default?.index?.["get-started"] ?? null;
  } catch {
    return null;
  }
}

const ALLOWED_ORIGIN_PATTERN = /^https?:\/\/([a-z0-9-]+\.)*solana\.com$/;

function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    Vary: "Origin",
  };

  if (origin && ALLOWED_ORIGIN_PATTERN.test(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }

  return headers;
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const locale = request.nextUrl.searchParams.get("locale") || "en";

  const messages = (await loadMessages(locale)) ?? (await loadMessages("en"))!;

  const tabs = [
    { id: "institution", title: messages.tabs.institution, icon: "bank" },
    { id: "user", title: messages.tabs.user, icon: "avatar" },
    { id: "developer", title: messages.tabs.developer, icon: "code" },
  ];

  const links: Record<string, { title: string; href: string }[]> = {};
  for (const [key, items] of Object.entries(GET_STARTED_LINKS)) {
    const titles = messages.links[key] ?? [];
    links[key] = items.map((item, i) => ({
      title: titles[i] ?? "",
      href: item.href,
    }));
  }

  return NextResponse.json(
    { title: messages.title, tabs, links },
    { headers: getCorsHeaders(origin) },
  );
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}
