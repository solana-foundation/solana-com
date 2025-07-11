import { NextResponse } from "next/server";
import { z } from "zod";

const codeRunSchema = z.object({
  code: z.string(),
  language: z.enum(["rust", "rs", "typescript", "ts"]),
});

type CodeRunPayload = z.infer<typeof codeRunSchema>;

interface CodeRunResult {
  output: string;
}

const { CODE_RUN_SERVER_URL, TXTX_SURFNET_URL } = process.env;

const isEnvConfigured = !!CODE_RUN_SERVER_URL && !!TXTX_SURFNET_URL;

const TXTX_RPC_URL = isEnvConfigured ? `https://${TXTX_SURFNET_URL}:8899` : "";
const TXTX_WS_RPC_URL = isEnvConfigured ? `wss://${TXTX_SURFNET_URL}:8900` : "";

const replacement = (() => {
  const replacementMap: Record<string, string> = {
    "http://localhost:8899": TXTX_RPC_URL,
    "ws://localhost:8900": TXTX_WS_RPC_URL,
    "http://127.0.0.1:8899": TXTX_RPC_URL,
    "ws://127.0.0.1:8900": TXTX_WS_RPC_URL,
  };

  const pattern = Object.keys(replacementMap)
    .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  return {
    regex: new RegExp(pattern, "g"),
    map: replacementMap,
  };
})();

const replaceLocalHostUrl = (code: string): string => {
  return code.replace(replacement.regex, (matched) => replacement.map[matched]);
};

const getAPIRoute = (language: CodeRunPayload["language"]): string => {
  let path: string;
  switch (language) {
    case "rs":
      path = "rust";
      break;
    case "ts":
      path = "typescript";
      break;
    default:
      path = language;
  }
  return `${CODE_RUN_SERVER_URL}/${path}`;
};

export async function POST(req: Request) {
  if (!isEnvConfigured) {
    console.error("Missing required environment variables.");
    return NextResponse.json(
      { error: "Service unavailable due to missing environment variables." },
      { status: 503 },
    );
  }

  const body = await req.json();
  const parseResult = codeRunSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parseResult.error.flatten() },
      { status: 400 },
    );
  }

  const { code, language } = parseResult.data;

  const executableCode = replaceLocalHostUrl(code);
  const url = getAPIRoute(language);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: executableCode }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error from code runner service (status: ${response.status}):`,
        errorText,
      );
      return NextResponse.json(
        { error: "Error running code", details: errorText },
        { status: response.status },
      );
    }

    const responseJson = await response.json();

    const codeRun: CodeRunResult = {
      output: responseJson.stdout || "",
    };

    return NextResponse.json(codeRun, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch from code runner:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    );
  }
}
