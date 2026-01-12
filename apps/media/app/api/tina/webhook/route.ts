import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Redis } from "@upstash/redis";
import { RedisLevel } from "upstash-redis-level";
import { Octokit } from "@octokit/rest";

/**
 * GitHub Webhook Handler for Re-indexing
 *
 * Triggered when content changes are pushed to the repository.
 * Re-indexes affected content files in Redis.
 *
 * Supported events:
 * - push: Re-index changed files
 * - ping: Webhook verification
 */

interface GitHubPushPayload {
  ref: string;
  repository: {
    full_name: string;
  };
  commits: Array<{
    id: string;
    added: string[];
    modified: string[];
    removed: string[];
  }>;
}

/**
 * Verify GitHub webhook signature
 */
function verifyGitHubSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Get collection name from file path
 */
function getCollectionFromPath(filePath: string): string | null {
  const match = filePath.match(/^content\/([^/]+)\//);
  if (!match) return null;

  const dirName = match[1];
  const collectionMap: Record<string, string> = {
    authors: "author",
    categories: "category",
    ctas: "cta",
    global: "global",
    links: "link",
    podcasts: "podcast",
    posts: "post",
    switchbacks: "switchback",
    tags: "tag",
  };

  return collectionMap[dirName] || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const event = req.headers.get("x-github-event");
    const signature = req.headers.get("x-hub-signature-256");

    // Handle ping events (webhook verification)
    if (event === "ping") {
      return NextResponse.json({ status: "pong" });
    }

    // Only process push events
    if (event !== "push") {
      return NextResponse.json(
        { error: `Unsupported event: ${event}` },
        { status: 400 }
      );
    }

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (
      webhookSecret &&
      !verifyGitHubSignature(body, signature, webhookSecret)
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: GitHubPushPayload = JSON.parse(body);

    // Only process pushes to the configured branch
    const targetBranch = process.env.GITHUB_BRANCH || "staging";
    if (!payload.ref.endsWith(`/${targetBranch}`)) {
      return NextResponse.json({
        status: "skipped",
        reason: `Not targeting ${targetBranch} branch`,
      });
    }

    // Collect all affected content files
    const addedFiles: string[] = [];
    const modifiedFiles: string[] = [];
    const removedFiles: string[] = [];

    for (const commit of payload.commits) {
      for (const file of commit.added) {
        if (file.startsWith("content/") && getCollectionFromPath(file)) {
          addedFiles.push(file);
        }
      }
      for (const file of commit.modified) {
        if (file.startsWith("content/") && getCollectionFromPath(file)) {
          modifiedFiles.push(file);
        }
      }
      for (const file of commit.removed) {
        if (file.startsWith("content/") && getCollectionFromPath(file)) {
          removedFiles.push(file);
        }
      }
    }

    // De-duplicate
    const uniqueAdded = [...new Set(addedFiles)];
    const uniqueModified = [...new Set(modifiedFiles)];
    const uniqueRemoved = [...new Set(removedFiles)];

    const totalChanges =
      uniqueAdded.length + uniqueModified.length + uniqueRemoved.length;

    if (totalChanges === 0) {
      return NextResponse.json({
        status: "skipped",
        reason: "No content files changed",
      });
    }

    // Initialize Redis and GitHub client
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });

    const level = new RedisLevel({
      redis,
      namespace: "tina",
    });

    const octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
    });

    const [owner, repo] = payload.repository.full_name.split("/");

    // Process added and modified files
    const filesToIndex = [...uniqueAdded, ...uniqueModified];
    let indexed = 0;
    let errors = 0;

    for (const filePath of filesToIndex) {
      try {
        const collection = getCollectionFromPath(filePath);
        if (!collection) continue;

        // Fetch file content from GitHub
        const response = await octokit.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: targetBranch,
        });

        if ("content" in response.data) {
          const content = Buffer.from(response.data.content, "base64").toString(
            "utf-8"
          );
          const relativePath = filePath.replace(`content/${collection}s/`, "");
          const key = `content:${collection}:${relativePath}`;

          await level.put(key, content);
          indexed++;
        }
      } catch (error) {
        console.error(`Error indexing ${filePath}:`, error);
        errors++;
      }
    }

    // Process removed files
    let removed = 0;
    for (const filePath of uniqueRemoved) {
      try {
        const collection = getCollectionFromPath(filePath);
        if (!collection) continue;

        const relativePath = filePath.replace(`content/${collection}s/`, "");
        const key = `content:${collection}:${relativePath}`;

        await level.del(key);
        removed++;
      } catch (error) {
        console.error(`Error removing ${filePath}:`, error);
        errors++;
      }
    }

    await level.close();

    return NextResponse.json({
      status: "success",
      indexed,
      removed,
      errors,
      total: totalChanges,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "GitHub webhook for content re-indexing",
    events: ["push", "ping"],
  });
}
