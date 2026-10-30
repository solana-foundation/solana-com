import { defaultLocale } from "@workspace/i18n/config";
import { AGENT_PREAMBLE, docsLlms } from "@/lib/docs/llms";

/** /llms-full.txt: every English docs page as Markdown (Fumadocs `llms()`). */
export const dynamic = "force-static";

export async function GET() {
  const full = await docsLlms.full(defaultLocale);
  return new Response(`${AGENT_PREAMBLE}\n${full}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
