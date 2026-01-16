import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github";
import { createClient } from "@vercel/kv";
import { RedisLevel } from "upstash-redis-level";

// Check if we're in local development mode
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// Determine the branch to use
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  "main";

// Create the database based on environment
const createDatabaseInstance = () => {
  if (isLocal) {
    // Local development: use in-memory database with filesystem
    return createLocalDatabase();
  }

  // Production: use Vercel KV (Upstash Redis) with GitHub provider
  const kvClient = createClient({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });

  return createDatabase({
    gitProvider: new GitHubProvider({
      repo: process.env.GITHUB_REPO!,
      owner: process.env.GITHUB_OWNER!,
      token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
      branch,
    }),
    databaseAdapter: new RedisLevel<string, Record<string, unknown>>({
      redis: kvClient,
      debug: process.env.DEBUG === "true",
    }),
  });
};

export default createDatabaseInstance();
