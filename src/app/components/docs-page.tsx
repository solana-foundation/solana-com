import {
  DocsPage as FumaDocsPage,
  DocsBody,
  DocsTitle,
  DocsPageProps,
} from "fumadocs-ui/page";
import GithubIcon from "@@/public/src/img/footer/github.inline.svg";
import { ReactNode } from "react";
import { ScrollToTop } from "./scroll-to-top";

export function DocsPage(props: {
  children: ReactNode;
  filePath: string;
  toc: DocsPageProps["toc"];
  hideTableOfContents?: boolean;
  full?: boolean;
  title: string;
}) {
  return (
    // @ts-ignore
    <FumaDocsPage
      toc={props.toc}
      full={props.full}
      breadcrumb={{
        enabled: true,
        includeRoot: { url: "/docs" },
        includeSeparator: true,
      }}
      tableOfContentPopover={{
        enabled: !props.hideTableOfContents,
      }}
      tableOfContent={{
        footer: (
          <>
            <EditOnGithub path={props.filePath} />
            <ScrollToTop />
          </>
        ),
        enabled: !props.hideTableOfContents,
      }}
    >
      <DocsTitle className="text-fd-accent-foreground text-4xl md:text-5xl">
        {props.title}
      </DocsTitle>
      <DocsBody className="text-lg">{props.children}</DocsBody>
    </FumaDocsPage>
  );
}

function EditOnGithub({ path }: { path: string }) {
  const href = `https://github.com/solana-foundation/solana-com/blob/main/content/docs/${path.startsWith("/") ? path.slice(1) : path}`;
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
