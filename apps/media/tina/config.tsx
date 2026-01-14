import { defineConfig } from "tinacms";
import nextConfig from "../next.config";

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

const config: any = defineConfig({
  // Only require clientId and token if not in local mode
  clientId: isLocalMode ? undefined : process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH!,
  token: isLocalMode ? undefined : process.env.TINA_TOKEN,

  media: {
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
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_INDEXER_TOKEN!,
      stopwordLanguages: ["eng"],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
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
    return cms;
  },
});

export default config;
