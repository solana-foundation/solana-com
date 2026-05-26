import { docsSource } from "@@/src/app/sources/docs";
import { DocsLayout } from "@@/src/app/components/docs-layout";
import { InkeepChatButton } from "@solana-com/ui-chrome";
import { getMetadataFromSlug, ToolsDocsPage } from "../tools";
import { toStaticParams } from "@@/src/app/sources/utils";
import {
  getToolsNavigationTree,
  getToolsSidebarTree,
} from "../tools-page-tree";

type Props = {
  params: Promise<{ slug: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slug, locale } = await props.params;
  const tree = docsSource.pageTree[locale];
  const sidebarTree = getToolsSidebarTree(tree, slug[0]);
  const navigationTree = getToolsNavigationTree(tree, slug[0]);

  return (
    <DocsLayout tree={sidebarTree} locale={locale}>
      <ToolsDocsPage
        slug={["tools", ...slug]}
        locale={locale}
        pageTree={navigationTree}
      />
      <InkeepChatButton />
    </DocsLayout>
  );
}

export async function generateStaticParams() {
  return toStaticParams(docsSource)
    .filter((param) => param.slug[0] === "tools")
    .map((param) => ({ slug: param.slug.slice(1) }))
    .filter((param) => param.slug.length > 0);
}

export async function generateMetadata(props: Props) {
  const { slug, locale } = await props.params;
  return getMetadataFromSlug(["tools", ...slug], locale);
}
