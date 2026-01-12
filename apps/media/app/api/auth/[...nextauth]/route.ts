import NextAuth from "next-auth";
import { authOptions } from "@/auth";

/**
 * NextAuth.js API route handler
 *
 * Handles all authentication requests:
 * - GET /api/auth/signin - Sign in page
 * - GET /api/auth/signout - Sign out page
 * - GET /api/auth/callback/:provider - OAuth callback
 * - GET /api/auth/session - Get session
 * - GET /api/auth/csrf - Get CSRF token
 * - GET /api/auth/providers - Get available providers
 * - POST /api/auth/signin/:provider - Initiate sign in
 * - POST /api/auth/signout - Sign out
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
