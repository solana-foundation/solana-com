import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { GITHUB_CONFIG, GITHUB_RAW_BASE } from "@/lib/config/github";

/**
 * Template group categories to scan in the templates repo
 */
const TEMPLATE_GROUPS = [
  {
    name: "Kit",
    description: "Kit Templates (using @solana/kit)",
    path: "kit",
  },
  {
    name: "Mobile",
    description: "Mobile Templates for iOS and Android",
    path: "mobile",
  },
  {
    name: "Web3.js",
    description: "Web3.js Templates (using @solana/web3.js)",
    path: "web3js",
  },
  {
    name: "Community",
    description: "Community-contributed Templates",
    path: "community",
  },
] as const;

/**
 * In-memory cache for GitHub API responses
 */
type CacheEntry = {
  data: TemplatesResponse;
  timestamp: number;
  etag: string;
};

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Template metadata extracted from package.json
 */
type TemplateMetadata = {
  id: string;
  name: string;
  description: string;
  path: string;
  image: string;
  keywords: string[];
  displayName?: string;
  usecase?: string;
};

type TemplateGroup = {
  name: string;
  description: string;
  path: string;
  templates: TemplateMetadata[];
};

type TemplatesResponse = TemplateGroup[];

/**
 * GitHub API response type for directory listing
 */
type GitHubDirectoryEntry = {
  name: string;
  path: string;
  type: "file" | "dir";
};

/**
 * Package.json structure for template metadata
 */
type TemplatePackageJson = {
  name?: string;
  description?: string;
  keywords?: string[];
  solanaTemplate?: {
    displayName?: string;
    usecase?: string;
    image?: string;
  };
};

/**
 * Fetch directory contents from GitHub API
 */
async function fetchGitHubDirectory(
  path: string,
): Promise<GitHubDirectoryEntry[]> {
  const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}?ref=${GITHUB_CONFIG.branch}`;

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "solana-templates-api",
  };

  // Add GitHub token if available for higher rate limits
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      return []; // Directory doesn't exist yet
    }
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch and parse package.json for a template
 */
async function fetchTemplatePackageJson(
  templatePath: string,
): Promise<TemplatePackageJson | null> {
  const url = `${GITHUB_RAW_BASE}/${templatePath}/package.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`No package.json found for ${templatePath}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to parse package.json for ${templatePath}:`, error);
    return null;
  }
}

/**
 * Generate template metadata from package.json
 */
function extractTemplateMetadata(
  packageJson: TemplatePackageJson,
  templatePath: string,
  templateDirName: string,
): TemplateMetadata {
  const solanaConfig = packageJson.solanaTemplate || {};

  return {
    id: templateDirName,
    name: packageJson.name || templateDirName,
    description: packageJson.description || "",
    path: templatePath,
    image: solanaConfig.image || `/templates/${templateDirName}.png`,
    keywords: packageJson.keywords || [],
    displayName: solanaConfig.displayName,
    usecase: solanaConfig.usecase,
  };
}

/**
 * Fetch all templates and aggregate into response format
 */
async function aggregateTemplates(): Promise<TemplatesResponse> {
  const groups: TemplatesResponse = [];

  for (const group of TEMPLATE_GROUPS) {
    const templates: TemplateMetadata[] = [];

    try {
      const entries = await fetchGitHubDirectory(group.path);
      const directories = entries.filter((entry) => entry.type === "dir");

      // Fetch package.json for each template in parallel
      const templatePromises = directories.map(async (dir) => {
        const packageJson = await fetchTemplatePackageJson(dir.path);
        if (packageJson) {
          return extractTemplateMetadata(packageJson, dir.path, dir.name);
        }
        return null;
      });

      const results = await Promise.all(templatePromises);
      templates.push(
        ...results.filter((t): t is TemplateMetadata => t !== null),
      );
    } catch (error) {
      console.error(`Failed to fetch templates for ${group.path}:`, error);
    }

    // Only include groups that have templates
    if (templates.length > 0) {
      groups.push({
        name: group.name,
        description: group.description,
        path: group.path,
        templates,
      });
    }
  }

  return groups;
}

/**
 * Generate ETag from response data
 */
function generateETag(data: TemplatesResponse): string {
  const hash = createHash("md5").update(JSON.stringify(data)).digest("hex");
  return `"${hash}"`;
}

/**
 * Check if cache is still valid
 */
function isCacheValid(): boolean {
  if (!cache) return false;
  return Date.now() - cache.timestamp < CACHE_TTL_MS;
}

/**
 * GET /api/templates.json
 *
 * Returns aggregated template metadata from the templates repository.
 * Implements caching at multiple levels:
 * - In-memory cache with 5-minute TTL
 * - HTTP cache headers for CDN caching
 * - ETag support for conditional requests
 */
export async function GET(request: Request): Promise<Response> {
  try {
    // Check for conditional request
    const ifNoneMatch = request.headers.get("if-none-match");

    // Return cached data if valid
    if (isCacheValid() && cache) {
      // Check ETag for 304 response
      if (ifNoneMatch && ifNoneMatch === cache.etag) {
        return new Response(null, {
          status: 304,
          headers: {
            ETag: cache.etag,
            "Cache-Control":
              "public, s-maxage=300, stale-while-revalidate=3600",
            "X-Cache-Status": "HIT",
          },
        });
      }

      return NextResponse.json(cache.data, {
        headers: {
          ETag: cache.etag,
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
          "X-Cache-Status": "HIT",
        },
      });
    }

    // Fetch fresh data
    const data = await aggregateTemplates();
    const etag = generateETag(data);

    // Update cache
    cache = {
      data,
      timestamp: Date.now(),
      etag,
    };

    // Check ETag for 304 response (in case data hasn't changed)
    if (ifNoneMatch && ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
          "X-Cache-Status": "REVALIDATED",
        },
      });
    }

    return NextResponse.json(data, {
      headers: {
        ETag: etag,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        "X-Cache-Status": "MISS",
      },
    });
  } catch (error) {
    console.error("Failed to aggregate templates:", error);

    // Return stale cache if available during errors
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: {
          ETag: cache.etag,
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "X-Cache-Status": "STALE",
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 },
    );
  }
}
