import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "../../../../lib/auth/jwt";
import { validateVerifyToken } from "../../../../lib/auth/verify-token";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    const verifyToken = req.cookies.get("keystatic_verify")?.value;

    if (!verifyToken) {
      return NextResponse.json(
        { error: "Code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const valid = await validateVerifyToken(verifyToken, email, code);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    const jwt = await signJwt(email.trim().toLowerCase());

    const response = NextResponse.json({ ok: true });

    response.cookies.set("keystatic_session", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Clear the verify token
    response.cookies.set("keystatic_verify", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("verify-code error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
