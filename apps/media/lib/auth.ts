import { SignJWT, jwtVerify, JWTPayload } from "jose";
import type { AuthProvider as TinaAuthProvider } from "@tinacms/datalayer";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const ADMIN_WHITELIST = (process.env.ADMIN_WHITELIST || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

interface MagicLinkPayload extends JWTPayload {
  email: string;
  type: "magic-link";
}

interface SessionPayload extends JWTPayload {
  email: string;
  type: "session";
}

export function isEmailWhitelisted(email: string): boolean {
  return ADMIN_WHITELIST.includes(email.toLowerCase().trim());
}

export async function createMagicLinkToken(email: string): Promise<string> {
  return new SignJWT({ email: email.toLowerCase(), type: "magic-link" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email: email.toLowerCase(), type: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyMagicLinkToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const typedPayload = payload as MagicLinkPayload;

    if (typedPayload.type !== "magic-link") {
      return null;
    }

    return { email: typedPayload.email };
  } catch {
    return null;
  }
}

export async function verifySessionToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const typedPayload = payload as SessionPayload;

    if (typedPayload.type !== "session") {
      return null;
    }

    if (!isEmailWhitelisted(typedPayload.email)) {
      return null;
    }

    return { email: typedPayload.email };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = "admin_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: "/",
};

/**
 * TinaCMS Auth Provider for self-hosted backend
 * Integrates our magic link JWT authentication with TinaCMS
 */
export const AuthProvider: TinaAuthProvider = {
  /**
   * Authenticate a user - called when TinaCMS needs to verify credentials
   * For magic link auth, this is used after the session is already established
   */
  authenticate: async () => {
    // Magic link auth doesn't use username/password
    // Authentication is handled via the magic link flow
    // This returns false to indicate no direct auth
    return {
      authenticated: false,
    };
  },

  /**
   * Check if the current request is authorized
   * Called on every TinaCMS API request
   */
  isAuthorized: async (context: { req: Request }) => {
    const cookieHeader = context.req.headers.get("cookie");
    if (!cookieHeader) {
      return {
        authorized: false,
        errorCode: 401,
        errorMessage: "No session cookie",
      };
    }

    // Parse cookies
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...val] = c.split("=");
        return [key, val.join("=")];
      })
    );

    const sessionToken = cookies[SESSION_COOKIE_NAME];
    if (!sessionToken) {
      return {
        authorized: false,
        errorCode: 401,
        errorMessage: "No session token",
      };
    }

    const session = await verifySessionToken(sessionToken);
    if (!session) {
      return {
        authorized: false,
        errorCode: 401,
        errorMessage: "Invalid or expired session",
      };
    }

    return {
      authorized: true,
    };
  },

  /**
   * Extract user info from the request context
   */
  getUser: async (context: { req: Request }) => {
    const cookieHeader = context.req.headers.get("cookie");
    if (!cookieHeader) {
      return null;
    }

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...val] = c.split("=");
        return [key, val.join("=")];
      })
    );

    const sessionToken = cookies[SESSION_COOKIE_NAME];
    if (!sessionToken) {
      return null;
    }

    const session = await verifySessionToken(sessionToken);
    if (!session) {
      return null;
    }

    return {
      sub: session.email,
    };
  },
};
