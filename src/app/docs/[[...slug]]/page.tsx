import { source } from "@/app/source";
import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/app/mdx-components";
import GithubIcon from "@@/public/src/img/footer/github.inline.svg";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{
        enabled: true,
        includeRoot: { url: "/docs" },
        includeSeparator: true,
        // includePage: true,
      }}
      tableOfContent={{ footer: <EditOnGithub path={page.file.path} /> }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody>
        <MDX components={{ ...mdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

function EditOnGithub({ path }: { path: string }) {
  const href = `https://github.com/solana-foundation/solana-com/blob/main/${path.startsWith("/") ? path.slice(1) : path}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="pt-2 flex items-center gap-2 text-base text-fd-muted-foreground hover:text-fd-accent-foreground/80"
    >
      <GithubIcon width="18" height="18" />
      <span>Edit Page</span>
    </a>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
