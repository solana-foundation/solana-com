import { defineConfig } from "tinacms";
import nextConfig from "../next.config";

import Post from "./collection/post";
import Global from "./collection/global";
import Author from "./collection/author";
import Page from "./collection/page";
import Tag from "./collection/tag";
import Category from "./collection/category";
import CTA from "./collection/cta";
import Switchback from "./collection/switchback";
import Podcast from "./collection/podcast";

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
      Page,
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
});

export default config;
