import { proxyAskRequest } from "@/lib/ask-agent-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return proxyAskRequest(request, ["chat"]);
}
