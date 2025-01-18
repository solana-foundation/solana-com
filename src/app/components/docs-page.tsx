import {
  DocsPage as FumaDocsPage,
  DocsBody,
  DocsTitle,
  DocsPageProps,
} from "fumadocs-ui/page";
import { ReactNode } from "react";
import { ScrollToTop } from "./scroll-to-top";
import { EditOnGithub } from "./edit-page";

export function DocsPage(props: {
  children: ReactNode;
  filePath: string;
  toc: DocsPageProps["toc"];
  hideTableOfContents?: boolean;
  full?: boolean;
  title: string;
}) {
  const path = props.filePath;
  const href = `https://github.com/solana-foundation/solana-com/blob/main/content/docs/${path.startsWith("/") ? path.slice(1) : path}`;
  return (
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
            <EditOnGithub href={href} />
            <ScrollToTop />
          </>
        ),
        enabled: !props.hideTableOfContents,
      }}
    >
      <DocsTitle className="text-fd-accent-foreground text-4xl md:text-5xl">
        {props.title}
      </DocsTitle>
      <DocsBody className="text-lg container-docs">{props.children}</DocsBody>
    </FumaDocsPage>
  );
}
