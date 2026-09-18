import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Link } from "@workspace/i18n/routing";
import ErrorBoundary from "@/components/error-boundary";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleJsonLd } from "@/lib/content-structured-data";
import { newsPostMetadata } from "@/lib/metadata";
import { fetchPublishedPostBySlug } from "@/lib/post-data";
import { toPlainText } from "@/lib/structured-data";
import { summerSchoolMdxComponents } from "./components";
import { summerSchoolBody } from "./fonts";
import styles from "./summer-school.module.css";

const slug = "solana-summer-school-2026";
const texture = "/uploads/posts/solana-summer-school-2026/texture.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return newsPostMetadata(slug, locale);
}

export default async function SolanaSummerSchoolRecapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const post = await fetchPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const title = String(post.title);
  const structuredData = buildArticleJsonLd({
    slug,
    locale,
    title,
    description: post.description ? toPlainText(post.description) : undefined,
    image: post.heroImage,
    publishedAt: post.publishedAt,
    authorName: "Solana Foundation",
    category: "Developers",
    tags: ["Recap", "Events"],
    backPath: "/news",
    backLabel: "News",
  });

  return (
    <ErrorBoundary>
      <JsonLd data={structuredData} />
      <main
        className={`${styles.root} ${summerSchoolBody.variable} relative isolate overflow-hidden bg-[#191918] text-white`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[length:1500px_1000px] bg-repeat opacity-[0.05] mix-blend-screen"
          style={{ backgroundImage: `url(${texture})` }}
        />

        <header className="mx-auto flex w-full max-w-[1512px] items-center justify-between gap-5 px-5 py-5 md:px-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-[#14f195] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14f195]"
          >
            <ArrowLeft className="size-4" />
            News
          </Link>
          <p className="text-right text-[0.65rem] uppercase tracking-[0.16em] text-white/40 md:text-xs">
            June 15—August 15 · 2026 recap
          </p>
        </header>

        <h1 className="sr-only">{title}</h1>

        <article>
          <MDXRemote
            source={await post.body()}
            components={summerSchoolMdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </article>
      </main>
    </ErrorBoundary>
  );
}
