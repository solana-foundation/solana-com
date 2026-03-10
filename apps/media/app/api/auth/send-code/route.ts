import { NextRequest, NextResponse } from "next/server";
import { getAuthConfig, isEmailAllowed } from "../../../../lib/auth/config";
import { createVerifyToken } from "../../../../lib/auth/verify-token";

function generateCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(array[0] % 1000000).padStart(6, "0");
}

async function sendEmail(to: string, code: string) {
  const { sendgridApiKey, fromEmail } = getAuthConfig();

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sendgridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail, name: "Solana Media" },
      subject: "Your Solana Media login code",
      content: [
        {
          type: "text/plain",
          value: `Your login code is: ${code}\n\nThis code expires in 10 minutes.`,
        },
        {
          type: "text/html",
          value: `<div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
<h2 style="color: #000;">Solana Media</h2>
<p>Your login code is:</p>
<p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000;">${code}</p>
<p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
</div>`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SendGrid error: ${res.status} ${text}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Always return success to prevent email enumeration
    const successResponse = NextResponse.json({ ok: true });

    if (!isEmailAllowed(email)) {
      return successResponse;
    }

    const code = generateCode();

    const [verifyToken] = await Promise.all([
      createVerifyToken(email, code),
      sendEmail(email.trim().toLowerCase(), code),
    ]);

    successResponse.cookies.set("keystatic_verify", verifyToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 minutes
    });

    return successResponse;
  } catch (error) {
    console.error("send-code error:", error);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
