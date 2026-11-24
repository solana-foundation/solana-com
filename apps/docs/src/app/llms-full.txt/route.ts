import { defaultLocale } from "@workspace/i18n/config";
import { AGENT_PREAMBLE, docsLlms } from "@/lib/docs/llms";
import { getStartupRequestsIndex } from "@/lib/startup-requests-index";

/**
 * /llms-full.txt: the Request for Startups briefs, then every English docs
 * page as Markdown (lib/docs/llms.ts).
 */
export const dynamic = "force-static";

export async function GET() {
  const startups = await getStartupRequestsIndex();
  const full = await docsLlms.full(defaultLocale);
  return new Response(`${AGENT_PREAMBLE}\n${startups}\n${full}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
