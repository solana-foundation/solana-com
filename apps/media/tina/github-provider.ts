import { Octokit } from "@octokit/rest";
import type { GitProvider } from "@tinacms/datalayer";

interface GitHubProviderOptions {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

/**
 * GitHub-based Git provider for TinaCMS
 *
 * Persists content changes to GitHub via their REST API.
 * Commits are made directly to the specified branch.
 */
export class GitHubProvider implements GitProvider {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(options: GitHubProviderOptions) {
    this.owner = options.owner;
    this.repo = options.repo;
    this.branch = options.branch;
    this.octokit = new Octokit({
      auth: options.token,
    });
  }

  /**
   * Read a file from the repository
   */
  async getFile(filepath: string): Promise<string | undefined> {
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: filepath,
        ref: this.branch,
      });

      if ("content" in response.data) {
        // Content is base64 encoded
        return Buffer.from(response.data.content, "base64").toString("utf-8");
      }

      return undefined;
    } catch (error: unknown) {
      // File not found is expected for new files
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 404
      ) {
        return undefined;
      }
      throw error;
    }
  }

  /**
   * Write a file to the repository
   */
  async putFile(
    filepath: string,
    content: string,
    message?: string
  ): Promise<void> {
    const commitMessage = message || `Update ${filepath} via TinaCMS [skip ci]`;

    // Try to get the existing file to get its SHA
    let sha: string | undefined;
    try {
      const existing = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: filepath,
        ref: this.branch,
      });

      if ("sha" in existing.data) {
        sha = existing.data.sha;
      }
    } catch {
      // File doesn't exist yet, that's fine
    }

    await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: filepath,
      message: commitMessage,
      content: Buffer.from(content).toString("base64"),
      branch: this.branch,
      sha,
    });
  }

  /**
   * Delete a file from the repository
   */
  async deleteFile(filepath: string, message?: string): Promise<void> {
    const commitMessage = message || `Delete ${filepath} via TinaCMS [skip ci]`;

    // Get the file SHA (required for deletion)
    const existing = await this.octokit.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path: filepath,
      ref: this.branch,
    });

    if (!("sha" in existing.data)) {
      throw new Error(`Cannot delete ${filepath}: not a file`);
    }

    await this.octokit.repos.deleteFile({
      owner: this.owner,
      repo: this.repo,
      path: filepath,
      message: commitMessage,
      sha: existing.data.sha,
      branch: this.branch,
    });
  }

  /**
   * List files in a directory
   */
  async listFiles(dirpath: string): Promise<string[]> {
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: dirpath,
        ref: this.branch,
      });

      if (Array.isArray(response.data)) {
        return response.data
          .filter((item) => item.type === "file")
          .map((item) => item.path);
      }

      return [];
    } catch {
      return [];
    }
  }

  /**
   * Upload a media file (binary data)
   */
  async putMedia(
    filepath: string,
    data: Buffer,
    message?: string
  ): Promise<void> {
    const commitMessage =
      message || `Upload media ${filepath} via TinaCMS [skip ci]`;

    // Try to get the existing file to get its SHA
    let sha: string | undefined;
    try {
      const existing = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: filepath,
        ref: this.branch,
      });

      if ("sha" in existing.data) {
        sha = existing.data.sha;
      }
    } catch {
      // File doesn't exist yet, that's fine
    }

    await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: filepath,
      message: commitMessage,
      content: data.toString("base64"),
      branch: this.branch,
      sha,
    });
  }

  /**
   * Delete a media file
   */
  async deleteMedia(filepath: string): Promise<void> {
    return this.deleteFile(filepath, `Delete media ${filepath} via TinaCMS`);
  }

  /**
   * Get the current branch name
   */
  getBranch(): string {
    return this.branch;
  }

  /**
   * Get repository info
   */
  getRepoInfo(): { owner: string; repo: string; branch: string } {
    return {
      owner: this.owner,
      repo: this.repo,
      branch: this.branch,
    };
  }
}
