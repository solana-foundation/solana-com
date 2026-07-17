import { docsSource } from "@@/src/app/sources/docs";
import { DocsLayout } from "@@/src/app/components/docs-layout";
import { InkeepChatButton } from "@solana-com/ui-chrome";
import { ToolsDocsPage, getMetadataFromSlug } from "./tools";
import { getToolsNavigationTree, getToolsSidebarTree } from "./tools-page-tree";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(props: Props) {
  const { locale } = await props.params;
  const tree = docsSource.pageTree[locale];
  const sidebarTree = getToolsSidebarTree(tree);
  const navigationTree = getToolsNavigationTree(tree);

  // We use an index page instead of an optional catch-all route
  // because the optional catch-all route is 404ing in Vercel for localized routes
  // similar to https://github.com/vercel/next.js/issues/62657
  return (
    <DocsLayout tree={sidebarTree} locale={locale}>
      <ToolsDocsPage
        slug={["tools"]}
        locale={locale}
        pageTree={navigationTree}
      />
      <InkeepChatButton />
    </DocsLayout>
  );
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  return getMetadataFromSlug(["tools"], locale);
}
