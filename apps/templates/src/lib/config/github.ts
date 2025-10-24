/**
 * GitHub repository configuration for fetching templates
 * Change these values to switch between fork/branch or point to main after PR merge
 */
export const GITHUB_CONFIG = {
  owner: "solana-foundation",
  repo: "templates",
  branch: "main",
} as const;

/**
 * Base URL for raw GitHub content
 */
export const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}`;

/**
 * URL for templates.json metadata
 */
export const GITHUB_TEMPLATES_JSON = `${GITHUB_RAW_BASE}/templates.json`;
