import type { ReactNode } from "react";
import { SignJWT, jwtVerify, JWTPayload } from "jose";

// Auth provider type for admin API authorization
interface AuthProviderType {
  authenticate: () => Promise<{ authenticated: boolean }>;
  isAuthorized: (context: { req: Request }) => Promise<{
    authorized: boolean;
    errorCode?: number;
    errorMessage?: string;
  }>;
  getUser: (context: { req: Request }) => Promise<{ sub: string } | null>;
}

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
  httpOnly: false, // Must be false for admin UI to read the token
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: "/",
};

/**
 * Auth Provider for self-hosted backend (server-side only)
 * Used by the API routes for authorization
 */
export const AuthProvider: AuthProviderType = {
  authenticate: async () => {
    return { authenticated: false };
  },

  isAuthorized: async (context: { req: Request }) => {
    const cookieHeader = context.req.headers.get("cookie");
    if (!cookieHeader) {
      return {
        authorized: false,
        errorCode: 401,
        errorMessage: "No session cookie",
      };
    }

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

    return { authorized: true };
  },

  getUser: async (context: { req: Request }) => {
    const cookieHeader = context.req.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...val] = c.split("=");
        return [key, val.join("=")];
      })
    );

    const sessionToken = cookies[SESSION_COOKIE_NAME];
    if (!sessionToken) return null;

    const session = await verifySessionToken(sessionToken);
    if (!session) return null;

    return { sub: session.email };
  },
};

/**
 * Custom Auth Provider class for the admin UI (client-side)
 * Integrates magic link auth with the admin interface
 */
export class CustomAuthProvider {
  /**
   * Get the session provider component
   */
  getSessionProvider() {
    return ({ children }: { children: ReactNode }) => {
      return children;
    };
  }

  /**
   * Get the current auth token (session cookie value)
   */
  async getToken(): Promise<{ id_token: string } | null> {
    if (typeof document === "undefined") return null;

    const cookies = Object.fromEntries(
      document.cookie.split("; ").map((c) => {
        const [key, ...val] = c.split("=");
        return [key, val.join("=")];
      })
    );

    const token = cookies[SESSION_COOKIE_NAME];
    if (!token) return null;

    return { id_token: token };
  }

  /**
   * Get the current user
   */
  async getUser(): Promise<{ sub: string } | null> {
    const token = await this.getToken();
    if (!token) return null;

    try {
      const [, payloadB64] = token.id_token.split(".");
      const payload = JSON.parse(atob(payloadB64));
      return { sub: payload.email };
    } catch {
      return null;
    }
  }

  /**
   * Authenticate - redirect to our login page
   */
  async authenticate(): Promise<{ authenticated: boolean }> {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    return { authenticated: false };
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  /**
   * Check if user is authorized
   */
  async isAuthorized(): Promise<boolean> {
    return this.isAuthenticated();
  }

  /**
   * Authorize - same as authenticate for our flow
   */
  async authorize(): Promise<{ authenticated: boolean }> {
    return this.authenticate();
  }

  /**
   * Fetch with token - used for authenticated API requests
   */
  async fetchWithToken(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getToken();
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token.id_token}`);
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "include", // Include cookies
    });
  }

  /**
   * Logout - redirect to logout endpoint
   */
  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/logout";
    }
  }

  /**
   * Get login strategy - redirect to our custom login page
   */
  getLoginStrategy(): "LoginScreen" | "Redirect" | "UsernamePassword" {
    return "Redirect";
  }

  /**
   * Get login screen component - not used since we use redirect
   */
  getLoginScreen() {
    return null;
  }
}
