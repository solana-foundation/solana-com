import { coursesSource } from "@@/src/app/sources/courses";
import type { ReactNode } from "react";
import { DocsLayout } from "@@/src/app/components/docs-layout";
import { InkeepChatButton } from "@solana-com/ui-chrome";
type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout(props: Props) {
  const { locale } = await props.params;
  return (
    <DocsLayout
      tree={coursesSource.pageTree[locale]}
      sidebarEnabled={false}
      locale={locale}
    >
      {props.children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
