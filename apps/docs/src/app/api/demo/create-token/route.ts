import { demoRoute } from "@/lib/docs-demo/route";

/** POST /api/demo/create-token: a new devnet Token-2022 mint, with metadata. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = demoRoute("token", 3);
