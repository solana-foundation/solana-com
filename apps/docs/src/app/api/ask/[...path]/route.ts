import { proxyAskRequest } from "@/lib/ask-agent-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AskRouteContext = {
  params: Promise<{ path?: string[] }>;
};

async function proxy(request: Request, context: AskRouteContext) {
  const { path = [] } = await context.params;
  return proxyAskRequest(request, path);
}

export function GET(request: Request, context: AskRouteContext) {
  return proxy(request, context);
}

export function POST(request: Request, context: AskRouteContext) {
  return proxy(request, context);
}
