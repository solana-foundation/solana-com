import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CONTENT_ROOT = path.resolve(process.cwd(), "content");

function isSafePathSegment(segment: string) {
  return (
    segment.length > 0 &&
    segment !== "." &&
    segment !== ".." &&
    !segment.includes("/") &&
    !segment.includes("\\") &&
    !segment.includes("\0")
  );
}

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

  if (slugParts.length === 0) {
    return NextResponse.json(
      { error: "Invalid path. Expected: /api/md/{section}/{slug}" },
      { status: 400 }
    );
  }

  const safeSlugParts = slugParts.filter(Boolean);
  if (!safeSlugParts.length || !safeSlugParts.every(isSafePathSegment)) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  const slug = safeSlugParts.join("/");

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
    const baseDir = path.resolve(CONTENT_ROOT, contentDir);
    const resolvedPath = path.resolve(baseDir, ...safeSlugParts);

    if (!resolvedPath.startsWith(`${baseDir}${path.sep}`)) {
      return NextResponse.json({ error: "Invalid path." }, { status: 400 });
    }

    // Try both .mdx and .md extensions
    const extensions = [".mdx", ".md"];
    let content: string | null = null;

    for (const ext of extensions) {
      const filePath = `${resolvedPath}${ext}`;

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
