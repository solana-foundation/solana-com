import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { listDraftBranches } from "@/lib/github";

export async function GET(request: NextRequest) {
  // Skip auth in local mode
  if (process.env.KEYSTATIC_LOCAL !== "true") {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }
  }

  try {
    const branches = await listDraftBranches();

    const drafts = branches.map((branch) => {
      const parts = branch.name.split("/");
      return {
        name: branch.name,
        collection: parts[1] || "",
        slug: parts.slice(2).join("/") || "",
      };
    });

    return NextResponse.json({ success: true, drafts });
  } catch (error) {
    console.error("Failed to list drafts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to list drafts",
      },
      { status: 500 }
    );
  }
}
