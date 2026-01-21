import { defineConfig, LocalAuthProvider } from "tinacms";
import { createWorkflowPlugin } from "./plugins/workflow";

import Post from "./collection/post";
import Global from "./collection/global";
import Author from "./collection/author";
import Tag from "./collection/tag";
import Category from "./collection/category";
import CTA from "./collection/cta";
import Switchback from "./collection/switchback";
import Podcast from "./collection/podcast";
import Link from "./collection/link";
import { CustomAuthProvider } from "@/lib/auth";

// Determine the branch to use for preview URLs and content
const branch =
  process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// Compute absolute URL for TinaCMS API
// Server-side requests need an absolute URL since relative URLs have no origin
const apiUrl = (() => {
  // Use NEXT_PUBLIC_APP_URL if set (works for all environments)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/tina/gql`;
  }
  // Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/tina/gql`;
  }
  // Local development fallback
  return "http://localhost:3002/api/tina/gql";
})();

const config: ReturnType<typeof defineConfig> = defineConfig({
  authProvider: isLocal
    ? new LocalAuthProvider()
    : (new CustomAuthProvider() as any),
  contentApiUrlOverride: apiUrl,
  branch,

  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
    publicFolder: "public",
    outputFolder: "admin",
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
  ui: {
    previewUrl: (context) => {
      // Vercel preview URL format: https://<project-name>-git-<branch-slug>-<team>.vercel.app
      // Branch names with slashes: first slash becomes hyphen, remaining slashes are removed
      // Example: tina/posts/test-n23kk23 -> tina-poststest-n23kk23
      const projectName = "solana-com-media";
      const team = "solana-foundation";
      // Replace first slash with hyphen, then remove all remaining slashes
      const branchSlug = context.branch.replace(/\//, "-").replace(/\//g, "");
      return {
        url: `https://${projectName}-git-${branchSlug}-${team}.vercel.app`,
      };
    },
  },
  cmsCallback: (cms) => {
    cms.flags.set("branch-switcher", true);
    // Register workflow plugin for draft management
    cms.plugins.add(createWorkflowPlugin());
    return cms;
  },
});

export default config;
