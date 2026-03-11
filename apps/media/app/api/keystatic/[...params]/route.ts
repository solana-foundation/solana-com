import { makeRouteHandler } from "@keystatic/next/route-handler";
import keystatic from "../../../../keystatic.config";

export const dynamic = "force-dynamic";

export const { GET, POST } = makeRouteHandler({
  config: keystatic,
});
