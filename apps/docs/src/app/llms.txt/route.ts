import { indexPages } from "@/lib/docs/llms";
import { renderLlmsTxt } from "@/lib/docs/llms-index";
import { getStartupRequestsIndex } from "@/lib/startup-requests-index";

/**
 * /llms.txt: the agent index of every English page, after the Request for
 * Startups briefs, built with the app.
 */
export const dynamic = "force-static";

export async function GET() {
  const startups = await getStartupRequestsIndex();
  return new Response(renderLlmsTxt(indexPages(), undefined, [startups]), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
