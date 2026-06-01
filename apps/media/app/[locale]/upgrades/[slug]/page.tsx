import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Twitter, Facebook, Linkedin, Send } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { reader } from "@/lib/reader";
import { upgradeMdxComponents } from "@/components/upgrades/mdx-components";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string; locale: string }> };

const LOCALES = [
  "en",
  "ar",
  "de",
  "el",
  "es",
  "fi",
  "fr",
  "hi",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt",
  "ru",
  "tr",
  "uk",
  "vi",
  "zh",
];

function SocialShare({ title, slug }: { title: string; slug: string }) {
  const url = encodeURIComponent(`https://solana.com/upgrades/${slug}`);
  const text = encodeURIComponent(title);
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-sm text-gray-400">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="size-5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="size-5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="size-5" />
      </a>
      <a
        href={`https://t.me/share/url?url=${url}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label="Share on Telegram"
      >
        <Send className="size-5" />
      </a>
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = await reader.collections.upgrades.read(slug);

  if (!entry || entry.status !== "published") notFound();

  const rawBody = await entry.body();
  const authorEntry = entry.author
    ? await reader.collections.authors.read(entry.author)
    : null;
  const authorName = authorEntry?.name?.name ?? "Solana Foundation";
  const publishedDate = entry.publishedAt
    ? new Date(entry.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-black text-white min-h-screen">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 pt-8 md:pt-16">
          <div className="mb-8">
            <Link
              href="/upgrades"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#14F195] transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Upgrades</span>
            </Link>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {entry.title.name}
          </h1>
          {entry.description && (
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl">
              {entry.description}
            </p>
          )}
          <SocialShare title={entry.title.name} slug={slug} />
          {(publishedDate || authorName) && (
            <p className="text-base text-gray-400 mb-8">
              {publishedDate && <span>{publishedDate}</span>}
              {publishedDate && authorName && <span>, by </span>}
              {authorName && <span>{authorName}</span>}
            </p>
          )}
        </div>
      </section>

      <section className="bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <article>
            <MDXRemote
              source={rawBody}
              components={upgradeMdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </article>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const slugs = await reader.collections.upgrades.list();
    const published: string[] = [];
    for (const slug of slugs) {
      const entry = await reader.collections.upgrades.read(slug);
      if (entry?.status === "published") published.push(slug);
    }
    return published.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await reader.collections.upgrades.read(slug);
  if (!entry) return {};

  const title = entry.title.name;
  const description = entry.description ?? undefined;
  const languages: Record<string, string> = {
    "x-default": `/upgrades/${slug}`,
    en: `/upgrades/${slug}`,
  };
  for (const locale of LOCALES.filter((l) => l !== "en")) {
    languages[locale] = `/${locale}/upgrades/${slug}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/upgrades/${slug}`,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}
