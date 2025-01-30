import { DocsBody, DocsPageProps } from "fumadocs-ui/page";
import { ReactNode } from "react";
import { Toc, TOCItems } from "fumadocs-ui/components/layout/toc";
import { Text } from "lucide-react";
import {
  HeroTitle,
  ContentRecord,
} from "@/components/developers/DevelopersContentPage/DevelopersContentPage";
import { Breadcrumb } from "./breadcrumb";
import { ScrollToTop } from "./scroll-to-top";
import { findNeighbour } from "fumadocs-core/server";
import { EditOnGithub, TocLabel } from "./edit-page";
import { DocsFooter } from "./docs-footer";

export function BlogPage(props: {
  children: ReactNode;
  breadcrumb: { title: string; path: string }[];
  filePath: string;
  toc: DocsPageProps["toc"];
  hideTableOfContents?: boolean;
  full?: boolean;
  title: string;
  href: string;
  baseHref?: string;
  tags?: string[];
  date?: string;
  difficulty?: string;
  pageTree?: any;
}) {
  const record: ContentRecord = {
    href: props.href,
    title: props.title,
    date: props.date,
    tags: props.tags,
    difficulty: props.difficulty,
  };
  const baseHref = props.baseHref
    ?.replace(/^\/developers/, "")
    .replace(/^\//, "");
  const filePath = props.filePath?.replace(/^\//, "");
  const href = `https://github.com/solana-foundation/solana-com/blob/main/content/${baseHref}/${filePath}`;
  return (
    <div className="container">
      <div className="my-6">
        <Breadcrumb root={props.baseHref} items={props.breadcrumb} />
      </div>
      <div>
        <HeroTitle record={record} baseHref={props.baseHref} />
      </div>
      <div className="flex gap-8">
        <Toc
          className="max-xl:block max-[990px]:hidden"
          style={{ "--fd-toc-width": "268px" } as React.CSSProperties}
        >
          <div className="flex h-full w-[var(--fd-toc-width)] max-w-full flex-col gap-3">
            <h3 className="-ms-0.5 inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
              <Text className="size-4" />
              <TocLabel />
            </h3>
            <TOCItems items={props.toc} />
            <EditOnGithub href={href} />
            <ScrollToTop />
          </div>
        </Toc>
        <article className="min-w-0">
          <DocsBody className="text-lg mb-6">{props.children}</DocsBody>
          <Footer pageTree={props.pageTree} pageUrl={props.href} />
        </article>
      </div>
    </div>
  );
}

function Footer({ pageTree, pageUrl }: { pageTree: any; pageUrl: string }) {
  let { next, previous } = findNeighbour(pageTree, pageUrl);

  // only if neighbours are in the same folder
  const folderUrl = pageUrl.split("/").slice(0, -1).join("/");
  const nextFolder = next?.url.split("/").slice(0, -1).join("/");
  const previousFolder = previous?.url.split("/").slice(0, -1).join("/");
  if (folderUrl !== nextFolder) next = undefined;
  if (folderUrl !== previousFolder) previous = undefined;

  return <DocsFooter previous={previous} next={next} />;
}
