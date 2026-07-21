import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Twitter, Facebook, Linkedin, Send } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { reader } from "@/lib/reader";
import { upgradeMdxComponents } from "@/components/upgrades/mdx-components";
import { config } from "@/lib/config";
import { createUpgradeSocialImage } from "@/lib/upgrades/social-image";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string; locale: string }> };

const badgeColorMap: Record<string, string> = {
  green: "bg-[#14F195]/10 border-[#14F195]/30 text-[#14F195]",
  yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  red: "bg-red-500/10 border-red-500/30 text-red-400",
  purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
};

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
  const titleDisplay = String(entry.title);
  const authorEntry = entry.author
    ? await reader.collections.authors.read(entry.author)
    : null;
  const authorName = String(authorEntry?.name ?? "Solana Foundation");
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
          {entry.badges && entry.badges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {entry.badges.map(
                (
                  badge: { text: string; color: string; variant: string },
                  i: number,
                ) =>
                  badge.variant === "text" ? (
                    <span key={i} className="text-xs text-gray-500">
                      {badge.text}
                    </span>
                  ) : (
                    <span
                      key={i}
                      className={`text-xs px-3 py-1 rounded-full border font-medium ${badgeColorMap[badge.color] ?? badgeColorMap.green}`}
                    >
                      {badge.text}
                    </span>
                  ),
              )}
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {titleDisplay}
          </h1>
          {entry.subtitle && (
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl">
              {entry.subtitle}
            </p>
          )}
          <SocialShare title={titleDisplay} slug={slug} />
          {(publishedDate || authorName) && (
            <p className="text-base text-gray-400 mb-8">
              {publishedDate && <span>{publishedDate}</span>}
              {publishedDate && authorName && <span>, by </span>}
              {authorName && <span>{authorName}</span>}
            </p>
          )}
          {entry.metrics && entry.metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {entry.metrics.map(
                (metric: { value: string; label: string }, i: number) => (
                  <div
                    key={i}
                    className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-lg p-6 border border-white/10"
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                  </div>
                ),
              )}
            </div>
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
  const { slug, locale } = await params;
  const entry = await reader.collections.upgrades.read(slug);
  if (!entry) return {};

  const title = String(entry.title);
  const description = entry.description ?? entry.subtitle ?? undefined;
  const canonicalUrl = `${config.publicUrl}/upgrades/${slug}`;
  const socialImage = createUpgradeSocialImage(slug, title, config.publicUrl);
  const authorEntry = entry.author
    ? await reader.collections.authors.read(entry.author)
    : null;
  const authorName = String(authorEntry?.name ?? "Solana Foundation");
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
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: config.siteMetadata.title,
      locale,
      publishedTime: entry.publishedAt ?? undefined,
      authors: [authorName],
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${config.social.twitter.name}`,
      creator: `@${config.social.twitter.name}`,
      title,
      description,
      images: [socialImage],
    },
  };
}
