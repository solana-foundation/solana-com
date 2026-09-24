import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { canManageReportBlobs } from "../blob-auth";

const REPORTS_PATH_PREFIX = "reports/";

export async function POST(request: Request) {
  if (!(await canManageReportBlobs(request))) {
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
