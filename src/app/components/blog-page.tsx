import { DocsBody, DocsPageProps } from "fumadocs-ui/page";
import GithubIcon from "@@/public/src/img/footer/github.inline.svg";
import { ReactNode } from "react";
import { Toc, TOCItems } from "fumadocs-ui/components/layout/toc";
import { Text } from "lucide-react";
import { HeroTitle } from "@/components/developers/DevelopersContentPage/DevelopersContentPage";
import { Breadcrumb } from "./breadcrumb";

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
}) {
  const record: any = {
    href: props.href,
    title: props.title,
    date: props.date,
    tags: props.tags,
    difficulty: props.difficulty,
  };
  // TODO prev, next links
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
            <EditOnGithub path={props.filePath} />
          </div>
        </Toc>
        <article className="min-w-0">
          <DocsBody className="text-lg">{props.children}</DocsBody>
        </article>
      </div>
    </div>
  );
}

function EditOnGithub({ path }: { path: string }) {
  const href = `https://github.com/solana-foundation/solana-com/blob/main/${path.startsWith("/") ? path.slice(1) : path}`;
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
