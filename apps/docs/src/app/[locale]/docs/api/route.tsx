import { NextResponse } from "next/server";
import { z } from "zod";

const codeRunSchema = z.object({
  code: z.string(),
  language: z.enum(["rust", "rs", "typescript", "ts", "py"]),
});

type CodeRunPayload = z.infer<typeof codeRunSchema>;

interface CodeRunResult {
  output: string;
}

const { CODE_RUN_SERVER_URL, TXTX_SURFNET_URL } = process.env;

const isEnvConfigured = !!CODE_RUN_SERVER_URL && !!TXTX_SURFNET_URL;

const TXTX_RPC_URL = isEnvConfigured ? `https://${TXTX_SURFNET_URL}:8899` : "";
const TXTX_WS_RPC_URL = isEnvConfigured ? `wss://${TXTX_SURFNET_URL}:8900` : "";
const LOCALHOST_RPC_URL = "http://localhost:8899";
const LOCALHOST_WS_URL = "ws://localhost:8900";

const createExplicitClientSetup = (): string =>
  [
    "const feePayer = await generateKeyPairSigner();",
    "",
    "const client = createClient({",
    `  url: ${JSON.stringify(TXTX_RPC_URL)},`,
    "  payer: feePayer,",
    "  rpcSubscriptionsConfig: {",
    `    url: ${JSON.stringify(TXTX_WS_RPC_URL)},`,
    "  },",
    "});",
    "",
    "await airdropFactory({",
    "  rpc: client.rpc,",
    "  rpcSubscriptions: client.rpcSubscriptions,",
    "})({",
    "  recipientAddress: feePayer.address,",
    "  lamports: lamports(1_000_000_000n),",
    '  commitment: "confirmed",',
    "});",
  ].join("\n");

const replaceLocalHostUrl = (code: string): string => {
  return code
    .replaceAll(LOCALHOST_RPC_URL, TXTX_RPC_URL)
    .replaceAll(LOCALHOST_WS_URL, TXTX_WS_RPC_URL);
};

const upsertNamedImport = (
  code: string,
  moduleName: string,
  additions: string[],
  removals: string[] = [],
): string => {
  const escapedModuleName = moduleName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const importRegex = new RegExp(
    `import\\s*{\\s*([^}]*)\\s*}\\s*from\\s*["']${escapedModuleName}["'];?`,
  );

  const existingImport = code.match(importRegex);
  if (!existingImport) {
    return `import { ${additions.join(", ")} } from "${moduleName}";\n${code}`;
  }

  return code.replace(importRegex, (_match, specifierBlock: string) => {
    const nextSpecifiers = specifierBlock
      .split(",")
      .map((specifier) => specifier.trim())
      .filter(Boolean)
      .filter((specifier) => !removals.includes(specifier));

    for (const addition of additions) {
      if (!nextSpecifiers.includes(addition)) {
        nextSpecifiers.push(addition);
      }
    }

    return `import { ${nextSpecifiers.join(", ")} } from "${moduleName}";`;
  });
};

// `createLocalClient()` assumes the snippet is running with a local validator
// with an auto-funded payer. The docs runner executes against a remote Surfnet
// endpoint instead, so we rewrite those snippets to an explicit RPC client setup.
const replaceCreateLocalClientSnippet = (code: string): string => {
  if (!code.includes("createLocalClient()")) {
    return code;
  }

  let nextCode = code;

  nextCode = upsertNamedImport(nextCode, "@solana/kit", [
    "generateKeyPairSigner",
    "airdropFactory",
    "lamports",
  ]);
  nextCode = upsertNamedImport(
    nextCode,
    "@solana/kit-client-rpc",
    ["createClient"],
    ["createLocalClient"],
  );

  nextCode = nextCode.replace(
    "const client = await createLocalClient();",
    createExplicitClientSetup(),
  );
  nextCode = nextCode.replaceAll("client.payer.address", "feePayer.address");
  nextCode = nextCode.replaceAll("client.payer", "feePayer");

  return nextCode;
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
    case "py":
      path = "python";
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

  let executableCode = replaceLocalHostUrl(code);

  if (language === "ts" || language === "typescript") {
    executableCode = replaceCreateLocalClientSnippet(executableCode);
  }

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
