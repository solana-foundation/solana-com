import { expect, test } from "@playwright/test";

type CreateRefInput = {
  name: string;
  oid: string;
  repositoryId: string;
};

const repositoryId = "repository-id";
const mainCommit = "main-commit";
const mainTree = "main-tree";

function githubRef(name: string, oid: string, treeOid: string) {
  return {
    __typename: "Ref",
    id: `ref-${name}`,
    name,
    target: {
      __typename: "Commit",
      id: `commit-${name}`,
      oid,
      tree: {
        __typename: "Tree",
        id: `tree-${name}`,
        oid: treeOid,
      },
    },
  };
}

test("filters branches and creates a staging branch from main", async ({
  context,
  page,
}) => {
  test.skip(
    process.env.NEXT_PUBLIC_KEYSTATIC_LOCAL !== "false",
    "This test exercises Keystatic's GitHub storage mode.",
  );

  let createRefInput: CreateRefInput | undefined;

  await context.addCookies([
    {
      name: "keystatic-gh-access-token",
      value: "test-token",
      url: "http://127.0.0.1:3002",
    },
  ]);

  await page.route(
    "https://api.github.com/repos/solana-foundation/solana-com/git/trees/**",
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        json: {
          sha: mainTree,
          truncated: false,
          tree: [],
        },
      });
    },
  );

  await page.route("https://api.github.com/graphql", async (route) => {
    const body = route.request().postDataJSON() as {
      query: string;
      variables?: { input?: CreateRefInput };
    };

    if (body.query.includes("mutation CreateBranch")) {
      createRefInput = body.variables?.input;
      await route.fulfill({
        contentType: "application/json",
        json: {
          data: {
            createRef: {
              __typename: "CreateRefPayload",
              ref: githubRef(
                "staging-editor-article-name",
                mainCommit,
                mainTree,
              ),
            },
          },
        },
      });
      return;
    }

    if (body.query.includes("query GitHubAppShell")) {
      await route.fulfill({
        contentType: "application/json",
        json: {
          data: {
            repository: {
              __typename: "Repository",
              id: repositoryId,
              isPrivate: false,
              owner: {
                __typename: "Organization",
                id: "owner-id",
                login: "solana-foundation",
              },
              name: "solana-com",
              defaultBranchRef: {
                __typename: "Ref",
                id: "ref-main",
                name: "main",
              },
              refs: {
                __typename: "RefConnection",
                nodes: [
                  githubRef("main", mainCommit, mainTree),
                  githubRef(
                    "staging-existing-article",
                    "staging-commit",
                    "staging-tree",
                  ),
                  githubRef(
                    "unrelated-feature",
                    "feature-commit",
                    "feature-tree",
                  ),
                ],
                pageInfo: {
                  __typename: "PageInfo",
                  hasNextPage: false,
                  endCursor: null,
                },
              },
              viewerPermission: "WRITE",
              forks: {
                __typename: "RepositoryConnection",
                nodes: [],
              },
            },
            viewer: {
              __typename: "User",
              id: "viewer-id",
              name: "Editor",
              login: "editor",
              avatarUrl: "https://example.com/avatar.png",
              databaseId: 1,
            },
          },
        },
      });
      return;
    }

    throw new Error(`Unexpected GraphQL operation: ${body.query}`);
  });

  await page.goto("/keystatic/branch/main");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  const branchPicker = page.getByRole("combobox", {
    name: "Current branch",
  });
  await branchPicker.click();
  await expect(page.getByRole("option", { name: /main/ })).toBeVisible();
  await expect(
    page.getByRole("option", { name: "staging-existing-article" }),
  ).toBeVisible();
  await expect(
    page.getByRole("option", { name: "unrelated-feature" }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: /New branch/ }).click();
  await expect(page.getByText("staging-", { exact: true })).toBeVisible();
  await page
    .getByRole("textbox", { name: "Branch name" })
    .fill("editor-article-name");
  await page.getByRole("button", { name: "Create", exact: true }).click();

  await expect
    .poll(() => createRefInput)
    .toEqual({
      name: "refs/heads/staging-editor-article-name",
      oid: mainCommit,
      repositoryId,
    });
  await expect(page).toHaveURL(
    /\/keystatic\/branch\/staging-editor-article-name$/,
  );
});
