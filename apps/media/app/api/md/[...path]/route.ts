import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * API route to serve raw markdown content for LLM consumption.
 * Handles requests like:
 * - /api/md/news/post-slug → returns raw content of posts/post-slug.mdx
 * - /api/md/podcasts/podcast-slug → returns raw content of podcasts/podcast-slug.mdx
 *
 * The middleware rewrites requests like /news/post-slug.md to this endpoint.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;

  if (!pathSegments || pathSegments.length === 0) {
    return NextResponse.json(
      { error: "Invalid path. Expected: /api/md/{section}/{slug}" },
      { status: 400 }
    );
  }

  const [section, ...slugParts] = pathSegments;
  const slug = slugParts.join("/");

  // Map URL sections to content directories
  let contentDir: string;
  switch (section) {
    case "news":
      contentDir = "posts";
      break;
    case "podcasts":
      contentDir = "podcasts";
      break;
    default:
      return NextResponse.json(
        {
          error: `Unknown section: ${section}. Valid sections: news, podcasts`,
        },
        { status: 404 }
      );
  }

  try {
    // Try both .mdx and .md extensions
    const extensions = [".mdx", ".md"];
    let content: string | null = null;

    for (const ext of extensions) {
      const filePath = path.join(
        process.cwd(),
        "content",
        contentDir,
        `${slug}${ext}`
      );

      try {
        content = await fs.readFile(filePath, "utf-8");
        break;
      } catch {
        // Continue to next extension
      }
    }

    if (!content) {
      return NextResponse.json(
        { error: `Content not found: /${section}/${slug}` },
        { status: 404 }
      );
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Error serving markdown:", error);
    return NextResponse.json(
      { error: "Failed to fetch markdown content" },
      { status: 500 }
    );
  }
}
