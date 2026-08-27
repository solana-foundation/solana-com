import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@workspace/i18n/routing";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { Twitter } from "@boxicons/react/Twitter";
import { Facebook } from "@boxicons/react/Facebook";
import { Linkedin } from "@boxicons/react/Linkedin";
import { Send } from "@boxicons/react/Send";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { reader } from "@/lib/reader";
import { upgradeMdxComponents } from "@/components/upgrades/mdx-components";
import { upgradeMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { buildUpgradeJsonLd } from "@/lib/content-structured-data";
import { getUpgradeSocialImageUrl } from "@/lib/upgrades/social-image";
import { isPublishedUpgrade } from "@/lib/keystatic/upgrade-status";
import {
  isUpgradeStage,
  STAGE_BADGE_CLASSES,
  type UpgradeStage,
} from "@/lib/upgrades/stage";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string; locale: string }> };

async function SocialShare({ title, slug }: { title: string; slug: string }) {
  const t = await getTranslations("upgrades.detail");
  const url = encodeURIComponent(`https://solana.com/upgrades/${slug}`);
  const text = encodeURIComponent(title);
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-sm text-gray-400">{t("share")}</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label={t("shareOnTwitter")}
      >
        <Twitter className="size-5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label={t("shareOnFacebook")}
      >
        <Facebook className="size-5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label={t("shareOnLinkedin")}
      >
        <Linkedin className="size-5" />
      </a>
      <a
        href={`https://t.me/share/url?url=${url}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label={t("shareOnTelegram")}
      >
        <Send className="size-5" />
      </a>
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations("upgrades");
  const format = await getFormatter();
  const entry = await reader.collections.upgrades.read(slug);

  if (!isPublishedUpgrade(entry)) notFound();

  const rawBody = await entry.body();
  const titleDisplay = String(entry.title);
  const authorEntry = entry.author
    ? await reader.collections.authors.read(entry.author)
    : null;
  const authorName = String(authorEntry?.name ?? "Solana Foundation");
  const stage: UpgradeStage = isUpgradeStage(entry.stage)
    ? entry.stage
    : "in_development";
  const publishedDate = entry.publishedAt
    ? format.dateTime(new Date(entry.publishedAt), {
        month: "long",
        year: "numeric",
      })
    : null;
  const structuredData = buildUpgradeJsonLd({
    slug,
    locale,
    title: titleDisplay,
    description: entry.description ?? entry.subtitle,
    publishedAt: entry.publishedAt,
    authorName,
    image: getUpgradeSocialImageUrl(slug),
  });

  return (
    <div className="bg-black text-white min-h-screen">
      <JsonLd data={structuredData} />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 pt-8 md:pt-16">
          <div className="mb-8">
            <Link
              href="/upgrades"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#14F195] transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>{t("detail.back")}</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${STAGE_BADGE_CLASSES[stage]}`}
            >
              {t(`stage.${stage}`)}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {titleDisplay}
          </h1>
          {entry.subtitle && (
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl">
              {entry.subtitle}
            </p>
          )}
          <SocialShare title={titleDisplay} slug={slug} />
          <p className="text-base text-gray-400 mb-8">
            {publishedDate
              ? t("detail.bylineWithDate", {
                  date: publishedDate,
                  author: authorName,
                })
              : t("detail.byline", { author: authorName })}
          </p>
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
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
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
      if (isPublishedUpgrade(entry)) published.push(slug);
    }
    return published.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  return upgradeMetadata(slug, locale);
}
