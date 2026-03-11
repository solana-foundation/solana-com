import { makeRouteHandler } from "@keystatic/next/route-handler";
import keystatic from "../../../../keystatic.config";

export const dynamic = "force-dynamic";

let handler: ReturnType<typeof makeRouteHandler> | undefined;

function getHandler() {
  if (!handler) {
    handler = makeRouteHandler({ config: keystatic });
  }
  return handler;
}

export async function GET(req: Request) {
  return getHandler().GET(req);
}

export async function POST(req: Request) {
  return getHandler().POST(req);
}
