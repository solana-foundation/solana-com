import { proxyInkeepRequest } from "@solana-com/ui-chrome/inkeep-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30;

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return proxyInkeepRequest(request, { endpoint: "analytics", path });
}
