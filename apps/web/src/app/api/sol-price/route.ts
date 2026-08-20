import { NextResponse } from "next/server";

// Real SOL/USD market data for the perps-hack landing chart.
// Proxied server-side so the browser avoids CoinGecko CORS / rate limits,
// and cached briefly so we never hammer the upstream API.
export const revalidate = 15;

export async function GET() {
  try {
    const [ohlcRes, priceRes] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/coins/solana/ohlc?vs_currency=usd&days=1",
        { next: { revalidate: 60 } },
      ),
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
        { next: { revalidate: 15 } },
      ),
    ]);

    const ohlc: number[][] = ohlcRes.ok ? await ohlcRes.json() : [];
    const priceJson = priceRes.ok ? await priceRes.json() : null;
    const price =
      typeof priceJson?.solana?.usd === "number" ? priceJson.solana.usd : null;

    return NextResponse.json(
      { ohlc, price },
      { headers: { "Cache-Control": "public, s-maxage=15, max-age=5" } },
    );
  } catch {
    return NextResponse.json({ ohlc: [], price: null });
  }
}
