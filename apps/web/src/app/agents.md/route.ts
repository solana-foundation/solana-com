import { NextResponse } from "next/server";
import { defaultLocale } from "@workspace/i18n/config";
import { loadAppMessages } from "@workspace/i18n/messages";
import { renderAgentsMarkdown } from "@/lib/agents-markdown";

/**
 * /agents.md: the /agents page as Markdown for agents, listed in /llms.txt.
 * `Accept: text/markdown` requests for /agents are rewritten here by the
 * middleware.
 */
export const dynamic = "force-static";

export async function GET() {
  const messages = await loadAppMessages("web", defaultLocale);
  const markdown = renderAgentsMarkdown(
    messages.agents as Parameters<typeof renderAgentsMarkdown>[0],
  );

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
