import { getMirrorInstance } from "@/utils/mirror";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // const allowedOrigin = "https://solana.com";
  // const origin = req.headers.get("origin") || req.headers.get("referer");
  // if (!origin || !origin.startsWith(allowedOrigin)) {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  var { code, language, testCode } = await req.json();

  const { mirrorUrl, wsMirrorUrl } = await getMirrorInstance();
  code = code.replace(/clusterApiUrl\([^)]*\)/g, `"${mirrorUrl}"`);
  code = code.replace(
    /Create Connection, local validator in this example/g,
    "This Mirror instance lasts for 1 hour. You can create your own at https://mirror.ad",
  );
  code = code.replace(/http:\/\/localhost:8899/g, mirrorUrl);
  code = code.replace(/ws:\/\/localhost:8900/g, wsMirrorUrl);
  code = code.replace(/http:\/\/127\.0\.0\.1:8899/g, mirrorUrl);
  code = code.replace(/ws:\/\/127\.0\.0\.1:8900/g, wsMirrorUrl);
  code = code.replace(/"devnet"/g, `"${mirrorUrl}"`);
  code = code.replace(/"wsDevnet"/g, `"${wsMirrorUrl}"`);
  code = code.replace(
    /https:\/\/engine\.mirror\.ad\/rpc\/<mirror-id>/g,
    mirrorUrl,
  );
  code = code.replace(
    /wss:\/\/engine\.mirror\.ad\/rpc\/<mirror-id>/g,
    wsMirrorUrl,
  );

  const programId = parseProgramId(code);
  if (testCode && programId) {
    language = "anchorTest";
  }

  let url: string;
  switch (language) {
    case "rust":
      url = "https://api.mirror.ad/code-exec/rust";
      break;
    case "rs":
      url = "https://api.mirror.ad/code-exec/rust";
      break;
    case "typescript":
      url = "https://api.mirror.ad/code-exec/typescript";
      break;
    case "ts":
      url = "https://api.mirror.ad/code-exec/typescript";
      break;
    case "anchorTest":
      url = "https://api.mirror.ad/code-exec/programs/anchor/test";
      break;
    default:
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  console.log(url);

  const mirrorApiKey = process.env.MIRROR_API_KEY;
  if (!mirrorApiKey) {
    return NextResponse.json({ error: "No Mirror API Key" }, { status: 500 });
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_key: mirrorApiKey,
    },
    body: JSON.stringify({
      code,
      test_code: testCode || undefined,
      program_id: programId || undefined,
      blockchain_id: parseMirrorId(mirrorUrl),
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

function parseProgramId(code: string) {
  const programIdRegex = /declare_id!\("([^"]+)"\)/;
  const match = code.match(programIdRegex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

function parseMirrorId(url: string) {
  const uuidRegex = /\/rpc\/([a-f0-9\-]{36})/;
  const match = url.match(uuidRegex);
  const mirrorId = match ? match[1] : undefined;
  return mirrorId;
}
