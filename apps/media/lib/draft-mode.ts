import { draftMode } from "next/headers";

/**
 * Draft Mode Utilities
 *
 * Helpers for working with Next.js draft mode for content preview.
 */

/**
 * Check if draft mode is currently enabled
 */
export async function isDraftMode(): Promise<boolean> {
  const draft = await draftMode();
  return draft.isEnabled;
}

/**
 * Get draft mode status with additional info
 */
export async function getDraftModeStatus(): Promise<{
  isEnabled: boolean;
  exitUrl: string;
}> {
  const draft = await draftMode();

  return {
    isEnabled: draft.isEnabled,
    exitUrl: "/api/draft/disable",
  };
}
