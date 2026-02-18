"use server";

import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import {
  createDraftBranch,
  listDraftBranches,
  publishDraft,
  discardDraft,
  branchExists,
} from "@/lib/github";

/**
 * Get the current user from the session
 */
async function getCurrentUser(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  return verifySessionToken(sessionToken);
}

/**
 * Require authentication for an action
 */
async function requireAuth(): Promise<{ email: string }> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Create a new draft branch for content
 */
export async function createNewDraft(
  collection: string,
  slug: string
): Promise<{ success: boolean; branch?: string; error?: string }> {
  try {
    await requireAuth();

    const branch = await createDraftBranch(collection, slug);
    return { success: true, branch };
  } catch (error) {
    console.error("Failed to create draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create draft",
    };
  }
}

/**
 * List all draft branches
 */
export async function listDrafts(): Promise<{
  success: boolean;
  drafts?: Array<{ name: string; collection: string; slug: string }>;
  error?: string;
}> {
  try {
    await requireAuth();

    const branches = await listDraftBranches();

    const drafts = branches.map((branch) => {
      // Parse branch name: draft/collection/slug
      const parts = branch.name.split("/");
      return {
        name: branch.name,
        collection: parts[1] || "",
        slug: parts.slice(2).join("/") || "",
      };
    });

    return { success: true, drafts };
  } catch (error) {
    console.error("Failed to list drafts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list drafts",
    };
  }
}

/**
 * Publish a draft - creates PR, merges, and deletes the branch
 */
export async function publishContent(
  branch: string,
  title: string
): Promise<{ success: boolean; prUrl?: string; error?: string }> {
  try {
    await requireAuth();

    // Verify branch exists
    const exists = await branchExists(branch);
    if (!exists) {
      return { success: false, error: "Draft branch not found" };
    }

    const result = await publishDraft(branch, title);
    return { success: true, prUrl: result.prUrl };
  } catch (error) {
    console.error("Failed to publish:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish",
    };
  }
}

/**
 * Discard a draft - deletes the branch without merging
 */
export async function discardDraftContent(
  branch: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    // Verify branch exists
    const exists = await branchExists(branch);
    if (!exists) {
      return { success: false, error: "Draft branch not found" };
    }

    await discardDraft(branch);
    return { success: true };
  } catch (error) {
    console.error("Failed to discard draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to discard draft",
    };
  }
}

/**
 * Check if a draft branch exists
 */
export async function checkDraftExists(
  branch: string
): Promise<{ success: boolean; exists?: boolean; error?: string }> {
  try {
    await requireAuth();

    const exists = await branchExists(branch);
    return { success: true, exists };
  } catch (error) {
    console.error("Failed to check draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check draft",
    };
  }
}
