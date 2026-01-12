import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Allowed email domain for automatic access
 */
const ALLOWED_DOMAIN = "@solana.org";

/**
 * Get whitelisted emails from environment variable
 * Format: comma-separated list of email addresses
 */
function getWhitelistedEmails(): string[] {
  const whitelist = process.env.AUTH_WHITELIST;
  if (!whitelist) return [];
  return whitelist
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Check if an email is authorized to access the CMS
 * - All @solana.org emails are automatically allowed
 * - Additional emails can be whitelisted via AUTH_WHITELIST env var
 */
function isAuthorizedEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const normalizedEmail = email.toLowerCase();

  // Check if email is from allowed domain
  if (normalizedEmail.endsWith(ALLOWED_DOMAIN)) {
    return true;
  }

  // Check if email is in whitelist
  const whitelist = getWhitelistedEmails();
  return whitelist.includes(normalizedEmail);
}

/**
 * NextAuth configuration for self-hosted Tina CMS
 *
 * Features:
 * - Google OAuth authentication
 * - Restricted to @solana.org domain + whitelisted emails
 * - JWT-based sessions for API route protection
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  // Use JWT sessions for easier API route protection
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    /**
     * Control sign-in access based on email domain/whitelist
     */
    async signIn({ user }) {
      if (!isAuthorizedEmail(user.email)) {
        // Return false to deny access - will redirect to error page
        return false;
      }
      return true;
    },

    /**
     * Add user info to JWT token
     */
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    /**
     * Make user info available in session
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // Redirect auth errors to login page
  },

  // Debug mode in development
  debug: process.env.NODE_ENV === "development",
};

export { isAuthorizedEmail };
