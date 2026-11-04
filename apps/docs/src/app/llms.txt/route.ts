import { indexPages } from "@/lib/docs/llms";
import { renderLlmsTxt } from "@/lib/docs/llms-index";

/** /llms.txt: the agent index of every English page, built with the app. */
export const dynamic = "force-static";

export function GET() {
  return new Response(renderLlmsTxt(indexPages()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
