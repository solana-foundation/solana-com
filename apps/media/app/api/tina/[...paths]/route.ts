import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isLocalMode } from "@/tina/database";
import fs from "fs";
import path from "path";

/**
 * Catch-all API route for TinaCMS
 *
 * Handles various Tina CMS API endpoints:
 * - /api/tina/schema - Returns the GraphQL schema
 * - /api/tina/media/* - Media file operations
 * - /api/tina/index.html - Admin panel redirect
 */

interface RouteParams {
  params: Promise<{ paths: string[] }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { paths } = await params;
  const pathString = paths.join("/");

  // Handle schema request
  if (pathString === "schema" || pathString === "schema.gql") {
    return handleSchemaRequest();
  }

  // Handle media listing
  if (pathString === "media" || pathString.startsWith("media/")) {
    return handleMediaList(pathString);
  }

  // Handle admin panel redirect
  if (pathString === "index.html") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.json(
    { error: "Not found", path: pathString },
    { status: 404 }
  );
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { paths } = await params;
  const pathString = paths.join("/");

  // Require authentication for POST requests in production
  if (!isLocalMode) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Handle media upload
  if (pathString === "media" || pathString === "media/upload") {
    return handleMediaUpload(req);
  }

  return NextResponse.json(
    { error: "Not found", path: pathString },
    { status: 404 }
  );
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { paths } = await params;
  const pathString = paths.join("/");

  // Require authentication for DELETE requests in production
  if (!isLocalMode) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Handle media deletion
  if (pathString.startsWith("media/")) {
    const mediaPath = pathString.replace("media/", "");
    return handleMediaDelete(mediaPath);
  }

  return NextResponse.json(
    { error: "Not found", path: pathString },
    { status: 404 }
  );
}

/**
 * Return the GraphQL schema
 */
async function handleSchemaRequest() {
  try {
    const schemaPath = path.join(
      process.cwd(),
      "tina",
      "__generated__",
      "schema.gql"
    );

    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf-8");
      return new NextResponse(schema, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    return NextResponse.json(
      { error: "Schema not found. Run `tinacms build` first." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Schema error:", error);
    return NextResponse.json(
      { error: "Failed to read schema" },
      { status: 500 }
    );
  }
}

/**
 * List media files
 */
async function handleMediaList(pathString: string) {
  try {
    const mediaDir =
      pathString === "media" ? "" : pathString.replace("media/", "");
    const fullPath = path.join(process.cwd(), "public", "uploads", mediaDir);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ items: [] });
    }

    const items = fs.readdirSync(fullPath, { withFileTypes: true });
    const files = items.map((item) => ({
      type: item.isDirectory() ? "dir" : "file",
      path: `/uploads/${mediaDir ? mediaDir + "/" : ""}${item.name}`,
      name: item.name,
    }));

    return NextResponse.json({ items: files });
  } catch (error) {
    console.error("Media list error:", error);
    return NextResponse.json(
      { error: "Failed to list media" },
      { status: 500 }
    );
  }
}

/**
 * Handle media file upload
 */
async function handleMediaUpload(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const directory = (formData.get("directory") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", directory);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save the file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    // Return the public URL
    const publicPath = `/uploads/${directory ? directory + "/" : ""}${filename}`;
    return NextResponse.json({
      success: true,
      path: publicPath,
      filename,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 }
    );
  }
}

/**
 * Handle media file deletion
 */
async function handleMediaDelete(mediaPath: string) {
  try {
    const fullPath = path.join(process.cwd(), "public", "uploads", mediaPath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    fs.unlinkSync(fullPath);

    return NextResponse.json({
      success: true,
      deleted: mediaPath,
    });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
