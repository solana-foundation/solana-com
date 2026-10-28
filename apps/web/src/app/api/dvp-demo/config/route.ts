import { NextResponse } from "next/server";
import {
  ASSET_TOKEN,
  CASH_TOKEN,
  CLUSTER,
  PRESET,
  PROGRAM_ID,
} from "@/lib/delivery-vs-payment/config";
import { treasuryAddress } from "@/lib/delivery-vs-payment/server/solana";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!process.env.DVP_DEMO_RPC_URL)
      throw new Error("DVP_DEMO_RPC_URL is not set");
    const treasury = await treasuryAddress();

    return NextResponse.json({
      programId: PROGRAM_ID,
      cluster: CLUSTER,
      treasury,
      tokens: { asset: ASSET_TOKEN, cash: CASH_TOKEN },
      presets: {
        amountA: PRESET.amountA.toString(),
        amountB: PRESET.amountB.toString(),
        expirySeconds: PRESET.expirySeconds,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Demo is not configured",
      },
      { status: 503 },
    );
  }
}
