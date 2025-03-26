import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // const allowedOrigin = "https://solana.com";
  // const origin = req.headers.get("origin") || req.headers.get("referer");
  // if (!origin || !origin.startsWith(allowedOrigin)) {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  //parse json body
  const { code } = await req.json();

  const mirrorApiKey = process.env.MIRROR_API_KEY;
  if (!mirrorApiKey) {
    return NextResponse.json({ error: "No Mirror API Key" }, { status: 500 });
  }
  const response = await fetch("https://api.mirror.ad/code-exec/typescript", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_key: mirrorApiKey,
    },
    body: JSON.stringify({
      code,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(
      { error: "Error running code", details: error },
      { status: response.status },
    );
  }

  const codeRun = await response.json();

  return NextResponse.json(codeRun, { status: 200 });
}
