import { DocsBody, DocsPageProps } from "fumadocs-ui/page";
import GithubIcon from "@@/public/src/img/footer/github.inline.svg";
import { ReactNode } from "react";
// import { Breadcrumb } from "fumadocs-ui/components/layout/breadcrumb";
import { Toc, TOCItems } from "fumadocs-ui/components/layout/toc";
import { Text } from "lucide-react";
import { HeroTitle } from "@/components/developers/DevelopersContentPage/DevelopersContentPage";

export function BlogPage(props: {
  children: ReactNode;
  filePath: string;
  toc: DocsPageProps["toc"];
  hideTableOfContents?: boolean;
  full?: boolean;
  title: string;
  href: string;
  breadcrumbRoot?: string;
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
  // TODO small screen
  // TODO prev, next links
  return (
    <div>
      <div className="my-4">
        {/* <Breadcrumb
          includeRoot={{ url: props.breadcrumbRoot }}
          includeSeparator={true}
        /> */}
      </div>
      <div className="">
        <HeroTitle record={record} baseHref="/developers/courses" />
      </div>
      <div className="flex gap-8">
        <Toc>
          <div className="flex h-full w-[var(--fd-toc-width)] max-w-full flex-col gap-3">
            <h3 className="-ms-0.5 inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
              <Text className="size-4" />
              On this page
            </h3>
            <TOCItems items={props.toc} />
            <EditOnGithub path={props.filePath} />
          </div>
        </Toc>
        <article>
          <DocsBody className="text-lg">{props.children}</DocsBody>
        </article>
      </div>
    </div>
  );

  // return (
  //   <FumaDocsPage
  //     toc={props.toc}
  //     full={true}
  //     breadcrumb={{
  //       enabled: true,
  //       includeRoot: { url: "/developers/courses" },
  //       includeSeparator: true,
  //     }}
  //     tableOfContentPopover={{
  //       enabled: !props.hideTableOfContents,
  //     }}
  //     tableOfContent={{
  //       footer: <EditOnGithub path={props.filePath} />,
  //       enabled: !props.hideTableOfContents,
  //     }}
  //   >
  //     Title
  //     <DocsBody className="text-lg">{props.children}</DocsBody>
  //   </FumaDocsPage>
  // );
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
