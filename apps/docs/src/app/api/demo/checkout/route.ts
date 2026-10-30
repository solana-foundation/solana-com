import { demoRoute } from "@/lib/docs-demo/route";

/** POST /api/demo/checkout: 1 devnet USDC from the customer to the shop. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = demoRoute("checkout", 5);
