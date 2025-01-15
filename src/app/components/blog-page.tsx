import { DocsBody, DocsPageProps } from "fumadocs-ui/page";
import GithubIcon from "@@/public/src/img/footer/github.inline.svg";
import { ReactNode } from "react";
import { Toc, TOCItems } from "fumadocs-ui/components/layout/toc";
import { ChevronLeft, Text } from "lucide-react";
import { HeroTitle } from "@/components/developers/DevelopersContentPage/DevelopersContentPage";
import { Breadcrumb } from "./breadcrumb";
import { ScrollToTop } from "./scroll-to-top";
import { ChevronRight } from "react-feather";
import Link from "next/link";
import { findNeighbour } from "fumadocs-core/server";

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
  const record: any = {
    href: props.href,
    title: props.title,
    date: props.date,
    tags: props.tags,
    difficulty: props.difficulty,
  };
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
              On this page
            </h3>
            <TOCItems items={props.toc} />
            <EditOnGithub root={props.baseHref} path={props.filePath} />
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

  return (
    <div className="grid grid-cols-2 gap-4 pb-6">
      {previous ? (
        <Link
          href={previous.url}
          className="flex w-full flex-col gap-2 rounded-lg border bg-fd-card p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground"
        >
          <div className="inline-flex items-center gap-0.5 text-fd-muted-foreground">
            <ChevronLeft className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
            <p>Previous</p>
          </div>
          <p className="font-medium">{previous.name}</p>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={next.url}
          className="flex w-full flex-col gap-2 rounded-lg border bg-fd-card p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground col-start-2 text-end"
        >
          <div className="inline-flex items-center gap-0.5 text-fd-muted-foreground flex-row-reverse">
            <ChevronRight className="-me-1 size-4 shrink-0 rtl:rotate-180" />
            <p>Next</p>
          </div>
          <p className="font-medium">{next.name}</p>
        </Link>
      ) : null}
    </div>
  );
}

function EditOnGithub({ root, path }: { root: string; path: string }) {
  const first = root.startsWith("/developers") ? root.slice(12) : root.slice(1);
  const second = path.startsWith("/") ? path.slice(1) : path;
  const href = `https://github.com/solana-foundation/solana-com/blob/main/content/${first}/${second}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="pt-2 flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-accent-foreground/80"
    >
      <GithubIcon width="18" height="18" />
      <span>Edit page</span>
    </a>
  );
}
