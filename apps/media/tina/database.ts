import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { RedisLevel } from "upstash-redis-level";
import { Redis } from "@upstash/redis";
import { GitHubProvider } from "./github-provider";

/**
 * Check if we're in local development mode
 */
const isLocalMode = process.env.TINA_PUBLIC_IS_LOCAL === "true";

/**
 * Create a Redis-backed level store for production use
 */
function createRedisLevel() {
  const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });

  return new RedisLevel({
    redis,
    // Use a namespace to avoid conflicts with other Redis data
    namespace: "tina",
    // Enable debug logging in development
    debug: process.env.NODE_ENV === "development",
  });
}

/**
 * Create the Tina database instance
 *
 * In local mode: Uses filesystem-based storage
 * In production: Uses Upstash Redis for indexing + GitHub API for persistence
 */
export async function createTinaDatabase() {
  if (isLocalMode) {
    // Local development: use filesystem
    return createLocalDatabase();
  }

  // Production: use Redis + GitHub
  const level = createRedisLevel();
  const gitProvider = new GitHubProvider({
    owner: process.env.GITHUB_REPO_OWNER!,
    repo: process.env.GITHUB_REPO_NAME!,
    branch: process.env.GITHUB_BRANCH || "staging",
    token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
  });

  return createDatabase({
    level,
    gitProvider,
  });
}

/**
 * Singleton database instance
 * Ensures we reuse the same database connection
 */
let databasePromise: ReturnType<typeof createTinaDatabase> | null = null;

export function getDatabase() {
  if (!databasePromise) {
    databasePromise = createTinaDatabase();
  }
  return databasePromise;
}

export { isLocalMode };
