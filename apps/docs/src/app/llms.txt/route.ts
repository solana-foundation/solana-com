import { indexPages } from "@/lib/docs/llms";
import { renderLlmsTxt } from "@/lib/docs/llms-index";
import { getStartupRequestsIndex } from "@/lib/startup-requests-index";
import { getAgentsIndex } from "@/lib/agents-index";

/**
 * /llms.txt: the agent index of every English page, after the solana.com/agents
 * guide and the Request for Startups briefs, built with the app.
 */
export const dynamic = "force-static";

export async function GET() {
  const [agents, startups] = await Promise.all([
    getAgentsIndex(),
    getStartupRequestsIndex(),
  ]);
  return new Response(
    renderLlmsTxt(indexPages(), undefined, [agents, startups]),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}
