import { proxyInkeepRequest } from "@/lib/inkeep/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30;

export function POST(request: Request) {
  return proxyInkeepRequest(request, { endpoint: "search" });
}
