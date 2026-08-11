import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const REPORTS_PATH_PREFIX = "reports/";
const REPOSITORY = "solana-foundation/solana-com";

function getCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie
    .split(";")
    .map((item) => item.trim().split("="))
    .find(([key]) => key === name)?.[1];

  return value ? decodeURIComponent(value) : null;
}

async function canUploadReports(request: Request) {
  if (process.env.NEXT_PUBLIC_KEYSTATIC_LOCAL === "true") {
    return process.env.NODE_ENV !== "production";
  }

  const accessToken = getCookie(request, "keystatic-gh-access-token");
  if (!accessToken) return false;

  const viewerResponse = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!viewerResponse.ok) return false;

  const viewer = (await viewerResponse.json()) as { login?: string };
  if (!viewer.login) return false;

  const permissionResponse = await fetch(
    `https://api.github.com/repos/${REPOSITORY}/collaborators/${viewer.login}/permission`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );
  if (!permissionResponse.ok) return false;

  const permission = (await permissionResponse.json()) as {
    permission?: string;
  };
  return ["admin", "maintain", "push"].includes(permission.permission ?? "");
}

export async function POST(request: Request) {
  if (!(await canUploadReports(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (
          !pathname.startsWith(REPORTS_PATH_PREFIX) ||
          !pathname.toLowerCase().endsWith(".pdf")
        ) {
          throw new Error(
            "Only PDF files in the reports/ directory are allowed.",
          );
        }

        return {
          allowedContentTypes: ["application/pdf"],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
