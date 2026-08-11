import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { canManageReportBlobs } from "../blob-auth";

const REPORTS_PATH_PREFIX = "reports/";

function isReportPdf(pathname: unknown): pathname is string {
  return (
    typeof pathname === "string" &&
    pathname.startsWith(REPORTS_PATH_PREFIX) &&
    pathname.toLowerCase().endsWith(".pdf")
  );
}

export async function GET(request: Request) {
  if (!(await canManageReportBlobs(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { blobs } = await list({
      prefix: REPORTS_PATH_PREFIX,
      limit: 1000,
    });
    return NextResponse.json({ blobs });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load PDFs.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await canManageReportBlobs(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pathname } = (await request.json()) as { pathname?: unknown };
  if (!isReportPdf(pathname)) {
    return NextResponse.json({ error: "Invalid report PDF." }, { status: 400 });
  }

  try {
    await del(pathname);
    return NextResponse.json({ pathname });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to delete PDF.",
      },
      { status: 500 },
    );
  }
}
