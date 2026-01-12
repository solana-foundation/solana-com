import { defineConfig, LocalAuthProvider } from "tinacms";

import Post from "./collection/post";
import Global from "./collection/global";
import Author from "./collection/author";
import Tag from "./collection/tag";
import Category from "./collection/category";
import CTA from "./collection/cta";
import Switchback from "./collection/switchback";
import Podcast from "./collection/podcast";
import Link from "./collection/link";

// Check if we're using local mode (no authentication)
const isLocalMode = process.env.TINA_PUBLIC_IS_LOCAL === "true";

/**
 * Custom auth provider that integrates with our NextAuth setup
 * In self-hosted mode, authentication is handled by middleware
 */
class SelfHostedAuthProvider {
  async authenticate() {
    // Authentication is handled by our NextAuth middleware
    // If we get here, user is already authenticated
    return { authenticated: true };
  }

  async getUser() {
    // Fetch session from our NextAuth endpoint
    try {
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      if (session?.user) {
        return {
          name: session.user.name || session.user.email,
          email: session.user.email,
        };
      }
    } catch {
      // Session fetch failed
    }
    return null;
  }

  async logout() {
    // Redirect to NextAuth signout
    window.location.href = "/api/auth/signout";
  }

  getToken() {
    // Token is managed via cookies by NextAuth
    return null;
  }
}

/**
 * Get the auth provider based on environment
 */
function getAuthProvider() {
  if (isLocalMode) {
    return new LocalAuthProvider();
  }
  return new SelfHostedAuthProvider();
}

const config = defineConfig({
  // Self-hosted content API - uses our custom API routes
  contentApiUrlOverride: isLocalMode ? undefined : "/api/tina/gql",

  // Auth provider based on environment
  authProvider: getAuthProvider(),

  // Branch for content operations
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "staging",

  // Only require clientId and token if not in local mode (backwards compatibility)
  clientId: isLocalMode ? undefined : process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: isLocalMode ? undefined : process.env.TINA_TOKEN,

  media: {
    // Use local media storage with Git-backed persistence
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },

  build: {
    publicFolder: "public",
    outputFolder: "admin",
    basePath: "",
  },

  schema: {
    collections: [
      Category,
      Author,
      CTA,
      Global,
      Link,
      Podcast,
      Post,
      Switchback,
      Tag,
    ],
  },

  // Search configuration - only in non-local mode
  search: isLocalMode
    ? undefined
    : {
        tina: {
          indexerToken: process.env.TINA_SEARCH_INDEXER_TOKEN!,
          stopwordLanguages: ["eng"],
        },
        indexBatchSize: 100,
        maxSearchIndexFieldLength: 100,
      },

  // CMS customization
  cmsCallback: (cms) => {
    // Enable branch switcher in the admin UI
    cms.flags.set("branch-switcher", true);
    return cms;
  },
});

export default config;
