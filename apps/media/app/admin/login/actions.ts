"use server";

import { createMagicLinkToken, isEmailWhitelisted } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

export async function sendMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email is whitelisted
  if (!isEmailWhitelisted(normalizedEmail)) {
    // Return generic message to prevent email enumeration
    // (same response regardless of whether email is whitelisted)
    return { success: true };
  }

  try {
    // Create magic link token
    const token = await createMagicLinkToken(normalizedEmail);

    // Send email
    const result = await sendMagicLinkEmail(normalizedEmail, token);

    if (!result.success) {
      console.error("Failed to send magic link email:", result.error);
      return {
        success: false,
        error: "Failed to send email. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Magic link error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
