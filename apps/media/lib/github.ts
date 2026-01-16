const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "";
const GITHUB_BASE_BRANCH = process.env.GITHUB_BRANCH || "main";

const GITHUB_API = "https://api.github.com";

interface GitHubError {
  message: string;
  status: number;
}

async function githubRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${GITHUB_API}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      message: error.message || `GitHub API error: ${response.status}`,
      status: response.status,
    } as GitHubError;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

interface GitRef {
  ref: string;
  object: {
    sha: string;
    type: string;
  };
}

interface GitBranch {
  name: string;
  commit: {
    sha: string;
  };
}

interface GitPullRequest {
  number: number;
  html_url: string;
  title: string;
  state: string;
  merged: boolean;
}

/**
 * Get the SHA of a branch
 */
export async function getBranchSha(branch: string): Promise<string> {
  const ref = await githubRequest<GitRef>(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${encodeURIComponent(branch)}`
  );
  return ref.object.sha;
}

/**
 * Create a draft branch from the base branch
 * @param collection - Content collection (e.g., "posts", "podcasts")
 * @param slug - Content slug
 * @returns The name of the created branch
 */
export async function createDraftBranch(
  collection: string,
  slug: string
): Promise<string> {
  const branchName = `draft/${collection}/${slug}`;

  // Get the SHA of the base branch
  const baseSha = await getBranchSha(GITHUB_BASE_BRANCH);

  // Create the new branch
  await githubRequest(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`, {
    method: "POST",
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    }),
  });

  return branchName;
}

/**
 * Commit content to a branch
 */
export async function commitContent(
  branch: string,
  filePath: string,
  content: string,
  message: string
): Promise<void> {
  // Get the current file SHA (if it exists)
  let fileSha: string | undefined;
  try {
    const file = await githubRequest<{ sha: string }>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(branch)}`
    );
    fileSha = file.sha;
  } catch (error) {
    // File doesn't exist yet, that's okay
    if ((error as GitHubError).status !== 404) {
      throw error;
    }
  }

  // Create or update the file
  await githubRequest(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(filePath)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        branch,
        sha: fileSha,
      }),
    }
  );
}

/**
 * Create a pull request from a draft branch to the base branch
 */
export async function createPullRequest(
  branch: string,
  title: string,
  body?: string
): Promise<GitPullRequest> {
  return githubRequest<GitPullRequest>(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`,
    {
      method: "POST",
      body: JSON.stringify({
        title,
        head: branch,
        base: GITHUB_BASE_BRANCH,
        body: body || `Publishing content from draft branch: ${branch}`,
      }),
    }
  );
}

/**
 * Merge a pull request using squash merge
 */
export async function mergePullRequest(
  prNumber: number,
  commitTitle?: string
): Promise<void> {
  await githubRequest(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls/${prNumber}/merge`,
    {
      method: "PUT",
      body: JSON.stringify({
        merge_method: "squash",
        commit_title: commitTitle,
      }),
    }
  );
}

/**
 * Delete a branch
 */
export async function deleteBranch(branch: string): Promise<void> {
  await githubRequest(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${encodeURIComponent(branch)}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * List all draft branches
 */
export async function listDraftBranches(): Promise<GitBranch[]> {
  // GitHub API doesn't support prefix filtering, so we fetch all and filter
  const branches = await githubRequest<GitBranch[]>(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches?per_page=100`
  );

  return branches.filter((b) => b.name.startsWith("draft/"));
}

/**
 * Check if a branch exists
 */
export async function branchExists(branch: string): Promise<boolean> {
  try {
    await getBranchSha(branch);
    return true;
  } catch (error) {
    if ((error as GitHubError).status === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Publish a draft - creates PR, merges it, and deletes the branch
 */
export async function publishDraft(
  branch: string,
  title: string
): Promise<{ prUrl: string }> {
  // Create the PR
  const pr = await createPullRequest(branch, title);

  // Merge the PR
  await mergePullRequest(pr.number, title);

  // Delete the branch
  await deleteBranch(branch);

  return { prUrl: pr.html_url };
}

/**
 * Discard a draft - deletes the branch without merging
 */
export async function discardDraft(branch: string): Promise<void> {
  await deleteBranch(branch);
}
