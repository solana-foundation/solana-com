import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@solana.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
const IS_SANDBOX = process.env.SENDGRID_SANDBOX_MODE === "true";
const IS_DEV = process.env.NODE_ENV === "development";

export async function sendMagicLinkEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  const magicLink = `${APP_URL}/admin/auth/callback?token=${encodeURIComponent(token)}`;

  // In sandbox/dev mode, log the magic link to console for easy access
  if (IS_SANDBOX || IS_DEV) {
    console.log(`🔐 MAGIC LINK (dev/sandbox mode): ${magicLink}`);
  }

  // In sandbox mode, skip actual email sending but return success
  if (IS_SANDBOX) {
    console.log("📧 Sandbox mode: email not sent, use the link above");
    return { success: true };
  }

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: "Sign in to Solana Media Admin",
    text: `Click this link to sign in to the admin panel:\n\n${magicLink}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Sign in to Solana Media Admin</h2>
        <p>Click the button below to sign in:</p>
        <a href="${magicLink}" style="display: inline-block; background: #9945FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Sign In
        </a>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link:</p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">${magicLink}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("SendGrid error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
