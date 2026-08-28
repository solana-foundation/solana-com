import type { PageTree } from "fumadocs-core/server";

type Root = PageTree.Root;
type Folder = PageTree.Folder;
type Node = PageTree.Node;

const SECTION_ROUTES = {
  finance: "/docs/finance",
  tokens: "/docs/tokens",
  tokenization: "/docs/tokenization",
  institutional: "/docs/institutional",
  payments: "/docs/payments",
  defi: "/docs/defi",
} as const;

export type FinanceSection = keyof typeof SECTION_ROUTES;

export function getFinancePageTree(
  tree: Root,
  activeSection: FinanceSection = "finance",
): Root {
  const financeFolder = findFolder(tree, SECTION_ROUTES.finance);
  const tokensFolder = findFolder(tree, SECTION_ROUTES.tokens);
  const tokenizationFolder = findFolder(tree, SECTION_ROUTES.tokenization);
  const institutionalFolder = findFolder(tree, SECTION_ROUTES.institutional);
  const paymentsFolder = findFolder(tree, SECTION_ROUTES.payments);
  const defiFolder = findFolder(tree, SECTION_ROUTES.defi);

  const financePages: Node[] = financeFolder
    ? [
        ...(financeFolder.index
          ? [{ ...financeFolder.index, name: "Overview" }]
          : []),
        ...financeFolder.children,
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
      ...(institutionalFolder
        ? [
            renameFolder(
              institutionalFolder,
              "Institutional Finance",
              activeSection === "institutional",
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
    ],
  };
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
