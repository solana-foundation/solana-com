import type { PageTree } from "fumadocs-core/server";

type Root = PageTree.Root;
type Folder = PageTree.Folder;
type Node = PageTree.Node;

const SECTION_ROUTES = {
  finance: "/docs/finance",
  tokens: "/docs/tokens",
  tokenization: "/docs/tokenization",
  payments: "/docs/payments",
  defi: "/docs/defi",
} as const;

export type FinanceSection = keyof typeof SECTION_ROUTES;

/**
 * Finance pages that render after the section folders rather than above them.
 * Reference and operational material reads better once the asset sections have
 * had their say. Order follows the finance meta.json.
 */
const TRAILING_FINANCE_PAGES = [
  "privacy",
  "developer-tools",
  "ai-development",
  "production-readiness",
] as const;

export function getFinancePageTree(
  tree: Root,
  activeSection: FinanceSection = "finance",
): Root {
  const financeFolder = findFolder(tree, SECTION_ROUTES.finance);
  const tokensFolder = findFolder(tree, SECTION_ROUTES.tokens);
  const tokenizationFolder = findFolder(tree, SECTION_ROUTES.tokenization);
  const paymentsFolder = findFolder(tree, SECTION_ROUTES.payments);
  const defiFolder = findFolder(tree, SECTION_ROUTES.defi);
  const financeChildren = financeFolder?.children ?? [];
  const trailingPages = financeChildren.filter(isTrailingFinancePage);

  const financePages: Node[] = financeFolder
    ? [
        ...(financeFolder.index
          ? [{ ...financeFolder.index, name: "Overview" }]
          : []),
        ...financeChildren.filter((child) => !isTrailingFinancePage(child)),
      ]
    : [];

  return {
    ...tree,
    children: [
      ...financePages,
      ...(tokensFolder
        ? [renameFolder(tokensFolder, "Assets", activeSection === "tokens")]
        : []),
      ...(tokenizationFolder
        ? [
            renameFolder(
              tokenizationFolder,
              "Issuance & Tokenization",
              activeSection === "tokenization",
            ),
          ]
        : []),
      ...(paymentsFolder
        ? [
            renameFolder(
              paymentsFolder,
              "Payments",
              activeSection === "payments",
            ),
          ]
        : []),
      ...(defiFolder
        ? [
            renameFolder(
              defiFolder,
              "Markets & Trading",
              activeSection === "defi",
            ),
          ]
        : []),
      ...trailingPages,
    ],
  };
}

function isTrailingFinancePage(node: Node): boolean {
  return (
    node.type === "page" &&
    TRAILING_FINANCE_PAGES.some((slug) =>
      node.url.includes(`${SECTION_ROUTES.finance}/${slug}`),
    )
  );
}

function findFolder(tree: Root, route: string): Folder | undefined {
  return tree.children.find(
    (child): child is Folder =>
      child.type === "folder" && Boolean(child.index?.url.includes(route)),
  );
}

function renameFolder(
  folder: Folder,
  name: string,
  defaultOpen: boolean,
): Folder {
  return { ...folder, name, root: false, defaultOpen };
}
